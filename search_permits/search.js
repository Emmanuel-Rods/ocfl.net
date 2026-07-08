const {
  getPermitPage,
} = require("../permit_processors/get_default_permit_page.js");
const { buildBasicPayload } = require("../utils/payload_gen.js");

const {
  submitPermitSearch,
} = require("../permit_processors/get_permit_lists.js");

const {
  parsePermitResults,
} = require("../permit_processors/permit_list_parser.js");

async function searchPermitNumber(permitNumber) {
  const html = await getPermitPage();
  const basePayload = buildBasicPayload(html);
  // other payload
  basePayload[
    "ctl00$ContentPlaceHolder1$ucHeaderAndSearchBP$uc_permitnumber_BP$ReferenceFile"
  ] = permitNumber;
  basePayload[
    "ctl00$ContentPlaceHolder1$ucHeaderAndSearchBP$uc_SearchBtnWProgress$btnSearch"
  ] = "Search";

  const permitListHTML = await submitPermitSearch(basePayload);
  const permits = parsePermitResults(permitListHTML);
  // there might be cases where the search returns multpliple permitnumbers
  if (!Array.isArray(permits)) {
    return null;
  }
  const permit = permits.find((permit) => permit["PERMIT#"] === permitNumber);
  console.log("results for query : ", permitNumber, " ", permits.length);
  return { permit, permitListHTML };
}

module.exports = { searchPermitNumber };
