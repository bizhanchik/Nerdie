import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

export const RecordingHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recording...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'flex-start',
  },
  title: {
    ...typography.largeTitle,
    color: colors.text.primary,
  },
});
