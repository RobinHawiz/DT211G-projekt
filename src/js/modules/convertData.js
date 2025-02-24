const { fetchData } = require("./fetchData");

export async function convertDogData(dogBreedsData, dogGroupsData) {
  let output = [];
  await dogBreedsData.forEach(async (dogData) => {
    await dogData.data.forEach(async (dog) => {
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
      };

      output.push(dogCard);
    });
  });
  return output;
}
