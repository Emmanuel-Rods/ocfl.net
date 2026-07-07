const fs = require("fs").promises;
const path = require("path");

// --- 1. Define the Master Blueprint ---
// Every key your Supabase DB will EVER expect goes here.
const UNIVERSAL_SCHEMA = {
  permitInfo: null,
  people_details: null,
  associated_properties: null,
  permit_report_pdf: null,
  processes_and_reports: null,
};

async function cleanFolder(inputFolder, outputFolder) {
  await fs.mkdir(outputFolder, { recursive: true });

  const allFiles = await fs.readdir(inputFolder);
  const jsonFiles = allFiles.filter((file) => file.endsWith(".json"));

  console.log(
    `Starting Master Blueprint cleanup for ${jsonFiles.length} files...\n`,
  );

  let processedCount = 0;
  const errorLog = [];

  // --- 2. Loop through the Input Folder ---
  for (const filename of jsonFiles) {
    const inputFilePath = path.join(inputFolder, filename);
    const outputFilePath = path.join(outputFolder, filename);

    try {
      // Read and parse the JSON file
      const rawDataString = await fs.readFile(inputFilePath, "utf-8");
      const rawData = JSON.parse(rawDataString);

      const cleanedData = structuredClone(UNIVERSAL_SCHEMA);

      // --- 3. Overwrite the nulls with real data (if it exists) ---
      if (rawData.permit && rawData.permit.permitInfo) {
        cleanedData.permitInfo = rawData.permit.permitInfo;
      }

      cleanedData.people_details = rawData.people_details ?? null;
      cleanedData.associated_properties = rawData.associated_properties ?? null;
      cleanedData.permit_report_pdf = rawData.permit_report_pdf ?? null;

      // Orange County Smart Filter for processes
      const processesSource = rawData.processes_and_reports;
      if (Array.isArray(processesSource) && processesSource.length > 0) {
        const allowedGroups = ["Inspection History", "Scheduled Inspections"];
        const filteredProcesses = processesSource.filter((p) =>
          allowedGroups.includes(p.group),
        );

        if (filteredProcesses.length > 0) {
          cleanedData.processes_and_reports = filteredProcesses;
        }
      }

      // --- 4. Save the cleanly structured file to the Output Folder ---
      await fs.writeFile(
        outputFilePath,
        JSON.stringify(cleanedData, null, 2),
        "utf-8",
      );

      processedCount++;
    } catch (error) {
      errorLog.push(`[${filename}] Failed to process: ${error.message}`);
    }
  }

  // --- Terminal Summary ---
  console.log("-".repeat(40));
  console.log(
    `CLEANUP COMPLETE: Processed ${processedCount} out of ${jsonFiles.length} files.`,
  );

  if (errorLog.length > 0) {
    console.log("\n[WARNING] The following files encountered errors:");
    for (const error of errorLog) {
      console.log(`  -> ${error}`);
    }
  }
}

function cleanPermitData(rawData) {
  const cleanedData = structuredClone(UNIVERSAL_SCHEMA);

  // --- 2. Overwrite the nulls with real data (if it exists) ---
  if (rawData.permit && rawData.permit.permitInfo) {
    cleanedData.permitInfo = rawData.permit.permitInfo;
  }

  cleanedData.people_details = rawData.people_details ?? null;
  cleanedData.associated_properties = rawData.associated_properties ?? null;
  cleanedData.permit_report_pdf = rawData.permit_report_pdf ?? null;

  // Orange County Smart Filter for processes
  const processesSource = rawData.processes_and_reports;
  if (Array.isArray(processesSource) && processesSource.length > 0) {
    const allowedGroups = ["Inspection History", "Scheduled Inspections"];
    const filteredProcesses = processesSource.filter((p) =>
      allowedGroups.includes(p.group),
    );

    if (filteredProcesses.length > 0) {
      cleanedData.processes_and_reports = filteredProcesses;
    }
  }

  return cleanedData;
}

module.exports = { cleanFolder, cleanPermitData };
