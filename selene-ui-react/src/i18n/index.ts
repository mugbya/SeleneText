import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '@/i18n/en/common.json';
import zhCommon from '@/i18n/zh/common.json';

const resources = {
    en: { common: enCommon },
    zh: { common: zhCommon },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'zh',
        fallbackLng: 'zh',
        ns: ['common'],
        defaultNS: 'common',
        interpolation: { escapeValue: false },
    });

export default i18n;