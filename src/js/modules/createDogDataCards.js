const { fetchData } = require("./fetchData");

export async function createDogDataCards(dogBreedsData, dogGroupsData) {
  let output = [];
  await dogBreedsData.forEach(async (dogData) => {
    await dogData.data.forEach(async (dog) => {
      const dogImgUrl = await getDogImgUrl(dog.attributes.name);
      const dogCard = {
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

      output.push(dogCard);
    });
  });
  return output;
}

async function getDogImgUrl(dogName) {
  let output = "";
  let dogNameParam = querifyString(dogName);
  const regEx = /\bdog\b/i;
  // The dog API has a dog with a grammatically incorrect name, which I have to fix here because I do not have access to their db.
  if (dogNameParam === "Bavarian+Mountain+Scent+Houn") dogNameParam += "d";
  // If the dogNameParam does not consist of the word "dog" then the flickr search results might not give us dog images. So to remedy that we add the word "dog" at the end.
  if (!regEx.test(dogNameParam)) {
    dogNameParam += "+dog";
    console.log(dogNameParam);
  }
  const flickrImgData = await fetchData(
    `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=6ed90aad91cff221b0f95b03a3408089&text=${dogNameParam}&format=json&nojsoncallback=1`
  );
  const flickrImg = flickrImgData.photos.photo[0];
  try {
    output = `https://live.staticflickr.com/${flickrImg.server}/${flickrImg.id}_${flickrImg.secret}_b.jpg`;
  } catch (error) {
    console.log(error);
    console.log(dogNameParam);
  }
  return output;
}

function querifyString(str) {
  const chars = {
    " ": "+",
    é: "%C3%A9",
  };
  return str.replace(/ |,/g, (c) => chars[c]);
}
