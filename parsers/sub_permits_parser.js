const cheerio = require("cheerio");

/**
 * Parses sub-permit data from the provided HTML.
 * @param {string} html - The raw HTML string.
 * @returns {Array} An array of sub-permit objects.
 */
function getSubPermits(html) {
  const $ = cheerio.load(html);
  const subPermits = [];

  // Helper to clean up text (removes &nbsp; and extra spaces)
  const getCleanText = (element) => {
    return $(element)
      .text()
      .replace(/[\s\xA0]+/g, " ")
      .trim();
  };

  // Locate the sub-permits heading, get the next div container, and find all data rows.
  // This avoids accidental scraping of other tables that might share the same classes or duplicate IDs.
  const $subPermitRows = $("#subpermits")
    .nextAll("div")
    .first()
    .find("tr.FormtableData1");

  $subPermitRows.each((index, element) => {
    // Extract data for the current row using data-title attributes
    const permitNumber = getCleanText(
      $(element).find('td[data-title="PERMIT#"]'),
    );
    const appDate = getCleanText($(element).find('td[data-title="APP. DATE"]'));
    const issueDate = getCleanText(
      $(element).find('td[data-title="ISSUE DATE"]'),
    );
    const status = getCleanText($(element).find('td[data-title="STATUS"]'));

    const onClickAttr =
      $(element).find('td[data-title="PERMIT#"] a').attr("onclick") || "";
    const folderKeysMatch = onClickAttr.match(
      /setFolderKeys\('([^']+)',\s*(\d+)\)/,
    );
    const folderId = folderKeysMatch ? folderKeysMatch[2] : null;

    // Push the parsed data into our array
    subPermits.push({
      permitNumber,
      appDate,
      issueDate,
      status,
      folderId, // Useful if you need to fetch this sub-permit's specific page later
    });
  });

  return subPermits;
}

module.exports = { getSubPermits };
