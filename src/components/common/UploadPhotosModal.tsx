import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Camera, X } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { useTranslation } from '../../i18n/i18nContext';

interface UploadPhotosModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: () => void;
  lectureId: string;
}

export const UploadPhotosModal: React.FC<UploadPhotosModalProps> = ({
  visible,
  onClose,
  onUpload,
  lectureId,
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      // Navigate to camera screen, which will handle the upload
      onUpload();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text.tertiary} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Camera size={48} color={colors.primary} />
          </View>

          <Text style={styles.title}>{t.uploadPhotosQuestion}</Text>
          <Text style={styles.message}>{t.uploadPhotosMessage}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isUploading}
            >
              <Text style={styles.cancelButtonText}>{t.skip}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Camera size={20} color="#fff" />
                  <Text style={styles.uploadButtonText}>{t.uploadPhotos}</Text>
                </>
              )}
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
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.background.tertiary,
  },
  cancelButtonText: {
    ...typography.callout,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: colors.primary,
  },
  uploadButtonText: {
    ...typography.callout,
    color: '#fff',
    fontWeight: '600',
  },
});

