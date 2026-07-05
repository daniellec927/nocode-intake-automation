# Setup — No-Code Intake Automation (~20 minutes)

You'll build a Google Form that, on every submission, uses Claude to summarize the response, writes it into the linked Sheet, and emails you. No prior coding needed — you're pasting one script and clicking a few buttons.

**What you need:** a Google account and your Anthropic API key (the same `sk-ant-...` you used for the other projects).

---

## Step 1 — Create the Form (5 min)
1. Go to https://forms.new
2. Title it something like **"Client Intake"**.
3. Add a few questions, e.g.:
   - *Name* (short answer)
   - *What do you need help with?* (paragraph)
   - *Preferred language* (short answer)
   - *Phone or email* (short answer)

## Step 2 — Link it to a Sheet (1 min)
1. In the Form, click the **Responses** tab.
2. Click the green **Link to Sheets** icon → **Create a new spreadsheet** → **Create**.
3. The Sheet opens. Keep this tab open — the rest happens here.

## Step 3 — Open the script editor (1 min)
1. In the Sheet, click **Extensions → Apps Script**.
2. Delete the little `function myFunction() {}` placeholder.
3. Open `Code.gs` from this folder, copy everything, and paste it in.
4. Click the **Save** icon (💾).

## Step 4 — Add your API key safely (2 min)
1. In Apps Script, click the **⚙️ Project Settings** (left sidebar).
2. Scroll to **Script Properties → Add script property**.
3. Property = `ANTHROPIC_API_KEY`, Value = your `sk-ant-...` key. **Save script properties.**
   *(This keeps your key out of the code so it's safe to share the script.)*

## Step 5 — Test it once (3 min)
1. Back in the editor, pick **`testSummary`** in the function dropdown (top toolbar) → click **Run**.
2. A permissions popup appears the first time: **Review permissions → choose your account → Advanced → Go to (project) → Allow.** (This is Google asking if the script can use Gmail/Sheets — it's your own script.)
3. Click **Execution log** at the bottom. You should see something like:
   > *A Spanish-speaking parent facing eviction next week needs housing help.*
   > *URGENCY: HIGH*

If you see that, Claude is working. 🎉

## Step 6 — Make it run on every submission (2 min)
1. In Apps Script, click the **⏰ Triggers** icon (left sidebar) → **Add Trigger** (bottom-right).
2. Set:
   - Function: **`onFormSubmit`**
   - Event source: **From spreadsheet**
   - Event type: **On form submit**
3. **Save** (approve permissions again if asked).

## Step 7 — Try the whole thing (2 min)
1. Open your Form (the **Preview** eye icon), submit a test response.
2. Within a few seconds: your Sheet gets a new **AI Summary** column with the one-line summary + urgency, and you get an email titled **"New form submission."**

Done — that's a live workflow connecting **Form → Sheet → Claude → Gmail.**

---

## Now you can honestly check these application boxes
- ✅ **A workflow that connects two tools** (form → sheet, plus Claude and email)
- ✅ **Google Apps Script or a no-code tool** (the "comfortable using" question)
- ✅ **Something that uses an API** and **A tool that uses Claude** (already true from your other projects, reinforced here)

## For your portfolio / application
- Screen-record a 30-second clip: submit the form → show the Sheet auto-fill → show the email. Drop it in the optional "share something you built" field.
- You can also paste `Code.gs` into a GitHub repo (see the top-level README's GitHub steps) — just never commit your API key (it lives in Script Properties, not the code).

## Troubleshooting
- **"Setup needed: add ANTHROPIC_API_KEY…"** → Step 4 wasn't saved. Re-add the script property (exact name `ANTHROPIC_API_KEY`).
- **"AI summary failed: … temperature/model…"** → your model name may have changed; update `MODEL` at the top of `Code.gs` to a current one from docs.claude.com.
- **No email arrived** → check spam; confirm the trigger in Step 6 is `onFormSubmit` / On form submit.
- **Nothing happens on submit** → make sure you added the trigger (Step 6), not just ran the test.

## Optional: no API key at all
If you'd rather skip the AI part, you can still make a valid "connects two tools" workflow: delete the `summarizeWithClaude` call and just email yourself the raw submission. That connects Form → Sheet → Gmail with zero setup. The Claude version is more impressive, though — and you already have a key.
