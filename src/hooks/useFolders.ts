import { useState, useCallback } from 'react';
import { Folder } from '../types';
import { StorageService } from '../services/storage';

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFolders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await StorageService.getFolders();
      setFolders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFolder = useCallback(async (folder: Folder) => {
    await StorageService.saveFolder(folder);
    await loadFolders();
  }, [loadFolders]);

  const deleteFolder = useCallback(async (id: string) => {
    await StorageService.deleteFolder(id);
    await loadFolders();
  }, [loadFolders]);

  const createFolder = useCallback(async (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: Date.now(),
    };
    await saveFolder(newFolder);
    return newFolder;
  }, [saveFolder]);

  return {
    folders,
    loading,
    loadFolders,
    saveFolder,
    deleteFolder,
    createFolder,
  };
};
