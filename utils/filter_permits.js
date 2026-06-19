function filterPermits(permits) {
  // Define the allowed criteria based on your instructions
  const allowedOcc = [
    "01 Single Family",
    "02 Townhouse",
    "05 Five or more Family",
    "06 Mobile Home-RV",
    "10 Outdoor Pool",
    "13 Store-Shop-Warehouse-Mall-Rest-laund", // !from doc
    "13 Store-Shop-Warehouse-Mall-Rest.-Laund.", // !from actual json
    "19 Shed-Barn-Silo",
    "26 Non-census",
    "Billboard",
    "Commercial",
    "Ground",
    "Multi-Tenant",
    "Residential",
    "Wall",
  ];

  const allowedWork = ["Addition", "New Construction"];

  const allowedStatus = ["Complete", "Issued"];

  // Apply the filters step by step
  const filteredPermits = permits.filter((p) => {
    // 1. On the PERMIT column select permits starting with "B"
    if (!p["PERMIT#"] || !p["PERMIT#"].startsWith("B")) {
      return false;
    }

    // 2. Apply filter on OCC column
    if (!p["OCC"] || !allowedOcc.includes(p["OCC"])) {
      return false;
    }

    // 3. Apply filter on WORK column
    if (!p["WORK"] || !allowedWork.includes(p["WORK"])) {
      return false;
    }

    // 4. Apply filter on STATUS column
    if (!p["STATUS"] || !allowedStatus.includes(p["STATUS"])) {
      return false;
    }

    // If it passes all the above criteria, keep the row
    return true;
  });

  // Log the results
  console.log(
    `fetched ${permits.length} total permits, ${filteredPermits.length} passed all filters`,
  );

  return filteredPermits;
}

// // Example usage assuming your data object is defined as `data`:
// const finalPermits = processPermits(data.permits);

module.exports = { filterPermits };
