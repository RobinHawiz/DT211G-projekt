const { getDogData, generateInitialCard } = require("./modules/cardGenerator");
const { generateCard } = require("./modules/cardGenerator");
export let dogData;

async function init() {
  dogData = await getDogData();
  generateInitialCard(dogData[0]);
  generateCard(dogData[1]);
  require("./likeDislikePanel");
}

init();
