'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../lib/translations';

type Language = 'fr' | 'vi' | 'en';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'vi',
    setLang: () => {},
    t: () => ''
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Language>('vi');

    useEffect(() => {
        const storedLang = localStorage.getItem('acvni_lang') as Language;
        if (storedLang && ['fr', 'vi', 'en'].includes(storedLang)) {
            setLang(storedLang);
        }
    }, []);

    const handleSetLang = (newLang: Language) => {
        setLang(newLang);
        localStorage.setItem('acvni_lang', newLang);
        document.documentElement.lang = newLang;
    };

    const t = (keyPath: string) => {
        const keys = keyPath.split('.');
        let value: any = translations[lang];
        for (const key of keys) {
            if (value && value[key]) {
                value = value[key];
            } else {
                return keyPath; // fallback
            }
        }
        if (typeof value === 'string') {
            return value.replace('{year}', new Date().getFullYear().toString());
        }
        return value;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
