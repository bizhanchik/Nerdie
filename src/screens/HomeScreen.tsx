import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { ArrowLeft, Folder as FolderIcon, Mic, Camera } from 'lucide-react-native';
import { RootStackParamList, TabParamList } from '../../App';
import { StorageService } from '../services/storage';
import { Lecture, Folder } from '../types';
import { useLectures } from '../hooks/useLectures';
import { useFolders } from '../hooks/useFolders';
import { LectureCard } from '../components/common/LectureCard';
import { FolderCard } from '../components/common/FolderCard';
import { LoadingCard } from '../components/common/LoadingCard';
import { FAB } from '../components/common/FAB';
import { EditModal } from '../components/common/EditModal';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/i18nContext';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { lectures, loading, loadLectures, deleteLecture, saveLecture } = useLectures();
  const { folders, loadFolders, createFolder, deleteFolder } = useFolders();
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showEditLecture, setShowEditLecture] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    await Promise.all([loadLectures(), loadFolders()]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateFolder = async (name: string) => {
    await createFolder(name);
    setShowCreateFolder(false);
  };

  const handleDeleteFolder = async (folderId: string) => {
    Alert.alert(
      t.deleteFolder,
      t.deleteFolderMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            const folderLectures = lectures.filter((l) => l.folderId === folderId);
            for (const lecture of folderLectures) {
              await StorageService.saveLecture({
                ...lecture,
                folderId: undefined,
              });
            }
            await deleteFolder(folderId);
          },
        },
      ]
    );
  };

  const handleEditLecture = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setShowEditLecture(true);
  };

  const handleSaveLectureTitle = async (title: string) => {
    if (!editingLecture) return;
    await saveLecture({ ...editingLecture, title });
    setEditingLecture(null);
    setShowEditLecture(false);
  };

  const handleDeleteLecture = (lectureId: string) => {
    Alert.alert(
      t.deleteConfirm,
      t.deleteMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteLecture(lectureId);
          },
        },
      ]
    );
  };

  const filteredLectures = currentFolder
    ? lectures.filter((l) => l.folderId === currentFolder.id)
    : lectures.filter((l) => !l.folderId);

  const combinedData = currentFolder
    ? filteredLectures
    : [...folders, ...filteredLectures];

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          {currentFolder ? (
            <TouchableOpacity
              onPress={() => setCurrentFolder(null)}
              style={styles.backButton}
            >
              <ArrowLeft size={28} color={colors.text.primary} />
              <Text style={styles.headerTitle}>{currentFolder.name}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.mainHeader}>
              <Text style={styles.headerTitle}>{t.myLectures}</Text>
              <TouchableOpacity onPress={() => setShowCreateFolder(true)}>
                <FolderIcon size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {loading && combinedData.length === 0 ? (
          <View style={styles.listContent}>
            <LoadingCard count={5} />
          </View>
        ) : (
          <FlatList
            data={combinedData}
            renderItem={({ item }) => {
              if ('name' in item && 'createdAt' in item) {
                const folder = item as Folder;
                return (
                  <FolderCard
                    folder={folder}
                    lectureCount={lectures.filter((l) => l.folderId === folder.id).length}
                    onPress={() => setCurrentFolder(folder)}
                    onLongPress={() => handleDeleteFolder(folder.id)}
                  />
                );
              }
              const lecture = item as Lecture;
              return (
                <LectureCard
                  lecture={lecture}
                  onPress={() =>
                    navigation.navigate('LectureDetail', { lectureId: lecture.id })
                  }
                  onEdit={() => handleEditLecture(lecture)}
                  onDelete={() => handleDeleteLecture(lecture.id)}
                />
              );
            }}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {currentFolder
                    ? t.noLecturesInFolder
                    : t.noLectures}
                </Text>
              </View>
            }
          />
        )}

        <View style={styles.fabContainer}>
          <FAB
            icon={<Camera color="#fff" size={28} />}
            onPress={() => navigation.navigate('Camera')}
            color={colors.primary}
            style={styles.cameraFab}
          />
          <FAB
            icon={<Mic color="#fff" size={32} />}
            onPress={() => navigation.navigate('Record')}
            style={styles.micFab}
          />
        </View>

        <EditModal
          visible={showCreateFolder}
          title={t.newFolder}
          value=""
          placeholder={t.folderName}
          onClose={() => setShowCreateFolder(false)}
          onSave={handleCreateFolder}
        />

        <EditModal
          visible={showEditLecture}
          title={t.editLectureTitle}
          value={editingLecture?.title || ''}
          placeholder={t.lectureTitle}
          onClose={() => {
            setShowEditLecture(false);
            setEditingLecture(null);
          }}
          onSave={handleSaveLectureTitle}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    backgroundColor: colors.background.primary,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    ...typography.largeTitle,
    color: colors.text.primary,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  cameraFab: {
    marginRight: spacing.sm,
  },
  micFab: {
    marginLeft: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    ...typography.headline,
    color: colors.text.placeholder,
  },
});
