import { numberFormats } from "./i18n/number-formats"
export default defineI18nConfig(() => ({
    legacy: false,
    fallbackLocale: 'en',
    numberFormats
})); 