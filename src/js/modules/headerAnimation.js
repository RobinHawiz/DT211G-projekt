/**
 * Provides animation functions for the website's logo and menu button (doggy burger).
 * @module headerAnimation
 */

const logo = document.querySelector(".logo a");
const logoImg = document.querySelector(".logo .logo-img");
const letters = logo.textContent.split("");
const doggyBurgerLines = document.querySelectorAll(".doggy-burger span");

/**
 * Splits the logo text into individual letters and animates them with a delay.
 * Each letter is wrapped in a span and given a CSS animation to animate its appearance.
 *
 * @param {number} delay - The delay (in seconds) before starting the animation for each letter.
 */
export function logoAnimation(delay) {
  logo.innerHTML = "";
  for (let i = 0; i <= letters.length - 1; i++) {
    logo.innerHTML += `<span class="letter letter-${i}">${letters[i]}</span>`;
    document.querySelector(`.letter-${i}`).style.animation = `0.5s ease ${
      delay + i / 30
    }s forwards logo-animation`;
  }
}

/**
 * Animates the logo image with a CSS animation, using the specified delay.
 *
 * @param {number} delay - The delay (in seconds) before starting the animation on the logo image.
 */
export function logoImgAnimation(delay) {
  logoImg.style.animation = `0.5s ease ${delay}s forwards logo-img-animation`;
}

/**
 * Animates the lines of the "doggy burger" menu icon with individual CSS animations for each span line.
 *
 * @param {number} delay - The delay (in seconds) before starting the animation for each doggyBurger span line.
 */
export function doggyBurgerLinesAnimation(delay) {
  doggyBurgerLines[0].style.animation = `0.5s ease ${delay}s forwards hamburger-span-1-animation`;
  doggyBurgerLines[1].style.animation = `0.5s ease ${delay}s forwards hamburger-span-2-animation`;
}
