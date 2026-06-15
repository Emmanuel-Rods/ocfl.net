const cheerio = require("cheerio");

function parsePermitInformation(html) {
  const $ = cheerio.load(html);

  const getCleanText = (selector) => {
    return $(selector)
      .text()
      .replace(/[\s\xA0]+/g, " ")
      .trim();
  };

  // Create an object to hold the extracted data
  const permitInfo = {
    permitNumber: getCleanText('#permitDetails2 td[data-title="PERMIT#"]'),
    applyDate: getCleanText('#permitDetails2 td[data-title="APPLY DATE"]'),
    name: getCleanText('#permitDetails2 td[data-title="NAME"]'),
    status: getCleanText('#permitDetails2 td[data-title="STATUS"]'),
    issueDate: getCleanText('#permitDetails2 td[data-title="ISSUE DATE"]'),
    expireDate: getCleanText('#permitDetails2 td[data-title="EXPIRE DATE"]'),
    type: getCleanText('#permitDetails2 td[data-title="TYPE"]'),
    subType: getCleanText('#permitDetails2 td[data-title="SUB TYPE"]'),
    workType: getCleanText('#permitDetails2 td[data-title="WORK TYPE"]'),
    address: getCleanText('#permitDetails2 td[data-title="ADDRESS"]'),
    parcel: getCleanText('#permitDetails2 td[data-title="PARCEL"]'),
    description: getCleanText('#permitDetails2 td[data-title="DESCRIPTION"]'),

    // We can also grab the map URL from the link element
    mapLink: $(".detailDataHeading a").attr("href") || null,
  };

  return { permitInfo };
}

// console.log(parsePermitInformation(html));

module.exports = { parsePermitInformation };
