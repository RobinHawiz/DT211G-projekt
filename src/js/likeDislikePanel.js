const {
  generateCard,
  generateInitialCard,
} = require("./modules/cardGenerator");
const { dogData } = require("./findMatch");

let dogDataTemp = dogData;
const like = document.querySelector(".like");
const dislike = document.querySelector(".dislike");
const toggleSettings = document.querySelector(".toggle-settings");
let card = document.querySelector(".card.current");
let bio = document.querySelector(".bio.current");
let index = 2; // The two first elements are already being displayed from the dogData array, so we start at the third element.
let newCardXCoord = 0;
let newCardYCoord = 0;
let cardRotationDeg = 0;
let isBeingLiked = false;
let isBeingDisliked = false;
let likeOrDislikeButtonWasClicked = false;
let areFiltersToggled = false;
let isMobileDevice = userDeviceIsMobile();
let bioArticles = document.querySelectorAll(".bio article");
const bioButton = document.querySelector("button.toggle-bio");
let deltaX = 0,
  deltaY = 0,
  startX = 0,
  startY = 0;
let windowCenterX;
let cardCenterX;
let debounceTimeout;
const debounceDelay = isMobileDevice ? 5 : 0; // Wait 10ms before calling the function if a mobile device is being used.
const filtersWrapper = document.querySelector(".filters-wrapper");
const filters = document.querySelector(".filters");
const filtersContainers = document.querySelectorAll(".filters .container");
const breedGroupsLabels = document.querySelectorAll("ul.breed-groups label");

toggleSettings.addEventListener("click", toggleFilters);

filtersContainers.forEach((container) => {
  container.addEventListener("click", toggleSelected);
});

// This is done because the filters are being hidden from showing in the beginning. When the filters are out of view, then we apply opacity 1.
setTimeout(() => {
  filters.style.opacity = 1;
}, 300);

function toggleFilters() {
  if (areFiltersToggled) {
    showFilteredCards();
    document.querySelector(".body-find-match").style.overflow = "hidden";
  } else {
    document.querySelector(".body-find-match").style.overflow = "visible";
  }
  areFiltersToggled = areFiltersToggled ? false : true;
  filtersWrapper.classList.toggle("show");
  filters.classList.toggle("show");
}

function showFilteredCards() {
  if (!(dogDataTemp.length === 0)) {
    // Remove cards and bios.
    const currentCard = document.querySelector(".card.current");
    const currentBio = document.querySelector(".bio.current");

    currentCard.innerHTML = "";
    currentBio.innerHTML = "";

    const behindCard = document.querySelector(".card.behind");
    const behindBio = document.querySelector(".bio.behind");

    behindCard.remove();
    behindBio.remove();
  }

  dogDataTemp = dogData;

  // Create a new array with the requested dog groups to pull data from.

  let selectedDogGroups = [];

  breedGroupsLabels.forEach((label) => {
    if (label.classList.contains("selected"))
      selectedDogGroups.push(label.innerText);
  });
  dogDataTemp = dogDataTemp.filter((dog) =>
    selectedDogGroups.includes(dog.group)
  );

  if (!(dogDataTemp.length === 0)) {
    index = 0;
    generateInitialCard(dogDataTemp[index++]);
    generateCard(dogDataTemp[index++]);
    bioArticles = document.querySelectorAll(".bio.current article");
    enableAll();
  } else {
    disableAll();
  }
}

function toggleSelected(e) {
  e.target.classList.toggle("selected");
}

isMobileDevice
  ? card.addEventListener("touchstart", mouseDownOrTouchStart)
  : card.addEventListener("mousedown", mouseDownOrTouchStart);

function mouseDownOrTouchStart(e) {
  e.preventDefault(); // (For mobile) Disables: zooming with two fingers, pull down to refreshing the page, click events, etc.
  like.classList.toggle("scale-down");
  dislike.classList.toggle("scale-down");
  toggleSettings.classList.toggle("scale-down");
  bioButton.classList.toggle("scale-down");

  const touch = isMobileDevice ? e.targetTouches[0] : e;

  startX = touch.clientX;
  startY = touch.clientY;

  if (isMobileDevice) {
    document.addEventListener("touchmove", mouseMoveOrTouchMove);
    document.addEventListener("touchend", moveCard);
  } else {
    document.addEventListener("mousemove", mouseMoveOrTouchMove);
    document.addEventListener("mouseup", moveCard);
  }
}

function mouseMoveOrTouchMove(e) {
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    const touch = isMobileDevice ? e.targetTouches[0] : e;

    deltaX = touch.clientX - startX;
    deltaY = touch.clientY - startY;

    startX = touch.clientX;
    startY = touch.clientY;

    newCardXCoord += deltaX;
    newCardYCoord += deltaY;

    cardCenterX = card.getBoundingClientRect().left + card.offsetWidth / 2;
    windowCenterX = window.innerWidth / 2;
    cardRotationDeg = (windowCenterX - cardCenterX) / 30;

    reqAnimFrameId = requestAnimationFrame(() => {
      // We use translate3d because then the rendering will be done by the GPU, which is much faster and more efficient than using the CPU.
      card.style.transform = `translate3d(${newCardXCoord}px, ${newCardYCoord}px, 0) rotate(${cardRotationDeg}deg)`;
      changelikeDislikeIconOpacity();
    });
  }, debounceDelay);

  displayLikeOrDislikePanelButtons();
}

function displayLikeOrDislikePanelButtons() {
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

function changelikeDislikeIconOpacity() {
  const likeIcon = document.querySelector(".card.current .like-icon");
  const dislikeIcon = document.querySelector(".card.current .dislike-icon");

  cardCenterX = card.getBoundingClientRect().left + card.offsetWidth / 2;
  windowCenterX = window.innerWidth / 2;

  let dislikeIconOpacity = (windowCenterX - cardCenterX - 100) / 100;
  let likeIconOpacity = (cardCenterX - windowCenterX - 15) / 100;

  dislikeIcon.style.opacity =
    dislikeIconOpacity > 0.04 ? dislikeIconOpacity : 0;
  likeIcon.style.opacity = likeIconOpacity > 0.04 ? likeIconOpacity : 0;
}

async function moveCard() {
  clearTimeout(debounceTimeout); // Clear debounce timeout to avoid an additional function call after releasing the card.
  let cardBeingMoved = document.querySelector(".card.current");
  if (isMobileDevice) {
    cardBeingMoved.removeEventListener("touchstart", mouseDownOrTouchStart);
    document.removeEventListener("touchmove", mouseMoveOrTouchMove);
    document.removeEventListener("touchend", moveCard);
  } else {
    cardBeingMoved.removeEventListener("mousedown", mouseDownOrTouchStart);
    document.removeEventListener("mousemove", mouseMoveOrTouchMove);
    document.removeEventListener("mouseup", moveCard);
  }

  if (like.classList.contains("scale-down"))
    like.classList.toggle("scale-down");
  if (dislike.classList.contains("scale-down"))
    dislike.classList.toggle("scale-down");
  if (toggleSettings.classList.contains("scale-down"))
    toggleSettings.classList.toggle("scale-down");
  if (bioButton.classList.toggle("scale-down"))
    bioButton.classList.toggle("scale-down");
  let duration = 900; // Milliseconds.
  let currentX = newCardXCoord;
  let currentY = newCardYCoord;
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
    distanceRotationDeg = likeOrDislikeButtonWasClicked ? -30 : 0;
    window.requestAnimationFrame(moveCardOutOfView);
    resetCardValues();
    initNewCard();
  } else {
    duration = 500;
    distanceX = newCardXCoord * -1;
    distanceY = newCardYCoord * -1;
    distanceRotationDeg = cardRotationDeg * -1;
    window.requestAnimationFrame(moveCardToInitialPos);
  }
  function moveCardOutOfView(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsedTime = currentTime - startTime;
    const xCoord = easeOutQuint(elapsedTime, currentX, distanceX, duration);
    const rotDeg = easeOutQuintCard(
      elapsedTime,
      currentRotationDeg,
      distanceRotationDeg,
      duration
    );
    // We only change card x coordinates and its rotation.
    card.style.transform = `translate3d(${xCoord}px, ${currentY}px, 0) rotate(${rotDeg}deg)`;
    changelikeDislikeIconOpacity();
    if (elapsedTime < duration)
      animationFrameId = window.requestAnimationFrame(moveCardOutOfView);
  }
  function moveCardToInitialPos(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsedTime = currentTime - startTime;
    const xCoord = easeOutBack(elapsedTime, currentX, distanceX, duration);
    const yCoord = easeOutBack(elapsedTime, currentY, distanceY, duration);
    const rotDeg = easeOutQuintCard(
      elapsedTime,
      currentRotationDeg,
      distanceRotationDeg,
      duration
    );
    card.style.transform = `translate3d(${xCoord}px, ${yCoord}px, 0) rotate(${rotDeg}deg)`;
    changelikeDislikeIconOpacity();
    if (elapsedTime < duration)
      window.requestAnimationFrame(moveCardToInitialPos);
    else {
      resetCardValues();
      isMobileDevice
        ? card.addEventListener("touchstart", mouseDownOrTouchStart)
        : card.addEventListener("mousedown", mouseDownOrTouchStart);
    }
  }
}

function initNewCard() {
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
  isMobileDevice
    ? card.addEventListener("touchstart", mouseDownOrTouchStart)
    : card.addEventListener("mousedown", mouseDownOrTouchStart);

  // If we run out of cards, set index back to the start of the dogDataTemp array.
  if (index === dogDataTemp.length) index = 0;

  // Generate a new card that gets put behind the front card.
  generateCard(dogDataTemp[index++]);
}

bioButton.addEventListener("click", toggleBio);

function toggleBio() {
  if (!areFiltersToggled) {
    disableBioButton();
    rotateBioButton();
    displayBio(); // This function call toggles the class "opened" on the bioButton.
    document.querySelector(".body-find-match").style.overflow = "visible";
    disableSwipe();
    disableFilters();
    changeCardStylingPosition();
    scrollPage();
    setTimeout(() => {
      enableBioButton();
      if (!bioButton.classList.contains("opened")) {
        document.querySelector(".body-find-match").style.overflow = "hidden";
        enableSwipe();
        enableFilters();
      }
    }, 730);
  }
}

like.addEventListener("click", likeCard);

dislike.addEventListener("click", dislikeCard);

function likeCard() {
  if (!areFiltersToggled) {
    let timeOutDuration = 730;
    bioButton.classList.contains("opened")
      ? toggleBio()
      : (timeOutDuration = 0);
    setTimeout(() => {
      isBeingLiked = true;
      isBeingDisliked = false;
      likeOrDislikeButtonWasClicked = true;
      moveCard();
    }, timeOutDuration);
  }
}

function dislikeCard() {
  if (!areFiltersToggled) {
    let timeOutDuration = 730;
    bioButton.classList.contains("opened")
      ? toggleBio()
      : (timeOutDuration = 0);
    setTimeout(() => {
      isBeingDisliked = true;
      isBeingLiked = false;
      likeOrDislikeButtonWasClicked = true;
      moveCard();
    }, timeOutDuration);
  }
}

function disableAll() {
  disableSwipe();
  disableBioButton();
  disableLike();
  disableDislike();
}

function enableAll() {
  enableSwipe();
  enableBioButton();
  enableLike();
  enableDislike();
}

function enableLike() {
  like.addEventListener("click", likeCard);
}

function disableLike() {
  like.removeEventListener("click", likeCard);
}

function enableDislike() {
  dislike.addEventListener("click", dislikeCard);
}

function disableDislike() {
  dislike.removeEventListener("click", dislikeCard);
}

function resetCardValues() {
  newCardXCoord = 0;
  newCardYCoord = 0;
  cardRotationDeg = 0;
  isBeingLiked = false;
  isBeingDisliked = false;
  likeOrDislikeButtonWasClicked = false;
}

function disableBioButton() {
  bioButton.removeEventListener("click", toggleBio);
}

function enableBioButton() {
  bioButton.addEventListener("click", toggleBio);
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

function disableFilters() {
  toggleSettings.removeEventListener("click", toggleFilters);
}

function enableFilters() {
  toggleSettings.addEventListener("click", toggleFilters);
}

function disableSwipe() {
  isMobileDevice
    ? card.removeEventListener("touchstart", mouseDownOrTouchStart)
    : card.removeEventListener("mousedown", mouseDownOrTouchStart);
}

function enableSwipe() {
  isMobileDevice
    ? card.addEventListener("touchstart", mouseDownOrTouchStart)
    : card.addEventListener("mousedown", mouseDownOrTouchStart);
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

function userDeviceIsMobile() {
  let check = false;
  // Got this from http://detectmobilebrowsers.com/
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    ) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.operax);
  return check;
}
