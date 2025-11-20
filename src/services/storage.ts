import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lecture, Folder } from "../types";

const STORAGE_KEY = "@lectures_data";
const FOLDERS_KEY = "@folders_data";

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
};
