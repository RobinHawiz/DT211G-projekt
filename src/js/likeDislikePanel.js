const { Root } = require("postcss");

const header = document.querySelector("header");
const likeDislikePanel = document.querySelector(".like-dislike-panel");
const bio = document.querySelector(".bio");
const bioArticles = document.querySelectorAll(".bio article");
const toggleBioButton = document.querySelector(".toggle-bio");

toggleBioButton.addEventListener("click", () => {
  rotateToggleBioButton();
  displayBio();
  repositionPanel();
  let bioDOMRect = bio.getBoundingClientRect();
  let bioDistanceToTop = window.scrollY + bioDOMRect.top;
  // Determines initial scroll speed. The smaller the value, the greater the speed.
  // If true, value will be set for the desktop version of the webb app, otherwise set value for the mobile version.
  let stepDenominator =
    window.innerWidth > 534
      ? bioDistanceToTop / 37.3
      : bioDistanceToTop / 27 - 7000 / window.innerHeight;
  // Determines how quickly the scroll speed tapers off. The smaller the value, the faster it slows down.
  // If true, value will be set for the desktop version of the webb app, otherwise set value for the mobile version.
  let diffDenominator =
    window.innerWidth > 534 ? bioDistanceToTop / 86.9 : bioDistanceToTop / 86.9;

  scrollToElem(bioDOMRect, stepDenominator, diffDenominator, bioDistanceToTop);
});

function rotateToggleBioButton() {
  // true => open animation, false => close animation
  const animation = !toggleBioButton.classList.contains("opened")
    ? "toggle-bio-button-open-animation"
    : "toggle-bio-button-close-animation";

  toggleBioButton.querySelector(
    "img"
  ).style.animation = `0.4s ease forwards ${animation}`;
}

function displayBio() {
  !toggleBioButton.classList.contains("opened") ? showBio() : hideBio();
  toggleBioButton.classList.toggle("opened");
  bioArticles.forEach((bioArticle) => {
    bioArticle.classList.toggle("bio-in-animation");
  });
}

function showBio() {
  bio.style.display = "flex";
}

function hideBio() {
  setTimeout(() => (bio.style.display = "none"), 730);
}

function repositionPanel() {
  if (toggleBioButton.classList.contains("opened")) {
    likeDislikePanel.style.bottom = `${bio.offsetHeight}px`;
  } else {
    setTimeout(() => (likeDislikePanel.style.bottom = 0), 730);
  }
}

function scrollToElem(
  bioDOMRect,
  stepDenominator,
  diffDenominator,
  bioDistanceToTop
) {
  let isScrolledToBottom =
    window.scrollY + window.innerHeight >= document.body.scrollHeight;
  let rootScrollTopVal =
    document.documentElement.scrollTop || document.body.scrollTop;
  // Scroll to the bio element that opened
  if (toggleBioButton.classList.contains("opened")) {
    if (bioDOMRect.top - rootScrollTopVal > 0 && !isScrolledToBottom) {
      let yCoordinate = Math.ceil(
        rootScrollTopVal + bioDistanceToTop / stepDenominator
      );
      bioDistanceToTop -= bioDistanceToTop / diffDenominator;
      window.scrollTo(0, yCoordinate);

      window.requestAnimationFrame(() => {
        scrollToElem(
          bioDOMRect,
          stepDenominator,
          diffDenominator,
          bioDistanceToTop
        );
      });
    }
  }
  // Scroll to the top of the page
  else {
    if (rootScrollTopVal > 0) {
      window.scrollTo(0, rootScrollTopVal - rootScrollTopVal / 9);
      window.requestAnimationFrame(scrollToElem);
    }
  }
}
