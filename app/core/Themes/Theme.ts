// src/themes/index.ts
import { baseTheme } from "./Palette/base";
import { darkTheme } from "./Palette/dark";
import type { ThemeType, themeRecord } from "./types/types";

export const themes: Record<keyof typeof ThemeType, themeRecord> = {
  base: baseTheme,
  dark: darkTheme,
};
