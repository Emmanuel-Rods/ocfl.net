const { permitsFrom } = require("./main/permit.js");
const { filterPermits } = require("./utils/filter_permits.js");
const fs = require("fs").promises;

//
const {
  processSinglePermit,
} = require("./main/main_processing_permits_interface.js");
const { uploadFolder } = require("./db/upload.js");
const { deleteFolders } = require("./utils/deleteFolders.js");

const dateOffset = -1; // -1 = yesterday

async function main() {
  await fs.mkdir("permits", { recursive: true });
  console.log("fetching permits...");
  const data = await permitsFrom(dateOffset); // 200 days ago

  // Filter the permits
  const filtered = filterPermits(data.permits);

  const CONCURRENCY_LIMIT = 5;
  const activePromises = new Set(); // Tracks currently running tasks

  // Iterate through the filtered permits to manage concurrency
  for (const permit of filtered) {
    // Start the task for the current permit and add its promise to our tracking Set
    const promise = processSinglePermit(permit, data);
    activePromises.add(promise);

    // Once this specific promise finishes, remove it from the Set
    promise.finally(() => activePromises.delete(promise));

    // If we hit the concurrency limit of 5, wait for AT LEAST ONE to finish
    // before starting the next loop iteration
    if (activePromises.size >= CONCURRENCY_LIMIT) {
      await Promise.race(activePromises);
    }
  }

  // After the loop finishes starting all tasks, wait for the last batch (up to 5) to finish
  await Promise.all(activePromises);
  console.log("All permits processed!");

  await uploadFolder("permits");
  await deleteFolders(["permits"]);
}

// Call the main function to start the process
main().catch(console.error);
