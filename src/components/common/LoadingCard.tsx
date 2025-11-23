import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '../../constants/theme';

interface LoadingCardProps {
  count?: number;
}

const SkeletonBox: React.FC<{ width: string | number; height: number; marginBottom?: number }> = ({
  width,
  height,
  marginBottom = 0,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          marginBottom,
          opacity,
        },
      ]}
    />
  );
};

export const LoadingCard: React.FC<LoadingCardProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <SkeletonBox width="70%" height={18} marginBottom={spacing.sm} />
              <SkeletonBox width={60} height={20} />
            </View>
            <View style={styles.meta}>
              <SkeletonBox width={80} height={14} />
              <SkeletonBox width={60} height={14} />
            </View>
          </View>
          <SkeletonBox width={20} height={20} />
        </View>
      ))}
    </>
  );
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
  meta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  skeleton: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
  },
});
