const { getDogData, generateInitialCard } = require("./modules/cardGenerator");
const { generateCard } = require("./modules/cardGenerator");
export let dogData;

async function findMatchApp() {
  await init();
  require("./likeDislikePanel");
}

async function init() {
  dogData = await getDogData();
  await generateInitialCard(dogData[0]);
  await generateCard(dogData[1]);
  dogData.splice(0, 2);
}

findMatchApp();
