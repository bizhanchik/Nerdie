import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Folder as FolderIcon, ChevronRight } from 'lucide-react-native';
import { Folder } from '../../types';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

interface FolderCardProps {
  folder: Folder;
  lectureCount: number;
  onPress: () => void;
  onLongPress?: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  lectureCount,
  onPress,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.content}>
        <FolderIcon size={24} color={colors.primary} fill={colors.accent} />
        <Text style={styles.name}>{folder.name}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.count}>{lectureCount}</Text>
        <ChevronRight size={20} color={colors.border.dark} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.small,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  name: {
    ...typography.headline,
    color: colors.text.secondary,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  count: {
    ...typography.subheadline,
    color: colors.text.tertiary,
  },
});
