
const API_TOKEN = process.env.CRYPTO_NEWS_API_TOKEN || "bagck5b260xe3tmck20qzqko9sb16qutzy47wvtr";
const BASE_URL = "https://cryptonews-api.com/api/v1";

async function fetchShibNews(page = 1, items = 25) {
    const params = new URLSearchParams({
        token: API_TOKEN,
        tickers: "SHIB",
        items: items.toString(),
        page: page.toString(),
    });

    try {
        console.log(`Fetching SHIB news page ${page}...`);

        const response = await fetch(`${BASE_URL}?${params}`, {
            headers: {
                'User-Agent': 'CryptoNewsApp/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log(`Received ${data.data?.length || 0} SHIB articles for page ${page}`);
        return data;
    } catch (error) {
        console.error(`Error fetching SHIB news page ${page}:`, error);
        return null;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const itemsPerPage = parseInt(searchParams.get('items_per_page')) || 25;

    try {
        const newsData = await fetchShibNews(page, itemsPerPage);

        if (!newsData || !newsData.data) {
            return Response.json(
                { error: 'Could not retrieve SHIB news data' },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            articles: newsData.data,
            total_articles: newsData.total || newsData.data.length,
            current_page: page,
            total_pages: newsData.total_pages || 1,
            has_more: page < (newsData.total_pages || 1),
            items_per_page: itemsPerPage
        });

    } catch (error) {
        console.error('Error in SHIB news API:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


// const API_TOKEN = process.env.CRYPTO_NEWS_API_TOKEN || "bagck5b260xe3tmck20qzqko9sb16qutzy47wvtr";
// const BASE_URL = "https://cryptonews-api.com/api/v1";

// export async function GET() {
//     const params = new URLSearchParams({
//         token: API_TOKEN,
//         tickers: "SHIB",
//         items: "20",
//         page: "1"
//     });

//     try {
//         const response = await fetch(`${BASE_URL}?${params.toString()}`, {
//             headers: { 'User-Agent': 'CryptoNewsApp/1.0' }
//         });

//         if (!response.ok) {
//             return new Response(
//                 JSON.stringify({ success: false, message: `API failed with status ${response.status}` }),
//                 { status: 500 }
//             );
//         }

//         const data = await response.json();

//         return new Response(JSON.stringify({
//             success: true,
//             articles: data.data || [],
//         }), { status: 200 });
//     } catch (error) {
//         console.error("API call failed", error);
//         return new Response(
//             JSON.stringify({ success: false, message: 'Internal server error', error: error.message }),
//             { status: 500 }
//         );
//     }
// }
