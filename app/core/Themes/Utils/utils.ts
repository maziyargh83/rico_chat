import { config as CONFIG } from "~/Config";
import { themes } from "~/core/Themes/Theme";
import type {
  ThemeType,
  colorPropertyEnum,
  themeRecord,
} from "~/core/Themes/types/types";

export const mapTheme = (variables: themeRecord): Record<string, string> => {
  const res: Record<string, string> = {};
  Object.keys(variables).forEach((item) => {
    const result = createVariables(item);
    res[result] = variables[item as keyof typeof colorPropertyEnum];
  });
  return res;
};
export const addPrefixVariable = (name: string) => {
  let result = CONFIG.themeColorPrefix + name.toLocaleLowerCase();

  Object.keys(CONFIG.PrefixVariable).forEach((word) => {
    if (name.toLocaleLowerCase().includes(word.toLocaleLowerCase())) {
      result =
        (CONFIG.PrefixVariable as Record<string, string>)[word] +
        name.toLocaleLowerCase();
    }
  });
  return result;
};
export const createVariables = (name: string) => {
  const upperCaseIndex = findUpperCaseLetter(name);

  if (upperCaseIndex !== -1) {
    const sente = insertLetter(name, "-", upperCaseIndex);
    return addPrefixVariable(sente);
  }
  return addPrefixVariable(name);
};
export const insertLetter = (str: string, letter: string, index: number) => {
  return str.substring(0, index) + letter + str.substring(index);
};
export const findUpperCaseLetter = (str: string) =>
  str.split("").findIndex((item) => item.toUpperCase() === item);
export const applyTheme = (theme?: keyof typeof ThemeType): void => {
  const res = localStorage.getItem("theme");
  if (res && !theme) {
    const data = JSON.parse(res);
    applyStyle(data.pallet);

    return;
  }

  if (!theme) theme = CONFIG.baseTheme;

  const themeObject = mapTheme(themes[theme]);
  if (!themeObject) return;

  applyStyle(themeObject);
  const data = {
    theme,
    pallet: themeObject,
  };
  localStorage.setItem("theme", JSON.stringify(data));
};
export const applyStyle = (themeObject: Record<string, string>) => {
  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    if (property === "name") {
      return;
    }

    root.style.setProperty(property, themeObject[property]);
  });
};
export const getTheme = () => {
  let theme = CONFIG.baseTheme;
  const localStorageTheme =
    typeof window !== "undefined" ? localStorage?.getItem("theme") : undefined;
  if (localStorageTheme) {
    const themeName = JSON.parse(localStorageTheme);
    theme = themeName.theme;
  }
  return mapTheme(themes[theme]);
};
