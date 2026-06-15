const { buildBasicPayload } = require("../utils/payload_gen.js");
const {
  buildPermitPayload,
} = require("../permit_processors/permit_payload.js");
const { getPermit } = require("../permit_processors/get_permit.js");
const { parsePermitHTML } = require("./parser.js");

async function getPermitDetails(permit, html) {
  const basepayload = buildBasicPayload(html);
  const payload = buildPermitPayload(
    basepayload,
    permit.FolderRSN,
    permit.ReferenceFile,
  );
  const permitHTML = await getPermit(payload, permit.SearchID);
  const permitData = parsePermitHTML(permitHTML);
  return { permitData, permitHTML };
}

module.exports = { getPermitDetails };
