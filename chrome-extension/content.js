// Career Black Box Chrome Extension - Content Script
// This script runs on career-black-box.vercel.app to sync auth state

(function () {
    // Only run on career-black-box.vercel.app
    if (!window.location.hostname.includes('career-black-box') &&
        !window.location.hostname.includes('localhost')) {
        return;
    }

    // Function to extract auth token from Supabase
    function extractAuthToken() {
        // Try to get from localStorage (Supabase stores session there)
        const keys = Object.keys(localStorage);
        const supabaseKey = keys.find(key => key.includes('supabase.auth'));

        if (supabaseKey) {
            try {
                const session = JSON.parse(localStorage.getItem(supabaseKey));
                if (session?.access_token) {
                    return session.access_token;
                }
            } catch (e) {
                console.error('Failed to parse Supabase session:', e);
            }
        }

        return null;
    }

    // Sync auth state with extension
    function syncAuthState() {
        const token = extractAuthToken();

        if (token) {
            chrome.runtime.sendMessage({
                type: 'SET_AUTH_TOKEN',
                token: token
            }, response => {
                if (chrome.runtime.lastError) {
                    console.log('Extension not available');
                }
            });
        }
    }

    // Initial sync
    syncAuthState();

    // Listen for auth changes (login/logout)
    window.addEventListener('storage', (event) => {
        if (event.key?.includes('supabase')) {
            syncAuthState();
        }
    });

    // Also sync on page visibility change (in case user logs in in another tab)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            syncAuthState();
        }
    });

    console.log('Career Black Box extension content script loaded');
})();
