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
  return completeDogData;
}

export async function generateCard(dogData) {
  const cardWrapper = document.querySelector(".card-wrapper");

  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("behind");
  card.innerHTML = `
            <div class="img-wrapper">
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
          </div>
          <div class="dog-name-and-group">
            <h2>${dogData.name}</h2>
            <h3>${dogData.group}</h3>
          </div>
`;

  const bio = document.createElement("div");
  bio.classList.add("bio");
  bio.classList.add("behind");
  bio.innerHTML = `
            <article class="description">
            <div class="content">
              <div class="title">
                <img src="${infoIcon}" alt="Info icon" />
                <h3>Bio</h3>
              </div>
              <p>
              ${dogData.description}
              </p>
            </div>
          </article>
          <article class="Attributes">
            <div class="content">
              <div class="title">
                <img src="${dogIcon}" alt="Dog icon" />
                <h3>Attributes</h3>
              </div>
          <div class="attribute">
            <img src="${cakeIcon}" alt="Cake icon" />
            <p>Life expectancy: ${dogData.lifeExpectancy[0]}-${
    dogData.lifeExpectancy[1]
  } years</p>
          </div>
          <span class="divider"></span>
          <div class="attribute">
            <img src="${scaleIcon}" alt="Scale icon" />
            <div class="male-female-weights">
              <p>Male weight: ${dogData.maleWeight[0]}-${
    dogData.maleWeight[1]
  }kg</p>
              <p>Female weight: ${dogData.femaleWeight[0]}-${
    dogData.femaleWeight[1]
  }kg</p>
            </div>
          </div>
              <span class="divider"></span>
          <div class="attribute">
            <img src="${bacteriumIcon}" alt="Bacterium icon" />
            <p>Hypoallergenic: ${dogData.hypoallergenic ? `Yes` : `No`}</p>
          </div>
            </div>
          </article>
  `;

  cardWrapper.insertBefore(
    card,
    cardWrapper.querySelector(".like-dislike-panel")
  );
  card.parentNode.insertBefore(bio, card.nextSibling);
}

// The first card has to be generated this way because we need the card element and bio element to already exist in our HTML.
export async function generateInitialCard(dogData) {
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
          <div class="attribute">
            <img src="${cakeIcon}" alt="Cake icon" />
            <p>Life expectancy: ${dogData.lifeExpectancy[0]}-${
    dogData.lifeExpectancy[1]
  } years</p>
          </div>
          <span class="divider"></span>
          <div class="attribute">
            <img src="${scaleIcon}" alt="Scale icon" />
            <div class="male-female-weights">
              <p>Male weight: ${dogData.maleWeight[0]}-${
    dogData.maleWeight[1]
  }kg</p>
              <p>Female weight: ${dogData.femaleWeight[0]}-${
    dogData.femaleWeight[1]
  }kg</p>
            </div>
          </div>
          <span class="divider"></span>
          <div class="attribute">
            <img src="${bacteriumIcon}" alt="Bacterium icon" />
            <p>Hypoallergenic: ${dogData.hypoallergenic ? `Yes` : `No`}</p>
          </div>
    `;

  card.appendChild(imgWrapper);
  card.appendChild(dogNameAndGroup);
  bio.appendChild(description);
  bio.appendChild(attributes);
}
