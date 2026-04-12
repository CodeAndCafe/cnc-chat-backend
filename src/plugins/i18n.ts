import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: { loadPath: path.join(process.cwd(), "src/locales/{{lng}}/{{ns}}.json") },
    fallbackLng: "en",
    preload: ["en", "ja", "vi"], // Preload supported languages
    supportedLngs: ["en", "ja", "vi"],
  });

export default i18next;
