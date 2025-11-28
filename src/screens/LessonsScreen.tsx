import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ScreenWrapper from "../components/ScreenWrapper";
import LessonCard from "../components/common/LessonCard";
import { StorageService } from "../services/storage";
import { Lesson } from "../types";
import { RootStackParamList } from "../../App";
import { BookOpen } from "lucide-react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LessonsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const loadLessons = async () => {
    setLoading(true);
    const allLessons = await StorageService.getLessons();
    setLessons(allLessons);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadLessons();
    }, [])
  );

  const filteredLessons = lessons.filter((lesson) => {
    if (filter === "active") return !lesson.completed;
    if (filter === "completed") return lesson.completed;
    return true;
  });

  const handleLessonPress = (lesson: Lesson) => {
    navigation.navigate("LessonDetail", { lessonId: lesson.id });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <BookOpen size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No lessons yet</Text>
      <Text style={styles.emptySubtitle}>
        Lessons will be automatically generated from your processed lectures
      </Text>
    </View>
  );

  const renderLesson = ({ item }: { item: Lesson }) => (
    <LessonCard lesson={item} onPress={() => handleLessonPress(item)} />
  );

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Lessons</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
              onPress={() => setFilter("all")}
            >
              <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === "active" && styles.filterButtonActive]}
              onPress={() => setFilter("active")}
            >
              <Text style={[styles.filterText, filter === "active" && styles.filterTextActive]}>
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === "completed" && styles.filterButtonActive]}
              onPress={() => setFilter("completed")}
            >
              <Text style={[styles.filterText, filter === "completed" && styles.filterTextActive]}>
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <FlatList
            data={filteredLessons}
            renderItem={renderLesson}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});
