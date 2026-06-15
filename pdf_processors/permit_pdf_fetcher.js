const fs = require("fs").promises;

/**
 * Downloads a PDF attachment and writes it to disk.
 *
 * @param {Object} payload - An object containing the form data keys and values.
 * @param {string} outputPath - The file path where the PDF will be saved.
 */
async function downloadPdfFromForm(payload, outputPath) {
  const url = "https://fasttrack.ocfl.net/fileservices/DownloadAttachment.aspx";

  // Convert the JavaScript object into URL-encoded format (like the --data-urlencode flags)
  const formData = new URLSearchParams(payload);

  const headers = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "max-age=0",
    Connection: "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    Origin: "https://fasttrack.ocfl.net",
    Referer: "https://fasttrack.ocfl.net/fileservices/DownloadAttachment.aspx",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "sec-ch-ua":
      '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    // Warning: Cookies and ASP.NET tokens expire! If
  };

  try {
    console.log("Sending request to download PDF...");

    const response = await fetch(url, {
      method: "POST", // Because we are sending form data
      redirect: "follow", // Replicates --location
      headers: headers,
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 1. Get the binary response as an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // 2. Convert it to a Node.js Buffer
    const buffer = Buffer.from(arrayBuffer);

    // 3. Write the buffer to the disk
    // await fs.writeFile(outputPath, buffer);
    return buffer;

    console.log(`✅ Success! PDF saved to: ${outputPath}`);
  } catch (error) {
    console.error("❌ Failed to download the PDF:", error.message);
  }
}

module.exports = { downloadPdfFromForm };
