/**
 * @file Initializes the app functionality in the find-match page.
 * @requires module:cardGenerator
 */

const {
  getDogData,
  generateInitialCard,
  generateCard,
} = require("./modules/cardGenerator");
export let dogData;

/**
 * Initializes the application by fetching dog data and generating the initial dog cards.
 * Also loads the like/dislike panel functionality.
 */
async function init() {
  dogData = await getDogData();
  generateInitialCard(dogData[0]);
  generateCard(dogData[1]);
  require("./likeDislikePanel");
}

init();
