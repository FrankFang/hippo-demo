export const createCatcher = (fn: (e: unknown) => void) => (e: unknown) => {
  fn(e)
  return Promise.reject(e)
}
