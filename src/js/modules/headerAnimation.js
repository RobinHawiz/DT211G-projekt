const logo = document.querySelector(".logo a");
const logoImg = document.querySelector(".logo .logo-img");
const letters = logo.textContent.split("");
const doggyBurgerLines = document.querySelectorAll(".doggy-burger span");

export function logoAnimation(delay) {
  logo.innerHTML = "";
  for (let i = 0; i <= letters.length - 1; i++) {
    logo.innerHTML += `<span class="letter letter-${i}">${letters[i]}</span>`;
    document.querySelector(`.letter-${i}`).style.animation = `0.5s ease ${
      delay + i / 30
    }s forwards logo-animation`;
  }
}

export function logoImgAnimation(delay) {
  logoImg.style.animation = `0.5s ease ${delay}s forwards logo-img-animation`;
}

export function doggyBurgerLinesAnimation(delay) {
  doggyBurgerLines[0].style.animation = `0.5s ease ${delay}s forwards hamburger-span-1-animation`;
  doggyBurgerLines[1].style.animation = `0.5s ease ${delay}s forwards hamburger-span-2-animation`;
}
