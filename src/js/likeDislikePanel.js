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
let isMobileDevice = userDeviceIsMobile();
let bioArticles = document.querySelectorAll(".bio article");
const bioButton = document.querySelector("button.toggle-bio");
let newX = 0,
  newY = 0,
  startX = 0,
  startY = 0;

isMobileDevice
  ? card.addEventListener("touchstart", mouseDownOrTouchStart)
  : card.addEventListener("mousedown", mouseDownOrTouchStart);

function mouseDownOrTouchStart(e) {
  e.preventDefault(); // (For mobile) Disables: zooming with two fingers, pull down to refreshing the page, click events, etc.
  like.classList.toggle("scale-down");
  dislike.classList.toggle("scale-down");
  toggleSettings.classList.toggle("scale-down");
  bioButton.classList.toggle("scale-down");

  startX = isMobileDevice ? e.targetTouches[0].clientX : e.clientX;
  startY = isMobileDevice ? e.targetTouches[0].clientY : e.clientY;

  if (isMobileDevice) {
    document.addEventListener("touchmove", mouseMoveOrTouchMove);
    document.addEventListener("touchend", moveCard);
  } else {
    document.addEventListener("mousemove", mouseMoveOrTouchMove);
    document.addEventListener("mouseup", moveCard);
  }
}

function mouseMoveOrTouchMove(e) {
  newX = startX - (isMobileDevice ? e.targetTouches[0].clientX : e.clientX);
  newY = startY - (isMobileDevice ? e.targetTouches[0].clientY : e.clientY);

  startX = isMobileDevice ? e.targetTouches[0].clientX : e.clientX;
  startY = isMobileDevice ? e.targetTouches[0].clientY : e.clientY;

  cardStylingLeft = card.offsetLeft - newX;
  cardStylingTop = card.offsetTop - newY;

  cardCenterX = card.getBoundingClientRect().left + card.offsetWidth / 2;
  windowCenterX = window.innerWidth / 2;
  cardRotationDeg = (windowCenterX - cardCenterX) / 30;

  card.style.left = card.offsetLeft - newX + "px";
  card.style.top = card.offsetTop - newY + "px";
  card.style.transform = `rotate(${cardRotationDeg}deg)`;

  changelikeDislikeIconOpacity();

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
  const likeIcon = document.querySelector(".like-icon");
  const dislikeIcon = document.querySelector(".dislike-icon");

  cardCenterX = card.getBoundingClientRect().left + card.offsetWidth / 2;
  windowCenterX = window.innerWidth / 2;

  let dislikeIconOpacity = (windowCenterX - cardCenterX - 100) / 100;
  let likeIconOpacity = (cardCenterX - windowCenterX - 50) / 100;
  console.log(likeIconOpacity);

  dislikeIcon.style.opacity =
    dislikeIconOpacity > 0.04 ? dislikeIconOpacity : 0;
  likeIcon.style.opacity = likeIconOpacity > 0.04 ? likeIconOpacity : 0;
}

function moveCard() {
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
    changelikeDislikeIconOpacity();
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
      isMobileDevice
        ? card.addEventListener("touchstart", mouseDownOrTouchStart)
        : card.addEventListener("mousedown", mouseDownOrTouchStart);
    }
    changelikeDislikeIconOpacity();
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
  isMobileDevice
    ? card.addEventListener("touchstart", mouseDownOrTouchStart)
    : card.addEventListener("mousedown", mouseDownOrTouchStart);

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
  removeHtmlOverflowHidden();
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
  isMobileDevice
    ? card.removeEventListener("touchstart", mouseDownOrTouchStart)
    : card.removeEventListener("mousedown", mouseDownOrTouchStart);
}

function enableSwipe() {
  if (!bioButton.classList.contains("opened")) {
    isMobileDevice
      ? card.addEventListener("touchstart", mouseDownOrTouchStart)
      : card.addEventListener("mousedown", mouseDownOrTouchStart);
  }
}

function removeHtmlOverflowHidden() {
  document.querySelector("html").style.overflow = "visible";
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
