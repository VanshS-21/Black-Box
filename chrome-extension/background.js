// Career Black Box Chrome Extension - Background Service Worker

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'log-decision',
        title: 'Log Decision to Career Black Box',
        contexts: ['selection', 'page']
    });

    console.log('Career Black Box extension installed');
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'log-decision') {
        const selectedText = info.selectionText || '';
        const pageUrl = tab?.url || '';

        // Store the captured content
        await chrome.storage.local.set({
            capturedText: selectedText,
            capturedUrl: pageUrl
        });

        // Open the popup
        // Note: We can't programmatically open the popup, but we can open it in a new tab
        // or notify the user to click the extension icon

        if (selectedText.length > 0) {
            // Show notification that text was captured
            chrome.action.setBadgeText({ text: '1' });
            chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });

            // Clear badge after 5 seconds
            setTimeout(() => {
                chrome.action.setBadgeText({ text: '' });
            }, 5000);
        }

        // Open popup by opening extension page
        chrome.action.openPopup().catch(() => {
            // If openPopup fails (not all browsers support it), open in new tab
            chrome.tabs.create({
                url: chrome.runtime.getURL('popup.html')
            });
        });
    }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_AUTH_STATUS') {
        // Return auth status
        chrome.storage.local.get(['authToken', 'authExpiry']).then(result => {
            sendResponse({
                isAuthenticated: result.authToken && result.authExpiry > Date.now(),
                token: result.authToken
            });
        });
        return true; // Keep channel open for async response
    }

    if (message.type === 'SET_AUTH_TOKEN') {
        // Store auth token
        chrome.storage.local.set({
            authToken: message.token,
            authExpiry: Date.now() + (1000 * 60 * 60) // 1 hour
        }).then(() => {
            sendResponse({ success: true });
        });
        return true;
    }

    if (message.type === 'CLEAR_AUTH') {
        chrome.storage.local.remove(['authToken', 'authExpiry']).then(() => {
            sendResponse({ success: true });
        });
        return true;
    }
});

// Clear badge when popup is opened
chrome.action.onClicked.addListener(() => {
    chrome.action.setBadgeText({ text: '' });
});
