import "../style/style.scss";
const {
  logoAnimation,
  logoImgAnimation,
  doggyBurgerLinesAnimation,
} = require("./modules/headerAnimation");
require("./doggyburger");
var path = window.location.pathname;
var page = path.split("/").slice(-2)[0];

if (page === "DT211G-project") {
  logoAnimation(1);
  logoImgAnimation(1);
  doggyBurgerLinesAnimation(1.5);
} else {
  logoAnimation(0);
  logoImgAnimation(0);
  doggyBurgerLinesAnimation(0.5);
}
