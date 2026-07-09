const { permitsFrom } = require("./main/permit.js");
const { filterPermits } = require("./utils/filter_permits.js");
const fs = require("fs").promises;

//
const {
  processSinglePermit,
} = require("./main/main_processing_permits_interface.js");

const { uploadFolder } = require("./db/upload.js");
const { deleteFolders } = require("./utils/deleteFolders.js");

const getDataByStatus = require("./db/getPreviousData.js");
const { searchPermitNumber } = require("./search_permits/search.js");
const { comparePermitHashes } = require("./utils/hashes/compare.hash.js");

// for optimisations
const {
  getPermitPage,
} = require("./permit_processors/get_default_permit_page.js");

async function main() {
  await fs.mkdir("permits", { recursive: true });
  console.log("fetching permits...");

  const permitFile = await getDataByStatus("Issued"); // temp hardcoded
  // const permitFile = "Issued.json";
  const rawJson = await fs.readFile(permitFile, "utf-8");
  const permits = JSON.parse(rawJson);

  // concurrency
  const concurrencyLimit = 6;
  const executing = new Set();

  //call it once here ( for optimazation )
  const html = await getPermitPage();

  for (const permit of permits) {
    // Wrap the work in an async IIFE (Immediately Invoked Function Expression)
    const task = (async () => {
      try {
        console.log("Processing Permit :", permit.permit_number);
        const data = await searchPermitNumber(permit.permit_number, html);
        await processSinglePermit(data.permit, data);
      } catch (error) {
        console.log("An Error Occured while fetching ", permit.permit_number);
      }
    })();

    // Add the running task to our Set
    executing.add(task);

    // When the task finishes (success or fail), remove it from the Set
    task.finally(() => executing.delete(task));

    // If we have reached the limit of 5, wait for at least one to finish
    if (executing.size >= concurrencyLimit) {
      await Promise.race(executing);
    }
  }

  // Wait for the final few tasks to finish up
  await Promise.all(executing);
  // comparision logic here
  comparePermitHashes(permitFile, "permits", "DIFF_FOLDER");
  await uploadFolder("DIFF_FOLDER");
  await deleteFolders(["permits"]);
}

// Call the main function to start the process
main().catch(console.error);
