const {
  parsePermitInformation,
} = require("../parsers/permit_infomation_parser.js");

const {
  getPermitFieldInfo,
} = require("../parsers/secondary_permit_infomation_parser.js");

const { getSubPermits } = require("../parsers/sub_permits_parser.js");
const { getPeopleDetails } = require("../parsers/peoples_details_parser.js");
const {
  getAssociatedProperties,
} = require("../parsers/associated_properties_parser.js");
const { getProcesses } = require("../parsers/processes_and_reports_parser.js");
const {
  permitReportID,
} = require("../parsers/permit_report_attachment_id_parser.js");

function parsePermitHTML(html) {
  return {
    permit: parsePermitInformation(html),
    permit_field: getPermitFieldInfo(html),
    sub_permits: getSubPermits(html),
    people_details: getPeopleDetails(html),
    associated_properties: getAssociatedProperties(html),
    processes_and_reports: getProcesses(html),
    permitReportAttachmentId: permitReportID(html),
  };
}

module.exports = { parsePermitHTML };
