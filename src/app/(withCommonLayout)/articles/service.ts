// services/cryptoNewsService.ts
export interface CryptoArticle {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string;
    likeCount: number;
    likers: string[];
    comments: any[];
    sourceUrl?: string;
    sourceName?: string;
    tickers?: string[];
    sentiment?: string;
    type: 'crypto_news';
}

export interface CryptoNewsResponse {
    data: any[];
    page?: number;
    total_pages?: number;
    total_count?: number;
}

export interface FetchOptions {
    page?: number;
    limit?: number;
    ticker?: string;
    keywords?: string[];
}

class CryptoNewsService {
    private readonly apiToken = "bagck5b260xe3tmck20qzqko9sb16qutzy47wvtr";
    private readonly baseURL = "https://cryptonews-api.com/api/v1";
    private readonly cache = new Map<string, { data: any; timestamp: number }>();
private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

/**
 * Check if cached data is still valid
 */
private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
}

/**
 * Get cache key for request
 */
private getCacheKey(endpoint: string, params: any): string {
    return `${endpoint}_${JSON.stringify(params)}`;
}

/**
 * Make API request with caching
 */
private async makeRequest(endpoint: string, params: any): Promise<any> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
    console.log(`Using cached data for ${endpoint}`);
    return cached.data;
}

try {
    const url = new URL(`${this.baseURL}${endpoint}`);

    // Add parameters to URL
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key].toString());
        }
    });

    console.log(`Fetching from: ${url.toString()}`);

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response
    this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
    });

    return data;
} catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
}
}

/**
 * Transform API article to match your Article interface
 */
private transformArticle(apiArticle: any): CryptoArticle {
    return {
        id: `crypto_${apiArticle.news_id || Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: apiArticle.title || apiArticle.headline || 'Untitled Article',
        content: apiArticle.text || apiArticle.summary || 'No content available',
        authorId: `crypto_news_${apiArticle.source_name || 'unknown'}`,
        createdAt: new Date(apiArticle.date || Date.now()),
        updatedAt: new Date(apiArticle.date || Date.now()),
        image: apiArticle.image_url || apiArticle.image || undefined,
        likeCount: Math.floor(Math.random() * 50), // Random likes since API doesn't provide this
        likers: [], // Empty array since API doesn't provide this
        comments: [], // Empty array since API doesn't provide this
        sourceUrl: apiArticle.news_url || apiArticle.url,
        sourceName: apiArticle.source_name || 'CryptoNews',
        tickers: apiArticle.tickers || [],
        sentiment: apiArticle.sentiment || undefined,
        type: 'crypto_news'
    };
}

/**
 * Check if article matches keywords
 */
private articleMatchesKeywords(article: any, keywords: string[] = []): boolean {
    if (!keywords || keywords.length === 0) {
        return true;
    }

    const lowerKeywords = keywords.map(k => k.toLowerCase());

    // Check title
    const title = article.title || '';
    if (title && lowerKeywords.some(k => title.toLowerCase().includes(k))) {
        return true;
    }

    // Check text content
    const text = article.text || '';
    if (text && lowerKeywords.some(k => text.toLowerCase().includes(k))) {
        return true;
    }

    // Check tickers
    if (article.tickers) {
        if (article.tickers.some((ticker: string) =>
            lowerKeywords.some(k => k === ticker.toLowerCase())
        )) {
            return true;
        }
    }

    return false;
}

/**
 * Fetch trending headlines for a specific ticker
 */
async fetchTickerNews(ticker: string, options: FetchOptions = {}): Promise<CryptoArticle[]> {
    const { page = 1, limit = 10 } = options;

    try {
        const params = {
            token: this.apiToken,
            items: limit,
            page,
            ticker: ticker.toUpperCase()
        };

        const response = await this.makeRequest('/trending', params);

        if (!response || !response.data) {
    return [];
}

return response.data.map((article: any) => this.transformArticle(article));
} catch (error) {
    console.error(`Error fetching ${ticker} news:`, error);
    return [];
}
}

/**
 * Fetch all tickers news
 */
async fetchAllTickersNews(options: FetchOptions = {}): Promise<{
    articles: CryptoArticle[];
    totalPages: number;
    totalItems: number;
}> {
    const { page = 1, limit = 20, keywords } = options;

    try {
        const params = {
            token: this.apiToken,
            section: "alltickers",
            items: limit,
            page
        };

        const response = await this.makeRequest('/category', params);

        if (!response || !response.data) {
    return { articles: [], totalPages: 0, totalItems: 0 };
}

let articles = response.data;

// Filter by keywords if provided
if (keywords && keywords.length > 0) {
    articles = articles.filter((article: any) =>
        this.articleMatchesKeywords(article, keywords)
    );
}

const transformedArticles = articles.map((article: any) =>
    this.transformArticle(article)
);

return {
    articles: transformedArticles,
    totalPages: response.total_pages || 1,
    totalItems: response.total_count || transformedArticles.length
};
} catch (error) {
    console.error('Error fetching all tickers news:', error);
    return { articles: [], totalPages: 0, totalItems: 0 };
}
}

/**
 * Fetch trending news from multiple sources
 */
async fetchTrendingNews(options: FetchOptions = {}): Promise<{
    articles: CryptoArticle[];
    totalPages: number;
    totalItems: number;
}> {
    const { page = 1, limit = 20 } = options;

    try {
        // Fetch from multiple sources
        const [allTickersResult, btcNews, ethNews, shibNews] = await Promise.all([
            this.fetchAllTickersNews({ page, limit: Math.ceil(limit * 0.6) }),
            this.fetchTickerNews('BTC', { page: 1, limit: Math.ceil(limit * 0.15) }),
            this.fetchTickerNews('ETH', { page: 1, limit: Math.ceil(limit * 0.15) }),
            this.fetchTickerNews('SHIB', { page: 1, limit: Math.ceil(limit * 0.1) })
        ]);

        // Combine all articles
        const combinedArticles = [
            ...allTickersResult.articles,
            ...btcNews,
            ...ethNews,
            ...shibNews
        ];

        // Remove duplicates based on title similarity
        const uniqueArticles = combinedArticles.filter((article, index, self) =>
                index === self.findIndex(a =>
                    a.title.toLowerCase() === article.title.toLowerCase()
                )
        );

        // Sort by date (newest first)
        uniqueArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Paginate results
        const startIndex = (page - 1) * limit;
        const paginatedArticles = uniqueArticles.slice(startIndex, startIndex + limit);

        return {
            articles: paginatedArticles,
            totalPages: Math.ceil(uniqueArticles.length / limit),
            totalItems: uniqueArticles.length
        };
    } catch (error) {
        console.error('Error fetching trending news:', error);
        return { articles: [], totalPages: 0, totalItems: 0 };
    }
}

/**
 * Search articles by keywords
 */
async searchArticles(query: string, options: FetchOptions = {}): Promise<{
    articles: CryptoArticle[];
    totalPages: number;
    totalItems: number;
}> {
    const keywords = query.split(',').map(k => k.trim()).filter(k => k.length > 0);

    return this.fetchAllTickersNews({
        ...options,
        keywords
    });
}

/**
 * Get popular tickers news
 */
async getPopularTickersNews(options: FetchOptions = {}): Promise<{
    articles: CryptoArticle[];
    totalPages: number;
    totalItems: number;
}> {
    const popularTickers = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'DOGE', 'MATIC', 'AVAX'];
    const { limit = 20 } = options;

    try {
        const tickerPromises = popularTickers.map(ticker =>
            this.fetchTickerNews(ticker, { page: 1, limit: Math.ceil(limit / popularTickers.length) })
        );

        const results = await Promise.all(tickerPromises);
        const allArticles = results.flat();

        // Remove duplicates and sort by date
        const uniqueArticles = allArticles
            .filter((article, index, self) =>
                index === self.findIndex(a => a.title.toLowerCase() === article.title.toLowerCase())
            )
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);

        return {
            articles: uniqueArticles,
            totalPages: 1,
            totalItems: uniqueArticles.length
        };
    } catch (error) {
        console.error('Error fetching popular tickers news:', error);
        return { articles: [], totalPages: 0, totalItems: 0 };
    }
}

/**
 * Clear cache
 */
clearCache(): void {
    this.cache.clear();
}

/**
 * Get cache stats
 */
getCacheStats(): { size: number; keys: string[] } {
    return {
        size: this.cache.size,
        keys: Array.from(this.cache.keys())
    };
}
}

// Export singleton instance
export const cryptoNewsService = new CryptoNewsService();
export default cryptoNewsService;