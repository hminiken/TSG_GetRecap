
function parse_data(resp){
    books = resp.getElementsByClassName("book-pane-content grid grid-cols-10");
    book_array = []
    book_string = ""

    for (let book of books) {
        var dict = {};
         cover_link = book.getElementsByClassName("book-cover")[0].firstElementChild.firstElementChild.src
         cover_alt = book.getElementsByClassName("book-cover")[0].firstElementChild.firstElementChild.alt

         //Handle if user does not have a rating
        if (book.getElementsByClassName("-ml-3 font-medium").length > 0 ) {
          rating = book.getElementsByClassName("-ml-3 font-medium")[0].firstChild.textContent
        } else {
            rating = ""
        }
        var dict = {
            cover: cover_link,
            cover_alt: cover_alt,
            rating: rating
        };
        console.log("DICT: " + dict);
        book_array.push(JSON.stringify(dict));
    }
    
        book_string = "[" + book_array.toString() + "]";

    // Create an element to store the book data retrieved for the app
    tsg_book_data = document.getElementById("storygraph_return_content")
    tsg_child = tsg_book_data.appendChild( document.createElement("p") );
    tsg_child.textContent = book_string;
    tsg_child.id = "tsg_book_data_success";


}


document.getElementById('get_storygraph').addEventListener('click', async () => {
    if (document.getElementById("tsg_book_data_success"))  {
        //Clear existing book data before getting new data
        document.getElementById("tsg_book_data_success").remove();
    }

    //get the filter data
    const year = document.getElementById('yearDropdown').value;
    const month = document.getElementById('monthDropdown').value;

    if (!year || !month) {
        return res.status(400).json({ error: 'Year and month are required' });
    }
    // read_url = `https://app.thestorygraph.com/books-read/bea455db-1abd-4b75-9afd-c8fcf980b307?year=${year}&month=${month}`
    read_url = `https://app.thestorygraph.com/books-read/09a9e490-6188-4734-b111-faa83884a50e?year=${year}&month=${month}`
    
    chrome.runtime.sendMessage({ action: "fetchData", url: read_url }, (response) => {
        //store the response as html
        console.log("Got a response");
        console.log("Received response:", response);

        // if (response.success) {
        //     console.log("Fetched data:", response.data);
        // } else {
        //     console.error("Failed to fetch data:", response.error);
        // }
        console.log(response);
        const responseContainer = document.createElement("div");
        responseContainer.innerHTML = response;
        data = parse_data(responseContainer);

        //clear the html
        responseContainer.innerHTML = "";
  });
});


