/**
 * Generates dog breed data cards, including information about each dog breed, image fetching, and creating a custom doggy breed ("Nova Scotia Duck Tolling Retriever").
 *
 * @module CreateDogDataCards
 * @requires fetchData
 */

const { fetchData } = require("./fetchData");
import dogImg from "../../assets/oscar-sutton-unsplash-placeholder.jpg";
import dogImgBarbado from "../../assets/barbado.jpg";

/**
 * Creates dog data cards by processing the data for each dog breed.
 *
 * @param {Object[]} dogBreedsData - The dog breed data fetched from the external API {@link https://dogapi.dog/}.
 * @param {Object[]} dogGroupsData - The dog groups data fetched from the external API {@link https://dogapi.dog/}.
 *
 * @returns {Promise<Object[]>} A promise that resolves to an array of dog data objects, each containing breed details. Data specs -> {@link module:backupDogData}.
 */
export async function createDogDataCards(dogBreedsData, dogGroupsData) {
  let output = await Promise.all(
    dogBreedsData.flatMap((dogData) =>
      dogData.data.map(async (dog) => {
        const dogImgUrl = await getDogImgUrl(dog.attributes.name);
        return {
          name: dog.attributes.name,
          description: dog.attributes.description,
          lifeExpectancy: [dog.attributes.life.min, dog.attributes.life.max],
          maleWeight: [
            dog.attributes.male_weight.min,
            dog.attributes.male_weight.max,
          ],
          femaleWeight: [
            dog.attributes.female_weight.min,
            dog.attributes.female_weight.max,
          ],
          hypoallergenic: dog.attributes.hypoallergenic,
          group: dogGroupsData.data.find(
            (groupType) => groupType.id === dog.relationships.group.data.id
          ).attributes.name,
          img: dogImgUrl,
        };
      })
    )
  );
  const myDog = createYourOwnDoggy("Nova Scotia Duck Tolling Retriever");
  output.unshift(myDog);
  return output;
}

// For creating your very own doggies!

/**
 * Generates a new dog object for a user-created dog breed, specifically: "Nova Scotia Duck Tolling Retriever".
 * @param {string} name - The name of the dog breed.
 * @returns {Object} An object containing details for the custom dog breed. Data specs -> {@link module:backupDogData}.
 */
function createYourOwnDoggy(name) {
  return {
    name,
    description:
      "intelligent, affectionate, and eager to please. Play fetch with a tireless Toller until your right arm falls off, and he will ask you to throw left-handed.",
    lifeExpectancy: [13, 16],
    maleWeight: [20, 23],
    femaleWeight: [17, 20],
    hypoallergenic: false,
    group: "Sporting Group",
    img: dogImg,
  };
}

/**
 * Retrieves the URL of an image from Flickr for a given dog breed name.
 * If the Flickr search fails, a fallback image is used (but only for the dog "Barbado da Terceira". I probably should expand this to incorparate all search fails).
 * @param {string} dogName - The name of the dog breed for which to find an image.
 * @returns {Promise<string>} A promise that resolves to the URL of the dog's image.
 */
async function getDogImgUrl(dogName) {
  let output = "";
  let dogNameParam = encodeURIComponent(dogName);
  const regEx = /\bdog\b/i;
  switch (dogNameParam) {
    // The dog API has a dog with a grammatically incorrect name, which I have to fix here because I do not have access to their db.
    case "Bavarian%20Mountain%20Scent%20Houn":
      dogNameParam += "d";
    // The dog name "Braque Francais Pyrenean" gives either zero search results or gives the wrong images. That is fixed by removing "Pyrenean" from the name.
    case "Braque%20Francais%20Pyrenean":
      dogNameParam = "Braque%20Francais";
  }

  // If the dogNameParam does not consist of the word "dog" then the flickr search results might not give us dog images. So to remedy that we add the word "dog" at the end.
  if (!regEx.test(dogNameParam)) {
    dogNameParam += "%20dog";
  }
  const flickrImgData = await fetchData(
    `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=6ed90aad91cff221b0f95b03a3408089&text=${dogNameParam}&tags="dog"&format=json&nojsoncallback=1`
  );
  const flickrImg = flickrImgData.photos.photo[0];
  try {
    output = `https://live.staticflickr.com/${flickrImg.server}/${flickrImg.id}_${flickrImg.secret}_b.jpg`;
  } catch (error) {
    console.log(error);
    console.log("This doggy gives zero search results on Flickr :(");
    console.log(dogNameParam);
    // So far this is the only dog not giving a result, so I added my own image to use instead.
    if (dogNameParam === "Barbado%20da%20Terceira%20dog") {
      output = dogImgBarbado;
    }
  }
  return output;
}
