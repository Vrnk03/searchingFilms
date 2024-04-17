"use strict"

let form = document.forms.searchFilm;

let searchBtn = form.querySelector('input[type="button"]');

searchBtn.addEventListener("click", (event) => {
    event.preventDefault();

    let title = form.titleChoice.value;
    let type = form.typeChoice.value;

    Search(title, type);
});

function Search(title, type, offset = 0) { 
    let apiKey = "62d93a71";
    let url = 'https://www.omdbapi.com/?s=' + encodeURIComponent(title) + '&type=' + type + '&apikey=' + apiKey + '&page=' + (Math.ceil(offset / 3) + 1); 

    sendRequest(url, function(err, data) {
        if (err)
            alert(err);
        else {
            let movies = data.Search || [];
            let totalResults = parseInt(data.totalResults) || 0;
            let currentPage = Math.ceil(totalResults);

            displayRes(movies);
            renderPagination(totalResults, currentPage, offset);
        }
    });
    
}

function sendRequest(url, cb) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                cb(null, JSON.parse(xhr.responseText));
            } else {
                cb(new Error('Request failed.'));
            }
        }
    };
    xhr.open("GET", url);
    xhr.send();
}

function displayRes(movies)
{
    let collectionCards = document.querySelector("#collectionCards");
    collectionCards.innerHTML = '';
    let errorMessage = document.querySelector('#errorMessage');
    errorMessage.style.visibility = "hidden";

    console.log(movies.length)

    if (movies.length === 0) 
    {
        errorMessage.textContent = 'Movie not found!';
        errorMessage.style.visibility = "visible";
        return;
    }

    movies.slice(0, 3).forEach((movie) => {
        let cardCollection = document.querySelector("#collectionCards");

        let card = document.createElement('div');
        card.classList.add("card");

        let filmInfo = document.querySelector("#filmInfo");
        filmInfo.style.visibility = "hidden";


        let cardInfo = document.createElement('div');
        cardInfo.classList.add("info");

        let img = document.createElement('img');
        img.src = movie.Poster;
        img.alt = movie.Title;
        card.appendChild(img);

        let title = document.createElement('h3');
        title.textContent = movie.Title;
        cardInfo.appendChild(title);


        let year = document.createElement('p');
        year.textContent = movie.Year;
        cardInfo.appendChild(year);

        let details = document.createElement('button');
        details.textContent = 'Details';
        cardInfo.appendChild(details);

        card.appendChild(cardInfo);
        cardCollection.appendChild(card);
        

        details.addEventListener('click', () => {

            let url = 'http://www.omdbapi.com/?i=' + movie.imdbID + '&apikey=62d93a71';

            sendRequest(url, function(error, data) {
                if (error) 
                    alert(error);
                else 
                {
                    
                    let filmInfo = document.querySelector("#filmInfo");
                    let img = filmInfo.querySelector("img");
                    img.src = movie.Poster;
                    img.alt = movie.Title;

                    content.querySelector("#title").innerHTML = data.Title;
                    content.querySelector("#released").innerHTML = data.Released;
                    content.querySelector("#genre").innerHTML = data.Genre;
                    content.querySelector("#country").innerHTML = data.Country;
                    content.querySelector("#director").innerHTML = data.Director;
                    content.querySelector("#writer").innerHTML = data.Writer;
                    content.querySelector("#actors").innerHTML = data.Actors;
                    content.querySelector("#awards").innerHTML = data.Awards;

                    filmInfo.style.visibility = "visible";
                }
                });

        });
    });

}

function renderPagination(totalResults, currentPage, offset) {
    let paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';

    let totalPages = Math.ceil(totalResults / 3);
    let currentPageIndex = Math.floor(offset / 3) + 1;

    let startPage = Math.max(currentPageIndex - 3, 1);
    let endPage = Math.min(currentPageIndex + 3, totalPages);

    if (startPage > 1) {
        let prevButton = document.createElement('button');
        prevButton.textContent = '<<';
        prevButton.addEventListener('click', function() {
            Search(form.titleChoice.value, form.typeChoice.value, (startPage - 2) * 3);
        });
        paginationContainer.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        let button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', function() {
            Search(form.titleChoice.value, form.typeChoice.value, (this.textContent - 1) * 3);
        });

        if (i === currentPageIndex) {
            button.disabled = true;
        }

        paginationContainer.appendChild(button);
    }

    if (endPage < totalPages) {
        let nextButton = document.createElement('button');
        nextButton.textContent = '>>';
        nextButton.addEventListener('click', function() {
            Search(form.titleChoice.value, form.typeChoice.value, endPage * 3);
        });
        paginationContainer.appendChild(nextButton);
    }
}
