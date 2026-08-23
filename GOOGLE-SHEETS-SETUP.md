# Lead Form → Google Form → Google Sheet (LIVE ✅)

The website's "Request a Call Back" form is connected to the Google Form
**"Interest Form"**, which stores every response in its linked Google Sheet.
No server or Apps Script needed — the browser POSTs directly to the form.

## How it works

- Endpoint (in `script.js`):
  `https://docs.google.com/forms/d/e/1FAIpQLSeiwDBHaxy9QTyRCdfoC62inGwM2zdqhMOSyYBabRQv6Bl61A/formResponse`
- Field mapping (entry IDs read from the live form):

| Website field | Google Form field | Entry ID |
|---|---|---|
| Your name * | Name | `entry.2005620554` |
| Phone number * | Phone number | `entry.1166974658` |
| Email | Email | `entry.1045781291` |
| I'm interested in | What are you interested in? | `entry.122261008` |

- The website's interest dropdown mirrors the form's exact options
  (**Plotted developments / Resorts / Villas**) — required, since Google
  only accepts listed values for dropdown questions.
- A backup copy of every lead (including **Budget** and **Message**, which
  the Google Form doesn't have yet) is also kept in the browser's
  `localStorage` under the key `tac_leads`.

## Want Budget & Message in the Sheet too?

The site collects two extra fields the Google Form doesn't have yet:
**Comfortable budget** and **Anything on your mind?**. To capture them:

1. Open the Google Form → add two **Short answer** questions:
   `Comfortable budget` and `Message`.
2. Tell the developer/agent — the new entry IDs will be read from the form
   and added to the mapping in `script.js` in a minute.

## Verifying submissions

Open the linked Sheet (Google Form → **Responses → 📊 View in Sheets**).
Each website submission appears as a new row within ~1–2 seconds.

A test row was submitted during setup:
**"TEST LEAD (website wiring check — please delete)"** — safe to delete.

## Notes

- The form must stay **unrestricted** (not limited to your organisation),
  otherwise public visitors can't submit. This is already working.
- If you ever edit a dropdown's option labels in Google Forms, update the
  matching `<option>` values in `index.html` to match exactly.
