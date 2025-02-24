const { fetchData } = require("./modules/fetchData");
const { convertDogData } = require("./modules/convertData");
async function generateCard() {
  let completeDogData;
  if (localStorage.getItem("dogData") === null) {
    //Get data
    let dogBreedsData = [await fetchData("https://dogapi.dog/api/v2/breeds")];
    let tempDogBreedsData = dogBreedsData[0];
    while (tempDogBreedsData.links.next != undefined) {
      tempDogBreedsData = await fetchData(tempDogBreedsData.links.next);
      dogBreedsData.push(tempDogBreedsData);
    }
    const dogGroupsData = await fetchData("https://dogapi.dog/api/v2/groups");
    //Convert data
    completeDogData = await convertDogData(dogBreedsData, dogGroupsData);
    localStorage.setItem("dogData", JSON.stringify(completeDogData));
  } else {
    completeDogData = JSON.parse(localStorage.getItem("dogData"));
  }
  console.log("completeDogData:");
  console.log(completeDogData);
}

function querifyString(str) {
  const chars = {
    " ": "+",
    é: "%C3%A9",
  };
  return str.replace(/ |,/g, (c) => chars[c]);
}

generateCard();
