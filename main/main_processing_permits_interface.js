//const { permitsFrom } = require("./permit.js");
const { getPermitDetails } = require("./get_individual_permits.js");
const { inspections } = require("./inspection.js");
const { permitPDF } = require("./permit_pdf.js");
// const { filterPermits } = require("../utils/filter_permits.js");
const fs = require("fs").promises;

// Define the function that processes a single permit
const processSinglePermit = async (permit, data) => {
  try {
    const permitData = await getPermitDetails(permit, data.permitListHTML);

    // Using optional chaining (?.) to safely access nested properties without crashing
    const permitNumberString =
      permitData?.permitData?.permit?.permitInfo?.permitNumber || "";

    // console.log({ permitNumberString }); // Optional: uncomment if you want to see all

    if (permitNumberString.toLowerCase().includes("view parent permit")) {
      console.log(`Skipping subpermit: ${permit["PERMIT#"]}`);
      return; // Use 'return' instead of 'continue' inside an async function
    }

    // All these are awaited sequentially *within* this single permit's processing
    const inspectionData = await inspections(
      permitData.permitData,
      permitData.permitHTML,
    );

    const permit_report_pdf = await permitPDF(
      permitData.permitData.permitReportAttachmentId,
    );

    const result = {
      ...permitData.permitData,
      inspections: inspectionData,
      permit_report_pdf,
    };
    await fs.writeFile(
      `permits/${permit["PERMIT#"]}.json`,
      JSON.stringify(result, null, 2),
    );
    console.log(`✅ Successfully saved: ${permit["PERMIT#"]}`);
  } catch (error) {
    // Try/Catch is crucial in concurrent loops so one failure doesn't crash the others
    console.error(`❌ Error processing ${permit["PERMIT#"]}:`, error.message);
  }
};

module.exports = { processSinglePermit };
