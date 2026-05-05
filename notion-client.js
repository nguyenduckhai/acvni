document.addEventListener('DOMContentLoaded', async () => {
    const currentLang = localStorage.getItem('language') || 'vi';
    const localeMap = { 'vi': 'vi-VN', 'fr': 'fr-FR', 'en': 'en-US' };
    const dateLocale = localeMap[currentLang] || 'vi-VN';

    // Helper to safely get Notion property values
    const getPropValue = (prop) => {
        if (!prop) return '';
        if (prop.type === 'title') return prop.title[0]?.plain_text || '';
        if (prop.type === 'rich_text') return prop.rich_text[0]?.plain_text || '';
        if (prop.type === 'date') return prop.date?.start ? new Date(prop.date.start).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' }) : '';
        if (prop.type === 'select') return prop.select?.name || '';
        if (prop.type === 'multi_select') return prop.multi_select.map(s => s.name).join(', ');
        if (prop.type === 'people') return prop.people.map(p => p.name).join(', ');
        if (prop.type === 'files' && prop.files.length > 0) return prop.files[0].file?.url || prop.files[0].external?.url || '';
        if (prop.type === 'url') return prop.url || '';
        return '';
    };

    // Helper to render rich text blocks
    const renderRichText = (richTextArr) => {
        if (!richTextArr) return '';
        return richTextArr.map(rt => {
            let text = rt.plain_text;
            if (rt.annotations.bold) text = `<strong>${text}</strong>`;
            if (rt.annotations.italic) text = `<em>${text}</em>`;
            if (rt.annotations.strikethrough) text = `<del>${text}</del>`;
            if (rt.annotations.underline) text = `<u>${text}</u>`;
            if (rt.annotations.code) text = `<code>${text}</code>`;
            if (rt.href) text = `<a href="${rt.href}" target="_blank">${text}</a>`;
            return text;
        }).join('');
    };

    const isNewsPage = document.querySelector('.news-grid');
    const isArticlePage = document.getElementById('dynamic-article-header');

    // Get current language from localStorage
    const t = window.translations ? window.translations[currentLang] : null;

    // -----------------------------------------
    // RENDER NEWS LISTING PAGE
    // -----------------------------------------
    if (isNewsPage) {
        const newsGrid = document.querySelector('.news-grid');
        const paginationContainer = document.querySelector('.pagination');

        try {
            const pageSize = 6; 

            // Show loading state initially
            const loadingText = t ? t.news_page.loading : 'Đang tải tin tức';
            newsGrid.innerHTML = `<div class="loading-spinner">${loadingText}</div>`;

            // 1. Fetch total count of news items
            const countResponse = await fetch('/api/news/count');
            if (!countResponse.ok) throw new Error('Failed to fetch count');
            const countData = await countResponse.json();
            const totalArticles = countData.count;

            if (totalArticles === 0) {
                newsGrid.innerHTML = '';
                const emptyText = t ? t.news_page.empty : 'Không có tin tức nào để hiển thị.';
                newsGrid.innerHTML = `<p>${emptyText}</p>`;
                if (paginationContainer) paginationContainer.innerHTML = '';
                return;
            }

            const totalPages = Math.ceil(totalArticles / pageSize);

            const renderPage = async (pageNumber) => {
                try {
                    newsGrid.innerHTML = `<div class="loading-spinner">${loadingText}</div>`;
                    
                    const response = await fetch(`/api/news?page=${pageNumber}&limit=${pageSize}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    
                    const result = await response.json();
                    const currentArticles = result.data;

                    newsGrid.innerHTML = '';

                    let gridArticles = currentArticles.filter(article => {
                        const title = getPropValue(article.properties.Title);
                        return title && title.trim() !== '';
                    });

                    if (gridArticles.length === 0) {
                        const emptyText = t ? t.news_page.empty : 'Không có tin tức nào để hiển thị.';
                        newsGrid.innerHTML = `<p style="text-align: center; padding: 40px 0; width: 100%; grid-column: 1 / -1; color: #666; font-style: italic;">${emptyText}</p>`;
                    }

                    // Render Grid
                    gridArticles.forEach(article => {
                        const title = getPropValue(article.properties.Title) || 'Untitled';
                        const date = getPropValue(article.properties['Published Date']) || '';
                        const author = getPropValue(article.properties.Author) || 'ACVNI';
                        const coverUrl = getPropValue(article.properties.Thumnail);

                        const cardHtml = `
                            <a href="news-article.html?id=${article.id}" class="news-card">
                                ${coverUrl ? `<div class="news-card-img"><img src="${coverUrl}" alt="${title}"></div>` : ''}
                                <div class="news-card-content">
                                    <h3 class="news-card-title">${title}</h3>
                                    <p class="news-card-desc"></p>
                                    <div class="news-card-meta">
                                        <span>${author}</span>
                                        <span>${date}</span>
                                    </div>
                                </div>
                            </a>
                        `;
                        newsGrid.insertAdjacentHTML('beforeend', cardHtml);
                    });

                    // Render Pagination
                    if (paginationContainer) {
                        paginationContainer.innerHTML = '';
                        if (totalPages > 1) {
                            for (let i = 1; i <= totalPages; i++) {
                                const btn = document.createElement('a');
                                btn.href = '#';
                                btn.className = `page-link ${i === pageNumber ? 'active' : ''}`;
                                btn.textContent = i;
                                btn.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    renderPage(i);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                });
                                paginationContainer.appendChild(btn);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Failed to load page:', error);
                    const errorMsg = t ? `${t.article_page.error_title}. ${t.article_page.error_desc}` : 'Không thể tải tin tức lúc này. Vui lòng thử lại sau.';
                    newsGrid.innerHTML = `<p>${errorMsg}</p>`;
                }
            };

            renderPage(1);

        } catch (error) {
            console.error('Failed to load news from Notion:', error);
            const errorMsg = t ? `${t.article_page.error_title}. ${t.article_page.error_desc}` : 'Không thể tải tin tức lúc này. Vui lòng thử lại sau.';
            newsGrid.innerHTML = `<p>${errorMsg}</p>`;
        }
    }

    // -----------------------------------------
    // RENDER SINGLE ARTICLE PAGE
    // -----------------------------------------
    if (isArticlePage) {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        if (!articleId) {
            const notFoundText = t ? t.article_page.not_found_title : 'Không tìm thấy bài viết';
            document.getElementById('dynamic-article-header').innerHTML = `<h1>${notFoundText}</h1>`;
            return;
        }

        try {
            const response = await fetch(`/api/news/${articleId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const { page, blocks } = await response.json();

            // Render Header
            const title = getPropValue(page.properties.Title) || 'Untitled';
            const date = getPropValue(page.properties['Published Date']) || '';
            const category = getPropValue(page.properties.Category) || 'Tin Tức';
            const author = getPropValue(page.properties.Author) || 'ACVNI';

            document.title = `${title} - ACVNI`;

            const writtenByText = t ? t.article_page.written_by : 'Viết bởi:';
            const publishedText = t ? t.article_page.published : 'Ngày đăng:';

            document.getElementById('dynamic-article-header').innerHTML = `
                <span class="article-tag">${category}</span>
                <h1 class="article-title">${title}</h1>
                <div class="article-meta">
                    <span><strong>${writtenByText}</strong> ${author}</span>
                    <span><strong>${publishedText}</strong> ${date}</span>
                </div>
            `;

            // Render Cover Image
            const coverUrl = getPropValue(page.properties.Thumnail);
            if (coverUrl) {
                document.getElementById('dynamic-article-cover').innerHTML = `<img src="${coverUrl}" alt="${title}">`;
            }

            // Render Blocks (Content)
            const contentContainer = document.getElementById('dynamic-article-content');
            let contentHtml = '';

            blocks.forEach(block => {
                if (block.type === 'paragraph') {
                    const text = renderRichText(block.paragraph.rich_text);
                    if (text) contentHtml += `<p>${text}</p>`;
                    else contentHtml += `<br>`;
                } else if (block.type === 'heading_1') {
                    contentHtml += `<h2>${renderRichText(block.heading_1.rich_text)}</h2>`;
                } else if (block.type === 'heading_2') {
                    contentHtml += `<h3>${renderRichText(block.heading_2.rich_text)}</h3>`;
                } else if (block.type === 'heading_3') {
                    contentHtml += `<h4>${renderRichText(block.heading_3.rich_text)}</h4>`;
                } else if (block.type === 'quote') {
                    contentHtml += `<blockquote>${renderRichText(block.quote.rich_text)}</blockquote>`;
                } else if (block.type === 'bulleted_list_item') {
                    contentHtml += `<ul><li>${renderRichText(block.bulleted_list_item.rich_text)}</li></ul>`;
                } else if (block.type === 'numbered_list_item') {
                    contentHtml += `<ol><li>${renderRichText(block.numbered_list_item.rich_text)}</li></ol>`;
                } else if (block.type === 'image') {
                    const imgUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
                    contentHtml += `<img src="${imgUrl}" alt="Article Image" style="margin: 20px 0; border-radius: 8px; width: 100%;">`;
                }
                // Add more block types as needed (video, divider, etc)
            });

            contentContainer.innerHTML = contentHtml;

            // Load Latest News for Sidebar
            try {
                const newsResponse = await fetch('/api/news?limit=4');
                if (newsResponse.ok) {
                    const result = await newsResponse.json();
                    const allNews = result.data;
                    const latestNewsContainer = document.getElementById('dynamic-latest-news');
                    
                    // Filter out current article, empty titles, and take top 3
                    const latestArticles = allNews.filter(a => {
                        const t = getPropValue(a.properties.Title);
                        return a.id !== articleId && t && t.trim() !== '';
                    }).slice(0, 3);
                    
                    if (latestArticles.length > 0) {
                        let latestHtml = '';
                        latestArticles.forEach(article => {
                            const aTitle = getPropValue(article.properties.Title) || 'Untitled';
                            const aDate = getPropValue(article.properties['Published Date']) || '';
                            const aCoverUrl = getPropValue(article.properties.Thumnail);
                            
                            latestHtml += `
                                <div class="latest-news-item">
                                    ${aCoverUrl ? `<img src="${aCoverUrl}" alt="${aTitle}" class="latest-news-img">` : ''}
                                    <div class="latest-news-info">
                                        <h4><a href="news-article.html?id=${article.id}">${aTitle}</a></h4>
                                        <span>${aDate}</span>
                                    </div>
                                </div>
                            `;
                        });
                        latestNewsContainer.innerHTML = latestHtml;
                    } else {
                        const emptyText = t ? t.news_page.empty : 'Không có tin tức nào để hiển thị.';
                        latestNewsContainer.innerHTML = `<p>${emptyText}</p>`;
                    }
                }
            } catch (err) {
                console.error('Failed to load latest news:', err);
                document.getElementById('dynamic-latest-news').innerHTML = '';
            }

        } catch (error) {
            console.error('Failed to load article:', error);
            const errTitle = t ? t.article_page.error_title : 'Lỗi khi tải bài viết';
            const errDesc = t ? t.article_page.error_desc : 'Vui lòng thử lại sau.';
            document.getElementById('dynamic-article-header').innerHTML = `<h1>${errTitle}</h1><p>${errDesc}</p>`;
        }
    }
});
