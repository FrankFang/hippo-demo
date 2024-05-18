import type { supportedLocales } from "~/lib/constants"
import { getLocale } from "~/lib/hooks/get-locale"

interface Nested {
  [key: string]: Nested | string
}
export type I18n = Record<typeof supportedLocales[number], Nested>
export const Translation = (strings: I18n) => {
  const locale = getLocale()
  return <span>
    {locale}
  </span>
}
