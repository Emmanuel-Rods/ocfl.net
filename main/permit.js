const {
  getPermitPage,
} = require("../permit_processors/get_default_permit_page.js");
const { buildBasicPayload } = require("../utils/payload_gen.js");
const {
  buildPermitSearchPayload,
} = require("../permit_processors/permit_search_payload.js");
const {
  submitPermitSearch,
} = require("../permit_processors/get_permit_lists.js");

const {
  parsePermitResults,
} = require("../permit_processors/permit_list_parser.js");

//date util
const { getFormattedDate } = require("../utils/date_handlers/date_format.js");

//

async function permitsFrom(offset) {
  const html = await getPermitPage();
  const basePayload = buildBasicPayload(html);
  const date = getFormattedDate(offset); // yesterday
  const payload = buildPermitSearchPayload(basePayload, date, date);
  const permitListHTML = await submitPermitSearch(payload);
  const permits = parsePermitResults(permitListHTML);
  return { permits, permitListHTML };
}

module.exports = { permitsFrom };
