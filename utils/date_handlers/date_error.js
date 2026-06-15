const futureDateErrors = [
  `The scraper checked the future and found:
- no permits
- flying cars still delayed
- JavaScript somehow still exists`,

  `I asked the server for future permits.
The server asked me if I was okay.`,

  `The scraper attempted time travel but got stuck in an infinite loading spinner somewhere in 2029.`,

  `The intern responsible for maintaining the time machine quit last week.`,

  `This scraper is powerful, but not "Netflix sci-fi original series" powerful.`,

  `This feature requires:
- a quantum computer
- 14 PhDs
- permission from CERN`,

  `Even the government hasn't uploaded that data yet...
which honestly might be the most realistic part of this error.
`,

  `Future permit data is unavailable.
Time travel support is planned for v2.0.`,
  `You've selected a date in the future, so there are no permits available yet.

Unless you've secretly built a time-travel module capable of scraping future government records, stick to 0 or negative offsets.`,
];

function throwFutureDateError({ mm, dd, yyyy }) {
  const randomIndex = Math.floor(Math.random() * futureDateErrors.length);

  const randomMessage = futureDateErrors[randomIndex];

  throw new Error(
    `Future date detected: ${mm}/${dd}/${yyyy}

    ${randomMessage}

    Please use 0 or negative offsets.

`,
  );
}

module.exports = throwFutureDateError;
