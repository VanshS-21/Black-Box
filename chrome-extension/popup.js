// Career Black Box Chrome Extension - Popup Script

const API_BASE = 'https://career-black-box.vercel.app';
// For local development: const API_BASE = 'http://localhost:3000';

// DOM Elements
const authStatus = document.getElementById('auth-status');
const loginPrompt = document.getElementById('login-prompt');
const mainContent = document.getElementById('main-content');
const decisionInput = document.getElementById('decision-input');
const charCount = document.getElementById('char-count');
const structureBtn = document.getElementById('structure-btn');
const btnText = document.getElementById('btn-text');
const sourceInfo = document.getElementById('source-info');
const sourceUrl = document.getElementById('source-url');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const logAnotherBtn = document.getElementById('log-another-btn');
const retryBtn = document.getElementById('retry-btn');

// State
let isLoading = false;
let authToken = null;
let capturedSourceUrl = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();
    await loadCapturedContent();
    setupEventListeners();
});

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        // Try to get auth status from the main app via storage
        const result = await chrome.storage.local.get(['authToken', 'authExpiry']);

        if (result.authToken && result.authExpiry > Date.now()) {
            authToken = result.authToken;
            showAuthenticated();
            return;
        }

        // If no token in storage, check via cookie from the main site
        const cookies = await chrome.cookies.getAll({ url: API_BASE });
        const authCookie = cookies.find(c => c.name.includes('supabase-auth') || c.name.includes('sb-'));

        if (authCookie) {
            authToken = authCookie.value;
            // Cache it
            await chrome.storage.local.set({
                authToken: authToken,
                authExpiry: Date.now() + (1000 * 60 * 60) // 1 hour
            });
            showAuthenticated();
        } else {
            showNotAuthenticated();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showNotAuthenticated();
    }
}

function showAuthenticated() {
    authStatus.className = 'status-badge status-connected';
    authStatus.querySelector('.status-text').textContent = 'Connected';
    loginPrompt.classList.add('hidden');
    mainContent.classList.remove('hidden');
}

function showNotAuthenticated() {
    authStatus.className = 'status-badge status-disconnected';
    authStatus.querySelector('.status-text').textContent = 'Not signed in';
    loginPrompt.classList.remove('hidden');
    mainContent.classList.add('hidden');
}

// Load any content captured via right-click
async function loadCapturedContent() {
    try {
        const result = await chrome.storage.local.get(['capturedText', 'capturedUrl']);

        if (result.capturedText) {
            decisionInput.value = result.capturedText;
            updateCharCount();

            if (result.capturedUrl) {
                capturedSourceUrl = result.capturedUrl;
                sourceUrl.textContent = new URL(result.capturedUrl).hostname;
                sourceUrl.title = result.capturedUrl;
                sourceInfo.classList.remove('hidden');
            }

            // Clear the captured content
            await chrome.storage.local.remove(['capturedText', 'capturedUrl']);
        }
    } catch (error) {
        console.error('Failed to load captured content:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    decisionInput.addEventListener('input', () => {
        updateCharCount();
        updateButtonState();
    });

    structureBtn.addEventListener('click', handleStructure);
    logAnotherBtn.addEventListener('click', resetForm);
    retryBtn.addEventListener('click', resetForm);
}

function updateCharCount() {
    const count = decisionInput.value.length;
    charCount.textContent = count;
    charCount.parentElement.classList.toggle('valid', count >= 50);
}

function updateButtonState() {
    structureBtn.disabled = decisionInput.value.trim().length < 50 || isLoading;
}

// Handle structure and save
async function handleStructure() {
    if (isLoading) return;

    const rawInput = decisionInput.value.trim();
    if (rawInput.length < 50) return;

    isLoading = true;
    structureBtn.disabled = true;
    btnText.innerHTML = '<span class="spinner"></span> Processing...';

    try {
        // Step 1: Structure with AI
        const structureResponse = await fetch(`${API_BASE}/api/ai/structure`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ rawInput }),
        });

        if (!structureResponse.ok) {
            const errorData = await structureResponse.json();
            throw new Error(errorData.error || 'Failed to structure decision');
        }

        const structured = await structureResponse.json();

        // Step 2: Save the decision
        const saveResponse = await fetch(`${API_BASE}/api/decisions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                ...structured,
                original_input: rawInput,
                ai_structured: true,
                source: 'chrome_extension',
                source_url: capturedSourceUrl || null,
            }),
        });

        if (!saveResponse.ok) {
            const errorData = await saveResponse.json();
            throw new Error(errorData.error || 'Failed to save decision');
        }

        // Success!
        showSuccess();

    } catch (error) {
        console.error('Structure/save failed:', error);
        showError(error.message);
    } finally {
        isLoading = false;
    }
}

function showSuccess() {
    document.querySelector('.capture-form').classList.add('hidden');
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    btnText.textContent = 'Structure with AI';
    structureBtn.disabled = false;
}

function resetForm() {
    decisionInput.value = '';
    capturedSourceUrl = null;
    sourceInfo.classList.add('hidden');
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    document.querySelector('.capture-form').classList.remove('hidden');
    btnText.textContent = 'Structure with AI';
    structureBtn.disabled = true;
    updateCharCount();
}
