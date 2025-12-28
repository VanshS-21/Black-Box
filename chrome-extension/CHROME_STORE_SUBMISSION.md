# Chrome Web Store Submission Guide

This guide documents the steps to publish the Career Black Box Chrome Extension to the Chrome Web Store.

## Prerequisites

1. **Google Developer Account** - $5 one-time fee
   - Create at: https://chrome.google.com/webstore/devconsole/register

2. **Extension Ready** - Ensure extension is tested and working

## Submission Steps

### 1. Prepare Store Assets

Create the following assets:

| Asset | Size | Description |
|-------|------|-------------|
| Icon | 128x128 px | PNG, high-res version of extension icon |
| Screenshot 1 | 1280x800 px | Popup interface showing login |
| Screenshot 2 | 1280x800 px | GitHub context menu integration |
| Screenshot 3 | 1280x800 px | Decision capture flow |
| Promotional tile | 440x280 px | Feature graphic for store listing |

### 2. Write Store Listing

**Name**: Career Black Box - Decision Capture

**Short Description** (132 chars max):
> Capture technical decisions instantly from GitHub. Build your promotion portfolio while you work.

**Detailed Description**:
```
Career Black Box helps software engineers document their technical decisions directly from GitHub.

FEATURES:
• Right-click on any GitHub PR or Issue to capture a decision
• AI-powered structuring transforms notes into promotion-ready documentation
• Automatically extract context, trade-offs, and impact
• Sync with your Career Black Box dashboard

HOW IT WORKS:
1. Install extension and sign in
2. Right-click any GitHub comment or PR description
3. Click "Log to Career Black Box"
4. Decision is AI-structured and saved to your account

PRIVACY:
• Only captures content you explicitly select
• Data stored securely in your Career Black Box account
• No tracking or analytics collected

Built for software engineers who want to stop losing credit for their technical decisions.
```

**Category**: Productivity

**Language**: English

### 3. Create ZIP Package

```powershell
cd chrome-extension
# Remove any dev/test files
Remove-Item node_modules, .git, *.log -ErrorAction SilentlyContinue -Recurse

# Create zip (exclude unnecessary files)
Compress-Archive -Path * -DestinationPath ../career-black-box-extension.zip
```

### 4. Submit to Chrome Web Store

1. Go to https://chrome.google.com/webstore/devconsole
2. Click "New Item"
3. Upload ZIP file
4. Fill in store listing details
5. Upload screenshots and promotional images
6. Set visibility (Public)
7. Submit for review

### 5. Review Process

- **Timeline**: 3-7 business days typically
- **Common rejection reasons**:
  - Missing privacy policy
  - Overly broad permissions
  - Screenshots don't represent actual functionality
  - Description doesn't match actual features

### 6. Post-Approval

After approval:
1. Update marketing materials with Chrome Web Store link
2. Add "Available on Chrome Web Store" badge to website
3. Update APPLICATION_SUMMARY.md beta limitations section

## Privacy Policy

Ensure your privacy policy (linked from extension and website) covers:
- What data the extension collects (selected text, GitHub URLs)
- How data is transmitted (HTTPS to Career Black Box API)
- How data is stored (user's Career Black Box account)
- User rights (deletion via account settings)

## Permissions Justification

Document why each permission is needed for the Chrome team:

| Permission | Justification |
|------------|---------------|
| `contextMenus` | Right-click menu to capture decisions |
| `storage` | Store authentication token locally |
| `activeTab` | Read selected text from current page |
| `host_permissions: github.com` | Operate on GitHub pages only |

## Updating the Extension

1. Increment version in `manifest.json`
2. Create new ZIP package
3. Go to Developer Dashboard → select extension
4. Upload new package
5. Submit for review (updates typically faster)

---

*Last updated: December 2024*
