import { useTranslation } from 'react-i18next';

export const useI18n = (ns = 'common') => {
    const { t, i18n } = useTranslation(ns);
    return { t, i18n };
};