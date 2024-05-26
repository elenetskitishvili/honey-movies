"use strict";

const KEY = "4c17820f";
const API_URL = "http://www.omdbapi.com/";

const state = {
  search: {
    movieId: "",
    result: {},
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const selectedMovie = JSON.parse(sessionStorage.getItem("selectedMovie"));
  if (!selectedMovie) {
    console.error("No movie details found in sessionStorage.");
    return;
  }
  state.search.movieId = selectedMovie.imdbID;

  loadMovieDetails();
});

const loadMovieDetails = async () => {
  try {
    const response = await fetch(
      `${API_URL}?apikey=${KEY}&i=${state.search.movieId}&plot=full`
    );
    const data = await response.json();
    state.search.result = data;

    displayMovie();
  } catch (error) {
    console.error(error);
  }
};

const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return `
    ${'<i class="fa-solid fa-star star"></i>'.repeat(fullStars)}
    ${'<i class="fa-solid fa-star-half-alt star"></i>'.repeat(halfStar)}
    ${'<i class="fa-regular fa-star star"></i>'.repeat(emptyStars)}
  `;
};

const createMovieHTML = (movie) => {
  const imdbRating = parseFloat(movie.imdbRating) || 0;
  const ratingOutOfFive = imdbRating / 2;

  return `
    <div class="movie-details">
      <div class="movie-description">
        <a class="back-home" href="index.html">
          <span><i class="fa-solid fa-angle-left"></i></span>
          <span>Back home</span>
        </a>
        <h1 class="title">${movie.Title}</h1>
        <div class="rating-stars">
          ${generateStars(ratingOutOfFive)}
        </div>
        <i class="fa-brands fa-imdb imdb-logo"></i>
        <div class="description-text">
          <div class="released-sec">
            <span class="desc-key pad-r"><strong>Released: </strong></span>
            <span class="released-time">${movie.Released ?? "N/A"}</span>
          </div>
          <div class="genre-sec">
            <span class="desc-key pad-r"><strong>Genre:</strong></span>
            <span class="movie-genre">${movie.Genre ?? "N/A"}</span>
          </div>
          <div class="plot-sec">
            <span class="desc-key pad-r"><strong>Plot:</strong></span>
            <span class="movie-plot">${movie.Plot ?? "N/A"}</span>
          </div>
          <div class="btns-details">
          <button class="btn btn-transparent btn-details">
                + Watchlist
              </button>
              <button class="btn btn-cta btn-details">Watch Now</button>
              </div>
        </div>
      </div>
      <div class="movie-poster">
        <img src="${movie.Poster}" alt="${movie.Title}" />
      </div>
    </div>
  `;
};

const displayMovie = () => {
  const movieSection = document.querySelector(".section-movie-details");
  const selectedMovie = state.search.result;

  movieSection.innerHTML = createMovieHTML(selectedMovie);
  updateBackgroundImage(selectedMovie.Poster);
};

const updateBackgroundImage = (posterUrl) => {
  const backgroundPoster = document.getElementById("backgroundPoster");
  if (posterUrl !== "N/A") {
    backgroundPoster.src = posterUrl;
    document.body.style.backgroundImage = `url(${posterUrl})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
  } else {
    backgroundPoster.src = "";
    document.body.style.backgroundImage = "";
  }
};
