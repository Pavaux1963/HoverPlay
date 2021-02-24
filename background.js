chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'www.youtube.com' },
            })
        ],
        actions: [
            new chrome.declarativeContent.ShowPageAction()
        ]
    }]);
});

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (info.status === 'complete') {
        if (tab.url.indexOf('https://www.youtube.com') !== -1) {
            chrome.tabs.sendMessage(tabId, { command: 'start' });
        }
    }
});