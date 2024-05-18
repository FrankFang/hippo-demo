import { supportedLocales } from "~/lib/constants"

export const getLocale = () => {
  const language = globalThis.navigator?.languages
  // 找到第一个被支持的语言
  const locale = supportedLocales.find((locale) => language?.includes(locale))
  return locale ?? "en-US"
}
