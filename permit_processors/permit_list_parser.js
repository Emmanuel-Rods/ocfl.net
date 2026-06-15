const cheerio = require("cheerio");

/**
 * Parses the FastTrack permit search results table into JSON.
 * @param {string} html - The raw HTML string containing the search results.
 * @returns {string} - JSON string containing an array of parsed row objects.
 */
function parsePermitResults(html) {
  const $ = cheerio.load(html);
  const results = [];

  // Iterate over each row inside the specific table body
  $("table#detail_list_resp_3 tbody tr.FormtableData").each((index, row) => {
    const rowData = {};

    // Iterate over each cell (td) in the row
    $(row)
      .find("td")
      .each((i, cell) => {
        const $cell = $(cell);

        // Grab the column name from the data-title attribute (e.g., 'PERMIT#', 'LICENSE#')
        const columnHeader = $cell.attr("data-title");

        if (columnHeader) {
          // Get the text content and remove extra whitespace
          rowData[columnHeader] = $cell.text().trim();

          // If this is the PERMIT# column, extract the hidden data from the <a> tag
          if (columnHeader === "PERMIT#") {
            const $anchor = $cell.find("a.alink");
            // Note: Cheerio lowercases attribute names, so 'onClick' becomes 'onclick'
            const onClickText = $anchor.attr("onclick");

            if (onClickText) {
              // Regex to extract ReferenceFile (1st arg) and FolderRSN (2nd arg)
              // Example: setFolderKeys('B26003651', '3439036')
              const folderKeysRegex = /setFolderKeys\('([^']+)',\s*'([^']+)'\)/;
              const folderMatch = onClickText.match(folderKeysRegex);

              if (folderMatch) {
                rowData["ReferenceFile"] = folderMatch[1];
                rowData["FolderRSN"] = folderMatch[2];
              } else {
                rowData["ReferenceFile"] = null;
                rowData["FolderRSN"] = null;
              }

              // Regex to extract the SearchID
              // Example: permit-building.aspx?SearchID=SIGN');
              const searchIdRegex = /SearchID=([^']+)/;
              const searchIdMatch = onClickText.match(searchIdRegex);

              if (searchIdMatch) {
                rowData["SearchID"] = searchIdMatch[1];
              } else {
                rowData["SearchID"] = null;
              }
            }
          }
        }
      });

    // Only push if the row actually contained data
    if (Object.keys(rowData).length > 0) {
      results.push(rowData);
    }
  });

  return results;
}

module.exports = { parsePermitResults };
