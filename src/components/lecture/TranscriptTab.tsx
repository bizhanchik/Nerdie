import React, { useRef, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface TranscriptTabProps {
  transcription?: string;
  highlightText?: string;
}

export const TranscriptTab: React.FC<TranscriptTabProps> = ({
  transcription,
  highlightText
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const highlightRef = useRef<View>(null);

  useEffect(() => {
    if (highlightText && highlightRef.current) {
      // Auto-scroll to highlighted section after a short delay
      setTimeout(() => {
        highlightRef.current?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
          },
          () => {}
        );
      }, 300);
    }
  }, [highlightText]);

  const renderTranscriptionWithHighlight = () => {
    if (!transcription) {
      return <Text style={styles.bodyText}>No transcription available.</Text>;
    }

    if (!highlightText) {
      return <Text style={styles.bodyText}>{transcription}</Text>;
    }

    // Find the highlight text in transcription (case-insensitive)
    const lowerTranscription = transcription.toLowerCase();
    const lowerHighlight = highlightText.toLowerCase();
    const index = lowerTranscription.indexOf(lowerHighlight);

    if (index === -1) {
      // Highlight text not found, show normal transcription
      return <Text style={styles.bodyText}>{transcription}</Text>;
    }

    // Split transcription into parts: before, highlighted, after
    const beforeText = transcription.substring(0, index);
    const highlightedText = transcription.substring(index, index + highlightText.length);
    const afterText = transcription.substring(index + highlightText.length);

    return (
      <Text style={styles.bodyText}>
        {beforeText}
        <View ref={highlightRef} style={styles.highlightContainer}>
          <Text style={styles.highlightedText}>{highlightedText}</Text>
        </View>
        {afterText}
      </Text>
    );
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <Text style={styles.title}>Transcription</Text>
      {renderTranscriptionWithHighlight()}
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
  highlightContainer: {
    backgroundColor: colors.warning,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  highlightedText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
    fontWeight: '600',
  },
});
