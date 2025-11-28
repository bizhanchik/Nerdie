import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Lesson } from "../../types";
import { Clock, CheckCircle, Circle } from "lucide-react-native";

interface LessonCardProps {
  lesson: Lesson;
  onPress: () => void;
}

export default function LessonCard({ lesson, onPress }: LessonCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          {lesson.completed ? (
            <CheckCircle size={20} color="#34C759" />
          ) : (
            <Circle size={20} color="#999" />
          )}
        </View>
        {lesson.completed && lesson.score !== undefined && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{Math.round(lesson.score)}%</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {lesson.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {lesson.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.durationContainer}>
          <Clock size={14} color="#666" />
          <Text style={styles.duration}>{lesson.estimatedDuration} min</Text>
        </View>
        <Text style={styles.questionsCount}>
          {lesson.questions.length} questions
        </Text>
      </View>

      {lesson.completed && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>Completed</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusContainer: {
    padding: 4,
  },
  scoreContainer: {
    backgroundColor: "#34C759",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  duration: {
    fontSize: 13,
    color: "#666",
  },
  questionsCount: {
    fontSize: 13,
    color: "#666",
  },
  completedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#34C759",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
