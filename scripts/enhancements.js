"use strict";

// NAVIGATION ANIMATION
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");

  // Function to remove active class from all links
  const removeActiveClass = function () {
    navLinks.forEach((link) => link.classList.remove("nav-link--active"));
  };

  // Function to handle link click event
  const handleClick = (e) => {
    e.preventDefault();
    console.log(e);
    console.log(e.currentTarget);
    removeActiveClass();
    e.currentTarget.classList.add("nav-link--active");
  };

  // Listen to each navigation link
  navLinks.forEach((link) => link.addEventListener("click", handleClick));
});
