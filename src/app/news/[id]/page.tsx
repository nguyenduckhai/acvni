'use client';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
    if (prop.type === 'select') return prop.select?.name || '';
    return '';
};

const renderRichText = (richTextArr: any[]) => {
    if (!richTextArr) return '';
    return richTextArr.map(rt => {
        let text = rt.plain_text;
        if (rt.annotations.bold) text = `<strong>${text}</strong>`;
        if (rt.annotations.italic) text = `<em>${text}</em>`;
        if (rt.annotations.strikethrough) text = `<del>${text}</del>`;
        if (rt.annotations.underline) text = `<u>${text}</u>`;
        if (rt.annotations.code) text = `<code>${text}</code>`;
        if (rt.href) text = `<a href="${rt.href}" target="_blank" rel="noreferrer">${text}</a>`;
        return text;
    }).join('');
};

export default function ArticlePage() {
    const { t, lang } = useLanguage();
    const { id } = useParams();
    const [articleData, setArticleData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/news/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('HTTP Error');
                return res.json();
            })
            .then((data) => {
                setArticleData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(true);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <main className="container"><h1 style={{ marginTop: '150px' }}>{t('article_page.loading')}</h1></main>;
    if (error || !articleData?.page) return <main className="container"><h1 style={{ marginTop: '150px' }}>{t('article_page.error_title')}</h1></main>;

    const { page, blocks } = articleData;
    const title = getPropValue(page.properties.Title, lang) || 'Untitled';
    const date = getPropValue(page.properties['Published Date'], lang);
    const category = getPropValue(page.properties.Category, lang) || 'Tin Tức';
    const author = getPropValue(page.properties.Author, lang) || 'ACVNI';
    const coverUrl = getPropValue(page.properties.Thumnail, lang);

    return (
        <main>
            <div className="container" style={{ paddingTop: '150px', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
                <Link href="/news" className="btn-secondary" style={{ marginBottom: '30px', display: 'inline-block' }}>&larr; {t('article_page.back_to_news')}</Link>
                
                <div id="dynamic-article-header">
                    <span className="article-tag" style={{ color: 'var(--color-accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'block' }}>{category}</span>
                    <h1 className="article-title" style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: '1.3' }}>{title}</h1>
                    <div className="article-meta" style={{ display: 'flex', gap: '20px', color: '#666', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
                        <span><strong>{t('article_page.written_by')}</strong> {author}</span>
                        <span><strong>{t('article_page.published')}</strong> {date}</span>
                    </div>
                </div>

                {coverUrl && (
                    <div id="dynamic-article-cover" style={{ marginBottom: '40px' }}>
                        <img src={coverUrl} alt={title} style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                    </div>
                )}

                <div id="dynamic-article-content" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    {blocks.map((block: any, idx: number) => {
                        if (block.type === 'paragraph') {
                            const text = renderRichText(block.paragraph.rich_text);
                            return text ? <p key={idx} style={{ marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: text }} /> : <br key={idx} />;
                        } else if (block.type === 'heading_1') {
                            return <h2 key={idx} style={{ marginTop: '40px', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: renderRichText(block.heading_1.rich_text) }} />;
                        } else if (block.type === 'heading_2') {
                            return <h3 key={idx} style={{ marginTop: '30px', marginBottom: '15px' }} dangerouslySetInnerHTML={{ __html: renderRichText(block.heading_2.rich_text) }} />;
                        } else if (block.type === 'heading_3') {
                            return <h4 key={idx} style={{ marginTop: '20px', marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: renderRichText(block.heading_3.rich_text) }} />;
                        } else if (block.type === 'quote') {
                            return <blockquote key={idx} style={{ borderLeft: '4px solid var(--color-accent)', paddingLeft: '20px', fontStyle: 'italic', color: '#555', margin: '20px 0' }} dangerouslySetInnerHTML={{ __html: renderRichText(block.quote.rich_text) }} />;
                        } else if (block.type === 'bulleted_list_item') {
                            return <ul key={idx} style={{ marginLeft: '20px', marginBottom: '10px' }}><li dangerouslySetInnerHTML={{ __html: renderRichText(block.bulleted_list_item.rich_text) }} /></ul>;
                        } else if (block.type === 'numbered_list_item') {
                            return <ol key={idx} style={{ marginLeft: '20px', marginBottom: '10px' }}><li dangerouslySetInnerHTML={{ __html: renderRichText(block.numbered_list_item.rich_text) }} /></ol>;
                        } else if (block.type === 'image') {
                            const imgUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
                            return <img key={idx} src={imgUrl} alt="Article Image" style={{ margin: '30px 0', borderRadius: '8px', width: '100%' }} />;
                        }
                        return null;
                    })}
                </div>
            </div>
        </main>
    );
}
