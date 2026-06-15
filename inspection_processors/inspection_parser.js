const cheerio = require("cheerio");
const fs = require("fs");

/**
 * Parses inspection details and activity history from the provided HTML.
 * @param {string} html - The raw HTML string.
 * @returns {Object} An object containing the inspection details and activity array.
 */
function getInspectionDetails(html) {
  // 1. FAILSAFE: Fix broken HTML if the closing </title> or </head> is missing.
  // This forces the body element to be parsed correctly.
  let safeHtml = html.replace(
    /<title>([\s\S]*?)<body/i,
    "<title>$1</title></head><body",
  );

  const $ = cheerio.load(safeHtml);

  // Helper to clean up text (removes &nbsp;, newlines, and extra spaces)
  const getCleanText = (element) => {
    return $(element)
      .text()
      .replace(/[\s\xA0]+/g, " ")
      .trim();
  };

  // 2. Extract the permit reference
  // Target the span inside the title, then strip out the leading hyphen
  let permitRef = getCleanText($(".pageTitleNew span")).replace(/^-\s*/, "");

  // Fallback just in case the span ID changes
  if (!permitRef) {
    permitRef = getCleanText($(".pageTitleNew"))
      .replace("Inspection Details", "")
      .replace(/^-\s*/, "")
      .trim();
  }

  let details = {};
  const activity = [];

  // 3. Scan ALL tables on the page to find our data.
  // This is much safer than relying on duplicate `<div id="nmt">` tags.
  $("table").each((index, table) => {
    const $tbl = $(table);
    const tableHtml = $tbl.html() || "";

    // Is this the "Inspection Details" table?
    // We know it is if the HTML contains the 'METHOD' and 'SCHEDULED DATE' columns
    if (tableHtml.includes("METHOD") && tableHtml.includes("SCHEDULED DATE")) {
      details = {
        type: getCleanText($tbl.find('td[data-title="TYPE"]')),
        status: getCleanText($tbl.find('td[data-title="STATUS"]')),
        method: getCleanText($tbl.find('td[data-title="METHOD"]')),
        user: getCleanText($tbl.find('td[data-title="USER"]')),
        scheduledDate: getCleanText($tbl.find('td[data-title="SCHED DATE"]')),
        scheduledEndDate: getCleanText(
          $tbl.find('td[data-title="SCHED END DATE"]'),
        ),
        startDate: getCleanText($tbl.find('td[data-title="START DATE"]')),
        endDate: getCleanText($tbl.find('td[data-title="END DATE"]')),
        address: getCleanText($tbl.find('td[data-title="ADDRESS"]')),
      };
    }

    // Is this the "Activity" table?
    // We know it is if the HTML contains 'COMMENT' and 'RESULT' columns
    if (tableHtml.includes("COMMENT") && tableHtml.includes("RESULT")) {
      const $rows = $tbl.find("tr.FormtableData1");

      $rows.each((_, el) => {
        const $row = $(el);
        const date = getCleanText($row.find('td[data-title="DATE"]'));
        const user = getCleanText($row.find('td[data-title="USER"]'));
        const comment = getCleanText($row.find('td[data-title="COMMENT"]'));
        const result = getCleanText($row.find('td[data-title="RESULT"]'));

        // Only push if the row actually has data
        if (date || user || comment || result) {
          activity.push({
            date,
            user,
            comment,
            result,
          });
        }
      });
    }
  });

  return {
    permitRef,
    details,
    activity,
  };
}

module.exports = { getInspectionDetails };
