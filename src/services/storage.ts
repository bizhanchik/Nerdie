import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lecture, Folder, UserProfile, Lesson, LessonProgress } from "../types";

const STORAGE_KEY = "@lectures_data";
const FOLDERS_KEY = "@folders_data";
const USER_PROFILE_KEY = "@user_profile";
const LESSONS_KEY = "@lessons_data";
const LESSON_PROGRESS_KEY = "@lesson_progress";

export const StorageService = {
  async getLectures(): Promise<Lecture[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Failed to fetch lectures", e);
      return [];
    }
  },

  async saveLecture(lecture: Lecture): Promise<void> {
    try {
      const lectures = await this.getLectures();
      const updatedLectures = [
        lecture,
        ...lectures.filter((l) => l.id !== lecture.id),
      ];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLectures));
    } catch (e) {
      console.error("Failed to save lecture", e);
    }
  },

  async deleteLecture(id: string): Promise<void> {
    try {
      const lectures = await this.getLectures();
      const updatedLectures = lectures.filter((l) => l.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLectures));
    } catch (e) {
      console.error("Failed to delete lecture", e);
    }
  },

  async getLectureById(id: string): Promise<Lecture | undefined> {
    const lectures = await this.getLectures();
    return lectures.find((l) => l.id === id);
  },

  async getFolders(): Promise<Folder[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(FOLDERS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Failed to fetch folders", e);
      return [];
    }
  },

  async saveFolder(folder: Folder): Promise<void> {
    try {
      const folders = await this.getFolders();
      const updatedFolders = [
        folder,
        ...folders.filter((f) => f.id !== folder.id),
      ];
      await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(updatedFolders));
    } catch (e) {
      console.error("Failed to save folder", e);
    }
  },

  async deleteFolder(id: string): Promise<void> {
    try {
      const folders = await this.getFolders();
      const updatedFolders = folders.filter((f) => f.id !== id);
      await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(updatedFolders));
    } catch (e) {
      console.error("Failed to delete folder", e);
    }
  },

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Failed to fetch user profile", e);
      return null;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save user profile", e);
    }
  },

  async getLessons(): Promise<Lesson[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(LESSONS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Failed to fetch lessons", e);
      return [];
    }
  },

  async saveLesson(lesson: Lesson): Promise<void> {
    try {
      const lessons = await this.getLessons();
      const updatedLessons = [
        lesson,
        ...lessons.filter((l) => l.id !== lesson.id),
      ];
      await AsyncStorage.setItem(LESSONS_KEY, JSON.stringify(updatedLessons));
    } catch (e) {
      console.error("Failed to save lesson", e);
    }
  },

  async deleteLesson(id: string): Promise<void> {
    try {
      const lessons = await this.getLessons();
      const updatedLessons = lessons.filter((l) => l.id !== id);
      await AsyncStorage.setItem(LESSONS_KEY, JSON.stringify(updatedLessons));
    } catch (e) {
      console.error("Failed to delete lesson", e);
    }
  },

  async getLessonById(id: string): Promise<Lesson | undefined> {
    const lessons = await this.getLessons();
    return lessons.find((l) => l.id === id);
  },

  async getLessonsByLectureId(lectureId: string): Promise<Lesson[]> {
    const lessons = await this.getLessons();
    return lessons.filter((l) => l.lectureId === lectureId);
  },

  async getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(`${LESSON_PROGRESS_KEY}_${lessonId}`);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Failed to fetch lesson progress", e);
      return null;
    }
  },

  async saveLessonProgress(progress: LessonProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${LESSON_PROGRESS_KEY}_${progress.lessonId}`,
        JSON.stringify(progress)
      );
    } catch (e) {
      console.error("Failed to save lesson progress", e);
    }
  },

  async deleteLessonProgress(lessonId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${LESSON_PROGRESS_KEY}_${lessonId}`);
    } catch (e) {
      console.error("Failed to delete lesson progress", e);
    }
  },
};
