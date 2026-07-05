/**
 * No-Code Intake Automation  (Google Apps Script)
 * -----------------------------------------------
 * Connects three tools with no server: Google Form -> Google Sheet -> Claude -> Gmail.
 * When someone submits your Form, this script:
 *   1. Reads the new row from the linked Sheet
 *   2. Asks Claude for a one-line summary + an urgency flag
 *   3. Writes the summary into an "AI Summary" column
 *   4. Emails you the summary so nothing slips through
 *
 * This is exactly the "a form that populates a sheet" workflow Claude Corps lists.
 *
 * SETUP: follow SETUP.md in this folder (about 20 minutes, no prior coding needed).
 * Your API key is read from Script Properties (Project Settings > Script properties),
 * so it never lives in the code and never gets committed to GitHub.
 */

// ---------- Settings ----------
const MODEL = 'claude-sonnet-5';        // confirm the latest at docs.claude.com
const NOTIFY_EMAIL = Session.getActiveUser().getEmail(); // defaults to you; change to any address
const SUMMARY_COLUMN_HEADER = 'AI Summary';
// ------------------------------

/** Runs automatically on every form submission (set up as a trigger in SETUP.md). */
function onFormSubmit(e) {
  const sheet = e.range.getSheet();
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const row = e.range.getRow();
  const values = sheet.getRange(row, 1, 1, lastCol).getValues()[0];

  // Turn the submission into a readable "Question: answer" block.
  const submission = headers
    .map((h, i) => (h && values[i] !== '' ? `${h}: ${values[i]}` : null))
    .filter(Boolean)
    .join('\n');

  const summary = summarizeWithClaude(submission);

  // Write the summary into the AI Summary column (create it if it doesn't exist).
  let col = headers.indexOf(SUMMARY_COLUMN_HEADER) + 1;
  if (col === 0) {
    col = lastCol + 1;
    sheet.getRange(1, col).setValue(SUMMARY_COLUMN_HEADER);
  }
  sheet.getRange(row, col).setValue(summary);

  MailApp.sendEmail(NOTIFY_EMAIL, 'New form submission', summary + '\n\n---\n' + submission);
}

/** Sends one submission to Claude and returns "summary\nURGENCY: LEVEL". */
function summarizeWithClaude(submission) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) return 'Setup needed: add ANTHROPIC_API_KEY in Project Settings > Script properties.';

  const prompt =
    'Someone submitted this intake form for a nonprofit. In ONE sentence, summarize who they are ' +
    'and what they need. Then, on a new line, output exactly "URGENCY: HIGH", "URGENCY: MEDIUM", or ' +
    '"URGENCY: LOW". Be conservative — only use HIGH for safety, housing loss, or medical urgency.\n\n' +
    submission;

  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      model: MODEL,
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = JSON.parse(response.getContentText());
  if (data && data.content && data.content[0]) return data.content[0].text;
  return 'AI summary failed: ' + response.getContentText();
}

/** Run this once by hand (Run button) to test without submitting the form. */
function testSummary() {
  Logger.log(summarizeWithClaude(
    'Name: Test Person\nWhat do you need?: Facing eviction next week, two kids\nLanguage: Spanish'
  ));
}
