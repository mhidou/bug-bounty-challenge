import i18n from "i18next";
import { cloneDeep } from "lodash";
import { initReactI18next } from "react-i18next";
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

export const FALLBACK_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "app.language";

export interface Language {
  locale: string;
  name: string;
  icon?: JSX.Element;
}

export const defaultTranslationModules = [
  { locale: "de", texts: de },
  { locale: "en", texts: en },
  { locale: "es", texts: es },
  { locale: "fr", texts: fr }
];
export const defaultLanguages = defaultTranslationModules.map((m) => m.locale);

const getBrowserLanguage = (): string => {
  if (typeof navigator === "undefined") return FALLBACK_LANGUAGE;
  const userLang = navigator.language || FALLBACK_LANGUAGE;
  return userLang.split("-")[0];
};

const getStoredLanguage = (): string | null => {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    // SSR, private mode, etc. — fall back to detection.
    return null;
  }
};

const pickInitialLanguage = (): string => {
  const stored = getStoredLanguage();
  if (stored && defaultLanguages.includes(stored)) return stored;

  const browser = getBrowserLanguage();
  if (defaultLanguages.includes(browser)) return browser;

  return FALLBACK_LANGUAGE;
};

const resources = cloneDeep(
  Object.fromEntries(
    defaultTranslationModules.map((m) => [m.locale, { app: m.texts }])
  )
);

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    ns: ["common", "app"],
    defaultNS: "app",
    lng: pickInitialLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

i18n.on("languageChanged", (lng) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  } catch {
    // Storage unavailable — preference simply won't persist across sessions.
  }
});

export default i18n;
