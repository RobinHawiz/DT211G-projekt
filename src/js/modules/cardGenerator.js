const { fetchData } = require("./fetchData");
const { createDogDataCards } = require("./createDogDataCards");
import infoIcon from "../../assets/info.svg";
import dogIcon from "../../assets/dog-attributes.svg";
import cakeIcon from "../../assets/cake-birthday.svg";
import scaleIcon from "../../assets/scale.svg";
import bacteriumIcon from "../../assets/bacterium.svg";
import likeIcon from "../../assets/like.svg";
import dislikeIcon from "../../assets/dislike.svg";

export async function getDogData() {
  let output;
  //Get data
  let dogBreedsData = [await fetchData("https://dogapi.dog/api/v2/breeds")];
  if (dogBreedsData[0] === undefined) {
    output = import("../modules/backupDogData").then(
      async ({ backupDogData }) => {
        console.log("Backup data is being used.");
        return backupDogData;
      }
    );
  } else {
    let tempDogBreedsData = dogBreedsData[0];
    while (tempDogBreedsData.links.next != undefined) {
      tempDogBreedsData = await fetchData(tempDogBreedsData.links.next);
      dogBreedsData.push(tempDogBreedsData);
    }
    const dogGroupsData = await fetchData("https://dogapi.dog/api/v2/groups");
    //Convert data
    output = await createDogDataCards(dogBreedsData, dogGroupsData);
  }
  return output;
}

export function generateCard(dogData) {
  const cardWrapper = document.querySelector(".card-wrapper");

  const cardBehind = document.querySelector(".card.current").cloneNode(true);
  cardBehind.classList.remove("current");
  cardBehind.classList.add("behind");

  cardBehind.querySelector(".dog-img").src = dogData.img;
  cardBehind.querySelector(".dog-img").alt = "A " + dogData.name;
  cardBehind.querySelector(".dog-name-and-group h2").innerText = dogData.name;
  cardBehind.querySelector(".dog-name-and-group h3").innerText = dogData.group;

  const bioBehind = document.querySelector(".bio.current").cloneNode(true);
  bioBehind.classList.remove("current");
  bioBehind.classList.add("behind");

  bioBehind.querySelector(".description .content p").innerText =
    dogData.description;
  bioBehind.querySelector(
    ".Attributes .attribute.life-expectancy p"
  ).innerText = `Life expectancy: ${dogData.lifeExpectancy[0]}-${dogData.lifeExpectancy[1]} years`;
  bioBehind.querySelector(
    ".Attributes .attribute.weight .male-weight"
  ).innerText = `${dogData.maleWeight[0]}-${dogData.maleWeight[1]}kg`;
  bioBehind.querySelector(
    ".Attributes .attribute.weight .female-weight"
  ).innerText = `${dogData.femaleWeight[0]}-${dogData.femaleWeight[1]}kg`;
  bioBehind.querySelector(
    ".Attributes .attribute.hypoallergenic p"
  ).innerText = `Hypoallergenic: ${dogData.hypoallergenic ? `Yes` : `No`}`;

  cardWrapper.insertBefore(
    cardBehind,
    cardWrapper.querySelector(".like-dislike-panel")
  );
  cardBehind.parentNode.insertBefore(bioBehind, cardBehind.nextSibling);
}

// The first card has to be generated this way because we need the card element and bio element to already exist in our HTML.
export function generateInitialCard(dogData) {
  const card = document.querySelector(".card");
  const bio = document.querySelector(".bio");

  let imgWrapper = document.createElement("div");
  imgWrapper.classList.add("img-wrapper");
  imgWrapper.innerHTML = `
              <img
              class="like-icon"
              src="${likeIcon}"
              alt="Like icon"
            />
                        <img
              class="dislike-icon"
              src="${dislikeIcon}"
              alt="Dislike icon"
            />
            <img
              class="dog-img"
              src="${dogData.img}"
              alt="A ${dogData.name}"
            />
        `;
  let dogNameAndGroup = document.createElement("div");
  dogNameAndGroup.classList.add("dog-name-and-group");
  dogNameAndGroup.innerHTML = `
            <h2>${dogData.name}</h2>
            <h3>${dogData.group}</h3>
        `;
  let description = document.createElement("article");
  description.classList.add("description");
  description.innerHTML = `
            <div class="content">
              <div class="title">
                <img src="${infoIcon}" alt="Info icon" />
                <h3>Bio</h3>
              </div>
              <p>
              ${dogData.description}
              </p>
            </div>
        `;
  let attributes = document.createElement("article");
  attributes.classList.add("Attributes");
  attributes.innerHTML = `
        <div class="content">
          <div class="title">
            <img src="${dogIcon}" alt="Dog icon" />
            <h3>Attributes</h3>
          </div>
          <div class="attribute life-expectancy">
            <img src="${cakeIcon}" alt="Cake icon" />
            <p>Life expectancy: ${dogData.lifeExpectancy[0]}-${
    dogData.lifeExpectancy[1]
  } years</p>
          </div>
          <span class="divider"></span>
          <div class="attribute weight">
            <img src="${scaleIcon}" alt="Scale icon" />
            <div class="male-female-weights">
              <p class="male-weight">Male weight: ${dogData.maleWeight[0]}-${
    dogData.maleWeight[1]
  }kg</p>
              <p class="female-weight">Female weight: ${
                dogData.femaleWeight[0]
              }-${dogData.femaleWeight[1]}kg</p>
            </div>
          </div>
          <span class="divider"></span>
          <div class="attribute hypoallergenic">
            <img src="${bacteriumIcon}" alt="Bacterium icon" />
            <p>Hypoallergenic: ${dogData.hypoallergenic ? `Yes` : `No`}</p>
          </div>
    `;

  card.appendChild(imgWrapper);
  card.appendChild(dogNameAndGroup);
  bio.appendChild(description);
  bio.appendChild(attributes);
}
