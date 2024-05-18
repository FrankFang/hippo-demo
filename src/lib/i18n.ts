export const supportedLocales: Locale[] = ['en-US', 'zh-CN']
export const getLocale = () => {
  const query = new URLSearchParams(window.location.search)
  const localeInQuery = query.get('locale')
  const locales = navigator.languages
  return supportedLocales.find(item => item === localeInQuery) ??
    supportedLocales.find(item => locales.includes(item))
}
export const i18n = <T extends Transition>(translations: I18n<T>) => {
  return new Proxy({}, {
    get: (target, prop: string) => {
      const locale = getLocale() ?? 'en-US'
      return translations[locale][prop] as string;
    }
  }) as T
}



