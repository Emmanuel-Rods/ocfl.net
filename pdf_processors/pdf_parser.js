const fs = require("fs");
const { PDFParse } = require("pdf-parse");

async function extractTextFromLocalPDF(dataBuffer) {
  try {
    // 1. Read the local PDF file (this returns a Node.js Buffer)
    // const dataBuffer = fs.readFileSync(pdfFilePath);

    // 2. Convert the Node.js Buffer to a native JS Uint8Array
    const uint8Array = new Uint8Array(dataBuffer);

    // 3. Initialize the parser with the Uint8Array
    const parser = new PDFParse(uint8Array);

    // 4. Extract the text
    const result = await parser.getText();

    console.log("--- Extracted Text ---");
    console.log(result.text);
    // fs.writeFileSync("pdf.txt", result.text);

    return result.text;
  } catch (error) {
    console.error("Error extracting text:", error);
  }
}

module.exports = { extractTextFromLocalPDF };
