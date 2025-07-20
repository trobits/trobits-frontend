export interface CryptoArticle {
    id: string;
    title: string;
    text?: string;
    content?: string;
    source_name?: string;
    sourceName?: string;
    date: string;
    createdAt: string;
    tickers?: string[];
    news_url?: string;
    sourceUrl?: string;
    image_url?: string;
    image?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    kind?: string;
    likeCount: number;
    likers: string[];
    comments: any[];
    authorId?: string;
    type: 'crypto_news' | 'blog_post';
}

export interface FetchOptions {
    page?: number;
    limit?: number;
    ticker?: string;
    keywords?: string[];
}

interface ApiResponse {
    success: boolean;
    articles: any[];
    total_articles: number;
    pages_searched?: number;
    keyword?: string;
    keywords?: string[];
    ticker?: string;
    error?: string;
    current_page?: number;
    total_pages?: number;
}

interface CacheItem {
    data: ApiResponse;
    timestamp: number;
}

interface PaginatedResult {
    articles: CryptoArticle[];
    hasMore: boolean;
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

class CryptoNewsService {
    private cache = new Map<string, CacheItem>();
    private cacheTimeout = 2 * 60 * 1000; // 2 minutes for faster updates
    private baseURL = '';
    private maxPages = 5; // API limit

    private getCacheKey(endpoint: string, params: Record<string, any>): string {
        const paramString = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${endpoint}?${paramString}`;
    }

    private async fetchWithCache(endpoint: string, params: Record<string, any> = {}): Promise<ApiResponse> {
        const cacheKey = this.getCacheKey(endpoint, params);
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key].toString());
            }
        });

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();

            if (data.success) {
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
                return data;
            } else {
                throw new Error(data.error || 'API request failed');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    private transformArticle(article: any): CryptoArticle {
        const id = article.id ||
            article.news_url ||
            `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const date = article.date || article.createdAt || new Date().toISOString();

        return {
            id,
            title: article.title || 'Untitled Article',
            text: article.text || article.content || '',
            content: article.text || article.content || '',
            source_name: article.source_name || article.sourceName || 'Unknown Source',
            sourceName: article.source_name || article.sourceName || 'Unknown Source',
            date,
            createdAt: date,
            tickers: Array.isArray(article.tickers) ? article.tickers : [],
            news_url: article.news_url || article.sourceUrl,
            sourceUrl: article.news_url || article.sourceUrl,
            image_url: article.image_url || article.image,
            image: article.image_url || article.image,
            sentiment: article.sentiment || 'neutral',
            kind: article.kind || 'news',
            likeCount: article.likeCount || 0,
            likers: article.likers || [],
            comments: article.comments || [],
            authorId: article.authorId,
            type: (article.type as 'crypto_news' | 'blog_post') || 'crypto_news'
        };
    }

    async fetchTrendingNews(options: FetchOptions = {}): Promise<PaginatedResult> {
        const { page = 1, limit = 25 } = options;

        // Check if we've exceeded the API limit
        if (page > this.maxPages) {
            return {
                articles: [],
                hasMore: false,
                totalItems: 0,
                currentPage: page,
                totalPages: this.maxPages
            };
        }

        try {
            // Calculate items per page based on API limitations
            const itemsPerPage = Math.min(limit, 100); // API max per page

            const result = await this.fetchWithCache('/api/crypto-news/all-tickers', {
                page: page, // Use actual page parameter
                items_per_page: itemsPerPage
            });

            const articles = (result.articles || []).map(article => this.transformArticle(article));
            const totalPages = Math.min(this.maxPages, Math.ceil((result.total_articles || 0) / itemsPerPage));

            return {
                articles,
                hasMore: page < totalPages && articles.length === itemsPerPage,
                totalItems: result.total_articles || articles.length,
                currentPage: page,
                totalPages
            };
        } catch (error) {
            console.error('Error fetching trending news:', error);
            return {
                articles: [],
                hasMore: false,
                totalItems: 0,
                currentPage: page,
                totalPages: 0
            };
        }
    }

    async fetchAllTickersNews(options: FetchOptions = {}): Promise<PaginatedResult> {
        const { page = 1, limit = 25, keywords = [] } = options;

        if (keywords && keywords.length > 0) {
            return this.searchArticles(keywords.join(','), options);
        }

        // Check if we've exceeded the API limit
        if (page > this.maxPages) {
            return {
                articles: [],
                hasMore: false,
                totalItems: 0,
                currentPage: page,
                totalPages: this.maxPages
            };
        }

        try {
            const itemsPerPage = Math.min(limit, 100);

            const result = await this.fetchWithCache('/api/crypto-news/all-tickers', {
                page: page,
                items_per_page: itemsPerPage
            });

            const articles = (result.articles || []).map(article => this.transformArticle(article));
            const totalPages = Math.min(this.maxPages, Math.ceil((result.total_articles || 0) / itemsPerPage));

            return {
                articles,
                hasMore: page < totalPages && articles.length === itemsPerPage,
                totalItems: result.total_articles || articles.length,
                currentPage: page,
                totalPages
            };
        } catch (error) {
            console.error('Error fetching all tickers news:', error);
            return {
                articles: [],
                hasMore: false,
                totalItems: 0,
                currentPage: page,
                totalPages: 0
            };
        }
    }

    async fetchTickerNews(ticker: string, options: FetchOptions = {}): Promise<PaginatedResult> {
        const { page = 1, limit = 25 } = options;

        if (!ticker || typeof ticker !== 'string') {
            throw new Error('Invalid ticker provided');
        }

        // For ticker-specific searches, we might need different pagination handling
        try {
            // Fetch multiple pages if needed to get enough articles
            const maxPages = Math.min(3, this.maxPages);

            const result = await this.fetchWithCache(`/api/crypto-news/ticker/${ticker.toUpperCase()}`, {
                max_pages: maxPages
            });

            const allArticles = (result.articles || []).map(article => this.transformArticle(article));

            // Implement client-side pagination for ticker news since API returns all at once
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedArticles = allArticles.slice(startIndex, endIndex);

            const totalPages = Math.ceil(allArticles.length / limit);

            return {
                articles: paginatedArticles,
                hasMore: endIndex < allArticles.length,
                totalItems: allArticles.length,
                currentPage: page,
                totalPages
            };
        } catch (error) {
            console.error(`Error fetching ticker news for ${ticker}:`, error);
            return {
                articles: [],
                hasMore: false,
                totalItems: 0,
                currentPage: page,
                totalPages: 0
            };
        }
    }

    async searchArticles(query: string, options: FetchOptions = {}): Promise<PaginatedResult> {
        const { page = 1, limit = 25 } = options;

        if (!query || typeof query !== 'string') {
            return this.fetchAllTickersNews(options);
        }

        const keywords = query.split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        if (keywords.length === 0) {
            return this.fetchAllTickersNews(options);
        }

        try {
            // Check if it's a single ticker search
            if (keywords.length === 1) {
                const keyword = keywords[0].toUpperCase();

                if (/^[A-Z0-9]{2,10}$/.test(keyword)) {
                    try {
                        return await this.fetchTickerNews(keyword, options);
                    } catch (error) {
                        console.log(`Ticker search failed for ${keyword}, trying keyword search`);
                    }
                }
            }

            // Special handling for known keywords
            const lowerKeywords = keywords.map(k => k.toLowerCase());

            // Shiba-related search
            if (lowerKeywords.some(k => ['shib', 'shiba', 'shibainu'].includes(k))) {
                return this.getCategoryNews('shiba', options);
            }

            // Terra/Luna-related search
            if (lowerKeywords.some(k => ['luna', 'terra', 'lunc', 'terraclassic'].includes(k))) {
                return this.getCategoryNews('terra-luna', options);
            }

            // Generic keyword search - use all tickers endpoint with pagination
            const result = await this.fetchAllTickersNews({ ...options, keywords: [] });

            // Client-side filtering for general keywords
            const filteredArticles = result.articles.filter(article => {
                return lowerKeywords.some(keyword => {
                    const title = (article.title || '').toLowerCase();
                    const content = (article.text || article.content || '').toLowerCase();
                    const source = (article.source_name || article.sourceName || '').toLowerCase();
                    const tickers = (article.tickers || []).join(' ').toLowerCase();

                    return title.includes(keyword) ||
                        content.includes(keyword) ||
                        source.includes(keyword) ||
                        tickers.includes(keyword);
                });
            });

            return {
                articles: filteredArticles,
                hasMore: result.hasMore, // Inherit pagination from base query
                totalItems: filteredArticles.length,
                currentPage: page,
                totalPages: Math.ceil(filteredArticles.length / limit)
            };

        } catch (error) {
            console.error('Error in search articles:', error);
            return {
                articles: [],
                hasMore: false,
                totalItems: 0,
                currentPage: page,
                totalPages: 0
            };
        }
    }

    async getPopularTickersNews(options: FetchOptions = {}): Promise<PaginatedResult> {
        const { page = 1, limit = 25 } = options;

        const popularTickers = [
            'BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'SHIB',
            'AVAX', 'MATIC', 'DOT', 'LUNA', 'ATOM', 'LINK', 'UNI', 'LTC'
        ];

        try {
            const result = await this.fetchAllTickersNews(options);

            const popularArticles = result.articles.filter(article => {
                const hasPopularTicker = article.tickers?.some(ticker =>
                    popularTickers.includes(ticker.toUpperCase())
                );

                const titleMentionsPopular = popularTickers.some(ticker =>
                    (article.title || '').toLowerCase().includes(ticker.toLowerCase())
                );

                return hasPopularTicker || titleMentionsPopular;
            });

            return {
                articles: popularArticles,
                hasMore: result.hasMore,
                totalItems: popularArticles.length,
                currentPage: page,
                totalPages: Math.ceil(popularArticles.length / limit)
            };

        } catch (error) {
            console.error('Error fetching popular tickers news:', error);
            return {
                articles: [],
                hasMore: false,
                totalItems: 0,
                currentPage: page,
                totalPages: 0
            };
        }
    }

    async getCategoryNews(
        category: 'shiba' | 'terra-luna',
        options: FetchOptions = {}
    ): Promise<PaginatedResult> {
        const { page = 1, limit = 25 } = options;

        try {
            const endpoint = category === 'shiba'
                ? '/api/crypto-news/shib'
                : '/api/crypto-news/terra-luna';

            // For category news, fetch based on page if API supports it
            const result = await this.fetchWithCache(endpoint, {
                page: page,
                min_articles: limit,
                max_pages: Math.min(3, this.maxPages)
            });

            const allArticles = (result.articles || []).map(article => this.transformArticle(article));

            // If API doesn't support pagination for category, do client-side
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedArticles = allArticles.slice(startIndex, endIndex);

            const totalPages = Math.ceil(allArticles.length / limit);

            return {
                articles: paginatedArticles,
                hasMore: endIndex < allArticles.length,
                totalItems: allArticles.length,
                currentPage: page,
                totalPages
            };

        } catch (error) {
            console.error(`Error fetching ${category} news:`, error);
            return {
                articles: [],
                hasMore: false,
                totalItems: 0,
                currentPage: page,
                totalPages: 0
            };
        }
    }

    clearCache(): void {
        this.cache.clear();
    }

    // Enhanced cache management
    clearPageCache(endpoint?: string): void {
        if (endpoint) {
            const keysToDelete = Array.from(this.cache.keys()).filter(key =>
                key.includes(endpoint)
            );
            keysToDelete.forEach(key => this.cache.delete(key));
        } else {
            this.cache.clear();
        }
    }

    // Get cache stats (useful for debugging)
    getCacheStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }

    // Method to preload popular data
    async preloadPopularData(): Promise<void> {
        try {
            // Preload first page of trending news
            await this.fetchTrendingNews({ page: 1, limit: 25 });

            // Preload popular tickers
            await this.getPopularTickersNews({ page: 1, limit: 20 });

        } catch (error) {
            console.error('Error preloading data:', error);
        }
    }

    // Health check method
    async healthCheck(): Promise<{ status: 'ok' | 'error'; message?: string }> {
        try {
            await this.fetchTrendingNews({ page: 1, limit: 1 });
            return { status: 'ok' };
        } catch (error) {
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Method to get fresh articles (bypass cache)
    async getFreshArticles(type: 'trending' | 'all' = 'trending', limit: number = 25): Promise<CryptoArticle[]> {
        // Clear relevant cache entries
        this.clearPageCache('/api/crypto-news/all-tickers');

        try {
            if (type === 'trending') {
                const result = await this.fetchTrendingNews({ page: 1, limit });
                return result.articles;
            } else {
                const result = await this.fetchAllTickersNews({ page: 1, limit });
                return result.articles;
            }
        } catch (error) {
            console.error('Error fetching fresh articles:', error);
            return [];
        }
    }

    // Set maximum pages (useful for different API plans)
    setMaxPages(maxPages: number): void {
        this.maxPages = Math.max(1, Math.min(maxPages, 10)); // Reasonable limits
    }

    // Get current pagination limits
    getPaginationLimits(): { maxPages: number; cacheTimeout: number } {
        return {
            maxPages: this.maxPages,
            cacheTimeout: this.cacheTimeout
        };
    }
}

// Create and export singleton instance
const cryptoNewsService = new CryptoNewsService();

// Export the class and instance
export { CryptoNewsService };
export default cryptoNewsService;