
function addToPage(booksString) {

        book_string = "[" + booksString + "]";
        // Create an element to store the book data retrieved for the app
        tsg_book_data = document.getElementById("storygraph_return_content")
        tsg_child = tsg_book_data.appendChild( document.createElement("p") );
        tsg_child.textContent = book_string;
        tsg_child.id = "tsg_book_data_success";
    
}


function parse_data(resp){
    // console.log("parse_data");
    // console.log(resp);
    books = resp.getElementsByClassName("book-pane-content grid grid-cols-10");
    book_array = []
    book_string = ""
    if (books.length > 0) {
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
        // console.log("DICT: " + JSON.stringify(dict));
        book_array.push(JSON.stringify(dict));
    }
    
        book_string =  book_array.toString() ;
        console.log("book string: " + book_string)

        return book_string;
}
        else {
            return null;
        }




}

async function fetchData(read_url) {
    return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "fetchData", url: read_url }, (response) => {
        console.log("Read URL: " + read_url)
            const responseContainer = document.createElement("div");
            responseContainer.innerHTML = response;
            // console.log("Got Response");
            // console.log(response);
            // console.log("Return!");
            resolve(responseContainer);
            
    });
});
}


async function processLinks(year, month)  {
    book_pages = []
    for (i = 1; i < 4; i++) {
        read_url = `https://app.thestorygraph.com/books-read/09a9e490-6188-4734-b111-faa83884a50e?year=${year}&month=${month}&page=${i}`
        responseContainer = await fetchData(read_url).then( (data) => {
            console.log(data);
            console.log("IN LOOP: " + i)
            let book_string = parse_data(data);
            if (book_string != null) {
                book_pages.push(book_string)
            }
            data.innerHTML = "";

        })        
    }
    console.log("book_pages " + book_pages.toString())
    addToPage(book_pages.toString())
}

document.getElementById('get_storygraph').addEventListener('click', async () => {
    if (document.getElementById("tsg_book_data_success"))  {
        //Clear existing book data before getting new data
        document.getElementById("tsg_book_data_success").remove();
    }

    //get the filter data
    const year = document.getElementById('yearDropdown').value;
    const month = 1 //document.getElementById('monthDropdown').value;

    // if (!year || !month) {
    //     return res.status(400).json({ error: 'Year and month are required' });
    // }

    processLinks(year, month)

   
    // read_url = `https://app.thestorygraph.com/books-read/bea455db-1abd-4b75-9afd-c8fcf980b307?year=${year}&month=${month}`
    // chrome.runtime.sendMessage({ action: "fetchData", url: read_url }, (response) => {
    //     console.log("Read URL: " + read_url)
    //         const responseContainer = document.createElement("div");
    //         responseContainer.innerHTML = response;
    //         console.log("Got Response");
    //         console.log(response);
    //         data = parse_data(responseContainer);
    //         responseContainer.innerHTML = "";
    // });
});


