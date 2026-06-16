const fs = require("fs").promises;
const path = require("path");
const { permitsFrom } = require("./main/permit.js");
// TODO: Import your actual permitsFrom function here
// const { permitsFrom } = require('./your-permits-module');

// Configuration
const DELAY_MS = 1500; // Delay in milliseconds (1.5 seconds)
const OUTPUT_FOLDER = path.join(__dirname, "permits_archive");
const DAYS_TO_FETCH = 365;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchYearOfPermits() {
  try {
    // Create the destination folder if it does not already exist
    await fs.mkdir(OUTPUT_FOLDER, { recursive: true });
    console.log(`Output folder verified at: ${OUTPUT_FOLDER}`);

    // Loop from 365 days ago up to today (0 days ago)
    for (let i = DAYS_TO_FETCH; i >= 0; i--) {
      const daysAgo = -i;
      console.log(`Fetching permits for ${daysAgo} days ago...`);

      try {
        // Call the permit function
        const data = await permitsFrom(daysAgo);

        if (data && data.permits) {
          // Generate a standardized filename
          const fileName = `permits_day_${i}.json`;
          const filePath = path.join(OUTPUT_FOLDER, fileName);

          // Save the specific day's permits
          await fs.writeFile(filePath, JSON.stringify(data.permits, null, 2));
          console.log(`Successfully saved: ${fileName}`);
        } else {
          console.warn(`No permits data found for ${daysAgo} days ago.`);
        }
      } catch (fetchError) {
        console.error(
          `Failed to retrieve or save data for ${daysAgo} days ago:`,
          fetchError.message,
        );
      }

      // Introduce delay before the next iteration, except on the last item
      if (i > 0) {
        console.log(`Waiting ${DELAY_MS}ms...`);
        await delay(DELAY_MS);
      }
    }

    console.log("Archiving process complete.");
  } catch (err) {
    console.error("An error occurred during the archiving process:", err);
  }
}

// Execute the function
fetchYearOfPermits();
