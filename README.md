# No-Code Intake Automation

A Google Form that, on every submission, uses Claude to write a one-line summary + urgency flag, saves it back into the linked Google Sheet, and emails a staff member. No server, no deployment — it lives inside a Google Sheet.

**Why this one matters for your application:** it's deliberately humble. Claude Corps literally lists "a workflow that connects two tools (e.g., a form that populates a sheet)" as something they value. Shipping this proves you'll happily do high-utility glue work instead of over-engineering — and it lets you honestly check the **"Google Apps Script or a no-code tool"** comfort box.

## Setup (about 30 minutes, no coding required beyond pasting)

1. **Create a Google Form** with a few intake questions (Name, What do you need, Language, etc.).
2. In the Form, click **Responses → Link to Sheets** to create a linked Google Sheet.
3. Open that Sheet → **Extensions → Apps Script**.
4. Delete the placeholder code, paste in `Code.gs` from this folder.
5. Fill in the four CONFIG values at the top (API key, notify email).
   - *Safer option:* instead of pasting the key, use **Project Settings → Script Properties**, add `ANTHROPIC_API_KEY`, and change the code to `PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY')`.
6. Run `testSummary` once (click **Run**) and approve the permissions prompt. Check the log — you should see a summary + urgency line.
7. Set the trigger: **Triggers (clock icon) → Add Trigger → choose `onFormSubmit`, event source "From spreadsheet", type "On form submit"**.
8. Submit a test response through the Form. Within a few seconds the Sheet gets an **AI Summary** column and you get an email.

## Make it real

Offer this to the nonprofit from project #5 for one of their existing intake or contact forms. Turning a pile of raw form responses into triaged, summarized, emailed alerts is genuinely useful and takes you an afternoon.

## Judgment note (good to mention in an interview)

The prompt tells Claude to be **conservative** with the HIGH urgency flag (only safety/housing/medical). Auto-triaging real people's needs is exactly where you must design against false confidence — a good example of the judgment Claude Corps screens for.
