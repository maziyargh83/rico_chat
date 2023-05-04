import type { themeRecord } from "~/core/Themes/types/types";

export const extend = (
  extending: themeRecord,
  newTheme: Partial<themeRecord>
): themeRecord => {
  return { ...extending, ...newTheme };
};
