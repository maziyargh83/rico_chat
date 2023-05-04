export enum colorPropertyEnum {
  "body",
  "secondary",
  "tertiary",
  "primary",
  "light",
  "reverse",
  "border",
}
export type themeRecord = Record<keyof typeof colorPropertyEnum, string>;
export enum ThemeType {
  "base",
  "dark",
}
