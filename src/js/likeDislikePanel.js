const likeDislikePanel = document.querySelector(".like-dislike-panel");
const bio = document.querySelector(".bio");
const bioArticles = document.querySelectorAll(".bio article");
const toggleBioButton = document.querySelector(".toggle-bio");

toggleBioButton.addEventListener("click", () => {
  rotateToggleBioButton();
  displayBio();
  repositionPanel();
  scrollToElem();
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
  setTimeout(() => (bio.style.display = "none"), 710);
}

function repositionPanel() {
  if (toggleBioButton.classList.contains("opened")) {
    likeDislikePanel.style.bottom = `${bio.offsetHeight}px`;
  } else {
    setTimeout(() => (likeDislikePanel.style.bottom = 0), 710);
  }
}

function scrollToElem() {
  if (toggleBioButton.classList.contains("opened")) {
    bio.scrollIntoView({ behavior: "smooth" });
  } else {
    document.body.scrollIntoView({ behavior: "smooth" });
  }
}
