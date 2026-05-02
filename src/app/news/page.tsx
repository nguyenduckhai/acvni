'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

const getPropValue = (prop: any, lang: string) => {
    if (!prop) return '';
    if (prop.type === 'title') return prop.title[0]?.plain_text || '';
    if (prop.type === 'rich_text') return prop.rich_text[0]?.plain_text || '';
    if (prop.type === 'date') {
        const localeMap: any = { 'vi': 'vi-VN', 'fr': 'fr-FR', 'en': 'en-US' };
        const dateLocale = localeMap[lang] || 'vi-VN';
        return prop.date?.start ? new Date(prop.date.start).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    }
    if (prop.type === 'files' && prop.files.length > 0) return prop.files[0].file?.url || prop.files[0].external?.url || '';
    return '';
};

export default function NewsPage() {
    const { t, lang } = useLanguage();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/api/news')
            .then((res) => {
                if (!res.ok) throw new Error('HTTP Error');
                return res.json();
            })
            .then((data) => {
                setArticles(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(true);
                setLoading(false);
            });
    }, []);

    const featuredArticle = articles.length > 0 ? articles[0] : null;
    const gridArticles = articles.length > 1 ? articles.slice(1, 9) : [];

    return (
        <main>
            <div className="news-header">
                <h1>{t('news_page.title')}</h1>
                <p>{t('news_page.subtitle')}</p>
            </div>

            <div className="news-container">
                {loading && <div className="loading-spinner">{t('news_page.loading')}</div>}
                {error && <p>{t('article_page.error_title')}</p>}
                {!loading && !error && articles.length === 0 && <p>{t('news_page.empty')}</p>}

                {!loading && !error && featuredArticle && (
                    <Link href={`/news/${featuredArticle.id}`} className={`news-featured ${!getPropValue(featuredArticle.properties.Thumnail, lang) ? 'news-featured-no-img' : ''}`}>
                        {getPropValue(featuredArticle.properties.Thumnail, lang) && (
                            <img src={getPropValue(featuredArticle.properties.Thumnail, lang)} alt="Featured" />
                        )}
                        <div className="news-featured-content">
                            <h2>{getPropValue(featuredArticle.properties.Title, lang)}</h2>
                            <div className="news-featured-meta" style={{ marginTop: !getPropValue(featuredArticle.properties.Thumnail, lang) ? '20px' : '0' }}>
                                <span>{t('article_page.by')} {getPropValue(featuredArticle.properties.Author, lang) || 'ACVNI'}</span>
                                <span>{getPropValue(featuredArticle.properties['Published Date'], lang)}</span>
                            </div>
                        </div>
                    </Link>
                )}

                <div className="news-grid">
                    {!loading && gridArticles.map((article: any) => {
                        const coverUrl = getPropValue(article.properties.Thumnail, lang);
                        return (
                            <Link key={article.id} href={`/news/${article.id}`} className="news-card">
                                {coverUrl && (
                                    <div className="news-card-img">
                                        <img src={coverUrl} alt="Cover" />
                                    </div>
                                )}
                                <div className="news-card-content">
                                    <h3 className="news-card-title">{getPropValue(article.properties.Title, lang)}</h3>
                                    <div className="news-card-meta">
                                        <span>{getPropValue(article.properties.Author, lang) || 'ACVNI'}</span>
                                        <span>{getPropValue(article.properties['Published Date'], lang)}</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </main>
    );
}
