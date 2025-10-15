import { numberFormats } from "./i18n/number-formats"
export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    numberFormats
})); 