/**
 * Fetch data module
 * @module fetchData
 */

/**
 *
 * @param {string} url url that links to a (publicly accessible) JSON data source.
 * @returns {Promise} Promise object that contains the reason why the promise was rejected.
 * @returns {Object | Array} Object or Array that contains some sort of data that was fetched and parsed from the url source.
 */

export async function fetchData(url) {
  let response = await fetch(url)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Det uppstod ett fel:", error);
    });
  return response;
}
