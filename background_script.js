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
            
          url = "https://app.thestorygraph.com/books-read/bea455db-1abd-4b75-9afd-c8fcf980b307?year=2024&month=6"
          const data = fetchData(url, cookies).then(result => {
            if (result.success) {
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
  
  
