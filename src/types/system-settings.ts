export type SystemTheme =
  | "dark"
  | "midnight"
  | "light";

export type WallpaperType =
  | "aurora"
  | "grid"
  | "plain";

export type DesktopIconSize =
  | "small"
  | "medium"
  | "large";

export type SystemSettings = {
  theme: SystemTheme;

  wallpaper: WallpaperType;

  bootAnimation: boolean;

  desktopIconSize: DesktopIconSize;
};