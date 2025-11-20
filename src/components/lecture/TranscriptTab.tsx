import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

interface TranscriptTabProps {
  transcription?: string;
}

export const TranscriptTab: React.FC<TranscriptTabProps> = ({ transcription }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transcription</Text>
      <Text style={styles.bodyText}>
        {transcription || 'No transcription available.'}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  title: {
    ...typography.title3,
    marginBottom: spacing.lg,
    color: colors.text.secondary,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.quaternary,
  },
});
