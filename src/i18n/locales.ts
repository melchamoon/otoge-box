export type LocaleOption = { code: string; abbr: string; name: string };

export const locales: LocaleOption[] = [
  { code: 'en', abbr: 'en', name: 'English' },
  { code: 'es', abbr: 'es', name: 'Español' },
  { code: 'ru', abbr: 'ru', name: 'Русский' },
  { code: 'vi', abbr: 'vi', name: 'Tiếng Việt' },
  { code: 'id', abbr: 'id', name: 'Bahasa Indonesia' },
  { code: 'ja', abbr: 'ja', name: '日本語' },
  { code: 'ko', abbr: 'ko', name: '한국어' },
  { code: 'zh-Hant', abbr: 'tc', name: '正體中文' },
  { code: 'zh-Hans', abbr: 'sc', name: '简体中文' },
];

export const defaultLocale = 'en';
export const localeCookieName = 'NEXT_LOCALE';
