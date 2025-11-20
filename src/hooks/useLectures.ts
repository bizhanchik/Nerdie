import { useState, useCallback } from 'react';
import { Lecture } from '../types';
import { StorageService } from '../services/storage';

export const useLectures = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLectures = useCallback(async () => {
    setLoading(true);
    try {
      const data = await StorageService.getLectures();
      setLectures(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLectureById = useCallback(
    (id: string) => {
      return lectures.find((l) => l.id === id);
    },
    [lectures]
  );

  const saveLecture = useCallback(async (lecture: Lecture) => {
    await StorageService.saveLecture(lecture);
    await loadLectures();
  }, [loadLectures]);

  const deleteLecture = useCallback(async (id: string) => {
    await StorageService.deleteLecture(id);
    await loadLectures();
  }, [loadLectures]);

  const getLecturesByFolder = useCallback(
    (folderId?: string) => {
      if (folderId) {
        return lectures.filter((l) => l.folderId === folderId);
      }
      return lectures.filter((l) => !l.folderId);
    },
    [lectures]
  );

  return {
    lectures,
    loading,
    loadLectures,
    getLectureById,
    saveLecture,
    deleteLecture,
    getLecturesByFolder,
  };
};
