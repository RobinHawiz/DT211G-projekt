const { getDogData, generateInitialCard } = require("./modules/cardGenerator");
const { generateCard } = require("./modules/cardGenerator");
const { dogData } = require("./findMatch");

const likeDislikePanel = document.querySelector(".like-dislike-panel");
let bio = document.querySelector(".bio");
let bioArticles = document.querySelectorAll(".bio article");
const bioButton = document.querySelector("button.toggle-bio");
const likeButton = document.querySelector("button.like");

likeButton.addEventListener("click", async () => {
  // Remove the front card.
  document.querySelector(".card").remove();
  document.querySelector(".bio").remove();
  // Move the card that was behind the front card forward.
  document.querySelector(".card").classList.remove("behind");
  document.querySelector(".bio").classList.remove("behind");

  // Hook up the new bio.
  bio = document.querySelector(".bio");
  bioArticles = document.querySelectorAll(".bio article");

  // Generate a new card that gets put behind the front card.
  await generateCard(dogData[0]);
  dogData.splice(0, 1);
});

bioButton.addEventListener("click", () => {
  rotateBioButton();
  displayBio();
  repositionPanel();
  scrollPage();
});

function rotateBioButton() {
  // true => open animation, false => close animation
  const animation = !bioButton.classList.contains("opened")
    ? "toggle-bio-button-open-animation"
    : "toggle-bio-button-close-animation";

  bioButton.querySelector(
    "img"
  ).style.animation = `0.4s ease forwards ${animation}`;
}

function displayBio() {
  !bioButton.classList.contains("opened") ? showBio() : hideBio();
  bioButton.classList.toggle("opened");
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
  if (bioButton.classList.contains("opened")) {
    likeDislikePanel.style.bottom = `${bio.offsetHeight}px`;
  } else {
    setTimeout(() => (likeDislikePanel.style.bottom = 0), 730);
  }
}

function scrollPage() {
  // Scroll to the bio element that opened
  if (bioButton.classList.contains("opened")) {
    const elemPosition = bio.getBoundingClientRect().top;
    const scrollPosition = window.scrollY;
    const scrollLimit =
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) - window.innerHeight;
    let distance =
      elemPosition > scrollLimit - scrollPosition
        ? scrollLimit - scrollPosition
        : elemPosition;

    const duration = 700;
    let startTime = null;
    function scrollToElem(currentTime) {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const yCoordinate = easeOutQuint(
        elapsedTime,
        scrollPosition,
        distance,
        duration
      );
      window.scrollTo(0, yCoordinate);
      if (elapsedTime < duration) window.requestAnimationFrame(scrollToElem);
    }
    window.requestAnimationFrame(scrollToElem);
  }
  // Scroll to the top of the page
  else {
    function scrollToTop() {
      let bodyScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      window.scrollTo(0, bodyScrollTop - bodyScrollTop / 6 - 0.5);
      if (bodyScrollTop > 0) window.requestAnimationFrame(scrollToTop);
    }
    window.requestAnimationFrame(scrollToTop);
  }
}

/*
Got this function from: https://spicyyoghurt.com/tools/easing-functions
t = Time - Amount of time that has passed since the beginning of the animation. Usually starts at 0 and is slowly increased using a game loop or other update function.
b = Beginning value - The starting point of the animation. In my case it'll be the window.scrollY position.
c = Change in value - The amount of change needed to go from starting point to end point. In my case it'll be the distance between the target element and the window.scrollY position.
d = Duration - Amount of time the animation will take. 
*/
function easeOutQuint(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t * t * t + 1) + b + 2;
}
