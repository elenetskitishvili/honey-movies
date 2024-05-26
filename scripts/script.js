"use strict";

const KEY = "4c17820f";
const API_URL = "http://www.omdbapi.com/";
const searchInput = document.getElementById("search");
const movieList = document.getElementById("movie-list");

const state = {
  search: {
    query: "",
    results: [],
  },
};

// Wait for the DOM to fully load,
document.addEventListener("DOMContentLoaded", () => {
  searchInput.value = "";
});

// When we submit the input field, query is got and loadSearchResults function is called to fetch the data
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = getQuery();
    loadSearchResults(query);
  }
});

/////////////////////////////////////////////////////////////////
// Event listeners for movie list to manage the focus and click states:

// We check whether the movie link is clicked or not.
let isMovieLinkClicked = false;
movieList.addEventListener("mousedown", (e) => {
  if (e.target.closest("a.movie-link")) {
    isMovieLinkClicked = true;
  }
});
movieList.addEventListener("mouseup", () => {
  isMovieLinkClicked = false;
});

// Clear the movie list when the input field loses focus and no movie link is clicked
searchInput.addEventListener("focusout", () => {
  if (!isMovieLinkClicked) {
    movieList.innerHTML = "";
  }
});

// Clear the search input field and results when the page is hidden or unloaded
window.addEventListener("pagehide", () => {
  searchInput.value = "";
  movieList.innerHTML = "";
});

//////////////////////////////////////////////////////////
// Function to get the query from the input field
const getQuery = () => searchInput.value;

// Function to load search results based on the query and calls a Function to display search results
const loadSearchResults = async (query) => {
  try {
    if (!query) {
      movieList.innerHTML = "";
      return;
    }

    state.search.query = query;
    const res = await fetch(`${API_URL}?apikey=${KEY}&s=${query}`);
    const data = await res.json();
    state.search.results = data.Search || [];
    displaySearchResults(state.search.results);
  } catch (err) {
    console.error(err);
  }
};

// Function to display search results and to store the clicked movie into the session storage.
const displaySearchResults = (results) => {
  movieList.innerHTML = "";

  if (results.length === 0) {
    movieList.insertAdjacentHTML(
      "beforeend",
      `<p class="no-results-message">No results found.</p>`
    );
    return;
  }

  results.forEach((movie) => {
    const movieItemHTML = `
      <li class="movie-item">
        <a class="movie-link" href="movie-details.html" target="_blank" data-movie-id="${movie.imdbID}">
          <img src="${movie.Poster}" alt="${movie.Title}" />
          <span class="movie-title">${movie.Title}</span>
        </a>
      </li>
    `;
    movieList.insertAdjacentHTML("beforeend", movieItemHTML);

    const movieLink = movieList.querySelector(
      `a[data-movie-id="${movie.imdbID}"]`
    );
    movieLink.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.setItem("selectedMovie", JSON.stringify(movie));
      window.location.href = "movie-details.html";
    });
  });
};
