const cheerio = require("cheerio");

/**
 * Parses processes, inspections, and reports from the provided HTML.
 * @param {string} html - The raw HTML string.
 * @returns {Array} An array of process objects.
 */
function getProcesses(html) {
  const $ = cheerio.load(html);
  const processes = [];

  // Helper to clean up text
  const getCleanText = (element) => {
    return $(element)
      .text()
      .replace(/[\s\xA0]+/g, " ")
      .trim();
  };

  // Target the specific section that holds the process data
  const $rows = $("#processSection table tr");

  // We will update this variable whenever we hit a new grouping header row
  let currentGroup = "Unknown Group";

  $rows.each((index, element) => {
    const $row = $(element);

    // 1. Check if the row is a GROUP HEADER (e.g., "Inspection History", "Review")
    if ($row.hasClass("FormtableDataGroup")) {
      // Extract the group name from the <a> tag inside the header
      currentGroup = getCleanText($row.find("a.alink"));
    }
    // 2. Otherwise, check if it's a DATA ROW
    else if ($row.hasClass("FormtableData1")) {
      const processName = getCleanText($row.find('td[data-title="PROCESS"]'));
      const status = getCleanText($row.find('td[data-title="STATUS"]'));
      const scheduleDt = getCleanText(
        $row.find('td[data-title="SCHEDULE DT"]'),
      );
      const startDt = getCleanText($row.find('td[data-title="START DT"]'));
      const endDt = getCleanText($row.find('td[data-title="END DT"]'));

      // Extract the hidden process key from the onClick attribute
      // Example string: setProcessKey('41461891');
      const onClickAttr =
        $row.find('td[data-title="PROCESS"] a').attr("onclick") || "";
      const keyMatch = onClickAttr.match(/setProcessKey\('(\d+)'\)/);
      const processKey = keyMatch ? keyMatch[1] : null;

      // Only add if it actually has a process name
      if (processName) {
        processes.push({
          group: currentGroup, // Tracks which section this row belongs to
          processKey, // Extracted ID!
          processName,
          status,
          scheduleDt,
          startDt,
          endDt,
        });
      }
    }
  });

  return processes;
}

// --- TEST EXECUTION --- //

module.exports = { getProcesses };
