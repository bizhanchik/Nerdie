import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Camera, X, Check } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { RootStackParamList } from "../../App";
import { colors, spacing, typography, borderRadius } from "../constants/theme";
import { useTranslation } from "../i18n/i18nContext";

type CameraScreenRouteProp = RouteProp<RootStackParamList, "Camera">;
type CameraScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Camera"
>;

export default function CameraScreen() {
  const { t } = useTranslation();
  const route = useRoute<CameraScreenRouteProp>();
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const lectureId = route.params?.lectureId;

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t.permissionDenied, t.cameraPermissionMessage, [
        { text: t.ok, onPress: () => navigation.goBack() },
      ]);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert(t.error, t.photoError);
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.map((asset) => asset.uri);
        setPhotos([...photos, ...newPhotos]);
      }
    } catch (error) {
      console.error("Error picking photos:", error);
      Alert.alert(t.error, t.photoError);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleDone = async () => {
    if (photos.length === 0) {
      Alert.alert(t.error, t.noPhotosSelected);
      return;
    }

    if (lectureId) {
      // Add photos to existing lecture
      setIsProcessing(true);
      try {
        const { StorageService } = await import("../services/storage");
        const lecture = await StorageService.getLectureById(lectureId);
        if (lecture) {
          const updatedLecture = {
            ...lecture,
            photoUris: [...(lecture.photoUris || []), ...photos],
          };
          await StorageService.saveLecture(updatedLecture);

          // Regenerate materials with photos if lecture is processed
          if (lecture.status === "processed" && lecture.transcription) {
            const { OpenAIService } = await import("../services/openai");
            const materials =
              await OpenAIService.generateStudyMaterialsWithPhotos(
                lecture.transcription,
                updatedLecture.photoUris
              );
            updatedLecture.summary = materials.summary;
            updatedLecture.flashcards = materials.flashcards;
            updatedLecture.notes = materials.notes;
            await StorageService.saveLecture(updatedLecture);
          }

          navigation.goBack();
          // Small delay to ensure navigation completes
          setTimeout(() => {
            navigation.navigate("LectureDetail", { lectureId });
          }, 100);
        }
      } catch (error) {
        console.error("Error adding photos to lecture:", error);
        Alert.alert(t.error, t.photoUploadError);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Navigate to process photos screen for new lecture
      navigation.navigate("ProcessPhotos", { photoUris: photos });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.cameraTitle}</Text>
        <TouchableOpacity
          onPress={handleDone}
          disabled={photos.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Check
              size={24}
              color={
                photos.length > 0 ? colors.primary : colors.text.placeholder
              }
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.photoContainer}
        showsVerticalScrollIndicator={false}
      >
        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <Camera size={64} color={colors.text.placeholder} />
            <Text style={styles.emptyText}>{t.noPhotosYet}</Text>
            <Text style={styles.emptySubtext}>{t.takeOrSelectPhotos}</Text>
          </View>
        ) : (
          <View style={styles.photoGrid}>
            {photos.map((uri, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto(index)}
                >
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={takePhoto}
        >
          <Camera size={24} color="#fff" />
          <Text style={styles.buttonText}>{t.takePhoto}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={pickFromGallery}
        >
          <Text style={styles.secondaryButtonText}>{t.selectFromGallery}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    ...typography.headline,
    color: colors.text.primary,
  },
  photoContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  emptyText: {
    ...typography.headline,
    color: colors.text.primary,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  photoWrapper: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.danger,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    ...typography.callout,
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButtonText: {
    ...typography.callout,
    color: colors.primary,
    fontWeight: "600",
  },
});
