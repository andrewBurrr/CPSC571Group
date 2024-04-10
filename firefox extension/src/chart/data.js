/**
 * Load data from the given url
 * @param url {string} - The URL to load data from
 * @returns {Promise<any>} - The data
 */
const loadData = async (url) => {
    const response = await fetch(url);
    return await response.json();
}

export { loadData };