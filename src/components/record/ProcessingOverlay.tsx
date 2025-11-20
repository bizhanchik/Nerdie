import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

interface ProcessingOverlayProps {
  step: string;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ step }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.text.primary} />
      <Text style={styles.text}>{step}</Text>
      <Text style={styles.subText}>This may take a minute...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: spacing.xl,
    ...typography.headline,
    color: colors.text.secondary,
  },
  subText: {
    marginTop: spacing.sm,
    ...typography.subheadline,
    color: colors.text.tertiary,
  },
});
