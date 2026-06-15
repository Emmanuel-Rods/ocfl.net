const cheerio = require("cheerio");

/**
 * Parses ASP.NET and session hidden fields from the provided HTML.
 * @param {string} html - The raw HTML string.
 * @returns {string} - JSON string containing the extracted fields.
 */
function buildBasicPayload(html) {
  const $ = cheerio.load(html);

  const targets = [
    "__EVENTTARGET",
    "__EVENTARGUMENT",
    "__VIEWSTATE",
    "__VIEWSTATEGENERATOR",
    "__EVENTVALIDATION",
    "as_ffc_field",
    "as_sfid",
    "as_fid",
  ];

  const extractedData = {};

  targets.forEach((fieldName) => {
    // Locate the input by its 'name' attribute and grab its 'value' attribute
    const value = $(`input[name="${fieldName}"]`).val();

    // Fallback to empty string if the element is not found
    extractedData[fieldName] = value !== undefined ? value : "";
  });

  return extractedData;
}

module.exports = {
  buildBasicPayload,
};
