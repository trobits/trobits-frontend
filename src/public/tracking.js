// Trobits Affiliate Tracking Script
(function() {
    // Production API URL
    const TRACKING_API_URL = 'https://api.trobits.com/api/tracking';
    const DEBUG = false; // Set to false in production

    // Function to log messages
    function log(message, data = null) {
        if (DEBUG) {
            if (data) {
                console.log(`[Trobits Tracking] ${message}`, data);
            } else {
                console.log(`[Trobits Tracking] ${message}`);
            }
        }
    }

    // Function to generate a unique user ID if not exists
    function getUserId() {
        let userId = localStorage.getItem('trobits_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('trobits_user_id', userId);
            log('Generated new user ID', userId);
        }
        return userId;
    }

    // Function to get user data
    function getUserData() {
        const userData = {
            email: localStorage.getItem('trobits_user_email') || '',
            username: localStorage.getItem('trobits_username') || '',
            userType: localStorage.getItem('trobits_user_type') || 'guest',
            deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            browser: navigator.userAgent,
            os: navigator.platform,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        log('User data collected', userData);
        return userData;
    }

    // Function to track click
    async function trackClick(link, linkName) {
        log('Tracking click', { link, linkName });
        try {
            const response = await fetch(`${TRACKING_API_URL}/click`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: getUserId(),
                    affiliateLink: link,
                    metadata: {
                        linkName: linkName,
                        source: window.location.hostname,
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        referrer: document.referrer,
                        screenSize: `${window.screen.width}x${window.screen.height}`,
                        language: navigator.language,
                        pageUrl: window.location.href,
                        pageTitle: document.title,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                    },
                    userData: getUserData()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            log('Click tracked successfully', data);
            return data.taggedLink;
        } catch (error) {
            log('Error tracking click', error);
            // Return original link if tracking fails
            return link;
        }
    }

    // Function to track conversion
    async function trackConversion(trackingId, orderId) {
        log('Tracking conversion', { trackingId, orderId });
        try {
            const response = await fetch(`${TRACKING_API_URL}/conversion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trackingId,
                    orderId,
                    metadata: {
                        conversionSource: window.location.hostname,
                        conversionTime: new Date().toISOString(),
                        pageUrl: window.location.href,
                        pageTitle: document.title,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            log('Conversion tracked successfully', data);
            return data;
        } catch (error) {
            log('Error tracking conversion', error);
            return null;
        }
    }

    // Function to initialize tracking on page load
    function initTracking() {
        log('Initializing tracking');
        
        // Check if we're on a conversion page
        const urlParams = new URLSearchParams(window.location.search);
        const trackingId = urlParams.get('trobits_tracking_id');
        const orderId = urlParams.get('order_id');

        if (trackingId && orderId) {
            log('Conversion page detected', { trackingId, orderId });
            trackConversion(trackingId, orderId);
        }

        // Add click tracking to all affiliate links
        const affiliateLinks = document.querySelectorAll('a[data-affiliate-link]');
        log(`Found ${affiliateLinks.length} affiliate links`);

        affiliateLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const originalLink = link.getAttribute('href');
                const linkName = link.getAttribute('data-affiliate-link');
                
                log('Affiliate link clicked', { originalLink, linkName });
                const taggedLink = await trackClick(originalLink, linkName);
                
                if (taggedLink) {
                    log('Redirecting to tagged link', taggedLink);
                    window.location.href = taggedLink;
                } else {
                    log('Using original link due to tracking failure', originalLink);
                    window.location.href = originalLink;
                }
            });
        });
    }

    // Initialize tracking when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        initTracking();
    }

    // Expose tracking functions globally
    window.TrobitsTracking = {
        trackClick,
        trackConversion,
        getUserId,
        getUserData,
        // Add a function to manually set user data
        setUserData: (data) => {
            if (data.email) localStorage.setItem('trobits_user_email', data.email);
            if (data.username) localStorage.setItem('trobits_username', data.username);
            if (data.userType) localStorage.setItem('trobits_user_type', data.userType);
            log('User data updated', data);
        }
    };
})(); 