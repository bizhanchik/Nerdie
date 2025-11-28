import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Share2, Edit2, Trash2, Folder as FolderIcon, Camera } from 'lucide-react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { formatDate } from '../../utils/dateUtils';

interface LectureHeaderProps {
  title: string;
  date: number;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveToFolder: () => void;
  onUploadPhotos?: () => void;
}

export const LectureHeader: React.FC<LectureHeaderProps> = ({
  title,
  date,
  onShare,
  onEdit,
  onDelete,
  onMoveToFolder,
  onUploadPhotos,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.date}>{formatDate(date)}</Text>
        <View style={styles.actions}>
          {onUploadPhotos && (
            <TouchableOpacity onPress={onUploadPhotos}>
              <Camera size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onMoveToFolder}>
            <FolderIcon size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit}>
            <Edit2 size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Trash2 size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onShare} style={styles.shareButton}>
        <Share2 size={20} color={colors.primary} />
        <Text style={styles.shareText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  date: {
    ...typography.footnote,
    color: colors.text.tertiary,
  },
  title: {
    ...typography.title2,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.sm,
  },
  shareText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
