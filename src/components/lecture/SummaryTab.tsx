import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { colors, spacing, typography } from '../../constants/theme';

interface SummaryTabProps {
  summary?: string;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ summary }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Summary</Text>
      {summary ? (
        <Markdown style={markdownStyles}>{summary}</Markdown>
      ) : (
        <Text style={styles.emptyText}>No summary available.</Text>
      )}
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
  emptyText: {
    ...typography.body,
    color: colors.text.quaternary,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.quaternary,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginBottom: 10,
    marginTop: 20,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginBottom: 8,
    marginTop: 16,
  },
  list_item: {
    marginBottom: 8,
  },
  bullet_list: {
    marginBottom: 8,
  },
});
