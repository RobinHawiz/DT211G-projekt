/**
 * @file Handles the header and doggyBurger animation.
 * @requires module:headerAnimation
 * @requires doggyburger
 */

import "../style/style.scss";
const {
  logoAnimation,
  logoImgAnimation,
  doggyBurgerLinesAnimation,
} = require("./modules/headerAnimation");
require("./doggyburger");

/*
 * Get the current URL path.
 */
var path = window.location.pathname;
var page = path.split("/").slice(-2)[0];

/**
 * Initializes header animations based on the current page.
 * If the user is on the "DT211G-projekt" page, animations start with higher intensity.
 * Otherwise, animations are initialized with lower intensity.
 */
if (page === "DT211G-projekt") {
  logoAnimation(1);
  logoImgAnimation(1);
  doggyBurgerLinesAnimation(1.2);
} else {
  logoAnimation(0);
  logoImgAnimation(0);
  doggyBurgerLinesAnimation(0.2);
}
