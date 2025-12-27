// Career Black Box Chrome Extension - GitHub Content Script
// This script runs on github.com to enable right-click decision capture and account linking

(function () {
    const API_BASE = 'https://black-box-flax.vercel.app';

    // Utility to get current GitHub user info from the page
    function getGitHubUserInfo() {
        // Try to get user info from GitHub's meta tags
        const userLoginMeta = document.querySelector('meta[name="user-login"]');
        const userIdMeta = document.querySelector('meta[name="octolytics-actor-id"]');

        if (userLoginMeta && userIdMeta) {
            return {
                username: userLoginMeta.getAttribute('content'),
                userId: parseInt(userIdMeta.getAttribute('content'), 10)
            };
        }

        return null;
    }

    // Check if we're on a PR or issue page
    function isOnPROrIssuePage() {
        const path = window.location.pathname;
        return path.includes('/pull/') || path.includes('/issues/');
    }

    // Get the current PR/Issue URL
    function getCurrentPageUrl() {
        return window.location.href;
    }

    // Create floating button for GitHub linking
    function createLinkButton() {
        // Check if already created
        if (document.getElementById('cbb-link-button')) return;

        const button = document.createElement('button');
        button.id = 'cbb-link-button';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M12 12h.01"/>
                <path d="M17 12h.01"/>
                <path d="M7 12h.01"/>
            </svg>
            <span>Link Career Black Box</span>
        `;
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: none;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
        });

        button.addEventListener('click', showLinkDialog);

        document.body.appendChild(button);

        // Check if we should show the button
        checkAndShowLinkButton();
    }

    // Check if user should see the link button
    async function checkAndShowLinkButton() {
        try {
            const result = await chrome.storage.local.get(['githubLinked', 'authToken']);
            const button = document.getElementById('cbb-link-button');

            if (button && result.authToken && !result.githubLinked) {
                // User is logged in but GitHub not linked
                button.style.display = 'flex';
            }
        } catch (e) {
            console.log('Extension not available');
        }
    }

    // Show dialog for entering link code
    function showLinkDialog() {
        // Remove existing dialog if any
        const existingDialog = document.getElementById('cbb-link-dialog');
        if (existingDialog) existingDialog.remove();

        const overlay = document.createElement('div');
        overlay.id = 'cbb-link-dialog';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: #1e293b;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            color: white;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        `;

        const githubUser = getGitHubUserInfo();

        dialog.innerHTML = `
            <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Link GitHub Account</h2>
            <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 14px;">
                Enter the link code from your Career Black Box settings.
            </p>
            ${githubUser ? `
                <p style="margin: 0 0 16px 0; color: #6366f1; font-size: 14px;">
                    Linking as: @${githubUser.username}
                </p>
            ` : ''}
            <input type="text" id="cbb-link-code-input" placeholder="Enter 6-character code" 
                style="width: 100%; padding: 12px; border: 1px solid #334155; border-radius: 8px; 
                    background: #0f172a; color: white; font-size: 16px; text-transform: uppercase;
                    letter-spacing: 4px; text-align: center; margin-bottom: 16px; box-sizing: border-box;"
                maxlength="6"
            />
            <div id="cbb-link-error" style="color: #f87171; font-size: 14px; margin-bottom: 16px; display: none;"></div>
            <div style="display: flex; gap: 12px;">
                <button id="cbb-link-cancel" style="flex: 1; padding: 12px; border: 1px solid #334155; 
                    border-radius: 8px; background: transparent; color: #94a3b8; cursor: pointer; font-size: 14px;">
                    Cancel
                </button>
                <button id="cbb-link-submit" style="flex: 1; padding: 12px; border: none; border-radius: 8px; 
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; 
                    cursor: pointer; font-size: 14px; font-weight: 500;">
                    Link Account
                </button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Focus input
        const input = document.getElementById('cbb-link-code-input');
        input.focus();

        // Handle cancel
        document.getElementById('cbb-link-cancel').addEventListener('click', () => {
            overlay.remove();
        });

        // Handle overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Handle submit
        document.getElementById('cbb-link-submit').addEventListener('click', () => {
            submitLinkCode(input.value);
        });

        // Handle enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitLinkCode(input.value);
            }
        });
    }

    // Submit link code to API
    async function submitLinkCode(code) {
        const errorDiv = document.getElementById('cbb-link-error');
        const submitBtn = document.getElementById('cbb-link-submit');

        if (!code || code.length !== 6) {
            errorDiv.textContent = 'Please enter a 6-character code';
            errorDiv.style.display = 'block';
            return;
        }

        const githubUser = getGitHubUserInfo();
        if (!githubUser) {
            errorDiv.textContent = 'Could not detect your GitHub username. Please ensure you are logged in.';
            errorDiv.style.display = 'block';
            return;
        }

        submitBtn.textContent = 'Linking...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE}/api/github/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    linkCode: code.toUpperCase(),
                    githubUserId: githubUser.userId,
                    githubUsername: githubUser.username
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success!
                await chrome.storage.local.set({ githubLinked: true });

                // Update UI
                const dialog = document.getElementById('cbb-link-dialog');
                dialog.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                        <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #4ade80;">
                            Successfully Linked!
                        </h2>
                        <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 14px;">
                            Comment @blackbox on any PR to capture decisions.
                        </p>
                        <button onclick="this.closest('#cbb-link-dialog').remove()" 
                            style="padding: 12px 24px; border: none; border-radius: 8px; 
                            background: #4ade80; color: black; cursor: pointer; font-size: 14px; font-weight: 500;">
                            Got it!
                        </button>
                    </div>
                `;

                // Hide the link button
                const linkButton = document.getElementById('cbb-link-button');
                if (linkButton) linkButton.style.display = 'none';
            } else {
                errorDiv.textContent = data.error || 'Failed to link account';
                errorDiv.style.display = 'block';
                submitBtn.textContent = 'Link Account';
                submitBtn.disabled = false;
            }
        } catch (e) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.style.display = 'block';
            submitBtn.textContent = 'Link Account';
            submitBtn.disabled = false;
        }
    }

    // Initialize when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLinkButton);
    } else {
        createLinkButton();
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'CHECK_GITHUB_USER') {
            const userInfo = getGitHubUserInfo();
            sendResponse(userInfo);
        }
        return true;
    });

    console.log('Career Black Box GitHub content script loaded');
})();
