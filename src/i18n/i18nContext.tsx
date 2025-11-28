import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage } from '../types';
import { translations, Translations } from './translations';
import { StorageService } from '../services/storage';

interface I18nContextType {
  language: SupportedLanguage;
  t: Translations;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const profile = await StorageService.getUserProfile();
      if (profile?.language) {
        setLanguageState(profile.language);
      }
    } catch (error) {
      console.error('Failed to load language preference', error);
    }
  };

  const setLanguage = async (lang: SupportedLanguage) => {
    try {
      const profile = await StorageService.getUserProfile();
      if (profile) {
        profile.language = lang;
        await StorageService.saveUserProfile(profile);
        setLanguageState(lang);
      }
    } catch (error) {
      console.error('Failed to save language preference', error);
      throw error;
    }
  };

  const value: I18nContextType = {
    language,
    t: translations[language],
    setLanguage,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
