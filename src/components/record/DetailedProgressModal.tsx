import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { CheckCircle, Circle, Loader } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { ProcessingProgress, ProcessingStep } from '../../types';

interface DetailedProgressModalProps {
  visible: boolean;
  progress: ProcessingProgress;
}

interface StepInfo {
  key: ProcessingStep;
  label: string;
  description: string;
}

const STEPS: StepInfo[] = [
  {
    key: 'title_generation',
    label: 'Generating Title',
    description: 'Analyzing lecture content...',
  },
  {
    key: 'transcription',
    label: 'Transcribing Audio',
    description: 'Converting speech to text...',
  },
  {
    key: 'study_materials',
    label: 'Creating Study Materials',
    description: 'Generating summary, flashcards, and notes...',
  },
  {
    key: 'assembly',
    label: 'Assembling Learning Pack',
    description: 'Finalizing your materials...',
  },
];

export const DetailedProgressModal: React.FC<DetailedProgressModalProps> = ({
  visible,
  progress,
}) => {
  const getStepStatus = (stepKey: ProcessingStep): 'pending' | 'in_progress' | 'completed' => {
    const currentStepIndex = STEPS.findIndex((s) => s.key === progress.currentStep);
    const thisStepIndex = STEPS.findIndex((s) => s.key === stepKey);

    if (thisStepIndex < currentStepIndex) return 'completed';
    if (thisStepIndex === currentStepIndex) return 'in_progress';
    return 'pending';
  };

  const renderStepIcon = (stepKey: ProcessingStep) => {
    const status = getStepStatus(stepKey);

    if (status === 'completed') {
      return <CheckCircle size={24} color={colors.success} />;
    }

    if (status === 'in_progress') {
      return <Loader size={24} color={colors.primary} />;
    }

    return <Circle size={24} color={colors.text.placeholder} />;
  };

  const renderStep = (step: StepInfo, index: number) => {
    const status = getStepStatus(step.key);
    const isActive = status === 'in_progress';

    return (
      <View key={step.key} style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <View style={styles.stepIconContainer}>{renderStepIcon(step.key)}</View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
              {step.label}
            </Text>
            <Text style={styles.stepDescription}>
              {isActive && progress.message ? progress.message : step.description}
            </Text>
          </View>
        </View>

        {index < STEPS.length - 1 && (
          <View
            style={[
              styles.stepConnector,
              status === 'completed' && styles.stepConnectorCompleted,
            ]}
          />
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Processing Lecture</Text>
            <Text style={styles.subtitle}>
              Step {progress.stepNumber} of {progress.totalSteps}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress.progress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress.progress)}%</Text>
          </View>

          <View style={styles.stepsContainer}>
            {STEPS.map((step, index) => renderStep(step, index))}
          </View>

          <View style={styles.footer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.footerText}>
              {progress.stepName || 'Processing...'}
            </Text>
          </View>

          <Text style={styles.hint}>This may take a minute or two...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.callout,
    color: colors.text.tertiary,
  },
  progressBarContainer: {
    marginBottom: spacing.xxl,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  stepsContainer: {
    marginBottom: spacing.xl,
  },
  stepContainer: {
    marginBottom: spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIconContainer: {
    marginRight: spacing.md,
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    ...typography.headline,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepDescription: {
    ...typography.subheadline,
    color: colors.text.quaternary,
  },
  stepConnector: {
    width: 2,
    height: spacing.md,
    backgroundColor: colors.border.light,
    marginLeft: 11,
    marginTop: spacing.xs,
  },
  stepConnectorCompleted: {
    backgroundColor: colors.success,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  footerText: {
    ...typography.callout,
    color: colors.text.secondary,
  },
  hint: {
    ...typography.footnote,
    color: colors.text.quaternary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
