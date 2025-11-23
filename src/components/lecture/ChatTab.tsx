import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, Clock } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { ChatMessage, TimestampReference } from '../../types';
import { OpenAIService } from '../../services/openai';

interface ChatTabProps {
  lectureId: string;
  transcription?: string;
  notes?: string;
  chatHistory: ChatMessage[];
  onUpdateChatHistory: (messages: ChatMessage[]) => void;
  onTimestampClick?: (reference: TimestampReference) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  lectureId,
  transcription,
  notes,
  chatHistory,
  onUpdateChatHistory,
  onTimestampClick,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatHistory.length]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    if (!transcription) {
      alert('No transcription available. Please process the lecture first.');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    const updatedHistory = [...chatHistory, userMessage];
    onUpdateChatHistory(updatedHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await OpenAIService.chatAboutLecture(
        transcription,
        notes,
        chatHistory,
        inputText.trim()
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        references: response.references,
      };

      onUpdateChatHistory([...updatedHistory, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      alert('Failed to get response. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';

    return (
      <View
        key={message.id}
        style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}
      >
        <Text style={[styles.messageText, isUser && styles.userMessageText]}>
          {message.content}
        </Text>

        {!isUser && message.references && message.references.length > 0 && (
          <View style={styles.referencesContainer}>
            <Text style={styles.referencesTitle}>References:</Text>
            {message.references.map((ref, index) => (
              <TouchableOpacity
                key={index}
                style={styles.referenceChip}
                onPress={() => onTimestampClick && onTimestampClick(ref)}
              >
                <Clock size={12} color={colors.primary} />
                <Text style={styles.referenceTime}>
                  {formatTime(ref.start)} - {formatTime(ref.end)}
                </Text>
                <Text style={styles.referenceText} numberOfLines={1}>
                  "{ref.text}"
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {!transcription ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No transcription available yet. Process the lecture to start chatting.
            </Text>
          </View>
        ) : chatHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Ask questions about this lecture</Text>
            <Text style={styles.emptyText}>
              I can help you understand the content, clarify concepts, and find specific topics
              discussed in the lecture.
            </Text>
          </View>
        ) : (
          chatHistory.map(renderMessage)
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question about this lecture..."
          placeholderTextColor={colors.text.placeholder}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!isLoading && !!transcription}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Send size={20} color={inputText.trim() && !isLoading ? colors.primary : colors.text.placeholder} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
    minHeight: 300,
  },
  emptyTitle: {
    ...typography.title3,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.quaternary,
    textAlign: 'center',
    lineHeight: 24,
  },
  messageContainer: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    marginLeft: '15%',
  },
  aiMessage: {
    backgroundColor: colors.background.tertiary,
    alignSelf: 'flex-start',
    marginRight: '15%',
    ...shadows.small,
  },
  messageText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.background.primary,
  },
  referencesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  referencesTitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  referenceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  referenceTime: {
    ...typography.footnote,
    color: colors.primary,
    fontWeight: '600',
  },
  referenceText: {
    ...typography.footnote,
    color: colors.text.tertiary,
    flex: 1,
    marginLeft: spacing.xs,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.quaternary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.body,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    paddingTop: spacing.md,
    maxHeight: 100,
    color: colors.text.secondary,
  },
  sendButton: {
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
