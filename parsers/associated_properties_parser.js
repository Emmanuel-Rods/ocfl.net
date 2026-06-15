const cheerio = require("cheerio");

/**
 * Parses associated property data from the provided HTML.
 * @param {string} html - The raw HTML string.
 * @returns {Array} An array of associated property objects.
 */
function getAssociatedProperties(html) {
  const $ = cheerio.load(html);
  const properties = [];

  // Helper to clean up text (removes &nbsp; and extra spaces)
  const getCleanText = (element) => {
    return $(element)
      .text()
      .replace(/[\s\xA0]+/g, " ")
      .trim();
  };

  // 1. Find the specific heading that contains "ASSOCIATED PROPERTY"
  // We use .filter() because there are multiple elements with the class 'detailDataHeading'
  const $heading = $(".detailDataHeading").filter(function () {
    return $(this).text().includes("ASSOCIATED PROPERTY");
  });

  // 2. Get the very next 'div' after this heading, which contains our table
  const $tableContainer = $heading.nextAll("div").first();

  // 3. Find all data rows in that specific table
  const $rows = $tableContainer.find("tr.FormtableData1");

  $rows.each((index, element) => {
    const address = getCleanText($(element).find('td[data-title="ADDRESS"]'));
    const parcel = getCleanText($(element).find('td[data-title="PARCEL"]'));

    // Only add if we actually found data, to prevent empty objects
    if (address || parcel) {
      properties.push({
        address,
        parcel,
      });
    }
  });

  return properties;
}

module.exports = { getAssociatedProperties };
