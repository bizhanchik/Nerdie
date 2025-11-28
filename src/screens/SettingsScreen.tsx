import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Save, Key, Globe, Languages } from "lucide-react-native";
import { setOpenAIApiKey } from "../services/openai";
import { StorageService } from "../services/storage";
import { SupportedLanguage } from "../types";
import ScreenWrapper from "../components/ScreenWrapper";
import { useTranslation } from "../i18n/i18nContext";

const LANGUAGES = [
  { code: 'en' as SupportedLanguage, name: 'English', nativeName: 'English' },
  { code: 'ru' as SupportedLanguage, name: 'Russian', nativeName: 'Русский' },
  { code: 'kk' as SupportedLanguage, name: 'Kazakh', nativeName: 'Қазақша' },
];

export default function SettingsScreen() {
  const { t, language, setLanguage } = useTranslation();
  const [apiKey, setApiKey] = useState("");
  const [selectedLessonLanguage, setSelectedLessonLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    loadApiKey();
    loadLanguage();
  }, []);

  const loadApiKey = async () => {
    try {
      const key = await AsyncStorage.getItem("OPENAI_API_KEY");
      if (key) {
        setApiKey(key);
        setOpenAIApiKey(key);
      }
    } catch (e) {
      console.error("Failed to load API key", e);
    }
  };

  const loadLanguage = async () => {
    try {
      const profile = await StorageService.getUserProfile();
      if (profile) {
        setSelectedLessonLanguage(profile.language);
      }
    } catch (e) {
      console.error("Failed to load language", e);
    }
  };

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem("OPENAI_API_KEY", apiKey);
      setOpenAIApiKey(apiKey);
      Alert.alert(t.success, t.apiKeySaved);
    } catch (e) {
      Alert.alert(t.error, "Failed to save API key");
    }
  };

  const handleUILanguageChange = async (lang: SupportedLanguage) => {
    try {
      await setLanguage(lang);
      Alert.alert(t.success, t.languageUpdated);
    } catch (e) {
      Alert.alert(t.error, "Failed to update language");
    }
  };

  const handleLessonLanguageChange = async (lang: SupportedLanguage) => {
    try {
      const profile = await StorageService.getUserProfile();
      if (profile) {
        profile.language = lang;
        await StorageService.saveUserProfile(profile);
        setSelectedLessonLanguage(lang);
        Alert.alert(t.success, t.languageUpdated);
      }
    } catch (e) {
      Alert.alert(t.error, "Failed to update language");
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.headerTitle}>{t.settingsTitle}</Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Key size={20} color="#007AFF" />
              <Text style={styles.sectionTitle}>{t.apiKeySection}</Text>
            </View>

            <Text style={styles.description}>
              {t.apiKeyDescription}
            </Text>

            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder={t.apiKeyPlaceholder}
              autoCapitalize="none"
              secureTextEntry
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveApiKey}>
              <Save size={20} color="#fff" />
              <Text style={styles.saveButtonText}>{t.saveKey}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Languages size={20} color="#007AFF" />
              <Text style={styles.sectionTitle}>{t.appLanguageSection}</Text>
            </View>

            <Text style={styles.description}>
              {t.appLanguageDescription}
            </Text>

            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={`ui-${lang.code}`}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleUILanguageChange(lang.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={[
                    styles.languageName,
                    language === lang.code && styles.languageNameSelected,
                  ]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={styles.languageEnglishName}>{lang.name}</Text>
                </View>
                {language === lang.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={20} color="#007AFF" />
              <Text style={styles.sectionTitle}>{t.lessonLanguageSection}</Text>
            </View>

            <Text style={styles.description}>
              {t.lessonLanguageDescription}
            </Text>

            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={`lesson-${lang.code}`}
                style={[
                  styles.languageOption,
                  selectedLessonLanguage === lang.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleLessonLanguageChange(lang.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={[
                    styles.languageName,
                    selectedLessonLanguage === lang.code && styles.languageNameSelected,
                  ]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={styles.languageEnglishName}>{lang.name}</Text>
                </View>
                {selectedLessonLanguage === lang.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 24,
    marginTop: 10,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  languageOptionSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F7FF",
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  languageNameSelected: {
    color: "#007AFF",
  },
  languageEnglishName: {
    fontSize: 14,
    color: "#666",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
