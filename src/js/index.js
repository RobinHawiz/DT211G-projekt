import "../style/style.scss";
const {
  logoAnimation,
  doggyBurgerLinesAnimation,
} = require("./modules/headerAnimation");
require("./doggyburger");
var path = window.location.pathname;
var page = path.split("/").slice(-2)[0];

if (page === "DT211G-project") {
  logoAnimation(2);
  doggyBurgerLinesAnimation(2.5);
} else {
  logoAnimation(0);
  doggyBurgerLinesAnimation(0.5);
}
