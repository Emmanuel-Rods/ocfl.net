const { permitsFrom } = require("./main/permit.js");
const { getPermitDetails } = require("./main/get_individual_permits.js");
const { inspections } = require("./main/inspection.js");
const { permitPDF } = require("./main/permit_pdf.js");
const { filterPermits } = require("./utils/filter_permits.js");
const fs = require("fs").promises;
const fsSync = require("fs");

async function processfrom(day) {
  //   await fs.mkdir("permits", { recursive: true });
  const data = await permitsFrom(-day); // 200 days ago

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

// 1. Create a safe wrapper function
async function safeProcess(day) {
  try {
    await processfrom(day);
  } catch (error) {
    // If it crashes, log it, but DON'T throw the error.
    // This allows the main loop to keep going.
    console.error(`❌ Error on day ${day}:`, error.message);
    return false; // Indicates failure
  }
  return true; // Indicates success
}

async function main() {
  await fs.mkdir("permits", { recursive: true });

  const activePromises = new Set();
  const failedDays = []; // Keep track of days that crashed so you can retry them later

  for (let day = 365; day >= 0; day--) {
    // 2. Call the SAFE function instead of the raw function
    const promise = safeProcess(day).then((success) => {
      if (!success) failedDays.push(day);
    });

    activePromises.add(promise);
    promise.finally(() => activePromises.delete(promise));

    if (activePromises.size >= 3) {
      await Promise.race(activePromises);
    }
  }

  await Promise.all(activePromises);

  // 3. Print a summary at the end
  if (failedDays.length > 0) {
    console.log(
      `⚠️ Finished, but the following days crashed: ${failedDays.join(", ")}`,
    );
  } else {
    console.log("All days processed successfully!");
  }
}

main();
