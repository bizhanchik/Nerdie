import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { X, List, Folder as FolderIcon } from 'lucide-react-native';
import { Folder } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface MoveFolderModalProps {
  visible: boolean;
  folders: Folder[];
  currentFolderId?: string;
  onClose: () => void;
  onSelectFolder: (folderId?: string) => void;
}

export const MoveFolderModal: React.FC<MoveFolderModalProps> = ({
  visible,
  folders,
  currentFolderId,
  onClose,
  onSelectFolder,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Move to Folder</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.folderOption}
            onPress={() => onSelectFolder(undefined)}
          >
            <View style={styles.iconContainer}>
              <List size={20} color={colors.text.tertiary} />
            </View>
            <Text style={styles.folderText}>Main List (No Folder)</Text>
            {!currentFolderId && <View style={styles.checkMark} />}
          </TouchableOpacity>

          <FlatList
            data={folders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.folderOption}
                onPress={() => onSelectFolder(item.id)}
              >
                <View style={styles.iconContainer}>
                  <FolderIcon size={20} color={colors.primary} />
                </View>
                <Text style={styles.folderText}>{item.name}</Text>
                {currentFolderId === item.id && <View style={styles.checkMark} />}
              </TouchableOpacity>
            )}
            style={{ maxHeight: 300 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 320,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title3,
    color: colors.text.secondary,
  },
  folderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  folderText: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
  },
  checkMark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
});
