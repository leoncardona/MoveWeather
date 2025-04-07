import en from "./en.json";
import es from "./es.json";

export const translations = {
  en,
  es,
} as const;

export type Language = keyof typeof translations;
export const defaultLanguage: Language = "en";
export const supportedLanguages: Language[] = ["en", "es"];
