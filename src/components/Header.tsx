'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function Header() {
    const { lang, setLang, t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header id="header" className={scrolled ? 'scrolled' : ''}>
            <div className="container navbar">
                <Link href="/" className="logo">
                    <img src="/assets/logo_new.webp" alt="ACVNI Logo" />
                    <span>ACVNI</span>
                </Link>

                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <li><Link href="/#about" onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link></li>
                    <li><Link href="/#mission" onClick={() => setMenuOpen(false)}>{t('nav.mission')}</Link></li>
                    <li><Link href="/#activities" onClick={() => setMenuOpen(false)}>{t('nav.activities')}</Link></li>
                    <li><Link href="/#membership" onClick={() => setMenuOpen(false)}>{t('nav.membership')}</Link></li>
                    <li><Link href="/#events-gallery" onClick={() => setMenuOpen(false)}>{t('nav.events')}</Link></li>
                    <li><Link href="/news" onClick={() => setMenuOpen(false)}>{t('nav.news')}</Link></li>
                    <li><Link href="/#contact" className="btn-primary" style={{ color: 'white' }} onClick={() => setMenuOpen(false)}>{t('nav.contact')}</Link></li>
                    
                    <li className="lang-switcher">
                        <button className={`lang-btn ${lang === 'vi' ? 'active' : ''}`} onClick={() => setLang('vi')}>VI</button>
                        <span className="separator">|</span>
                        <button className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} onClick={() => setLang('fr')}>FR</button>
                        <span className="separator">|</span>
                        <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
                    </li>
                </ul>

                <button className={`hamburger ${menuOpen ? 'active' : ''}`} aria-label="Open Menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </div>
        </header>
    );
}
