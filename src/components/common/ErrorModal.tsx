import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  AlertCircle,
  Wifi,
  Key,
  Zap,
  RefreshCw,
  X,
  Settings,
} from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { AIError, AIErrorType } from '../../types';

interface ErrorModalProps {
  visible: boolean;
  error: AIError;
  onRetry?: () => void;
  onClose: () => void;
  onGoToSettings?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  error,
  onRetry,
  onClose,
  onGoToSettings,
}) => {
  const getErrorIcon = (type: AIErrorType) => {
    switch (type) {
      case 'network_error':
        return Wifi;
      case 'api_key_missing':
      case 'api_key_invalid':
        return Key;
      case 'rate_limit':
        return Zap;
      default:
        return AlertCircle;
    }
  };

  const getErrorColor = (type: AIErrorType) => {
    switch (type) {
      case 'network_error':
        return colors.warning;
      case 'api_key_missing':
      case 'api_key_invalid':
        return colors.info;
      case 'rate_limit':
        return colors.warning;
      default:
        return colors.danger;
    }
  };

  const getErrorTitle = (type: AIErrorType) => {
    switch (type) {
      case 'network_error':
        return 'Network Error';
      case 'api_key_missing':
        return 'API Key Required';
      case 'api_key_invalid':
        return 'Invalid API Key';
      case 'rate_limit':
        return 'Rate Limit Exceeded';
      case 'transcription_failed':
        return 'Transcription Failed';
      case 'generation_failed':
        return 'Generation Failed';
      case 'processing_failed':
        return 'Processing Failed';
      default:
        return 'Error Occurred';
    }
  };

  const ErrorIcon = getErrorIcon(error.type);
  const errorColor = getErrorColor(error.type);
  const needsSettings = error.type === 'api_key_missing' || error.type === 'api_key_invalid';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={colors.text.tertiary} />
          </TouchableOpacity>

          <View style={[styles.iconContainer, { backgroundColor: errorColor + '15' }]}>
            <ErrorIcon size={48} color={errorColor} />
          </View>

          <Text style={styles.title}>{getErrorTitle(error.type)}</Text>

          <ScrollView
            style={styles.messageContainer}
            contentContainerStyle={styles.messageContent}
          >
            <Text style={styles.message}>{error.message}</Text>

            {error.step && (
              <View style={styles.stepInfo}>
                <Text style={styles.stepLabel}>Failed at step:</Text>
                <Text style={styles.stepValue}>{error.step.replace('_', ' ')}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.actions}>
            {needsSettings && onGoToSettings && (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onGoToSettings}
              >
                <Settings size={20} color={colors.background.primary} />
                <Text style={styles.primaryButtonText}>Go to Settings</Text>
              </TouchableOpacity>
            )}

            {error.retryable && onRetry && (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onRetry}
              >
                <RefreshCw size={20} color={colors.background.primary} />
                <Text style={styles.primaryButtonText}>Retry</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContainer: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 400,
    ...shadows.large,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    padding: spacing.sm,
    zIndex: 1,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  messageContainer: {
    maxHeight: 200,
    marginBottom: spacing.xl,
  },
  messageContent: {
    paddingBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepInfo: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepLabel: {
    ...typography.callout,
    color: colors.text.tertiary,
  },
  stepValue: {
    ...typography.callout,
    color: colors.text.secondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actions: {
    gap: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.background.tertiary,
  },
  primaryButtonText: {
    ...typography.headline,
    color: colors.background.primary,
  },
  secondaryButtonText: {
    ...typography.headline,
    color: colors.text.secondary,
  },
});
