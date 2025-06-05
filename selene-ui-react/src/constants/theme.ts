import themeDarkImg from '@/assets/img/theme-dark.png';
import themeLightImg from '@/assets/img/theme-light.png';
import themeAutoImg from '@/assets/img/theme-auto.png';

export type ThemeKey = 'light' | 'dark' | 'yellow';

export const themeOptions: { key: ThemeKey; label: string; image: string }[] = [
  {
    key: 'light',
    label: '亮色主题',
    image: themeLightImg,
  },
  {
    key: 'dark',
    label: '暗色主题',
    image: themeDarkImg,
  },
  {
    key: 'yellow',
    label: '黄色主题',
    image: themeLightImg,
  },
];

// ["light", "dark", "yellow"]
export const themeKeys = themeOptions.map((item) => item.key);


export enum EditorThemeType {
  DashboardLightTheme = 'DashboardLightTheme',
  DashboardBlackTheme = 'DashboardBlackTheme',
}

export enum PrimaryColorType {
  Polar_Green = 'polar-green',
  Golden_Purple = 'golden-purple',
  Polar_Blue = 'polar-blue',
  Silver = 'silver',
  Red = 'red',
  Orange = 'orange',
  Blue2 = 'blue2',
  Gold = 'gold',
}

export enum LangType {
  EN_US = 'en-us',
  ZH_CN = 'zh-cn',
  TR_TR = 'tr-tr',
  JA_JP = 'ja-jp',
}
