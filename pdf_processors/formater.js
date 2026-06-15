/**
 * Parses raw OCR text from Orange County Building Permits into structured JSON.
 *
 * @param {string} rawText - The raw text extracted from the PDF
 * @returns {Object} Parsed JSON data
 */
function parsePermitData(rawText) {
  // 1. Normalize line endings and create an array of clean lines
  const normalizedText = rawText.replace(/\r\n/g, "\n");
  const lines = normalizedText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const data = {
    permitNumber: null,
    dateIssued: null,
    parcelId: null,
    tenant: null,
    contractor: null,
    contractorLicense: null,
    valueOfWork: null,
    squareFootage: null,
    zoningDistrict: null,
    typeOfConstruction: null,
    buildingRiskCategory: null,
    windSpeed: null,
    natureOfWork: null,
    projectAddress: null,
    contractorAddress: null,
    issuedBy: null,
    owner: null,
    specialConsiderations: null,
    useAndOccupancyType: null,
    buildingCode: null,
  };

  // 2. Strict Pattern Matching (Regex)
  // These data points have specific recognizable patterns regardless of where they land.
  data.permitNumber = (normalizedText.match(/B\d{8}/) || [])[0] || null;
  data.dateIssued =
    (normalizedText.match(
      /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/,
    ) || [])[0] || null;
  data.parcelId =
    (normalizedText.match(/\d{2}-\d{2}-\d{2}-\d{4}-\d{2}-\d{3}/) || [])[0] ||
    null;
  data.valueOfWork =
    (normalizedText.match(/\$[0-9,]+\.\d{2}/) || [])[0] || null;
  data.contractorLicense =
    (normalizedText.match(/[A-Z]{3}\d{7}/) || [])[0] || null;
  data.zoningDistrict =
    (normalizedText.match(/\bR-[1-9][A-Z]*\b/) || [])[0] || null;
  data.typeOfConstruction =
    (normalizedText.match(/Type\s+[A-Z]+/i) || [])[0] || null;
  data.natureOfWork =
    (normalizedText.match(/New Construction|Alteration|Addition|Repair/i) ||
      [])[0] || null;
  data.useAndOccupancyType =
    (normalizedText.match(/[A-Z]-\d+\s*\([^)]+\)/) || [])[0] || null;

  // 3. Address Extraction
  // Looks for a 3-line sequence ending in "FL" and a 5-digit zip code
  const addresses = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\d{5}$/.test(lines[i]) && /FL$/.test(lines[i - 1])) {
      addresses.push(`${lines[i - 2]}, ${lines[i - 1]} ${lines[i]}`);
    }
  }
  if (addresses.length >= 1) data.projectAddress = addresses[0];
  if (addresses.length >= 2) data.contractorAddress = addresses[1];

  // 4. Special Text Block Extraction
  // Extracts the sentence between the Building Code and the "MPH" label
  const specialMatch = normalizedText.match(
    /Code,\s*Residential\s*\n([\s\S]*?)\n\s*MPH/,
  );
  if (specialMatch) {
    data.specialConsiderations = specialMatch[1].trim();
  }

  const codeMatch = normalizedText.match(
    /(\d+(?:st|nd|rd|th)\s+Ed\..*?Code,\s*Residential)/s,
  );
  if (codeMatch) {
    data.buildingCode = codeMatch[1].replace(/\n/g, " ").trim();
  }

  // 5. Contextual/Relative Extraction
  // Uses the reliable regex targets to find surrounding unformatted text (Names)
  const parcelIndex = lines.indexOf(data.parcelId);
  if (parcelIndex !== -1) {
    // Based on the OCR layout, Contractor is right after Parcel ID
    if (lines.length > parcelIndex + 1)
      data.contractor = lines[parcelIndex + 1];
    // Square Footage is two lines after Parcel ID
    if (lines.length > parcelIndex + 2)
      data.squareFootage = lines[parcelIndex + 2];
    // Tenant is right before Parcel ID
    if (parcelIndex - 1 >= 0) data.tenant = lines[parcelIndex - 1];
  }

  const nocIndex = lines.indexOf("No"); // The "NOC" field value
  if (nocIndex !== -1) {
    // Owner is immediately before the NOC value
    if (nocIndex - 1 >= 0) data.owner = lines[nocIndex - 1];
    // Issued By is two lines before the NOC value
    if (nocIndex - 2 >= 0) data.issuedBy = lines[nocIndex - 2];
  }

  // Wind speed is typically a 3-digit number before the nature of work
  const windSpeedIndex = lines.findIndex(
    (l) => /^\d{3}$/.test(l) && l !== data.squareFootage,
  );
  if (windSpeedIndex !== -1) {
    data.windSpeed = lines[windSpeedIndex];
    // Building Risk category (e.g., 'I') is usually right above wind speed
    if (windSpeedIndex - 1 >= 0)
      data.buildingRiskCategory = lines[windSpeedIndex - 1];
  }

  return data;
}

module.exports = { parsePermitData };
