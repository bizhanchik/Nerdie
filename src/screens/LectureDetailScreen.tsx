import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Share, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StorageService } from '../services/storage';
import { Lecture, Folder } from '../types';
import { LectureHeader } from '../components/lecture/LectureHeader';
import { TabBar, TabType } from '../components/lecture/TabBar';
import { SummaryTab } from '../components/lecture/SummaryTab';
import { FlashcardsTab } from '../components/lecture/FlashcardsTab';
import { NotesTab } from '../components/lecture/NotesTab';
import { TranscriptTab } from '../components/lecture/TranscriptTab';
import { EditModal } from '../components/common/EditModal';
import { MoveFolderModal } from '../components/lecture/MoveFolderModal';
import { colors } from '../constants/theme';

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

  useEffect(() => {
    loadLecture();
    loadFolders();
  }, [lectureId]);

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

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <View style={styles.content}>
        {activeTab === 'summary' && <SummaryTab summary={lecture.summary} />}
        {activeTab === 'flashcards' && (
          <FlashcardsTab flashcards={lecture.flashcards} />
        )}
        {activeTab === 'notes' && <NotesTab notes={lecture.notes} />}
        {activeTab === 'transcript' && (
          <TranscriptTab transcription={lecture.transcription} />
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
  content: {
    flex: 1,
  },
});
