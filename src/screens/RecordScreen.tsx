import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { StorageService } from '../services/storage';
import { OpenAIService } from '../services/openai';
import { Lecture, ProcessingProgress, AIError } from '../types';
import { useRecording } from '../hooks/useRecording';
import { WaveformVisualizer } from '../components/record/WaveformVisualizer';
import { RecordingHeader } from '../components/record/RecordingHeader';
import { StopButton } from '../components/record/StopButton';
import { DetailedProgressModal } from '../components/record/DetailedProgressModal';
import { ErrorModal } from '../components/common/ErrorModal';
import { colors } from '../constants/theme';
import { Audio } from 'expo-av';

type RecordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Record'
>;

export default function RecordScreen() {
  const navigation = useNavigation<RecordScreenNavigationProp>();
  const { metering, startRecording, stopRecording, cleanup } = useRecording();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({
    currentStep: 'title_generation',
    stepNumber: 1,
    totalSteps: 4,
    stepName: 'Generating Title',
    progress: 0,
  });
  const [error, setError] = useState<AIError | null>(null);
  const [showError, setShowError] = useState(false);
  const [currentLectureId, setCurrentLectureId] = useState<string | null>(null);

  useEffect(() => {
    startRecording().catch((error) => {
      console.error('Failed to start recording', error);
      navigation.goBack();
    });

    return cleanup;
  }, []);

  const handleStopRecording = async () => {
    const result = await stopRecording();
    if (!result || !result.uri) return;

    await processRecording(result.uri, result.duration);
  };

  const extractAudioSnippet = async (uri: string, maxDurationSeconds: number = 30): Promise<string> => {
    // For now, we'll use the full audio and rely on the transcription being cut short
    // In a more sophisticated implementation, you could use FFmpeg to extract a snippet
    // For this MVP, we'll transcribe the full audio and use the first portion for title generation
    return uri;
  };

  const processRecording = async (uri: string, duration: number) => {
    setIsProcessing(true);
    const lectureId = Date.now().toString();
    setCurrentLectureId(lectureId);

    try {
      const newLecture: Lecture = {
        id: lectureId,
        title: `Lecture ${new Date().toLocaleDateString()}`, // Temporary title
        date: Date.now(),
        audioUri: uri,
        duration: duration,
        status: 'processing',
      };

      await StorageService.saveLecture(newLecture);

      // Step 1: Generate Title (25% of progress)
      setProgress({
        currentStep: 'title_generation',
        stepNumber: 1,
        totalSteps: 4,
        stepName: 'Generating Title',
        progress: 0,
        message: 'Analyzing audio content...',
      });

      // Extract snippet and transcribe for title
      const snippetUri = await extractAudioSnippet(uri, 30);

      setProgress(prev => ({ ...prev, progress: 10, message: 'Transcribing audio snippet...' }));
      const fullTranscription = await OpenAIService.transcribeAudio(uri);

      // Use first 200 words for title generation
      const words = fullTranscription.split(' ');
      const snippetTranscription = words.slice(0, Math.min(200, words.length)).join(' ');

      setProgress(prev => ({ ...prev, progress: 20, message: 'Creating intelligent title...' }));
      let lectureTitle: string;
      try {
        lectureTitle = await OpenAIService.generateLectureTitle(snippetTranscription);
      } catch (titleError) {
        console.warn('Title generation failed, using fallback', titleError);
        lectureTitle = `Lecture ${new Date().toLocaleDateString()}`;
      }

      newLecture.title = lectureTitle;
      newLecture.transcription = fullTranscription;
      await StorageService.saveLecture(newLecture);

      // Step 2: Transcription (already done above, mark as complete - 50%)
      setProgress({
        currentStep: 'transcription',
        stepNumber: 2,
        totalSteps: 4,
        stepName: 'Transcribing Audio',
        progress: 50,
        message: 'Transcription complete!',
      });

      // Brief pause to show completion
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

      const materials = await OpenAIService.generateStudyMaterials(fullTranscription);

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
        progress: 90,
        message: 'Finalizing your materials...',
      });

      // Validate Learning Pack
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

      setProgress(prev => ({ ...prev, progress: 100, message: 'Complete!' }));

      // Brief pause to show completion
      await new Promise(resolve => setTimeout(resolve, 800));

      setIsProcessing(false);
      navigation.replace('LectureDetail', { lectureId: newLecture.id });
    } catch (error) {
      console.error('Processing failed', error);

      const aiError = error as AIError;
      setError(aiError);

      // Save lecture with error details
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
    if (currentLectureId) {
      StorageService.getLectures().then(lectures => {
        const lecture = lectures.find(l => l.id === currentLectureId);
        if (lecture) {
          processRecording(lecture.audioUri, lecture.duration);
        }
      });
    }
  };

  const handleErrorClose = () => {
    setShowError(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <RecordingHeader />

      <View style={styles.content}>
        <WaveformVisualizer metering={metering} />
      </View>

      <View style={styles.footer}>
        <StopButton onPress={handleStopRecording} />
      </View>

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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
});
