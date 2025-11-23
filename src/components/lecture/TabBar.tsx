import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AlignLeft, BookOpen, List, FileText, MessageCircle } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

export type TabType = 'summary' | 'flashcards' | 'notes' | 'transcript' | 'chat';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ key: TabType; label: string; icon: typeof AlignLeft }> = [
    { key: 'summary', label: 'Summary', icon: AlignLeft },
    { key: 'flashcards', label: 'Cards', icon: BookOpen },
    { key: 'notes', label: 'Notes', icon: List },
    { key: 'transcript', label: 'Text', icon: FileText },
    { key: 'chat', label: 'Chat', icon: MessageCircle },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(({ key, label, icon: Icon }) => (
        <TouchableOpacity
          key={key}
          style={[styles.tab, activeTab === key && styles.activeTab]}
          onPress={() => onTabChange(key)}
        >
          <Icon
            size={20}
            color={activeTab === key ? colors.primary : colors.text.tertiary}
          />
          <Text
            style={[styles.tabText, activeTab === key && styles.activeTabText]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: 6,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    ...typography.footnote,
    color: colors.text.tertiary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
