const cheerio = require("cheerio");

/**
 * Parses people details from the provided HTML.
 * @param {string} html - The raw HTML string.
 * @returns {Array} An array of people objects.
 */
function getPeopleDetails(html) {
  const $ = cheerio.load(html);
  const people = [];

  // Helper to clean up text (removes &nbsp;, newlines, tabs, and extra spaces)
  const getCleanText = (element) => {
    return $(element)
      .text()
      .replace(/[\s\xA0]+/g, " ")
      .trim();
  };

  // 1. Find the specific heading that contains "PEOPLE DETAILS"
  const $heading = $(".detailDataHeading").filter(function () {
    return $(this).text().includes("PEOPLE DETAILS");
  });

  // 2. Get the next 'div' after this heading, which contains our table
  const $tableContainer = $heading.nextAll("div").first();

  // 3. Find all data rows in that specific table
  const $rows = $tableContainer.find("tr.FormtableData1");

  $rows.each((index, element) => {
    const type = getCleanText($(element).find('td[data-title="TYPE"]'));
    const name = getCleanText($(element).find('td[data-title="NAME"]'));
    const address = getCleanText($(element).find('td[data-title="ADDRESS"]'));

    // Push the parsed data into our array if the row isn't completely empty
    if (type || name || address) {
      people.push({
        type,
        name,
        address,
      });
    }
  });

  return people;
}

module.exports = { getPeopleDetails };
