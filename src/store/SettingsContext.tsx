import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, ThemeId, FontStyleId, FontSizeId, IconSizeId, EmojiScaleId, EmojiImageStyleId } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const defaultSettings: AppSettings = {
  theme: 'obsidiansilk',
  fontStyle: 'regal',
  fontSize: 'base',
  iconSize: 'base',
  emojiScale: 'base',
  useImagesForEmojis: false,
  emojiImageStyle: 'illustrated',
  bgBlur: 0,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('daily_record_app_settings') || localStorage.getItem('oasis_app_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
    return defaultSettings;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply settings to DOM element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-font', settings.fontStyle);
    root.setAttribute('data-font-size', settings.fontSize);
    root.setAttribute('data-icon-size', settings.iconSize);
    root.setAttribute('data-emoji-scale', settings.emojiScale);
    root.style.setProperty('--bg-blur', `${settings.bgBlur ?? 0}px`);
    
    if (settings.theme === 'dailyrecord' || settings.theme === 'midnight') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('daily_record_app_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      resetSettings,
      isSettingsOpen,
      setIsSettingsOpen,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
