"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  DesktopIconSize,
  SystemSettings,
  SystemTheme,
  WallpaperType,
} from "../../types/system-settings";

/*
|--------------------------------------------------------------------------
| Storage
|--------------------------------------------------------------------------
*/

const STORAGE_KEY =
  "jaejun-os-settings";

/*
|--------------------------------------------------------------------------
| Default Settings
|--------------------------------------------------------------------------
*/

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings =
  {
    theme: "midnight",

    wallpaper: "aurora",

    bootAnimation: true,

    desktopIconSize: "medium",
  };

/*
|--------------------------------------------------------------------------
| Context Type
|--------------------------------------------------------------------------
*/

type SystemSettingsContextValue = {
  settings: SystemSettings;

  hydrated: boolean;

  setTheme: (
    theme: SystemTheme
  ) => void;

  setWallpaper: (
    wallpaper: WallpaperType
  ) => void;

  setBootAnimation: (
    enabled: boolean
  ) => void;

  setDesktopIconSize: (
    size: DesktopIconSize
  ) => void;

  resetSettings: () => void;
};

/*
|--------------------------------------------------------------------------
| Context
|--------------------------------------------------------------------------
*/

const SystemSettingsContext =
  createContext<SystemSettingsContextValue | null>(
    null
  );

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
*/

export function SystemSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    settings,
    setSettings,
  ] =
    useState<SystemSettings>(
      DEFAULT_SYSTEM_SETTINGS
    );

  /*
   * localStorage를 읽었는지 여부
   */

  const [
    hydrated,
    setHydrated,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load Settings
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      if (!stored) {
        setHydrated(true);

        return;
      }

      const parsed: unknown =
        JSON.parse(stored);

      setSettings(
        normalizeSettings(
          parsed
        )
      );
    } catch {
      /*
       * 잘못된 JSON 등이 저장되어 있으면
       * 기본 설정 사용
       */

      setSettings(
        DEFAULT_SYSTEM_SETTINGS
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Save Settings
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        settings
      )
    );
  }, [
    settings,
    hydrated,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Set Theme
  |--------------------------------------------------------------------------
  */

  const setTheme =
    useCallback(
      (
        theme: SystemTheme
      ) => {
        setSettings(
          (
            currentSettings
          ) => ({
            ...currentSettings,

            theme,
          })
        );
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | Set Wallpaper
  |--------------------------------------------------------------------------
  */

  const setWallpaper =
    useCallback(
      (
        wallpaper: WallpaperType
      ) => {
        setSettings(
          (
            currentSettings
          ) => ({
            ...currentSettings,

            wallpaper,
          })
        );
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | Set Boot Animation
  |--------------------------------------------------------------------------
  */

  const setBootAnimation =
    useCallback(
      (
        bootAnimation: boolean
      ) => {
        setSettings(
          (
            currentSettings
          ) => ({
            ...currentSettings,

            bootAnimation,
          })
        );
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | Set Desktop Icon Size
  |--------------------------------------------------------------------------
  */

  const setDesktopIconSize =
    useCallback(
      (
        desktopIconSize: DesktopIconSize
      ) => {
        setSettings(
          (
            currentSettings
          ) => ({
            ...currentSettings,

            desktopIconSize,
          })
        );
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  */

  const resetSettings =
    useCallback(() => {
      setSettings(
        DEFAULT_SYSTEM_SETTINGS
      );
    }, []);

  return (
    <SystemSettingsContext.Provider
      value={{
        settings,

        hydrated,

        setTheme,

        setWallpaper,

        setBootAnimation,

        setDesktopIconSize,

        resetSettings,
      }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useSystemSettings() {
  const context =
    useContext(
      SystemSettingsContext
    );

  if (!context) {
    throw new Error(
      "useSystemSettings must be used inside SystemSettingsProvider."
    );
  }

  return context;
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function normalizeSettings(
  value: unknown
): SystemSettings {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return {
      ...DEFAULT_SYSTEM_SETTINGS,
    };
  }

  const candidate =
    value as Partial<SystemSettings>;

  return {
    theme:
      candidate.theme ===
        "dark" ||
      candidate.theme ===
        "midnight" ||
      candidate.theme ===
        "light"
        ? candidate.theme
        : DEFAULT_SYSTEM_SETTINGS.theme,

    wallpaper:
      candidate.wallpaper ===
        "aurora" ||
      candidate.wallpaper ===
        "grid" ||
      candidate.wallpaper ===
        "plain"
        ? candidate.wallpaper
        : DEFAULT_SYSTEM_SETTINGS.wallpaper,

    bootAnimation:
      typeof candidate.bootAnimation ===
      "boolean"
        ? candidate.bootAnimation
        : DEFAULT_SYSTEM_SETTINGS.bootAnimation,

    desktopIconSize:
      candidate.desktopIconSize ===
        "small" ||
      candidate.desktopIconSize ===
        "medium" ||
      candidate.desktopIconSize ===
        "large"
        ? candidate.desktopIconSize
        : DEFAULT_SYSTEM_SETTINGS.desktopIconSize,
  };
}