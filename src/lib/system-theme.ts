import type {
  CSSProperties,
} from "react";

import type {
  SystemTheme,
} from "../types/system-settings";

/*
|--------------------------------------------------------------------------
| Theme Style Type
|--------------------------------------------------------------------------
*/

export type OSThemeStyle =
  CSSProperties & {
    "--os-bg": string;

    "--os-text": string;

    "--os-muted": string;

    "--os-border": string;

    "--os-panel": string;

    "--os-panel-soft": string;

    "--os-menubar": string;

    "--os-dock": string;

    "--os-accent": string;
  };

/*
|--------------------------------------------------------------------------
| Theme
|--------------------------------------------------------------------------
*/

export function getThemeStyle(
  theme: SystemTheme
): OSThemeStyle {
  switch (theme) {
    /*
    |--------------------------------------------------------------------------
    | Dark
    |--------------------------------------------------------------------------
    */

    case "dark":
      return {
        "--os-bg":
          "#0b0f19",

        "--os-text":
          "#f8fafc",

        "--os-muted":
          "rgba(248, 250, 252, 0.52)",

        "--os-border":
          "rgba(255, 255, 255, 0.12)",

        "--os-panel":
          "rgba(17, 24, 39, 0.96)",

        "--os-panel-soft":
          "rgba(255, 255, 255, 0.06)",

        "--os-menubar":
          "rgba(0, 0, 0, 0.30)",

        "--os-dock":
          "rgba(0, 0, 0, 0.42)",

        "--os-accent":
          "#60a5fa",
      };

    /*
    |--------------------------------------------------------------------------
    | Light
    |--------------------------------------------------------------------------
    */

    case "light":
      return {
        "--os-bg":
          "#e9eef7",

        "--os-text":
          "#111827",

        "--os-muted":
          "rgba(17, 24, 39, 0.55)",

        "--os-border":
          "rgba(17, 24, 39, 0.14)",

        "--os-panel":
          "rgba(255, 255, 255, 0.94)",

        "--os-panel-soft":
          "rgba(17, 24, 39, 0.06)",

        "--os-menubar":
          "rgba(255, 255, 255, 0.60)",

        "--os-dock":
          "rgba(255, 255, 255, 0.62)",

        "--os-accent":
          "#2563eb",
      };

    /*
    |--------------------------------------------------------------------------
    | Midnight
    |--------------------------------------------------------------------------
    */

    case "midnight":
    default:
      return {
        "--os-bg":
          "#050812",

        "--os-text":
          "#f8fafc",

        "--os-muted":
          "rgba(226, 232, 240, 0.52)",

        "--os-border":
          "rgba(148, 163, 184, 0.15)",

        "--os-panel":
          "rgba(8, 13, 27, 0.96)",

        "--os-panel-soft":
          "rgba(148, 163, 184, 0.07)",

        "--os-menubar":
          "rgba(3, 7, 18, 0.52)",

        "--os-dock":
          "rgba(3, 7, 18, 0.58)",

        "--os-accent":
          "#818cf8",
      };
  }
}