'use client';
import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <h3>ACVNI</h3>
                        <p>{t('footer.subtitle')}</p>
                        <div className="footer-info">
                            <p>{t('footer.siret')}</p>
                            <p>{t('footer.president')}</p>
                            <p>{t('footer.email')}</p>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <a href="https://www.facebook.com/groups/1884851371854868/" target="_blank" rel="noreferrer">Facebook</a>
                        </div>
                    </div>

                    <div className="footer-links-group">
                        <div className="link-col">
                            <h4>Nav</h4>
                            <Link href="/#about">{t('nav.about')}</Link>
                            <Link href="/#events-gallery">{t('nav.events')}</Link>
                            <Link href="/#membership">{t('nav.membership')}</Link>
                        </div>
                        <div className="link-col">
                            <h4>Legal</h4>
                            <Link href="#">{t('footer.legal')}</Link>
                            <Link href="#">{t('footer.privacy')}</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p dangerouslySetInnerHTML={{ __html: t('footer.copyright') }}></p>
                    <p>Nice, France</p>
                </div>
            </div>
        </footer>
    );
}
