const { getInspection } = require("../inspection_processors/get_inspection.js");
const {
  getInspectionDetails,
} = require("../inspection_processors/inspection_parser.js");

const { buildBasicPayload } = require("../utils/payload_gen.js");

async function inspections(permit, html) {
  //either inspection history or sheduled inspection
  const inspectionArray = [];
  const targetGroups = ["Inspection History", "Scheduled Inspections"];

  // Filter the array
  const filteredInspections = permit.processes_and_reports.filter((item) =>
    targetGroups.includes(item.group),
  );
  const payload = buildBasicPayload(html);
  for (const inspection of filteredInspections) {
    const inspectionHTML = await getInspection(payload, inspection.processKey);
    const parsedInspection = getInspectionDetails(inspectionHTML);
    inspectionArray.push(parsedInspection);
  }

  return inspectionArray;
}

module.exports = { inspections };
