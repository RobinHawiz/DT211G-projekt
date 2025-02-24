const { fetchData } = require("./modules/fetchData");
const { createDogDataCards } = require("./modules/createDogDataCards");
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
    completeDogData = await createDogDataCards(dogBreedsData, dogGroupsData);
    localStorage.setItem("dogData", JSON.stringify(completeDogData));
  } else {
    completeDogData = JSON.parse(localStorage.getItem("dogData"));
  }
  console.log("completeDogData:");
  console.log(completeDogData);
}

generateCard();
