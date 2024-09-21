
console.log("This is the background");

const injectScrollScript = (tabId) => {
    console.log("Inject");
    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
            target: { tabId },
            function: () => {
                window.scrollTo(0, document.body.scrollHeight);
                // Wait for scrolling to complete
                setTimeout(() => {
                    resolve();
                }, 3000); // Adjust the delay as needed
            }
        });
    });
};

const fetchDataFromTab = async (tabId, url) => {
    console.log("Fetch")
    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
            target: { tabId },
            function: () => {
                // Replace this with your data extraction logic
                return document.body.innerText;
            }
        }, (results) => {
            if (chrome.runtime.lastError || !results || !results[0].result) {
                reject(chrome.runtime.lastError || 'Failed to extract data');
            } else {
                resolve(results[0].result);
            }
        });
    });
};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log("Reached Listener");

    if (request.action === "fetchData") {
        try {
            // Create a hidden tab to load the URL
            chrome.tabs.create({ url: request.url, active: false }, async (tab) => {
                // Inject the script to scroll to the bottom
                await injectScrollScript(tab.id);

                // Fetch data from the page
                const data = await fetchDataFromTab(tab.id, request.url);

                // Send the response
                sendResponse({ success: true, data });

                // Optionally, close the tab after fetching data
                chrome.tabs.remove(tab.id);
            });
        } catch (error) {
            console.error('Error:', error.message);
            sendResponse({ success: false, error: error.message });
        }
    }
    
    // Important! Return true to indicate you want to send a response asynchronously
    return true;
});
