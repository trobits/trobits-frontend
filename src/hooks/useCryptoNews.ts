import { useState, useEffect, useCallback, useRef } from 'react';
import cryptoNewsService, { CryptoArticle, FetchOptions } from '../app/(withCommonLayout)/articles/service';

export interface UseCryptoNewsResult {
    data: CryptoArticle[];
    isLoading: boolean;
    isFetching: boolean;
    error: string | null;
    totalPages: number;
    totalItems: number;
    refetch: () => Promise<void>;
    clearCache: () => void;
}

export interface UseCryptoNewsOptions extends FetchOptions {
    enabled?: boolean;
    refetchOnMount?: boolean;
    staleTime?: number;
}

type NewsType = 'trending' | 'alltickers' | 'ticker' | 'search' | 'popular';

export function useCryptoNews(
    type: NewsType = 'trending',
    options: UseCryptoNewsOptions = {}
): UseCryptoNewsResult {
    const {
        page = 1,
        limit = 20,
        ticker,
        keywords,
        enabled = true,
        refetchOnMount = true,
        staleTime = 5 * 60 * 1000, // 5 minutes
    } = options;

    const [data, setData] = useState<CryptoArticle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [lastFetch, setLastFetch] = useState<number>(0);

    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (showLoading = false) => {
        if (!enabled) return;

        // Check if data is still fresh
        if (Date.now() - lastFetch < staleTime && data.length > 0) {
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
                totalPages: number;
                totalItems: number;
            };

            switch (type) {
                case 'trending':
                    result = await cryptoNewsService.fetchTrendingNews({ page, limit });
                    break;

                case 'alltickers':
                    result = await cryptoNewsService.fetchAllTickersNews({ page, limit, keywords });
                    break;

                case 'ticker':
                    if (!ticker) {
                        throw new Error('Ticker is required for ticker news type');
                    }
                    const tickerArticles = await cryptoNewsService.fetchTickerNews(ticker, { page, limit });
                    result = {
                        articles: tickerArticles,
                        totalPages: 1,
                        totalItems: tickerArticles.length
                    };
                    break;

                case 'search':
                    if (!keywords || keywords.length === 0) {
                        throw new Error('Keywords are required for search type');
                    }
                    result = await cryptoNewsService.searchArticles(keywords.join(','), { page, limit });
                    break;

                case 'popular':
                    result = await cryptoNewsService.getPopularTickersNews({ page, limit });
                    break;

                default:
                    throw new Error(`Unknown news type: ${type}`);
            }

            // Check if request was aborted
            if (abortControllerRef.current?.signal.aborted) {
                return;
            }

            setData(result.articles);
            setTotalPages(result.totalPages);
            setTotalItems(result.totalItems);
            setLastFetch(Date.now());

        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Failed to fetch crypto news');
                console.error('Error fetching crypto news:', err);
            }
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [type, page, limit, ticker, keywords?.join(','), enabled, staleTime, lastFetch, data.length]);

    const refetch = useCallback(async () => {
        setLastFetch(0); // Force fresh fetch
        await fetchData(false);
    }, [fetchData]);

    const clearCache = useCallback(() => {
        cryptoNewsService.clearCache();
        setLastFetch(0);
    }, []);

    // Initial fetch
    useEffect(() => {
        if (enabled && refetchOnMount) {
            fetchData(true);
        }
    }, [enabled, refetchOnMount]);

    // Refetch when dependencies change
    useEffect(() => {
        if (enabled) {
            fetchData(false);
        }
    }, [fetchData]);

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
        totalPages,
        totalItems,
        refetch,
        clearCache,
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

// Hook for combining database articles with crypto news
export function useMixedArticles(
    databaseArticles: any[] = [],
    cryptoNewsOptions: UseCryptoNewsOptions = {}
) {
    const { data: cryptoNews, ...cryptoState } = useTrendingNews(cryptoNewsOptions);

    const [combinedData, setCombinedData] = useState<any[]>([]);

    useEffect(() => {
        // Combine and sort articles
        const combined = [...databaseArticles, ...cryptoNews]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Remove duplicates based on title
        const unique = combined.filter((article, index, self) =>
            index === self.findIndex(a => a.title.toLowerCase() === article.title.toLowerCase())
        );

        setCombinedData(unique);
    }, [databaseArticles, cryptoNews]);

    return {
        ...cryptoState,
        data: combinedData,
    };
}