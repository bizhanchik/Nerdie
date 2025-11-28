import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserProfile } from "../types";
import { StorageService } from "../services/storage";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const COMMON_INTERESTS = [
  "Sports",
  "Music",
  "Art",
  "Technology",
  "Science",
  "History",
  "Literature",
  "Gaming",
  "Movies",
  "Cooking",
  "Travel",
  "Fashion",
  "Photography",
  "Nature",
  "Mathematics",
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const handleComplete = async () => {
    const profile: UserProfile = {
      id: Date.now().toString(),
      age: age ? parseInt(age) : undefined,
      interests: selectedInterests,
      hasCompletedOnboarding: true,
      createdAt: Date.now(),
    };

    await StorageService.saveUserProfile(profile);
    onComplete();
  };

  const canProceedToStep2 = age.trim() !== "" && !isNaN(parseInt(age));
  const canComplete = selectedInterests.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Nerdie!</Text>
            <Text style={styles.subtitle}>
              Let's personalize your learning experience
            </Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
              <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
              <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
            </View>
          </View>

          {step === 1 ? (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>How old are you?</Text>
              <Text style={styles.stepDescription}>
                This helps us tailor lessons to your level
              </Text>
              <TextInput
                style={styles.ageInput}
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                keyboardType="number-pad"
                maxLength={3}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.button, !canProceedToStep2 && styles.buttonDisabled]}
                onPress={() => setStep(2)}
                disabled={!canProceedToStep2}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>What are your interests?</Text>
              <Text style={styles.stepDescription}>
                We'll use these to create relatable examples in your lessons
              </Text>

              <View style={styles.interestsContainer}>
                {COMMON_INTERESTS.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.interestChip,
                      selectedInterests.includes(interest) && styles.interestChipSelected,
                    ]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text
                      style={[
                        styles.interestChipText,
                        selectedInterests.includes(interest) &&
                          styles.interestChipTextSelected,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.customInterestContainer}>
                <TextInput
                  style={styles.customInterestInput}
                  value={customInterest}
                  onChangeText={setCustomInterest}
                  placeholder="Add your own interest"
                  onSubmitEditing={addCustomInterest}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addCustomInterest}
                  disabled={!customInterest.trim()}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              {selectedInterests.length > 0 && (
                <View style={styles.selectedContainer}>
                  <Text style={styles.selectedTitle}>Selected ({selectedInterests.length}):</Text>
                  <View style={styles.selectedChips}>
                    {selectedInterests.map((interest) => (
                      <View key={interest} style={styles.selectedChip}>
                        <Text style={styles.selectedChipText}>{interest}</Text>
                        <TouchableOpacity onPress={() => toggleInterest(interest)}>
                          <Text style={styles.removeChipText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonFlex, !canComplete && styles.buttonDisabled]}
                  onPress={handleComplete}
                  disabled={!canComplete}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  progressDotActive: {
    backgroundColor: "#007AFF",
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: "#007AFF",
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  ageInput: {
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    backgroundColor: "#fff",
  },
  interestChipSelected: {
    backgroundColor: "#007AFF",
  },
  interestChipText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  interestChipTextSelected: {
    color: "#fff",
  },
  customInterestContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  customInterestInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  selectedContainer: {
    marginBottom: 24,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  selectedChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    gap: 6,
  },
  selectedChipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  removeChipText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  backButton: {
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonFlex: {
    flex: 2,
  },
});
