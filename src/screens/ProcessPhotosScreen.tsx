import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { StorageService } from '../services/storage';
import { OpenAIService } from '../services/openai';
import { Lecture, ProcessingProgress, AIError, Lesson } from '../types';
import { DetailedProgressModal } from '../components/record/DetailedProgressModal';
import { ErrorModal } from '../components/common/ErrorModal';
import { colors } from '../constants/theme';

type ProcessPhotosRouteProp = RouteProp<RootStackParamList, 'ProcessPhotos'>;
type ProcessPhotosNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProcessPhotos'
>;

export default function ProcessPhotosScreen() {
  const route = useRoute<ProcessPhotosRouteProp>();
  const navigation = useNavigation<ProcessPhotosNavigationProp>();
  const { photoUris } = route.params;
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState<ProcessingProgress>({
    currentStep: 'title_generation',
    stepNumber: 1,
    totalSteps: 4,
    stepName: 'Processing Photos',
    progress: 0,
  });
  const [error, setError] = useState<AIError | null>(null);
  const [showError, setShowError] = useState(false);
  const [currentLectureId, setCurrentLectureId] = useState<string | null>(null);

  useEffect(() => {
    processPhotos();
  }, []);

  const processPhotos = async () => {
    setIsProcessing(true);
    const lectureId = Date.now().toString();
    setCurrentLectureId(lectureId);

    try {
      const newLecture: Lecture = {
        id: lectureId,
        title: `Notes ${new Date().toLocaleDateString()}`,
        date: Date.now(),
        audioUri: '', // No audio for photo-only lectures
        duration: 0,
        photoUris: photoUris,
        status: 'processing',
      };

      await StorageService.saveLecture(newLecture);

      // Step 1: Extract text from photos (25%)
      setProgress({
        currentStep: 'title_generation',
        stepNumber: 1,
        totalSteps: 4,
        stepName: 'Analyzing Photos',
        progress: 10,
        message: 'Extracting text from photos...',
      });

      const extractedText = await OpenAIService.extractTextFromPhotos(photoUris);

      setProgress(prev => ({ ...prev, progress: 30, message: 'Generating title...' }));
      let lectureTitle: string;
      try {
        const snippet = extractedText.slice(0, 500);
        lectureTitle = await OpenAIService.generateLectureTitle(snippet);
      } catch (titleError) {
        console.warn('Title generation failed, using fallback', titleError);
        lectureTitle = `Notes ${new Date().toLocaleDateString()}`;
      }

      newLecture.title = lectureTitle;
      await StorageService.saveLecture(newLecture);

      // Step 2: Transcription equivalent (50%)
      setProgress({
        currentStep: 'transcription',
        stepNumber: 2,
        totalSteps: 4,
        stepName: 'Processing Content',
        progress: 50,
        message: 'Content extracted!',
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Generate Study Materials (75%)
      setProgress({
        currentStep: 'study_materials',
        stepNumber: 3,
        totalSteps: 4,
        stepName: 'Creating Study Materials',
        progress: 60,
        message: 'Generating summary...',
      });

      const materials = await OpenAIService.generateStudyMaterials(extractedText);

      setProgress(prev => ({ ...prev, progress: 75, message: 'Creating flashcards and notes...' }));

      newLecture.summary = materials.summary;
      newLecture.flashcards = materials.flashcards;
      newLecture.notes = materials.notes;
      await StorageService.saveLecture(newLecture);

      // Step 4: Assembly (100%)
      setProgress({
        currentStep: 'assembly',
        stepNumber: 4,
        totalSteps: 4,
        stepName: 'Assembling Learning Pack',
        progress: 80,
        message: 'Finalizing your materials...',
      });

      const isComplete = !!(
        newLecture.summary &&
        newLecture.flashcards &&
        newLecture.flashcards.length > 0 &&
        newLecture.notes
      );

      if (!isComplete) {
        throw new Error('Learning Pack incomplete - missing materials');
      }

      newLecture.status = 'processed';
      await StorageService.saveLecture(newLecture);

      // Generate personalized lesson
      setProgress(prev => ({ ...prev, progress: 85, message: 'Generating personalized lesson...' }));

      try {
        const userProfile = await StorageService.getUserProfile();

        const lessonData = await OpenAIService.generatePersonalizedLesson(
          newLecture.title,
          extractedText,
          newLecture.summary!,
          newLecture.notes!,
          userProfile
        );

        const lesson: Lesson = {
          id: `lesson_${lectureId}`,
          lectureId: newLecture.id,
          title: lessonData.title,
          description: lessonData.description,
          content: lessonData.content,
          questions: lessonData.questions,
          estimatedDuration: lessonData.estimatedDuration,
          createdAt: Date.now(),
          completed: false,
        };

        await StorageService.saveLesson(lesson);
        setProgress(prev => ({ ...prev, progress: 95, message: 'Lesson created successfully!' }));
      } catch (lessonError) {
        console.warn('Lesson generation failed, but continuing', lessonError);
      }

      setProgress(prev => ({ ...prev, progress: 100, message: 'Complete!' }));

      await new Promise(resolve => setTimeout(resolve, 800));

      setIsProcessing(false);
      navigation.replace('LectureDetail', { lectureId: newLecture.id });
    } catch (error) {
      console.error('Processing failed', error);

      const aiError = error as AIError;
      setError(aiError);

      const lectures = await StorageService.getLectures();
      const current = lectures.find((l) => l.id === lectureId);
      if (current) {
        current.status = 'failed';
        current.errorMessage = aiError.message;
        current.lastProcessingStep = aiError.step;
        await StorageService.saveLecture(current);
      }

      setIsProcessing(false);
      setShowError(true);
    }
  };

  const handleRetry = () => {
    setShowError(false);
    if (currentLectureId && photoUris) {
      processPhotos();
    }
  };

  const handleErrorClose = () => {
    setShowError(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <DetailedProgressModal visible={isProcessing} progress={progress} />

      {error && (
        <ErrorModal
          visible={showError}
          error={error}
          onRetry={error.retryable ? handleRetry : undefined}
          onClose={handleErrorClose}
          onGoToSettings={() => {
            setShowError(false);
            navigation.navigate('MainTabs', { screen: 'Settings' });
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});

