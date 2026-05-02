'use client';
import React from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';

export default function AlbumConsularPage() {
    const { t } = useLanguage();

    return (
        <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <div className="container album-container">
                <div className="album-header-grid">
                    <div className="album-info">
                        <h4 className="album-subtitle">{t('album_consular.subtitle')}</h4>
                        <h1 className="album-title">{t('album_consular.title')}</h1>

                        <div className="album-desc">
                            <p>{t('album_consular.desc')}</p>
                        </div>

                        <div className="album-meta">
                            <div className="meta-item">
                                <span className="meta-label">{t('common.date')}</span>
                                <span className="meta-value">{t('album_consular.date')}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">{t('common.location')}</span>
                                <span className="meta-value">{t('album_consular.location')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="album-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div key={num} className="album-item">
                            <img src={`/assets/album2/image${num}.jpg`} alt={`Album Consular ${num}`} loading="lazy" />
                        </div>
                    ))}
                </div>

                <div className="back-link-container" style={{ marginTop: '40px', textAlign: 'center' }}>
                    <Link href="/#events-gallery" className="btn-secondary">&larr; {t('common.back_home')}</Link>
                </div>
            </div>
        </main>
    );
}
