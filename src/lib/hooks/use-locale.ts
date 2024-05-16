import { supportedLocales } from "~/lib/constants"

export const useLocale = () => {
  const language = navigator.languages
  // 找到第一个被支持的语言
  const locale = language.find((lang) => supportedLocales.includes(lang))
  return { locale: locale ?? "en-US" }
}
