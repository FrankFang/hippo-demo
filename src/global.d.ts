declare global {
  type Locale = 'en-US' | 'zh-CN';
  type Transition = {
    [key: string]: string | Transition;
  }
  type KeysMatch<T extends Transition, U extends Transition> =
    {
      [K in keyof T]: K extends keyof U ? U[K] : never;
    } & {
      [K in keyof U]: K extends keyof T ? T[K] : never;
    };
  type I18n<T extends Transition> = {
    'en-US': T;
    'zh-CN': KeysMatch<T, T>;
  };
}


// don't delete the line below
export { }
