const header = document.querySelector("header");
const likeDislikePanel = document.querySelector(".like-dislike-panel");
const bio = document.querySelector(".bio");
const bioArticles = document.querySelectorAll(".bio article");
const toggleBioButton = document.querySelector(".toggle-bio");

toggleBioButton.addEventListener("click", () => {
  rotateToggleBioButton();
  displayBio();
  repositionPanel();
  scrollPage();
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

function scrollPage() {
  // Scroll to the bio element that opened
  if (toggleBioButton.classList.contains("opened")) {
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
