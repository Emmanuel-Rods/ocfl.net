function buildPermitSearchPayload(payload, startDate, endDate) {
  if (!startDate) {
    throw new Error("Startdate not specified");
  }
  payload[
    "ctl00$ContentPlaceHolder1$ucHeaderAndSearchBP$uc_dateissue_bp$IssueDate1"
  ] = startDate;

  payload[
    "ctl00$ContentPlaceHolder1$ucHeaderAndSearchBP$uc_dateissue_bp$IssueDate2"
  ] = endDate;

  payload[
    "ctl00$ContentPlaceHolder1$ucHeaderAndSearchBP$uc_SearchBtnWProgress$btnSearch"
  ] = "Search";

  return payload;
}

module.exports = { buildPermitSearchPayload };
