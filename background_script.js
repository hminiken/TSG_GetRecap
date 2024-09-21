console.log("This is the background")
  
const fetchData = async (url, cookies) => {
    try {
        const response = await fetch(url, {
            credentials: "include",
            headers: {
              "Cookie": cookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ")
            }
          })
        const data = await response.text();
        // const response = await fetch(url).then(data=> await response.tex);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async () => {
    console.log("Reached Listener");
    if (request.action === "fetchData") {
        browser_cookies = []
        chrome.cookies.getAll({domain: "thestorygraph.com"}, (cookies) => {    
          const data = fetchData(request.url, cookies).then(result => {
            if (result.success) {
              console.log("Success");
                sendResponse(result.data);

            } else {
                console.error('Failed to fetch data:', result.error);
            }
        });

      })
    }

    })();
     // Important! Return true to indicate you want to send a response asynchronously
  return true;
  });
  
  
