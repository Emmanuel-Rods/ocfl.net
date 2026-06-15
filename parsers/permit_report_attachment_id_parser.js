const cheerio = require("cheerio");

function permitReportID(html) {
  const $ = cheerio.load(html);

  // Helper to clean up extracted text (removes &nbsp;, newlines, and extra spaces)
  const cleanText = (text) => {
    return text
      ? text
          .replace(/\u00A0/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "";
  };

  // 6. PERMIT REPORT PDF DOWNLOAD ID ! this gives wrong id
  let permitReportAttachmentId = null;
  $("a").each((i, el) => {
    if (cleanText($(el).text()) === "Permit") {
      // Support both cases because Cheerio normalizes to lowercase
      const onClickStr = $(el).attr("onclick") || $(el).attr("onClick");

      // Validate the attribute actually exists before trying to read it
      if (onClickStr) {
        const match = onClickStr.match(/f_DownloadAttachment\((\d+)\)/);
        if (match) {
          permitReportAttachmentId = parseInt(match[1], 10);
        }
      }
    }
  });

  return permitReportAttachmentId;
}

// console.log(parsePermitInformation(html));

module.exports = { permitReportID };
