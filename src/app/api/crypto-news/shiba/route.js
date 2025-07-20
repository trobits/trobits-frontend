function articleMatchesKeywords(article, keywords) {
    if (!keywords || keywords.length === 0) {
        return true;
    }

    const lowerKeywords = keywords.map(k => k.toLowerCase());

    const title = article.title || '';
    if (title && lowerKeywords.some(k => title.toLowerCase().includes(k))) {
        return true;
    }

    const text = article.text || '';
    if (text && lowerKeywords.some(k => text.toLowerCase().includes(k))) {
        return true;
    }

    if (article.tickers) {
        for (const ticker of article.tickers) {
            if (lowerKeywords.some(k => k === ticker.toLowerCase())) {
                return true;
            }
        }
    }

    return false;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const min_articles = parseInt(searchParams.get('min_articles')) || 15;
    const max_pages = parseInt(searchParams.get('max_pages')) || 50;
    const items_per_page = parseInt(searchParams.get('items_per_page')) || 20;

    try {
        const keyword = "shiba";
        const shibaArticles = [];
        let articlesFound = 0;
        let pagesSearched = 0;

        for (let page = 1; page <= max_pages; page++) {
            pagesSearched = page;
            const newsData = await fetchAllTickersNews(page, items_per_page);

            if (!newsData || !newsData.data) {
                continue;
            }

            const articles = newsData.data;
            const filteredArticles = articles.filter(article =>
                articleMatchesKeywords(article, [keyword])
            );

            if (filteredArticles.length > 0) {
                shibaArticles.push(...filteredArticles);
                articlesFound += filteredArticles.length;
            }

            if (articlesFound >= min_articles) {
                break;
            }

            if (page < max_pages) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        return Response.json({
            success: true,
            keyword: keyword,
            articles: shibaArticles,
            total_articles: articlesFound,
            pages_searched: pagesSearched
        });

    } catch (error) {
        console.error('Error in shib API:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}