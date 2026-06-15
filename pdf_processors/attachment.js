async function getAttachmentHtml(attachmentRSN) {
  const url = `https://fasttrack.ocfl.net/fileservices/DownloadAttachment.aspx?attachmentrsn=${attachmentRSN}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow", // This is the equivalent of '--location' in curl
      headers: {
        // Some servers reject automated requests without a User-Agent
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Read and return the response body as text/html
    const html = await response.text();
    return html;
  } catch (error) {
    console.error("Failed to fetch the URL:", error);
    throw error;
  }
}

module.exports = { getAttachmentHtml };
