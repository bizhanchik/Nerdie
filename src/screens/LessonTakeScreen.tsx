import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Markdown from "react-native-markdown-display";
import { Lesson, LessonQuestion, LessonProgress } from "../types";
import { StorageService } from "../services/storage";
import { RootStackParamList } from "../../App";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react-native";

type LessonDetailRouteProp = RouteProp<RootStackParamList, "LessonDetail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LessonTakeScreen() {
  const route = useRoute<LessonDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { lessonId } = route.params;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"content" | "quiz">("content");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    setLoading(true);
    const lessonData = await StorageService.getLessonById(lessonId);
    if (lessonData) {
      setLesson(lessonData);

      const progress = await StorageService.getLessonProgress(lessonId);
      if (progress) {
        setAnswers(progress.answers);
        setCurrentQuestionIndex(progress.currentQuestionIndex);
      }
    }
    setLoading(false);
  };

  const saveProgress = async () => {
    if (!lesson) return;

    const progress: LessonProgress = {
      lessonId: lesson.id,
      currentQuestionIndex,
      answers,
      startedAt: Date.now(),
      lastUpdatedAt: Date.now(),
    };

    await StorageService.saveLessonProgress(progress);
  };

  const handleAnswerSelect = (answer: string) => {
    if (!lesson) return;

    const question = lesson.questions[currentQuestionIndex];
    setAnswers({ ...answers, [question.id]: answer });
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!lesson) return;

    setShowExplanation(false);

    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      saveProgress();
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    if (!lesson) return;

    let correctCount = 0;
    lesson.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        correctCount++;
      }
    });

    const score = (correctCount / lesson.questions.length) * 100;

    const updatedLesson: Lesson = {
      ...lesson,
      completed: true,
      score,
      completedAt: Date.now(),
    };

    await StorageService.saveLesson(updatedLesson);
    await StorageService.deleteLessonProgress(lesson.id);

    setQuizCompleted(true);
    setLesson(updatedLesson);
  };

  const renderQuestion = (question: LessonQuestion) => {
    const userAnswer = answers[question.id];
    const isCorrect =
      userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

    if (question.type === "multiple_choice") {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {lesson?.questions.length}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>

          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => {
              const isSelected = userAnswer === option;
              const isCorrectOption = option === question.correctAnswer;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                    showExplanation && isCorrectOption && styles.optionButtonCorrect,
                    showExplanation && isSelected && !isCorrect && styles.optionButtonWrong,
                  ]}
                  onPress={() => !showExplanation && handleAnswerSelect(option)}
                  disabled={showExplanation}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                      showExplanation && isCorrectOption && styles.optionTextCorrect,
                    ]}
                  >
                    {option}
                  </Text>
                  {showExplanation && isCorrectOption && (
                    <CheckCircle size={20} color="#34C759" />
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <XCircle size={20} color="#FF3B30" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {showExplanation && (
            <View style={[styles.explanationContainer, isCorrect ? styles.explanationCorrect : styles.explanationWrong]}>
              <Text style={styles.explanationTitle}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
          )}
        </View>
      );
    }

    if (question.type === "true_false") {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {lesson?.questions.length}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>

          <View style={styles.optionsContainer}>
            {["True", "False"].map((option) => {
              const isSelected = userAnswer === option;
              const isCorrectOption = option === question.correctAnswer;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                    showExplanation && isCorrectOption && styles.optionButtonCorrect,
                    showExplanation && isSelected && !isCorrect && styles.optionButtonWrong,
                  ]}
                  onPress={() => !showExplanation && handleAnswerSelect(option)}
                  disabled={showExplanation}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                      showExplanation && isCorrectOption && styles.optionTextCorrect,
                    ]}
                  >
                    {option}
                  </Text>
                  {showExplanation && isCorrectOption && (
                    <CheckCircle size={20} color="#34C759" />
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <XCircle size={20} color="#FF3B30" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {showExplanation && (
            <View style={[styles.explanationContainer, isCorrect ? styles.explanationCorrect : styles.explanationWrong]}>
              <Text style={styles.explanationTitle}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {lesson?.questions.length}
        </Text>
        <Text style={styles.questionText}>{question.question}</Text>

        <TextInput
          style={styles.textInput}
          value={userAnswer || ""}
          onChangeText={(text) => handleAnswerSelect(text)}
          placeholder="Type your answer here"
          multiline
          editable={!showExplanation}
        />

        {!showExplanation && userAnswer && (
          <TouchableOpacity style={styles.submitButton} onPress={() => setShowExplanation(true)}>
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </TouchableOpacity>
        )}

        {showExplanation && (
          <View style={[styles.explanationContainer, isCorrect ? styles.explanationCorrect : styles.explanationWrong]}>
            <Text style={styles.explanationTitle}>
              {isCorrect ? "Correct!" : "Here's the answer:"}
            </Text>
            {!isCorrect && (
              <Text style={styles.correctAnswerText}>
                Correct answer: {question.correctAnswer}
              </Text>
            )}
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (quizCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completionContainer}>
          <CheckCircle size={80} color="#34C759" />
          <Text style={styles.completionTitle}>Lesson Complete!</Text>
          <Text style={styles.completionScore}>
            Your Score: {Math.round(lesson.score || 0)}%
          </Text>
          <Text style={styles.completionMessage}>
            {(lesson.score || 0) >= 70
              ? "Great job! You've mastered this lesson."
              : "Good effort! You can always review the content and retake the quiz."}
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, currentView === "content" && styles.tabActive]}
          onPress={() => setCurrentView("content")}
        >
          <Text style={[styles.tabText, currentView === "content" && styles.tabTextActive]}>
            Lesson
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentView === "quiz" && styles.tabActive]}
          onPress={() => setCurrentView("quiz")}
        >
          <Text style={[styles.tabText, currentView === "quiz" && styles.tabTextActive]}>
            Quiz
          </Text>
        </TouchableOpacity>
      </View>

      {currentView === "content" ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonDescription}>{lesson.description}</Text>
          <Markdown style={markdownStyles}>{lesson.content}</Markdown>

          <TouchableOpacity
            style={styles.startQuizButton}
            onPress={() => setCurrentView("quiz")}
          >
            <Text style={styles.startQuizButtonText}>Start Quiz</Text>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.quizContainer}>
          <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
            {renderQuestion(lesson.questions[currentQuestionIndex])}
          </ScrollView>

          {showExplanation && (
            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                <Text style={styles.nextButtonText}>
                  {currentQuestionIndex < lesson.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#999",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  tabTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  lessonDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    lineHeight: 24,
  },
  startQuizButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 8,
  },
  startQuizButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  quizContainer: {
    flex: 1,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
    fontWeight: "500",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionButtonSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F7FF",
  },
  optionButtonCorrect: {
    borderColor: "#34C759",
    backgroundColor: "#F0FFF4",
  },
  optionButtonWrong: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF0F0",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: "600",
  },
  optionTextCorrect: {
    color: "#34C759",
    fontWeight: "600",
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  explanationContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  explanationCorrect: {
    backgroundColor: "#F0FFF4",
    borderColor: "#34C759",
  },
  explanationWrong: {
    backgroundColor: "#FFF0F0",
    borderColor: "#FF3B30",
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  correctAnswerText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  explanationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  nextButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  completionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginTop: 24,
    marginBottom: 16,
  },
  completionScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 16,
  },
  completionMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
    color: "#333",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 10,
    color: "#333",
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 8,
    color: "#333",
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 24,
  },
  strong: {
    fontWeight: "700",
  },
  em: {
    fontStyle: "italic",
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  list_item: {
    marginBottom: 6,
  },
  code_inline: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace",
    fontSize: 14,
  },
  code_block: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: "monospace",
    fontSize: 14,
  },
};
