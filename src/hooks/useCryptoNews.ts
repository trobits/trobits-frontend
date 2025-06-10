import { useState, useEffect, useCallback, useRef } from 'react';

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

export interface UseCryptoNewsResult {
    data: CryptoArticle[];
    isLoading: boolean;
    isFetching: boolean;
    error: string | null;
    hasNextPage: boolean;
    fetchNextPage: () => Promise<void>;
    refetch: () => Promise<void>;
    clearCache: () => void;
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

export interface UseCryptoNewsOptions extends FetchOptions {
    enabled?: boolean;
    refetchOnMount?: boolean;
    staleTime?: number;
    initialLimit?: number;
}

type NewsType = 'trending' | 'alltickers' | 'ticker' | 'search' | 'popular';

interface ApiResponse {
    success: boolean;
    articles: any[];
    total_articles: number;
    current_page?: number;
    total_pages?: number;
    has_more?: boolean;
    pages_searched?: number;
    keyword?: string;
    keywords?: string[];
    ticker?: string;
    error?: string;
}

// Enhanced API client for infinite scroll
class CryptoNewsService {
    private cache = new Map<string, { data: ApiResponse; timestamp: number }>();
    private cacheTimeout = 2 * 60 * 1000; // 2 minutes

    private getCacheKey(url: string): string {
        return url;
    }

    private async fetchWithCache(url: string): Promise<ApiResponse> {
        const cacheKey = this.getCacheKey(url);
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`🎯 Cache hit: ${cacheKey}`);
            return cached.data;
        }

        try {
            console.log(`🌐 Fetching: ${url}`);

            const response = await fetch(url, {
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
                console.log(`✅ API Success: ${data.articles?.length || 0} articles, page: ${data.current_page || 'unknown'}`);
                return data;
            } else {
                throw new Error(data.error || 'API request failed');
            }
        } catch (error) {
            console.error('❌ Fetch error:', error);
            throw error;
        }
    }

    async fetchTrendingNews(options: FetchOptions = {}): Promise<{ articles: CryptoArticle[]; hasMore: boolean; totalItems: number; currentPage: number; totalPages: number }> {
        const { page = 1, limit = 25 } = options;

        // Use the NEW API format: single page request
        const url = `/api/crypto-news/all-tickers?page=${page}&items_per_page=${limit}`;
        const result = await this.fetchWithCache(url);

        const articles = (result.articles || []).map(article => this.transformArticle(article));

        // Use new API response format
        const hasMore = result.has_more ?? (page < (result.total_pages || 1));
        const totalPages = result.total_pages || 1;
        const currentPage = result.current_page || page;

        console.log(`📈 Trending News - Page: ${currentPage}, Articles: ${articles.length}, HasMore: ${hasMore}, Total Pages: ${totalPages}`);

        return {
            articles,
            hasMore,
            totalItems: result.total_articles || articles.length,
            currentPage,
            totalPages
        };
    }

    async fetchAllTickersNews(options: FetchOptions = {}): Promise<{ articles: CryptoArticle[]; hasMore: boolean; totalItems: number; currentPage: number; totalPages: number }> {
        const { page = 1, limit = 25, keywords = [] } = options;

        if (keywords && keywords.length > 0) {
            return this.searchArticles(keywords.join(','), options);
        }

        // Use the NEW API format: single page request
        const url = `/api/crypto-news/all-tickers?page=${page}&items_per_page=${limit}`;
        const result = await this.fetchWithCache(url);

        const articles = (result.articles || []).map(article => this.transformArticle(article));

        // Use new API response format
        const hasMore = result.has_more ?? (page < (result.total_pages || 1));
        const totalPages = result.total_pages || 1;
        const currentPage = result.current_page || page;

        console.log(`🚀 All Tickers News - Page: ${currentPage}, Articles: ${articles.length}, HasMore: ${hasMore}, Total Pages: ${totalPages}`);

        return {
            articles,
            hasMore,
            totalItems: result.total_articles || articles.length,
            currentPage,
            totalPages
        };
    }

    async fetchTickerNews(ticker: string, options: FetchOptions = {}): Promise<{ articles: CryptoArticle[]; hasMore: boolean; totalItems: number; currentPage: number; totalPages: number }> {
        const { page = 1, limit = 25 } = options;

        if (!ticker || typeof ticker !== 'string') {
            throw new Error('Invalid ticker provided');
        }

        // Use the NEW API format: single page request
        const url = `/api/crypto-news/ticker/${ticker.toUpperCase()}?page=${page}&items_per_page=${limit}`;
        const result = await this.fetchWithCache(url);

        const articles = (result.articles || []).map(article => this.transformArticle(article));

        // Use new API response format
        const hasMore = result.has_more ?? (page < (result.total_pages || 1));
        const totalPages = result.total_pages || 1;
        const currentPage = result.current_page || page;

        console.log(`🎯 Ticker News (${ticker}) - Page: ${currentPage}, Articles: ${articles.length}, HasMore: ${hasMore}, Total Pages: ${totalPages}`);

        return {
            articles,
            hasMore,
            totalItems: result.total_articles || articles.length,
            currentPage,
            totalPages
        };
    }

    async searchArticles(query: string, options: FetchOptions = {}): Promise<{ articles: CryptoArticle[]; hasMore: boolean; totalItems: number; currentPage: number; totalPages: number }> {
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

                // Pattern for potential ticker symbols (2-10 alphanumeric characters)
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

            // Shiba-related search - still uses legacy API that fetches multiple pages
            if (lowerKeywords.some(k => ['shib', 'shiba', 'shibainu'].includes(k))) {
                const url = `/api/crypto-news/shiba?min_articles=${Math.max(limit, 30)}&max_pages=30`;
                const result = await this.fetchWithCache(url);

                const articles = (result.articles || []).map(article => this.transformArticle(article));
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedArticles = articles.slice(startIndex, endIndex);

                return {
                    articles: paginatedArticles,
                    hasMore: endIndex < articles.length,
                    totalItems: articles.length,
                    currentPage: page,
                    totalPages: Math.ceil(articles.length / limit)
                };
            }

            // Terra/Luna-related search - still uses legacy API
            if (lowerKeywords.some(k => ['luna', 'terra', 'lunc', 'terraclassic'].includes(k))) {
                const url = `/api/crypto-news/terra-luna?min_articles=${Math.max(limit, 30)}&max_pages=30`;
                const result = await this.fetchWithCache(url);

                const articles = (result.articles || []).map(article => this.transformArticle(article));
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedArticles = articles.slice(startIndex, endIndex);

                return {
                    articles: paginatedArticles,
                    hasMore: endIndex < articles.length,
                    totalItems: articles.length,
                    currentPage: page,
                    totalPages: Math.ceil(articles.length / limit)
                };
            }

            // Generic keyword search - use all tickers with client-side filtering
            const allResult = await this.fetchAllTickersNews({ page: 1, limit: limit * 2 });

            // Client-side filtering for general keywords
            const filteredArticles = allResult.articles.filter(article => {
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

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

            return {
                articles: paginatedArticles,
                hasMore: endIndex < filteredArticles.length,
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

    async getPopularTickersNews(options: FetchOptions = {}): Promise<{ articles: CryptoArticle[]; hasMore: boolean; totalItems: number; currentPage: number; totalPages: number }> {
        const popularTickers = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'SHIB'];
        const allResult = await this.fetchAllTickersNews(options);

        // Filter articles that mention popular tickers
        const popularArticles = allResult.articles.filter(article =>
                article.tickers?.some(ticker =>
                    popularTickers.includes(ticker.toUpperCase())
                ) || popularTickers.some(ticker =>
                    (article.title || '').toLowerCase().includes(ticker.toLowerCase())
                )
        );

        return {
            articles: popularArticles,
            hasMore: allResult.hasMore,
            totalItems: popularArticles.length,
            currentPage: allResult.currentPage,
            totalPages: allResult.totalPages
        };
    }

    private transformArticle(article: any): CryptoArticle {
        const id = article.news_url || article.id || `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const date = article.date || article.createdAt || new Date().toISOString();

        return {
            id,
            title: article.title || 'Untitled Article',
            text: article.text || article.content || '',
            content: article.text || article.content || '',
            source_name: article.source_name || 'Unknown Source',
            sourceName: article.source_name || 'Unknown Source',
            date,
            createdAt: date,
            tickers: Array.isArray(article.tickers) ? article.tickers : [],
            news_url: article.news_url,
            sourceUrl: article.news_url,
            image_url: article.image_url || article.image,
            image: article.image_url || article.image,
            sentiment: article.sentiment || 'neutral',
            kind: article.kind || 'news',
            likeCount: 0,
            likers: [],
            comments: [],
            authorId: article.authorId,
            type: 'crypto_news' as const
        };
    }

    clearCache(): void {
        this.cache.clear();
        console.log('🧹 Cache cleared');
    }
}

const cryptoNewsService = new CryptoNewsService();

export function useCryptoNews(
    type: NewsType = 'trending',
    options: UseCryptoNewsOptions = {}
): UseCryptoNewsResult {
    const {
        ticker,
        keywords,
        enabled = true,
        refetchOnMount = true,
        staleTime = 2 * 60 * 1000, // 2 minutes
        initialLimit = 25,
    } = options;

    const [data, setData] = useState<CryptoArticle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [lastFetch, setLastFetch] = useState<number>(0);

    const abortControllerRef = useRef<AbortController | null>(null);
    const loadedPagesRef = useRef<Set<number>>(new Set());

    const fetchData = useCallback(async (page: number, append: boolean = false, showLoading: boolean = false) => {
        if (!enabled) return;

        // Prevent duplicate requests for the same page
        if (append && loadedPagesRef.current.has(page)) {
            console.log(`⚠️ Page ${page} already loaded, skipping...`);
            return;
        }

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            if (showLoading) {
                setIsLoading(true);
            } else {
                setIsFetching(true);
            }
            setError(null);

            let result: {
                articles: CryptoArticle[];
                hasMore: boolean;
                totalItems: number;
                currentPage: number;
                totalPages: number;
            };

            console.log(`🚀 Fetching ${type} news, page ${page}...`);

            switch (type) {
                case 'trending':
                    result = await cryptoNewsService.fetchTrendingNews({ page, limit: initialLimit });
                    break;

                case 'alltickers':
                    result = await cryptoNewsService.fetchAllTickersNews({ page, limit: initialLimit, keywords });
                    break;

                case 'ticker':
                    if (!ticker) {
                        throw new Error('Ticker is required for ticker news type');
                    }
                    result = await cryptoNewsService.fetchTickerNews(ticker, { page, limit: initialLimit });
                    break;

                case 'search':
                    if (!keywords || keywords.length === 0) {
                        throw new Error('Keywords are required for search type');
                    }
                    result = await cryptoNewsService.searchArticles(keywords.join(','), { page, limit: initialLimit });
                    break;

                case 'popular':
                    result = await cryptoNewsService.getPopularTickersNews({ page, limit: initialLimit });
                    break;

                default:
                    throw new Error(`Unknown news type: ${type}`);
            }

            // Check if request was aborted
            if (abortControllerRef.current?.signal.aborted) {
                return;
            }

            console.log(`✅ Received ${result.articles.length} articles for page ${page}, hasMore: ${result.hasMore}`);

            if (append) {
                setData(prev => {
                    // Remove duplicates by ID
                    const existingIds = new Set(prev.map(article => article.id));
                    const newArticles = result.articles.filter(article => !existingIds.has(article.id));
                    console.log(`📝 Appending ${newArticles.length} new articles to existing ${prev.length}`);
                    return [...prev, ...newArticles];
                });
                loadedPagesRef.current.add(page);
            } else {
                setData(result.articles);
                loadedPagesRef.current.clear();
                loadedPagesRef.current.add(page);
                console.log(`🔄 Reset data with ${result.articles.length} articles`);
            }

            setHasNextPage(result.hasMore);
            setTotalItems(result.totalItems);
            setTotalPages(result.totalPages);
            setCurrentPage(result.currentPage);
            setLastFetch(Date.now());

        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Failed to fetch crypto news');
                console.error('❌ Error fetching crypto news:', err);
            }
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [type, ticker, keywords?.join(','), enabled, initialLimit]);

    const fetchNextPage = useCallback(async () => {
        if (!hasNextPage || isFetching) {
            console.log(`⏸️ Skipping next page fetch: hasNextPage=${hasNextPage}, isFetching=${isFetching}`);
            return;
        }

        const nextPage = currentPage + 1;
        console.log(`➡️ Fetching next page: ${nextPage}`);
        await fetchData(nextPage, true, false);
    }, [hasNextPage, isFetching, currentPage, fetchData]);

    const refetch = useCallback(async () => {
        console.log('🔄 Refetching data...');
        loadedPagesRef.current.clear();
        setLastFetch(0);
        setCurrentPage(1);
        await fetchData(1, false, false);
    }, [fetchData]);

    const clearCache = useCallback(() => {
        cryptoNewsService.clearCache();
        setLastFetch(0);
    }, []);

    // Initial fetch
    useEffect(() => {
        if (enabled && refetchOnMount) {
            console.log('🎬 Initial fetch triggered');
            loadedPagesRef.current.clear();
            setCurrentPage(1);
            fetchData(1, false, true);
        }
    }, [enabled, refetchOnMount]);

    // Refetch when dependencies change
    useEffect(() => {
        if (enabled) {
            console.log('🔄 Dependencies changed, refetching...');
            loadedPagesRef.current.clear();
            setCurrentPage(1);
            fetchData(1, false, false);
        }
    }, [type, ticker, keywords?.join(',')]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        data,
        isLoading,
        isFetching,
        error,
        hasNextPage,
        fetchNextPage,
        refetch,
        clearCache,
        totalItems,
        currentPage,
        totalPages,
    };
}

// Specific hooks for different types of news
export function useTrendingNews(options: UseCryptoNewsOptions = {}) {
    return useCryptoNews('trending', options);
}

export function useAllTickersNews(options: UseCryptoNewsOptions = {}) {
    return useCryptoNews('alltickers', options);
}

export function useTickerNews(ticker: string, options: UseCryptoNewsOptions = {}) {
    return useCryptoNews('ticker', { ...options, ticker });
}

export function useSearchNews(keywords: string[], options: UseCryptoNewsOptions = {}) {
    return useCryptoNews('search', { ...options, keywords });
}

export function usePopularNews(options: UseCryptoNewsOptions = {}) {
    return useCryptoNews('popular', options);
}