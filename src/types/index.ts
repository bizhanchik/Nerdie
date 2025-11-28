export interface Lecture {
  id: string;
  title: string;
  date: number; // timestamp
  audioUri: string;
  duration: number; // in seconds
  transcription?: string;
  summary?: string;
  flashcards?: Flashcard[];
  notes?: string;
  status: "recorded" | "processing" | "processed" | "failed";
  folderId?: string;
  chatHistory?: ChatMessage[];
  errorMessage?: string; // Store error details for failed lectures
  lastProcessingStep?: string; // Track which step failed
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface ProcessingResponse {
  summary: string;
  flashcards: Flashcard[];
  notes: string;
}

export interface TimestampReference {
  start: number; // seconds
  end: number; // seconds
  text: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number; // when the message was created
  references?: TimestampReference[]; // references to parts of the lecture
}

export type ProcessingStep =
  | 'title_generation'
  | 'transcription'
  | 'study_materials'
  | 'assembly';

export interface ProcessingProgress {
  currentStep: ProcessingStep;
  stepNumber: number;
  totalSteps: number;
  stepName: string;
  progress: number; // 0-100
  message?: string;
}

export type AIErrorType =
  | 'network_error'
  | 'api_key_missing'
  | 'api_key_invalid'
  | 'rate_limit'
  | 'processing_failed'
  | 'transcription_failed'
  | 'generation_failed'
  | 'unknown';

export interface AIError {
  type: AIErrorType;
  message: string;
  step?: ProcessingStep;
  retryable: boolean;
  originalError?: any;
}

export interface LearningPackStatus {
  hasSummary: boolean;
  hasFlashcards: boolean;
  hasNotes: boolean;
  completionPercentage: number;
  isComplete: boolean;
}

export interface UserProfile {
  id: string;
  age?: number;
  interests: string[];
  hasCompletedOnboarding: boolean;
  createdAt: number;
}

export interface LessonQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation: string;
  relatedTimestamp?: number; // Link to lecture timestamp
}

export interface Lesson {
  id: string;
  lectureId: string;
  title: string;
  description: string;
  content: string; // Main lesson content in markdown
  questions: LessonQuestion[];
  estimatedDuration: number; // in minutes
  createdAt: number;
  completed: boolean;
  score?: number; // percentage 0-100
  completedAt?: number;
}

export interface LessonProgress {
  lessonId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> userAnswer
  startedAt: number;
  lastUpdatedAt: number;
}
