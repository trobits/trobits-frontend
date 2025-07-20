const API_TOKEN = process.env.CRYPTO_NEWS_API_TOKEN || "bagck5b260xe3tmck20qzqko9sb16qutzy47wvtr";
const BASE_URL = "https://cryptonews-api.com/api/v1";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const coin = searchParams.get("coin")?.toUpperCase() || "SHIB"; // Default to SHIB
    const items = searchParams.get("items") || "20";
    const page = searchParams.get("page") || "1";

    const params = new URLSearchParams({
        token: API_TOKEN,
        tickers: coin,
        items,
        page,
    });

    try {
        const response = await fetch(`${BASE_URL}?${params.toString()}`, {
            headers: { "User-Agent": "CryptoNewsApp/1.0" }
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ success: false, message: `API failed with status ${response.status}` }),
                { status: 500 }
            );
        }

        const data = await response.json();

        return new Response(
            JSON.stringify({
                success: true,
                articles: data.data || [],
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(`Error fetching ${coin} news:`, error);
        return new Response(
            JSON.stringify({ success: false, message: "Internal server error", error: error.message }),
            { status: 500 }
        );
    }
}
