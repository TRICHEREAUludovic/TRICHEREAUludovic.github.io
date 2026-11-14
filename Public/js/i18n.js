const SUPPORTED_LANGUAGES = ["fr", "en"];
const languageCatalogs = new Map();
const languageErrorMessages = {
  fr: "Impossible de charger cette langue. Réessayez.",
  en: "Could not load this language. Please try again.",
};

let currentLang = "fr";
let currentTranslations = {};
let languageRequestId = 0;

function t(key) {
  return currentTranslations[key] ?? key;
}

function getSavedLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem("language");
    return SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : "fr";
  } catch (error) {
    console.error("Impossible de lire la préférence de langue.", error);
    return "fr";
  }
}

function setLanguageStatus(message) {
  document.querySelectorAll(".language-status").forEach((status) => {
    status.textContent = message;
  });
}

function setLanguageBusy(isBusy) {
  document.querySelectorAll(".language-switcher").forEach((switcher) => {
    switcher.setAttribute("aria-busy", String(isBusy));
  });
}

function applyTranslations(lang, translations) {
  currentLang = lang;
  currentTranslations = translations;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const translation = translations[key];

    if (typeof translation !== "string") {
      console.error(`Traduction manquante pour "${key}" (${lang}).`);
      return;
    }

    element.innerHTML = translation;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    const translation = translations[key];

    if (typeof translation !== "string") {
      console.error(`Traduction de placeholder manquante pour "${key}" (${lang}).`);
      return;
    }

    element.setAttribute("placeholder", translation);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.dataset.i18nAria;
    const translation = translations[key];

    if (typeof translation !== "string") {
      console.error(`Traduction aria manquante pour "${key}" (${lang}).`);
      return;
    }

    element.setAttribute("aria-label", translation);
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const key = element.dataset.i18nAlt;
    const translation = translations[key];

    if (typeof translation !== "string") {
      console.error(`Traduction alt manquante pour "${key}" (${lang}).`);
      return;
    }

    element.setAttribute("alt", translation);
  });

  document.querySelectorAll("[data-i18n-content]").forEach((element) => {
    const key = element.dataset.i18nContent;
    const translation = translations[key];

    if (typeof translation !== "string") {
      console.error(`Traduction de métadonnée manquante pour "${key}" (${lang}).`);
      return;
    }

    element.setAttribute("content", translation);
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === lang));
  });

  setLanguageStatus("");
  document.dispatchEvent(
    new CustomEvent("site-language-changed", { detail: { language: lang } }),
  );
}

async function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    console.error(`Langue non prise en charge : "${lang}".`);
    return false;
  }

  const requestId = ++languageRequestId;
  setLanguageStatus("");
  setLanguageBusy(true);

  try {
    let translations = languageCatalogs.get(lang);

    if (!translations) {
      const response = await fetch(`./Public/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Le fichier de langue a répondu avec le statut ${response.status}.`);
      }

      translations = await response.json();
      if (
        typeof translations !== "object" ||
        translations === null ||
        Array.isArray(translations)
      ) {
        throw new TypeError("Le fichier de langue doit contenir un objet JSON.");
      }

      languageCatalogs.set(lang, translations);
    }

    if (requestId !== languageRequestId) return false;

    applyTranslations(lang, translations);

    try {
      window.localStorage.setItem("language", lang);
    } catch (error) {
      console.error("Impossible de mémoriser la préférence de langue.", error);
      setLanguageStatus(
        translations["language.storageError"] ??
          languageErrorMessages[lang],
      );
    }

    return true;
  } catch (error) {
    if (requestId !== languageRequestId) return false;

    console.error(`Impossible de charger les traductions "${lang}".`, error);
    setLanguageStatus(languageErrorMessages[lang]);
    return false;
  } finally {
    if (requestId === languageRequestId) setLanguageBusy(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.language);
    });
  });

  setLanguage(getSavedLanguage());
});
