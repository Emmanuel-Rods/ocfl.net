const { permitsFrom } = require("./main/permit.js");
const { getPermitDetails } = require("./main/get_individual_permits.js");
const { inspections } = require("./main/inspection.js");
const { permitPDF } = require("./main/permit_pdf.js");
const { filterPermits } = require("./utils/filter_permits.js");
const fs = require("fs").promises;
const fsSync = require("fs");

async function main() {
  await fs.mkdir("permits", { recursive: true });
  console.log("fetching permits...");
  const data = await permitsFrom(-200); // 200 days ago
  fsSync.writeFileSync("test.json", JSON.stringify(data, null, 2));
  // await fs.writeFile(
  //   "daily_permits.json",
  //   JSON.stringify(data.permits, null, 2),
  // );

  // const data = JSON.parse(fsSync.readFileSync("test.json", "utf-8"));

  // Filter the permits
  const filtered = filterPermits(data.permits);

  //fsSync.writeFileSync("filtered.json", JSON.stringify(data, null, 2));

  for (const permit of filtered) {
    const permitData = await getPermitDetails(permit, data.permitListHTML);

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
  }
}

main();
