const { getDogData, generateInitialCard } = require("./modules/cardGenerator");
const { generateCard } = require("./modules/cardGenerator");
const { dogData } = require("./findMatch");

const like = document.querySelector(".like");
const dislike = document.querySelector(".dislike");
const toggleSettings = document.querySelector(".toggle-settings");
let card = document.querySelector(".card.current");
let bio = document.querySelector(".bio.current");
let cardStylingLeft = 0;
let cardStylingTop = 0;
let cardRotationDeg = 0;
let isBeingLiked = false;
let isBeingDisliked = false;
let likeOrDislikeButtonWasClicked = false;
let bioArticles = document.querySelectorAll(".bio article");
const bioButton = document.querySelector("button.toggle-bio");
let newX = 0,
  newY = 0,
  startX = 0,
  startY = 0;

card.addEventListener("mousedown", mouseDown);

function mouseDown(e) {
  like.classList.toggle("scale-down");
  dislike.classList.toggle("scale-down");
  toggleSettings.classList.toggle("scale-down");
  bioButton.classList.toggle("scale-down");

  startX = e.clientX;
  startY = e.clientY;

  document.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", moveCard);
}

function mouseMove(e) {
  newX = startX - e.clientX;
  newY = startY - e.clientY;

  startX = e.clientX;
  startY = e.clientY;

  cardStylingLeft = card.offsetLeft - newX;
  cardStylingTop = card.offsetTop - newY;

  cardCenterX = card.getBoundingClientRect().left + card.offsetWidth / 2;
  windowCenterX = window.innerWidth / 2;
  cardRotationDeg = (windowCenterX - cardCenterX) / 30;

  card.style.left = card.offsetLeft - newX + "px";
  card.style.top = card.offsetTop - newY + "px";
  card.style.transform = `rotate(${cardRotationDeg}deg)`;
  // Dog is being disliked.
  if (windowCenterX - cardCenterX > 200) {
    isBeingDisliked = true;
    if (dislike.classList.contains("scale-down"))
      dislike.classList.toggle("scale-down");
  }

  // Dog is being liked.
  else if (windowCenterX - cardCenterX < -100) {
    isBeingLiked = true;
    if (like.classList.contains("scale-down"))
      like.classList.toggle("scale-down");
  }
  // Dog is being neither liked nor disliked.
  else {
    isBeingLiked = false;
    isBeingDisliked = false;
    if (!dislike.classList.contains("scale-down"))
      dislike.classList.toggle("scale-down");
    if (!like.classList.contains("scale-down"))
      like.classList.toggle("scale-down");
  }
}

function moveCard() {
  document
    .querySelector(".card.current")
    .removeEventListener("mousedown", mouseDown);
  document.removeEventListener("mousemove", mouseMove);
  document.removeEventListener("mouseup", moveCard);
  if (like.classList.contains("scale-down"))
    like.classList.toggle("scale-down");
  if (dislike.classList.contains("scale-down"))
    dislike.classList.toggle("scale-down");
  if (toggleSettings.classList.contains("scale-down"))
    toggleSettings.classList.toggle("scale-down");
  if (bioButton.classList.toggle("scale-down"))
    bioButton.classList.toggle("scale-down");
  let duration = 900; // Milliseconds.
  let currentX = cardStylingLeft;
  let currentY = cardStylingTop;
  let distanceX;
  let distanceY;
  let currentRotationDeg = cardRotationDeg;
  let distanceRotationDeg;
  let startTime = null;
  const card = document.querySelector(".card.current");
  if (isBeingLiked) {
    distanceX =
      window.innerWidth / 2 + card.offsetWidth / 2 - currentX / 2 + 200;
    distanceRotationDeg = likeOrDislikeButtonWasClicked ? 30 : 0;
    window.requestAnimationFrame(moveCardOutOfView);
    resetCardValues();
    initNewCard();
  } else if (isBeingDisliked) {
    distanceX =
      -window.innerWidth / 2 - card.offsetWidth / 2 - currentX / 2 - 200;
    console.log(likeOrDislikeButtonWasClicked);
    distanceRotationDeg = likeOrDislikeButtonWasClicked ? -30 : 0;
    window.requestAnimationFrame(moveCardOutOfView);
    resetCardValues();
    initNewCard();
  } else {
    duration = 500;
    distanceX = cardStylingLeft * -1;
    distanceY = cardStylingTop * -1;
    distanceRotationDeg = cardRotationDeg * -1;
    window.requestAnimationFrame(moveCardToInitialPos);
  }
  function moveCardOutOfView(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsedTime = currentTime - startTime;
    const leftPos = easeOutQuint(elapsedTime, currentX, distanceX, duration);
    const rotDeg = easeOutQuintCard(
      elapsedTime,
      currentRotationDeg,
      distanceRotationDeg,
      duration
    );
    card.style.left = leftPos + "px";
    card.style.transform = `rotate(${rotDeg}deg)`;
    if (elapsedTime < duration)
      animationFrameId = window.requestAnimationFrame(moveCardOutOfView);
  }
  function moveCardToInitialPos(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsedTime = currentTime - startTime;
    const leftPos = easeOutBack(elapsedTime, currentX, distanceX, duration);
    const topPos = easeOutBack(elapsedTime, currentY, distanceY, duration);
    const rotDeg = easeOutQuintCard(
      elapsedTime,
      currentRotationDeg,
      distanceRotationDeg,
      duration
    );
    card.style.left = leftPos + "px";
    card.style.top = topPos + "px";
    card.style.transform = `rotate(${rotDeg}deg)`;
    if (elapsedTime < duration)
      window.requestAnimationFrame(moveCardToInitialPos);
    else {
      resetCardValues();
      card.addEventListener("mousedown", mouseDown);
    }
  }
}

async function initNewCard() {
  // Remove the front card.
  card.classList.remove("current");
  bio.classList.remove("current");
  card.classList.add("being-removed");
  bio.classList.add("being-removed");

  setTimeout(() => {
    document.querySelector(".card.being-removed").remove();
    document.querySelector(".bio.being-removed").remove();
  }, 700);

  // Move the card that was behind the front card forward.
  let cardBehind = document.querySelector(".card.behind");
  let bioBehind = document.querySelector(".bio.behind");
  cardBehind.classList.remove("behind");
  bioBehind.classList.remove("behind");
  cardBehind.classList.add("current");
  bioBehind.classList.add("current");

  // Hook up the new card and bio.
  card = cardBehind;
  bio = bioBehind;
  bioArticles = document.querySelectorAll(".bio.current article");
  card.addEventListener("mousedown", mouseDown);

  // Generate a new card that gets put behind the front card.
  await generateCard(dogData[0]);
  dogData.splice(0, 1);
}

bioButton.addEventListener("click", toggleBio);

function toggleBio() {
  disableBioButton();
  rotateBioButton();
  displayBio(); // This function call toggles the class "opened" on the bioButton.
  disableSwipe();
  changeCardStylingPosition();
  scrollPage();
  setTimeout(() => {
    bioButton.addEventListener("click", toggleBio);
    enableSwipe();
  }, 730);
}

like.addEventListener("click", () => {
  let timeOutDuration = 730;
  bioButton.classList.contains("opened") ? toggleBio() : (timeOutDuration = 0);
  setTimeout(() => {
    isBeingLiked = true;
    isBeingDisliked = false;
    likeOrDislikeButtonWasClicked = true;
    moveCard();
  }, timeOutDuration);
});

dislike.addEventListener("click", () => {
  let timeOutDuration = 730;
  bioButton.classList.contains("opened") ? toggleBio() : (timeOutDuration = 0);
  setTimeout(() => {
    isBeingDisliked = true;
    isBeingLiked = false;
    likeOrDislikeButtonWasClicked = true;
    moveCard();
  }, timeOutDuration);
});

function resetCardValues() {
  cardStylingLeft = 0;
  cardStylingTop = 0;
  cardRotationDeg = 0;
  isBeingLiked = false;
  isBeingDisliked = false;
  likeOrDislikeButtonWasClicked = false;
}

function disableBioButton() {
  bioButton.removeEventListener("click", toggleBio);
}

function rotateBioButton() {
  // true => open animation, false => close animation
  const animation = !bioButton.classList.contains("opened")
    ? "toggle-bio-button-open-animation"
    : "toggle-bio-button-close-animation";

  bioButton.querySelector(
    "img"
  ).style.animation = `0.4s ease forwards ${animation}`;
}

function disableSwipe() {
  card.removeEventListener("mousedown", mouseDown);
}

function enableSwipe() {
  if (!bioButton.classList.contains("opened"))
    card.addEventListener("mousedown", mouseDown);
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

function changeCardStylingPosition() {
  if (bioButton.classList.contains("opened")) {
    card.style.position = "relative";
  } else {
    setTimeout(() => (card.style.position = "absolute"), 730);
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

function easeOutQuintCard(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
}

function easeOutBack(t, b, c, d) {
  let s = 1.2;
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}
