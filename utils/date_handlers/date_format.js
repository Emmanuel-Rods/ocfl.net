const throwFutureDateError = require("./date_error.js");

function getFormattedDate(offset = 0) {
  const date = new Date();

  // Apply the day offset
  date.setDate(date.getDate() + offset);

  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  if (offset > 0) {
    throwFutureDateError({ mm, dd, yyyy });
  }
  return `${mm}/${dd}/${yyyy}`;
}

module.exports = { getFormattedDate };
