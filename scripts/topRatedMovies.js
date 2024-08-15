"use strict";

const searchQuery = "harry potter";
let searchResults = [];
let currentDisplayedCount = 0;
const moviesPerLine = 4;

const btnShowMore = document.querySelector(".btn-show-more");
const cardsContainer = document.querySelector(".cards-container");

document.addEventListener("DOMContentLoaded", () => {
  loadTopRatedMovies();
});

const loadTopRatedMovies = async () => {
  try {
    const res = await fetch(
      `${API_URL}?apikey=${KEY}&s=${searchQuery}&plot=short`
    );
    const data = await res.json();
    searchResults = data.Search;
    console.log(searchResults);
    displayTopRatedMovies();
  } catch (err) {
    console.error(err);
  }
};

const fetchMovieDetails = async (movieID) => {
  try {
    const res = await fetch(`${API_URL}?apikey=${KEY}&i=${movieID}&plot=short`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    '<i class="fa-solid fa-star star"></i>'.repeat(fullStars) +
    '<i class="fa-solid fa-star-half-alt star"></i>'.repeat(halfStar) +
    '<i class="fa-regular fa-star star"></i>'.repeat(emptyStars)
  );
};

const generateMovieHTML = (movie) => {
  const moviePoster = movie.Poster !== "N/A" ? movie.Poster : "images/logo.png";
  let shortDescription = movie.Plot.split(" ").slice(0, 8).join(" ");
  if (movie.Plot.split(" ").length > 8) {
    shortDescription += " ...";
  }

  const imdbRating = parseFloat(movie.imdbRating) || 0;
  const ratingOutOfFive = imdbRating / 2;

  return `
    <a class="movie-link movie-link-col" href="movie-details.html" data-movie-id="${
      movie.imdbID
    }">
      <div class="card">
        <img class="movie-img" src="${moviePoster}" alt="${movie.Title}" />
        <div class="card-content">
          <h4 class="movie-title movie-heading">${movie.Title}</h4>
          <div class="rating">
            ${generateStars(ratingOutOfFive)}
          </div>
          <p class="date-release">${movie.Year}</p>
          <p class="desc-short">${shortDescription}</p>
          <div class="label-rating">${imdbRating.toFixed(1)}</div>
        </div>
      </div>
    </a>
  `;
};

const displayTopRatedMovies = async () => {
  const end = currentDisplayedCount + moviesPerLine;
  const moviesToDisplay = searchResults.slice(currentDisplayedCount, end);

  const movieDetailsPromises = moviesToDisplay.map((movie) =>
    fetchMovieDetails(movie.imdbID)
  );

  try {
    const movieDetails = await Promise.all(movieDetailsPromises);

    movieDetails.forEach((movie) => {
      if (movie) {
        const movieHTML = generateMovieHTML(movie);
        cardsContainer.insertAdjacentHTML("beforeend", movieHTML);
      }
    });

    currentDisplayedCount += moviesPerLine;

    if (currentDisplayedCount >= searchResults.length) {
      btnShowMore.style.display = "none";
    }

    // Add event listeners to each movie card link
    const movieLinks = document.querySelectorAll(".movie-link");
    movieLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const movieID = link.dataset.movieId;
        const selectedMovie = movieDetails.find(
          (movie) => movie.imdbID === movieID
        );
        if (selectedMovie) {
          sessionStorage.setItem(
            "selectedMovie",
            JSON.stringify(selectedMovie)
          );
          window.location.href = "movie-details.html";
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};

btnShowMore.addEventListener("click", displayTopRatedMovies);
