import React from 'react';
import { useI18n } from '@/hooks/useI18n';

export default function LanguageSwitcher() {
    const { i18n } = useI18n();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="border px-2 py-1 rounded"
        >
            <option value="zh">简体中文</option>
            <option value="en">English</option>
        </select>
    );
}