import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Share, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RefreshCw, AlertCircle, GraduationCap } from 'lucide-react-native';
import { RootStackParamList } from '../../App';
import { StorageService } from '../services/storage';
import { OpenAIService } from '../services/openai';
import { Lecture, Folder, TimestampReference, ChatMessage, ProcessingProgress, AIError, Lesson } from '../types';
import { LectureHeader } from '../components/lecture/LectureHeader';
import { TabBar, TabType } from '../components/lecture/TabBar';
import { SummaryTab } from '../components/lecture/SummaryTab';
import { FlashcardsTab } from '../components/lecture/FlashcardsTab';
import { NotesTab } from '../components/lecture/NotesTab';
import { TranscriptTab } from '../components/lecture/TranscriptTab';
import { ChatTab } from '../components/lecture/ChatTab';
import { EditModal } from '../components/common/EditModal';
import { MoveFolderModal } from '../components/lecture/MoveFolderModal';
import { DetailedProgressModal } from '../components/record/DetailedProgressModal';
import { ErrorModal } from '../components/common/ErrorModal';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

type LectureDetailRouteProp = RouteProp<RootStackParamList, 'LectureDetail'>;

export default function LectureDetailScreen() {
  const route = useRoute<LectureDetailRouteProp>();
  const navigation = useNavigation();
  const { lectureId } = route.params;
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [showMoveFolder, setShowMoveFolder] = useState(false);
  const [highlightText, setHighlightText] = useState<string | undefined>(undefined);
  const [isRetrying, setIsRetrying] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({
    currentStep: 'title_generation',
    stepNumber: 1,
    totalSteps: 4,
    stepName: 'Generating Title',
    progress: 0,
  });
  const [error, setError] = useState<AIError | null>(null);
  const [showError, setShowError] = useState(false);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [existingLesson, setExistingLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    loadLecture();
    loadFolders();
    checkExistingLesson();
  }, [lectureId]);

  const checkExistingLesson = async () => {
    const lessons = await StorageService.getLessonsByLectureId(lectureId);
    if (lessons.length > 0) {
      setExistingLesson(lessons[0]);
    }
  };

  const loadLecture = async () => {
    const data = await StorageService.getLectureById(lectureId);
    if (data) {
      setLecture(data);
    }
  };

  const loadFolders = async () => {
    const data = await StorageService.getFolders();
    setFolders(data);
  };

  const handleShare = async () => {
    if (!lecture) return;
    try {
      await Share.share({
        message: `Lecture: ${lecture.title}\n\nSummary:\n${lecture.summary}\n\nNotes:\n${lecture.notes}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Lecture',
      'Are you sure you want to delete this lecture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteLecture(lectureId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleUpdateTitle = async (title: string) => {
    if (!lecture) return;
    const updatedLecture = { ...lecture, title };
    await StorageService.saveLecture(updatedLecture);
    setLecture(updatedLecture);
    setShowEditTitle(false);
  };

  const handleMoveToFolder = async (folderId?: string) => {
    if (!lecture) return;
    const updatedLecture = { ...lecture, folderId };
    await StorageService.saveLecture(updatedLecture);
    setLecture(updatedLecture);
    setShowMoveFolder(false);
  };

  const handleUpdateChatHistory = async (chatHistory: ChatMessage[]) => {
    if (!lecture) return;
    const updatedLecture = { ...lecture, chatHistory };
    await StorageService.saveLecture(updatedLecture);
    setLecture(updatedLecture);
  };

  const handleTimestampClick = (reference: TimestampReference) => {
    // Switch to transcript tab
    setActiveTab('transcript');
    // Set the text to highlight
    setHighlightText(reference.text);
    // Clear highlight after 5 seconds
    setTimeout(() => {
      setHighlightText(undefined);
    }, 5000);
  };

  const handleRetryProcessing = async () => {
    if (!lecture) return;

    setIsRetrying(true);
    setShowError(false);

    try {
      const updatedLecture = { ...lecture, status: 'processing' as const };
      await StorageService.saveLecture(updatedLecture);
      setLecture(updatedLecture);

      // If transcription exists, start from study materials generation
      if (lecture.transcription) {
        setProgress({
          currentStep: 'study_materials',
          stepNumber: 3,
          totalSteps: 4,
          stepName: 'Creating Study Materials',
          progress: 60,
          message: 'Generating summary...',
        });

        const materials = await OpenAIService.generateStudyMaterials(lecture.transcription);

        setProgress(prev => ({ ...prev, progress: 75, message: 'Creating flashcards and notes...' }));

        updatedLecture.summary = materials.summary;
        updatedLecture.flashcards = materials.flashcards;
        updatedLecture.notes = materials.notes;
        await StorageService.saveLecture(updatedLecture);

        setProgress({
          currentStep: 'assembly',
          stepNumber: 4,
          totalSteps: 4,
          stepName: 'Assembling Learning Pack',
          progress: 90,
          message: 'Finalizing your materials...',
        });
      } else {
        // Full retry from transcription
        setProgress({
          currentStep: 'transcription',
          stepNumber: 2,
          totalSteps: 4,
          stepName: 'Transcribing Audio',
          progress: 25,
          message: 'Converting speech to text...',
        });

        const transcription = await OpenAIService.transcribeAudio(lecture.audioUri);
        updatedLecture.transcription = transcription;
        await StorageService.saveLecture(updatedLecture);

        setProgress({
          currentStep: 'study_materials',
          stepNumber: 3,
          totalSteps: 4,
          stepName: 'Creating Study Materials',
          progress: 60,
          message: 'Generating summary...',
        });

        const materials = await OpenAIService.generateStudyMaterials(transcription);

        setProgress(prev => ({ ...prev, progress: 75, message: 'Creating flashcards and notes...' }));

        updatedLecture.summary = materials.summary;
        updatedLecture.flashcards = materials.flashcards;
        updatedLecture.notes = materials.notes;
        await StorageService.saveLecture(updatedLecture);

        setProgress({
          currentStep: 'assembly',
          stepNumber: 4,
          totalSteps: 4,
          stepName: 'Assembling Learning Pack',
          progress: 90,
          message: 'Finalizing your materials...',
        });
      }

      // Validate and complete
      const isComplete = !!(
        updatedLecture.summary &&
        updatedLecture.flashcards &&
        updatedLecture.flashcards.length > 0 &&
        updatedLecture.notes
      );

      if (!isComplete) {
        throw new Error('Learning Pack incomplete - missing materials');
      }

      updatedLecture.status = 'processed';
      updatedLecture.errorMessage = undefined;
      updatedLecture.lastProcessingStep = undefined;
      await StorageService.saveLecture(updatedLecture);

      setProgress(prev => ({ ...prev, progress: 100, message: 'Complete!' }));

      await new Promise(resolve => setTimeout(resolve, 800));

      setIsRetrying(false);
      setLecture(updatedLecture);
      Alert.alert('Success', 'Lecture processed successfully!');
    } catch (error) {
      console.error('Retry failed', error);

      const aiError = error as AIError;
      setError(aiError);

      if (lecture) {
        const failedLecture = { ...lecture };
        failedLecture.status = 'failed';
        failedLecture.errorMessage = aiError.message;
        failedLecture.lastProcessingStep = aiError.step;
        await StorageService.saveLecture(failedLecture);
        setLecture(failedLecture);
      }

      setIsRetrying(false);
      setShowError(true);
    }
  };

  const handleGenerateLesson = async () => {
    if (!lecture || !lecture.transcription || !lecture.summary || !lecture.notes) {
      Alert.alert(
        'Cannot Generate Lesson',
        'This lecture needs to be fully processed before a lesson can be generated.'
      );
      return;
    }

    if (existingLesson) {
      Alert.alert(
        'Lesson Already Exists',
        'A lesson already exists for this lecture. Would you like to view it or regenerate?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'View Lesson',
            onPress: () => navigation.navigate('LessonDetail', { lessonId: existingLesson.id }),
          },
          {
            text: 'Regenerate',
            style: 'destructive',
            onPress: () => generateNewLesson(),
          },
        ]
      );
      return;
    }

    generateNewLesson();
  };

  const generateNewLesson = async () => {
    if (!lecture || !lecture.transcription || !lecture.summary || !lecture.notes) return;

    setIsGeneratingLesson(true);

    try {
      const userProfile = await StorageService.getUserProfile();

      const lessonData = await OpenAIService.generatePersonalizedLesson(
        lecture.title,
        lecture.transcription,
        lecture.summary,
        lecture.notes,
        userProfile
      );

      const lesson: Lesson = {
        id: existingLesson ? existingLesson.id : `lesson_${lectureId}_${Date.now()}`,
        lectureId: lecture.id,
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content,
        questions: lessonData.questions,
        estimatedDuration: lessonData.estimatedDuration,
        createdAt: Date.now(),
        completed: false,
      };

      await StorageService.saveLesson(lesson);
      setExistingLesson(lesson);

      setIsGeneratingLesson(false);

      Alert.alert(
        'Lesson Created!',
        'Your personalized lesson has been generated. Would you like to start it now?',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Start Lesson',
            onPress: () => navigation.navigate('LessonDetail', { lessonId: lesson.id }),
          },
        ]
      );
    } catch (error) {
      console.error('Lesson generation failed', error);
      setIsGeneratingLesson(false);

      Alert.alert(
        'Generation Failed',
        'Failed to generate lesson. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  if (!lecture) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LectureHeader
        title={lecture.title}
        date={lecture.date}
        onShare={handleShare}
        onEdit={() => setShowEditTitle(true)}
        onDelete={handleDelete}
        onMoveToFolder={() => setShowMoveFolder(true)}
      />

      {lecture.status === 'failed' && (
        <View style={styles.errorBanner}>
          <View style={styles.errorBannerContent}>
            <AlertCircle size={20} color={colors.danger} />
            <View style={styles.errorBannerText}>
              <Text style={styles.errorBannerTitle}>Processing Failed</Text>
              <Text style={styles.errorBannerMessage}>
                {lecture.errorMessage || 'An error occurred while processing this lecture.'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetryProcessing}
          >
            <RefreshCw size={16} color={colors.background.primary} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {lecture.status === 'processed' && (
        <View style={styles.lessonBanner}>
          <View style={styles.lessonBannerContent}>
            <GraduationCap size={24} color={colors.primary} />
            <View style={styles.lessonBannerText}>
              <Text style={styles.lessonBannerTitle}>
                {existingLesson ? 'Lesson Available' : 'Create Interactive Lesson'}
              </Text>
              <Text style={styles.lessonBannerMessage}>
                {existingLesson
                  ? 'Test your knowledge with a personalized quiz'
                  : 'Generate a personalized lesson with quiz from this lecture'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.lessonButton}
            onPress={
              existingLesson
                ? () => navigation.navigate('LessonDetail', { lessonId: existingLesson.id })
                : handleGenerateLesson
            }
            disabled={isGeneratingLesson}
          >
            {isGeneratingLesson ? (
              <ActivityIndicator size="small" color={colors.background.primary} />
            ) : (
              <>
                <GraduationCap size={16} color={colors.background.primary} />
                <Text style={styles.lessonButtonText}>
                  {existingLesson ? 'Start Lesson' : 'Generate Lesson'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <View style={styles.content}>
        {activeTab === 'summary' && <SummaryTab summary={lecture.summary} />}
        {activeTab === 'flashcards' && (
          <FlashcardsTab flashcards={lecture.flashcards} />
        )}
        {activeTab === 'notes' && <NotesTab notes={lecture.notes} />}
        {activeTab === 'transcript' && (
          <TranscriptTab
            transcription={lecture.transcription}
            highlightText={highlightText}
          />
        )}
        {activeTab === 'chat' && (
          <ChatTab
            lectureId={lecture.id}
            transcription={lecture.transcription}
            notes={lecture.notes}
            chatHistory={lecture.chatHistory || []}
            onUpdateChatHistory={handleUpdateChatHistory}
            onTimestampClick={handleTimestampClick}
          />
        )}
      </View>

      <EditModal
        visible={showEditTitle}
        title="Edit Title"
        value={lecture.title}
        placeholder="Lecture Title"
        onClose={() => setShowEditTitle(false)}
        onSave={handleUpdateTitle}
      />

      <MoveFolderModal
        visible={showMoveFolder}
        folders={folders}
        currentFolderId={lecture.folderId}
        onClose={() => setShowMoveFolder(false)}
        onSelectFolder={handleMoveToFolder}
      />

      <DetailedProgressModal visible={isRetrying} progress={progress} />

      {error && (
        <ErrorModal
          visible={showError}
          error={error}
          onRetry={error.retryable ? handleRetryProcessing : undefined}
          onClose={() => setShowError(false)}
          onGoToSettings={() => {
            setShowError(false);
            navigation.navigate('MainTabs', { screen: 'Settings' });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: colors.danger + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    padding: spacing.lg,
    margin: spacing.lg,
    marginBottom: 0,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  errorBannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  errorBannerText: {
    flex: 1,
  },
  errorBannerTitle: {
    ...typography.callout,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  errorBannerMessage: {
    ...typography.footnote,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  retryButtonText: {
    ...typography.callout,
    color: colors.background.primary,
    fontWeight: '600',
  },
  lessonBanner: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.lg,
    margin: spacing.lg,
    marginBottom: 0,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  lessonBannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  lessonBannerText: {
    flex: 1,
  },
  lessonBannerTitle: {
    ...typography.callout,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  lessonBannerMessage: {
    ...typography.footnote,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  lessonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    minHeight: 44,
  },
  lessonButtonText: {
    ...typography.callout,
    color: colors.background.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});
