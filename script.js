// ==========================================
// IMDb Play
// script.js
// ==========================================

const input = document.getElementById("imdbInput");
const generateBtn = document.getElementById("generateBtn");
const watchBtn = document.getElementById("watchBtn");
const copyBtn = document.getElementById("copyBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

const generatedLink = document.getElementById("generatedLink");

const poster = document.getElementById("poster");
const movieTitle = document.getElementById("movieTitle");
const movieRating = document.getElementById("movieRating");
const movieGenre = document.getElementById("movieGenre");
const movieRuntime = document.getElementById("movieRuntime");

const recentList = document.getElementById("recentList");

const API_KEY = "e1971d29";

let currentPlayUrl = "";

// ================================
// Extract IMDb ID
// ================================

function getImdbID(url) {

    const match = url.match(/tt\d+/);

    if (match)
        return match[0];

    return null;
}

//=================
//LoadImdb
//=================

async function loadMovie(imdbID){

    try{

        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`
        );

        const data = await response.json();

        if(data.Response === "False"){

            alert("Movie not found.");

            return;

        }

        movieTitle.textContent =
            `${data.Title} (${data.Year})`;

        movieRating.textContent =
            `⭐ ${data.imdbRating}`;

        movieGenre.textContent =
            data.Genre;

        movieRuntime.textContent =
            data.Runtime;

        poster.src =
            data.Poster;

    }

    catch(error){

        console.log(error);

    }

}

// ================================
// Generate PlayIMDb URL
// ================================

function generateLink(){

    const imdbID = getImdbID(input.value.trim());

    if(!imdbID){

        alert("Invalid IMDb URL.");

        return;

    }

    currentPlayUrl =
        `https://playimdb.com/title/${imdbID}/`;

    generatedLink.value =
        currentPlayUrl;

    loadMovie(imdbID);

    saveRecent(imdbID);

}

// ================================
// Watch
// ================================

watchBtn.addEventListener("click", () => {

    if (!currentPlayUrl)
        return;

    window.open(currentPlayUrl, "_blank");

});

// ================================
// Copy
// ================================

copyBtn.addEventListener("click", async () => {

    if (!currentPlayUrl)
        return;

    await navigator.clipboard.writeText(currentPlayUrl);

    copyBtn.innerHTML =
        '<i class="fa-solid fa-check"></i> Copied!';

    setTimeout(() => {

        copyBtn.innerHTML =
            '<i class="fa-regular fa-copy"></i> Copy Link';

    }, 2000);

});

// ================================
// Favorite
// ================================

favoriteBtn.addEventListener("click", () => {

    if (!currentPlayUrl)
        return;

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(currentPlayUrl)) {

        favorites.push(currentPlayUrl);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        favoriteBtn.innerHTML =
            '<i class="fa-solid fa-star"></i> Saved';

    } else {

        favoriteBtn.innerHTML =
            '<i class="fa-solid fa-star"></i> Already Saved';

    }

});



// ================================
// Recent Movies
// ================================

function saveRecent(id) {

    let recent =
        JSON.parse(localStorage.getItem("recentMovies")) || [];

    recent = recent.filter(x => x !== id);

    recent.unshift(id);

    recent = recent.slice(0, 10);

    localStorage.setItem(
        "recentMovies",
        JSON.stringify(recent)
    );

    loadRecent();

}

function loadRecent() {

    let recent =
        JSON.parse(localStorage.getItem("recentMovies")) || [];

    recentList.innerHTML = "";

    if (recent.length === 0) {

        recentList.innerHTML =
            "<li>No recent movies.</li>";

        return;
    }

    recent.forEach(id => {

        const li = document.createElement("li");

        li.innerHTML =
            `<i class="fa-solid fa-film"></i> ${id}`;

        li.onclick = () => {

            input.value =
                `https://www.imdb.com/title/${id}/`;

            generateLink();

        };

        recentList.appendChild(li);

    });

}

// ================================
// Events
// ================================

generateBtn.addEventListener("click", generateLink);

input.addEventListener("keydown", e => {

    if (e.key === "Enter")
        generateLink();

});

// Auto-generate after paste
input.addEventListener("paste", () => {

    setTimeout(generateLink, 100);

});

// ================================
// Init
// ================================

loadRecent();