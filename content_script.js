
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
        book_array.push(dict);
        book_string += JSON.stringify(dict);
    }


    // Create an element to store the book data retrieved for the app
    tsg_book_data = document.getElementById("storygraph_return_content")
    tsg_child = tsg_book_data.appendChild( document.createElement("p") );
    tsg_child.textContent = book_string;
    tsg_child.id = "tsg_book_data_success";


}


document.getElementById('get_storygraph').addEventListener('click', async () => {
    if (document.getElementById("tsg_book_data_success")) 
    {
        //Clear existing book data before getting new data
        document.getElementById("tsg_book_data_success").remove();
    }
    chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {

        //store the response as html
        const responseContainer = document.createElement("div");
        responseContainer.innerHTML = response;
        data = parse_data(responseContainer);

        //clear the html
        responseContainer.innerHTML = "";
  });
});


