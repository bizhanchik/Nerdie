import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, Clock, ChevronRight, CheckCircle, Package } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Lecture, LearningPackStatus } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDate } from '../../utils/dateUtils';
import { formatDuration } from '../../utils/timeUtils';
import { SwipeActions } from './SwipeActions';

const getLearningPackStatus = (lecture: Lecture): LearningPackStatus => {
  const hasSummary = !!lecture.summary;
  const hasFlashcards = !!(lecture.flashcards && lecture.flashcards.length > 0);
  const hasNotes = !!lecture.notes;

  const completedItems = [hasSummary, hasFlashcards, hasNotes].filter(Boolean).length;
  const completionPercentage = Math.round((completedItems / 3) * 100);

  return {
    hasSummary,
    hasFlashcards,
    hasNotes,
    completionPercentage,
    isComplete: completedItems === 3,
  };
};

interface LectureCardProps {
  lecture: Lecture;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LectureCard: React.FC<LectureCardProps> = ({
  lecture,
  onPress,
  onEdit,
  onDelete,
}) => {
  const packStatus = getLearningPackStatus(lecture);

  const renderLearningPackBadge = () => {
    if (lecture.status === 'failed') {
      return (
        <View style={[styles.badge, styles.badgeFailed]}>
          <Text style={styles.badgeText}>Failed</Text>
        </View>
      );
    }

    if (lecture.status === 'processing') {
      return (
        <View style={[styles.badge, styles.badgeProcessing]}>
          <Text style={styles.badgeText}>Processing...</Text>
        </View>
      );
    }

    if (!packStatus.isComplete) {
      return (
        <View style={[styles.badge, styles.badgePartial]}>
          <Package size={12} color={colors.warning} />
          <Text style={[styles.badgeText, { color: colors.warning }]}>
            {packStatus.completionPercentage}%
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.badge, styles.badgeComplete]}>
        <CheckCircle size={12} color={colors.success} />
        <Text style={[styles.badgeText, { color: colors.success }]}>
          Pack Complete
        </Text>
      </View>
    );
  };

  const renderRightActions = () => {
    if (!onEdit && !onDelete) return null;
    return <SwipeActions onEdit={onEdit} onDelete={onDelete} />;
  };

  const content = (
    <TouchableOpacity activeOpacity={1} style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{lecture.title}</Text>
          {renderLearningPackBadge()}
        </View>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.text.tertiary} />
            <Text style={styles.metaText}>{formatDate(lecture.date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.text.tertiary} />
            <Text style={styles.metaText}>
              {formatDuration(lecture.duration)}
            </Text>
          </View>
        </View>
      </View>
      <ChevronRight size={20} color={colors.border.dark} />
    </TouchableOpacity>
  );

  if (onEdit || onDelete) {
    return (
      <Swipeable renderRightActions={renderRightActions}>{content}</Swipeable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  title: {
    ...typography.headline,
    color: colors.text.primary,
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    gap: spacing.xs,
  },
  badgeComplete: {
    backgroundColor: colors.success + '15',
  },
  badgePartial: {
    backgroundColor: colors.warning + '15',
  },
  badgeProcessing: {
    backgroundColor: colors.info + '15',
  },
  badgeFailed: {
    backgroundColor: colors.danger + '15',
  },
  badgeText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.footnote,
    color: colors.text.quaternary,
  },
});
