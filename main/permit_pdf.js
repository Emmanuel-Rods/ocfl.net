const { getAttachmentHtml } = require("../pdf_processors/attachment.js");
const { buildBasicPayload } = require("../utils/payload_gen.js");
const {
  downloadPdfFromForm,
} = require("../pdf_processors/permit_pdf_fetcher.js");
const { extractTextFromLocalPDF } = require("../pdf_processors/pdf_parser.js");
const { parsePermitData } = require("../pdf_processors/formater.js");

async function permitPDF(rsn) {
  try {
    const html = await getAttachmentHtml(rsn);
    const payload = buildBasicPayload(html);
    payload["hdnAttachmentRSN"] = rsn;
    const pdfbuffer = await downloadPdfFromForm(payload);
    const pdftext = await extractTextFromLocalPDF(pdfbuffer);
    const PDFJSON = parsePermitData(pdftext);
    return PDFJSON;
  } catch (error) {
    console.log("Error in Fetching PDF");
  }
}

module.exports = { permitPDF };
