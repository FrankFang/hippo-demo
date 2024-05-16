import type { supportedLocales } from "~/lib/constants"
import { useLocale } from "~/lib/hooks/use-locale"

interface Nested {
  [key: string]: Nested | string
}
export type I18n = Record<typeof supportedLocales[number], Nested>
const Translation = (strings: I18n) => {
  const { locale } = useLocale()
  return <span>

  </span>
}
