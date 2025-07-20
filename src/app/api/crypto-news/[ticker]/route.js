const API_TOKEN = process.env.CRYPTO_NEWS_API_TOKEN || "bagck5b260xe3tmck20qzqko9sb16qutzy47wvtr";
const BASE_URL = "https://cryptonews-api.com/api/v1";

async function fetchHeadlines(ticker, page = 1, items = 25) {
    const endpoint = "/trending";
    const params = new URLSearchParams({
        token: API_TOKEN,
        items: items.toString(),
        page: page.toString(),
        ticker: ticker
    });

    try {
        console.log(`Fetching headlines for ${ticker}, page ${page}...`);

        const response = await fetch(`${BASE_URL}${endpoint}?${params}`, {
            headers: {
                'User-Agent': 'CryptoNewsApp/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Received ${data.data?.length || 0} articles for ${ticker} page ${page}`);

        return data;
    } catch (error) {
        console.error(`Error fetching page ${page} for ${ticker}:`, error);
        return null;
    }
}

export async function GET(request, { params }) {
    const { ticker } = params;
    const { searchParams } = new URL(request.url);

    // NEW: Support single page fetching for infinite scroll
    const page = parseInt(searchParams.get('page')) || 1;
    const items_per_page = parseInt(searchParams.get('items_per_page')) || 25;

    // Legacy support: max_pages (fetch all pages at once)
    const max_pages = parseInt(searchParams.get('max_pages'));
    const isLegacyMode = max_pages && !searchParams.get('page');

    if (!ticker) {
        return Response.json(
            { error: 'Ticker parameter is required' },
            { status: 400 }
        );
    }

    try {
        if (isLegacyMode) {
            // LEGACY MODE: Fetch multiple pages (for backward compatibility)
            console.log(`Legacy mode: Fetching ${max_pages} pages for ${ticker}`);

            const allArticles = [];
            let totalPages = 1;

            for (let currentPage = 1; currentPage <= Math.min(max_pages, totalPages); currentPage++) {
                const headlinesData = await fetchHeadlines(ticker.toUpperCase(), currentPage, items_per_page);

                if (headlinesData) {
                    if (currentPage === 1) {
                        totalPages = headlinesData.total_pages || 1;
                    }

                    if (headlinesData.data && headlinesData.data.length > 0) {
                        allArticles.push(...headlinesData.data);
                    }
                } else if (currentPage === 1) {
                    return Response.json(
                        { error: `Could not retrieve headlines for ${ticker}` },
                        { status: 500 }
                    );
                }

                if (currentPage < Math.min(max_pages, totalPages)) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            return Response.json({
                success: true,
                ticker: ticker.toUpperCase(),
                articles: allArticles,
                total_articles: allArticles.length,
                total_pages: totalPages,
                pages_fetched: Math.min(max_pages, totalPages)
            });

        } else {
            // NEW MODE: Fetch single page for infinite scroll
            console.log(`Infinite scroll mode: Fetching page ${page} for ${ticker}`);

            const headlinesData = await fetchHeadlines(ticker.toUpperCase(), page, items_per_page);

            if (!headlinesData) {
                return Response.json(
                    { error: `Could not retrieve headlines for ${ticker}` },
                    { status: 500 }
                );
            }

            const articles = headlinesData.data || [];
            const totalPages = headlinesData.total_pages || 1;
            const hasMore = page < totalPages;

            console.log(`Page ${page} for ${ticker}: ${articles.length} articles, hasMore: ${hasMore}, totalPages: ${totalPages}`);

            return Response.json({
                success: true,
                ticker: ticker.toUpperCase(),
                articles: articles,
                total_articles: headlinesData.total || articles.length,
                current_page: page,
                total_pages: totalPages,
                has_more: hasMore,
                items_per_page: items_per_page,
                // Legacy fields
                pages_fetched: 1
            });
        }

    } catch (error) {
        console.error(`Error in ticker API for ${ticker}:`, error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}