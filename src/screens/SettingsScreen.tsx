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
import { Save, Key } from "lucide-react-native";
import { setOpenAIApiKey } from "../services/openai";
import ScreenWrapper from "../components/ScreenWrapper";

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    loadApiKey();
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

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem("OPENAI_API_KEY", apiKey);
      setOpenAIApiKey(apiKey);
      Alert.alert("Success", "API Key saved!");
    } catch (e) {
      Alert.alert("Error", "Failed to save API key");
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.headerTitle}>Settings</Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Key size={20} color="#007AFF" />
              <Text style={styles.sectionTitle}>OpenAI API Key</Text>
            </View>

            <Text style={styles.description}>
              Enter your OpenAI API key to enable transcription and AI features.
              Your key is stored locally on your device.
            </Text>

            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="sk-..."
              autoCapitalize="none"
              secureTextEntry
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveApiKey}>
              <Save size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Key</Text>
            </TouchableOpacity>
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
});
