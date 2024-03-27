browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^https:\/\/www\.reddit\.com\/r\/.*\/comments\/.*/.test(tab.url)) {
        browser.tabs.executeScript(tabId, {file: 'custom_script.js'});
    }
});