import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, Clock, ChevronRight } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Lecture } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDate } from '../../utils/dateUtils';
import { formatDuration } from '../../utils/timeUtils';
import { SwipeActions } from './SwipeActions';

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
  const renderRightActions = () => {
    if (!onEdit && !onDelete) return null;
    return <SwipeActions onEdit={onEdit} onDelete={onDelete} />;
  };

  const content = (
    <TouchableOpacity activeOpacity={1} style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{lecture.title}</Text>
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
  title: {
    ...typography.headline,
    marginBottom: spacing.xs,
    color: colors.text.primary,
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
