const doggyBurger = document.querySelector(".doggy-burger");
const nav = document.querySelector("nav");
const navLinks = nav.querySelector("ul");
const logo = document.querySelector(".logo");
let timeoutId;

doggyBurger.addEventListener("click", () => {
  // Accessibility.
  if (nav.classList.contains("toggle")) {
    doggyBurger.setAttribute("aria-label", "Menu");
    doggyBurger.setAttribute("aria-expanded", false);
  } else {
    doggyBurger.setAttribute("aria-label", "Close menu");
    doggyBurger.setAttribute("aria-expanded", true);
  }
  // Opening and closing of the menu.
  for (const line of doggyBurger.children) {
    line.classList.toggle("toggle");
  }
  nav.classList.toggle("toggle");
  logo.classList.toggle("nav-opened");

  /*
  Before setting display: none to the ul, we need to wait until the nav is closed. 
  Otherwise the links will disappear before the nav is closed, which looks weird.
  */
  if (!nav.classList.contains("toggle")) {
    nav.addEventListener("transitionend", toggleNavLinks, { once: true });
    nav.setAttribute("listener", true);
  }

  // If the nav is closed and is to be opened, then we want to instantly set display: flex to the ul, in order to "reveal" them while the nav is opening.
  else {
    // If the user toggles the doggyburger before the nav has finnished closing, we prevent the navLinks from dissappearing. Otherwise they will flicker (get removed and displayed again).
    if (nav.hasAttribute("listener")) {
      nav.removeEventListener("transitionend", toggleNavLinks, { once: true });
      nav.removeAttribute("listener");
    } else {
      toggleNavLinks();
    }
  }
});

function toggleNavLinks() {
  // If this function is called by the "transitionend" event, we have to remove the "listener" attribute because the event has been fired, which fires only once.
  nav.removeAttribute("listener");
  navLinks.classList.toggle("toggle");
}
