"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { localeLabels, translate, type Locale } from "../i18n/translations";

const storageKey = "imponix-locale";
const supportedLocales: Locale[] = ["en", "fr", "pt-BR"];

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (source: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(storageKey);
    if (isLocale(savedLocale)) setLocaleState(savedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(storageKey, nextLocale);
    document.cookie = `imponix_locale=${encodeURIComponent(nextLocale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };

  const value = useMemo(
    () => ({ locale, setLocale, t: (source: string) => translate(locale, source) }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function T({ children }: { children: string }) {
  const { t } = useLanguage();
  return <>{t(children)}</>;
}

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <label className={`language-switcher${mobile ? " language-switcher--mobile" : ""}`}>
      <span>{t("Language")}</span>
      <select
        aria-label={t("Language")}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
      >
        {supportedLocales.map((option) => (
          <option key={option} value={option}>
            {localeLabels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
