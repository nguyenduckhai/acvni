'use client';
import React from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';

export default function AlbumPage() {
    const { t } = useLanguage();

    return (
        <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <div className="container album-container">
                <div className="album-header-grid">
                    <div className="album-info">
                        <h4 className="album-subtitle">{t('gallery_page.subtitle_1')}</h4>
                        <h1 className="album-title">{t('gallery_page.title_1')}</h1>

                        <div className="album-desc">
                            <p>{t('gallery_page.desc_1')}</p>
                        </div>

                        <div className="album-meta">
                            <div className="meta-item">
                                <span className="meta-label">{t('common.date')}</span>
                                <span className="meta-value">TẾT 2026</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">{t('common.location')}</span>
                                <span className="meta-value">Nice, France</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="album-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((num) => (
                        <div key={num} className="album-item">
                            <img src={`/assets/album1/image${num}.${[5, 7].includes(num) ? 'jpg' : 'JPG'}`} alt={`TẾT VIỆT 2026 NICE ${num}`} loading="lazy" />
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
