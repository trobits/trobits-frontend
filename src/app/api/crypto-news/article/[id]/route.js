const API_TOKEN = process.env.CRYPTO_NEWS_API_TOKEN || "bagck5b260xe3tmck20qzqko9sb16qutzy47wvtr";
const BASE_URL = "https://cryptonews-api.com/api/v1";

async function fetchArticleById(articleId) {
    const endpoint = "/category";
    const params = new URLSearchParams({
        token: API_TOKEN,
        section: "alltickers",
        items: "100", // Fetch more to increase chances of finding the article
        page: "1"
    });

    try {
        console.log(`Searching for article with ID: ${articleId}`);

        const response = await fetch(`${BASE_URL}${endpoint}?${params}`, {
            headers: {
                'User-Agent': 'CryptoNewsApp/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            // Try to find article by ID (which could be news_url or encoded title)
            const article = data.data.find(item => {
                // Check if ID matches news_url
                if (item.news_url && item.news_url.includes(articleId)) {
                    return true;
                }

                // Check if ID matches encoded title or partial title
                const encodedTitle = encodeURIComponent(item.title || '').toLowerCase();
                const decodedId = decodeURIComponent(articleId).toLowerCase();

                if (encodedTitle.includes(decodedId) || decodedId.includes(item.title?.toLowerCase() || '')) {
                    return true;
                }

                return false;
            });

            if (article) {
                console.log(`Found article: ${article.title}`);
                return article;
            }
        }

        console.log(`Article not found in recent articles, trying search...`);
        return null;

    } catch (error) {
        console.error(`Error fetching article by ID ${articleId}:`, error);
        return null;
    }
}

export async function GET(request, { params }) {
    const { id } = params;

    if (!id) {
        return Response.json(
            { error: 'Article ID is required' },
            { status: 400 }
        );
    }

    try {
        console.log(`Crypto news detail API called for ID: ${id}`);

        const article = await fetchArticleById(id);

        if (!article) {
            return Response.json(
                { error: 'Article not found' },
                { status: 404 }
            );
        }

        // Transform article to match your expected format
        const transformedArticle = {
            id: article.news_url || `article-${Date.now()}`,
            title: article.title || 'Untitled Article',
            content: article.text || '',
            text: article.text || '',
            source_name: article.source_name || 'Unknown Source',
            sourceName: article.source_name || 'Unknown Source',
            date: article.date || new Date().toISOString(),
            createdAt: article.date || new Date().toISOString(),
            tickers: Array.isArray(article.tickers) ? article.tickers : [],
            news_url: article.news_url,
            sourceUrl: article.news_url,
            image_url: article.image_url || article.image,
            image: article.image_url || article.image,
            sentiment: article.sentiment || 'neutral',
            kind: article.kind || 'news',
            type: 'crypto_news',
            // Static fields since crypto news API doesn't support likes/comments
            likeCount: 0,
            likers: [],
            comments: [],
            authorId: null
        };

        return Response.json({
            success: true,
            data: transformedArticle
        });

    } catch (error) {
        console.error(`Error in crypto news detail API for ${id}:`, error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}