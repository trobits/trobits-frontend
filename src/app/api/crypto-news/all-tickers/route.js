const API_TOKEN = process.env.CRYPTO_NEWS_API_TOKEN || "bagck5b260xe3tmck20qzqko9sb16qutzy47wvtr";
const BASE_URL = "https://cryptonews-api.com/api/v1";

async function fetchAllTickersNews(page = 1, items = 25) {
    const endpoint = "/category";
    const params = new URLSearchParams({
        token: API_TOKEN,
        section: "alltickers",
        items: items.toString(),
        page: page.toString()
    });

    try {
        console.log(`Fetching all-tickers page ${page} with ${items} items...`);

        const response = await fetch(`${BASE_URL}${endpoint}?${params}`, {
            headers: {
                'User-Agent': 'CryptoNewsApp/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Received ${data.data?.length || 0} articles for page ${page}`);

        return data;
    } catch (error) {
        console.error(`Error fetching all tickers news page ${page}:`, error);
        return null;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    // Get single page parameters (CHANGED: no longer fetch multiple pages)
    const page = parseInt(searchParams.get('page')) || 1;
    const items_per_page = parseInt(searchParams.get('items_per_page')) || 25;

    // Optional: Legacy support for old 'pages' parameter
    const legacyPages = parseInt(searchParams.get('pages'));
    if (legacyPages) {
        console.warn('Legacy "pages" parameter detected, using page=1 instead for infinite scroll');
    }

    try {
        console.log(`All-tickers API called for page ${page}`);

        // Fetch ONLY the requested page (CHANGED: single page instead of loop)
        const newsData = await fetchAllTickersNews(page, items_per_page);

        if (!newsData || !newsData.data) {
            return Response.json(
                { error: 'Could not retrieve news data' },
                { status: 500 }
            );
        }

        const articles = newsData.data || [];

        // Calculate pagination info
        const totalPages = newsData.total_pages || 1;
        const hasMore = page < totalPages;

        console.log(`Page ${page}: ${articles.length} articles, hasMore: ${hasMore}, totalPages: ${totalPages}`);

        return Response.json({
            success: true,
            articles: articles,
            total_articles: newsData.total || articles.length,
            current_page: page,
            total_pages: totalPages,
            has_more: hasMore,
            items_per_page: items_per_page,
            // Legacy support
            pages_fetched: 1
        });

    } catch (error) {
        console.error('Error in all-tickers API:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}