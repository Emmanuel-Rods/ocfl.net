/**
 * Sends a POST request to search for building permits.
 * @param {Object} payload - Object containing dynamic form data (e.g., __VIEWSTATE, dates).
 * @returns {Promise<string>} - The HTML response from the server.
 */

async function submitPermitSearch(payload) {
  const url = "https://fasttrack.ocfl.net/OnlineServices/permit-building.aspx";

  // Define the headers based on the provided curl command
  const headers = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "max-age=0",
    Connection: "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    Origin: "https://fasttrack.ocfl.net",
    Referer: "https://fasttrack.ocfl.net/OnlineServices/permit-building.aspx",
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
  };

  const form = new URLSearchParams(payload).toString();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: form,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const html = await response.text();
    return html;
  } catch (error) {
    console.error("Failed to submit form:", error);
    throw error;
  }
}

module.exports = { submitPermitSearch };
