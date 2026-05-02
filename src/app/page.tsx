'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function Home() {
    const { t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        '/assets/album1/image7.jpg',
        '/assets/album1/image14.JPG',
        '/assets/album1/image6.JPG'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <>
            {/* Hero Section */}
            <section id="home" className="hero">
                <div className="hero-slideshow">
                    {slides.map((slide, index) => (
                        <div 
                            key={index} 
                            className={`slide ${index === currentSlide ? 'active' : ''}`} 
                            style={{ backgroundImage: `url('${slide}')` }}
                        />
                    ))}
                </div>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1 dangerouslySetInnerHTML={{ __html: t('hero.title') }}></h1>
                    <p dangerouslySetInnerHTML={{ __html: t('hero.subtitle') }}></p>
                </div>
            </section>

            {/* Our Approach / Generic Intro */}
            <section id="about" className="section-intro">
                <h2>{t('about.title')}</h2>
                <div dangerouslySetInnerHTML={{ __html: t('about.intro') }}></div>
                <Link href="#mission" className="btn-secondary" style={{ marginTop: '20px' }}>{t('common.readmore')}</Link>
            </section>

            {/* Mission Section */}
            <section id="mission" className="split-section">
                <div className="split-container">
                    <div className="split-image">
                        <img src="/assets/album1/image12.JPG" alt="Communauté" />
                    </div>
                    <div className="split-content">
                        <h3>{t('mission.title')}</h3>
                        <p>{t('about.vision_desc')}</p>

                        <h4 style={{ marginTop: '20px', fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
                            {t('about.goals_title')}
                        </h4>
                        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '10px', color: '#666' }}>
                            <li style={{ marginBottom: '8px' }}>{t('about.goals.1')}</li>
                            <li style={{ marginBottom: '8px' }}>{t('about.goals.2')}</li>
                            <li style={{ marginBottom: '8px' }}>{t('about.goals.3')}</li>
                            <li style={{ marginBottom: '8px' }}>{t('about.goals.4')}</li>
                            <li style={{ marginBottom: '8px' }}>{t('about.goals.5')}</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Activities Section */}
            <section id="activities" className="section-activities">
                <div className="container text-center">
                    <span className="section-label">{t('activities.label')}</span>
                    <h2>{t('activities.title_main')}</h2>
                    <p className="section-subtitle">{t('activities.intro_text')}</p>

                    <div className="activities-grid">
                        <div className="activity-card">
                            <h3>{t('activities.item1.title')}</h3>
                            <p>{t('activities.item1.desc')}</p>
                        </div>
                        <div className="activity-card">
                            <h3>{t('activities.item2.title')}</h3>
                            <p>{t('activities.item2.desc')}</p>
                        </div>
                        <div className="activity-card">
                            <h3>{t('activities.item3.title')}</h3>
                            <p>{t('activities.item3.desc')}</p>
                        </div>
                        <div className="activity-card">
                            <h3>{t('activities.item4.title')}</h3>
                            <p>{t('activities.item4.desc')}</p>
                        </div>
                        <div className="activity-card">
                            <h3>{t('activities.item5.title')}</h3>
                            <p>{t('activities.item5.desc')}</p>
                        </div>
                        <div className="activity-card">
                            <h3>{t('activities.item6.title')}</h3>
                            <p>{t('activities.item6.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Membership Section */}
            <section id="membership" className="split-section box-reverse">
                <div className="split-container split-reverse" style={{ direction: 'rtl' }}>
                    <div className="split-image" style={{ direction: 'ltr' }}>
                        <img src="/assets/album2/image1.jpg" alt="Activities Map" />
                    </div>
                    <div className="split-content" style={{ direction: 'ltr', textAlign: 'left' }}>
                        <h3>{t('membership.subtitle')}</h3>
                        <p>{t('membership.desc')}</p>
                        <Link href="#contact" className="btn-primary">{t('hero.btn_join')}</Link>
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section id="events-gallery" className="section-combined">
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px' }}>{t('nav.events')}</h2>
                </div>

                <div className="combined-slider-container">
                    <div className="combined-slider-track-container">
                        <div className="combined-slider-track">
                            <div className="combined-slide active" style={{ position: 'relative' }}>
                                <div className="combined-slide-bg" style={{ backgroundImage: "url('https://scontent-cdg4-3.xx.fbcdn.net/v/t39.30808-6/559871407_10236311362217948_2959636437633749231_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x1536&ctp=p600x600&_nc_cat=111&ccb=1-7&_nc_sid=295ae4&_nc_ohc=7rj2I7Nm-mYQ7kNvwFGeNKD&_nc_oc=AdpKelTBPBx-Re2RaBfCipGDogAnDnS_l3Q2W-Oz4rGxiURFur6I0ZnkXLrhKrS0_eQ&_nc_zt=23&_nc_ht=scontent-cdg4-3.xx&_nc_gid=-PEb9W08q8CZc_9ACDhKZg&_nc_ss=7a30f&oh=00_Af1V8WiFYA6fmj3S38kzXyWK_iZtnbDxv4Io0ggdYTFkoQ&oe=69EB0792')" }}></div>
                                <div className="combined-slide-content">
                                    <div className="event-meta">
                                        <span className="event-tag">{t('featured_event_charity.date')}</span>
                                        <span className="event-location" style={{ marginLeft: '10px' }}>{t('featured_event_charity.location')}</span>
                                    </div>
                                    <h3>{t('featured_event_charity.title')}</h3>
                                    <div className="combined-slide-btns">
                                        <a href="https://www.facebook.com/story.php?story_fbid=10236311341857439&id=1045822494" target="_blank" rel="noreferrer" className="btn-primary">{t('featured_event.btn')}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="section-quote">
                <div className="container">
                    <blockquote>{t('quote.text')}</blockquote>
                    <cite>{t('quote.author')}</cite>
                </div>
            </section>

            {/* Contact CTA */}
            <section id="contact" className="section-cta">
                <div className="container">
                    <h2>{t('contact.title')}</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 40px', color: '#ccc' }}>
                        {t('contact.desc')}
                    </p>

                    <div className="form-wrapper">
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--color-text-main)', marginBottom: '20px' }}>
                                {t('membership.register_online_title')}
                            </h3>
                            <a href="https://forms.gle/iByjqJptMSL3dV6b6" target="_blank" rel="noreferrer" className="btn-primary">
                                {t('membership.open_form_btn')}
                            </a>

                            <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                                <h3 style={{ color: 'var(--color-text-main)', marginBottom: '20px' }}>
                                    {t('contact.send_email_title')}
                                </h3>
                                <a href="mailto:contact.acvni@gmail.com" className="btn-secondary">
                                    {t('contact.open_mail_app')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
