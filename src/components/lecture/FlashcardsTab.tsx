import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Flashcard } from '../../types';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

interface FlashcardsTabProps {
  flashcards?: Flashcard[];
}

export const FlashcardsTab: React.FC<FlashcardsTabProps> = ({ flashcards }) => {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setFlippedCardId(flippedCardId === cardId ? null : cardId);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>
      {flashcards && flashcards.length > 0 ? (
        flashcards.map((card: Flashcard) => (
          <TouchableOpacity
            key={card.id}
            style={styles.cardContainer}
            onPress={() => toggleCard(card.id)}
          >
            <View
              style={[
                styles.flashcard,
                flippedCardId === card.id && styles.flashcardFlipped,
              ]}
            >
              <Text style={styles.cardLabel}>
                {flippedCardId === card.id ? 'ANSWER' : 'QUESTION'}
              </Text>
              <Text style={styles.cardText}>
                {flippedCardId === card.id ? card.back : card.front}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>No flashcards generated.</Text>
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
  cardContainer: {
    marginBottom: spacing.lg,
  },
  flashcard: {
    backgroundColor: colors.background.primary,
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  flashcardFlipped: {
    backgroundColor: '#f0f9ff',
    borderColor: colors.primary,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.text.placeholder,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  cardText: {
    ...typography.headline,
    textAlign: 'center',
    color: colors.text.secondary,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.quaternary,
  },
});
