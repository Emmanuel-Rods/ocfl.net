const cheerio = require("cheerio");

/**
 * Parses the detailed permit field information (attributes/custom fields).
 * @param {string} html - The raw HTML string.
 * @returns {Array} An array of field objects containing the group, description, and information.
 */
function getPermitFieldInfo(html) {
  const $ = cheerio.load(html);
  const fields = [];

  // Helper to clean up text (removes &nbsp; and collapses spaces)
  const getCleanText = (element) => {
    return $(element)
      .text()
      .replace(/[\s\xA0]+/g, " ")
      .trim();
  };

  // We target the #nmtinfo table where this specific data lives
  const $rows = $("#nmtinfo table tr");

  // Track the current grouping (e.g., "Affordable Housing", "Zoning Info")
  let currentGroup = "General";

  $rows.each((index, element) => {
    const $row = $(element);

    // 1. If it's a group header row, update the currentGroup variable
    if ($row.hasClass("FormtableDataGroup")) {
      currentGroup = getCleanText($row.find("a.alink"));
    }
    // 2. If it's a data row, extract the Description and Information
    else if ($row.hasClass("FormtableData1")) {
      // Note: The developers used specific classes for the left and right columns here instead of data-titles
      const description = getCleanText(
        $row.find("td.detailTextIndentInvisible-sm-desc"),
      );
      const information = getCleanText(
        $row.find("td.detailTextIndentInvisible-sm-info"),
      );

      // Only add to array if a description actually exists
      if (description) {
        fields.push({
          group: currentGroup,
          description: description,
          information: information,
        });
      }
    }
  });

  return fields;
}

// --- TEST EXECUTION --- //

module.exports = { getPermitFieldInfo };
