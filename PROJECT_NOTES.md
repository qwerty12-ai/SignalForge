# SignalForge – Development Notes & Debugging Log

## Project Overview

SignalForge is an AI-powered outreach engine that automates the early stages of B2B prospecting.

### Pipeline Flow

```
Input Domain (seed domain)
↓
Company Discovery — Ocean v3 (lookalike companies)
↓
Decision Makers — Prospeo search-person (all lookalike companies)
↓
Email Resolution — Prospeo enrich-person (all decision makers)
↓
Outreach Generation — Bravo (personalized copy per person)
↓
Safety Checkpoint — UI preview before sending
↓
Email Sending — Brevo SMTP API
↓
Results UI
```

---

## Final Architecture

### Stage 1: Company Discovery

**Provider:** Ocean.io v3

**Purpose:**
- Accept a seed domain from the user
- Discover 5 lookalike companies with similar firmographics
- Normalize all company data for downstream services

**Final Endpoint:**
```
POST https://api.ocean.io/v3/search/companies
```

**Body:**
```json
{
  "size": 5,
  "companiesFilters": {
    "lookalikeDomains": ["hubspot.com"]
  }
}
```

**Output:**
```json
[
  { "name": "", "domain": "", "website": "", "description": "" },
  { "name": "", "domain": "", "website": "", "description": "" }
]
```

---

### Ocean Journey — Full Debug History

**Attempt 1 — v3 lookalike (initial, wrong usage):**
- Used `lookalikeDomains` but passed result `[0]` only to Prospeo
- Ocean returned `wthubspot.com` instead of `hubspot.com`
- Root cause: misunderstood the assignment — seed domain is the input, lookalikes are the targets
- Prospeo failed because it received a garbage domain

**Attempt 2 — v1 enrich:**
- Tried `GET /v1/companies/{domain}`
- Returned 404 — endpoint doesn't exist at that path

**Attempt 3 — v2 enrich:**
- `POST /v2/enrich/company` with `{ company: { domain } }`
- This worked and returned correct company data
- But it fetches the seed company, not lookalikes — wrong per assignment spec

**Final solution — v3 correctly understood:**
- Re-read assignment: Ocean's job is lookalike discovery, not seed lookup
- All 5 returned companies are the targets
- Pipeline now passes all 5 domains to Prospeo sequentially
- AI-assisted debugging helped identify the domain mismatch and correct the pipeline flow

> **Lesson Learned:** Read the assignment spec before reading the API docs. The endpoint was correct all along — the mental model was wrong.

---

### Stage 2: Decision Makers

**Provider:** Prospeo `/search-person`

**Purpose:** Find decision makers across all 5 lookalike companies.

**Final Endpoint:**
```
POST https://api.prospeo.io/search-person
```

**Body:**
```json
{
  "page": 1,
  "filters": {
    "company": {
      "websites": {
        "include": ["company.domain"]
      }
    },
    "person_seniority": {
      "include": ["Founder/Owner", "C-Suite", "Vice President", "Director"]
    }
  }
}
```

**Output:**
```json
[
  { "name": "", "role": "", "personId": "", "linkedinUrl": "", "companyDomain": "" }
]
```

---

### Prospeo Journey — Full Debug History

**Error 1 — `INVALID_FILTERS` on seniority `"VP"`:**
- `"VP"` is not a valid enum — correct value is `"Vice President"`
- AI-assisted: fetched Prospeo docs to get exact valid enum list

**Error 2 — `INVALID_FILTERS` on seniority `"Owner"`:**
- `"Owner"` standalone is not valid — correct value is `"Founder/Owner"`

**Error 3 — `INVALID_FILTERS` on `company_website`:**
- Tried flat `"company_website": "hubspot.com"` — field doesn't exist
- Tried `"company_website": "https://www.hubspot.com"` — also rejected
- Correct shape is nested: `company.websites.include: [domain]`

**Error 4 — Rate limit exceeded on parallel calls:**
- Used `Promise.all` across 5 companies — all fired simultaneously
- Fixed by switching to sequential `for` loop with 1 second delay between calls

**Error 5 — `NO_RESULTS` treated as crash:**
- Prospeo returns 400 for empty results, not just actual errors
- Fixed by checking `error_code === "NO_RESULTS"` and returning `[]` gracefully

**Error 6 — Rate limit on enrich-person:**
- Prospeo also rate limits `/enrich-person` calls
- Fixed by adding 500ms delay between each enrich call
- Pipeline continues gracefully if a person's email can't be resolved

> **Lesson Learned:** Most third-party API failures are payload mismatches. Log the full error body before assuming anything else.

---

### Stage 3: Email Resolution

**Provider:** Prospeo `/enrich-person`

**Purpose:** Resolve verified work email from `person_id` returned by search.

**Endpoint:**
```
POST https://api.prospeo.io/enrich-person
```

**Body:**
```json
{
  "only_verified_email": false,
  "data": {
    "person_id": "person.personId"
  }
}
```

**Output:**
```json
[{ "email": "", "verified": true }]
```

**Notes:**
- Loops across all decision makers, not just the first
- Returns `[{ email: "Unavailable", verified: false }]` if no email found
- 500ms delay between calls to avoid rate limits
- `personName` and `personRole` attached to each contact for downstream use

---

### Stage 4: Outreach Generation

**Provider:** Bravo (custom, local)

**Status:** ✅ Live — generates personalized copy per person per company.

**Logic:**
- Uses first name only for natural tone
- Pulls first sentence of company description from Ocean as context
- Acknowledges the person's specific role
- Ends with a concrete ask — 15-minute call

**Output per contact:**
```json
{
  "subject": "A thought on LeadSquared's growth",
  "body": "Hi Srikanth, LeadSquared is a new-age SaaS CRM..."
}
```

**Company matching:**
- Each contact's email domain is matched back to the correct lookalike company
- Ensures email says "At LeadSquared" not "At HubSpot" (the seed)

---

### Stage 5: Email Sending

**Provider:** Brevo REST API

**Status:** ✅ Live — fires personalized email per contact via Brevo SMTP relay.

**Endpoint:**
```
POST https://api.brevo.com/v3/smtp/email
```

**Safety Checkpoint:**
- Pipeline runs all 4 stages and returns results to UI
- User reviews all outreach previews before any email fires
- "Confirm & Send All" button triggers `/api/send` route
- Brevo fires one email per contact with 300ms delay between sends
- Failed sends are logged but don't crash the rest

**Sender:**
- Verified domain: `signal-forge.co.in`
- DKIM and DMARC configured

---

## Frontend Bugs

### Bug #1 — Decision Maker Card Disappeared

**Symptoms:**
- API returned valid data
- Console showed `decisionmakers` array
- UI remained empty

**Root Cause:** Typo in `ResultsPanel`:
```js
// ❌ Wrong
results.decisionsmakers

// ✅ Correct
results.decisionmakers
```

> **Lesson Learned:** Always verify object property names before assuming API failure.

---

### Bug #2 — Visit Website Links Failed

**Root Cause:** Company object structure changed during Ocean integration.

**Solution:** Ensure company object consistently contains `website` field.

> **Lesson Learned:** Keep internal data contracts stable even when external APIs change.

---

### Bug #3 — CompanyCard crashed with `.map` undefined

**Root Cause:** `ResultsPanel` was passing `results.company` (single object) after pipeline was updated to return `results.companies` (array).

**Fix:** Updated `ResultsPanel` to pass `results.companies` and updated `CompanyCard` to render a list.

---

### Bug #4 — Outreach showed empty subject and message

**Root Cause:** `.map()` was used to call `outreachGeneration` but the function wasn't being awaited properly inside map — returned `{}` for every item.

**Fix:** Switched to a `for` loop which handles the return value correctly.

---

### Bug #5 — Wrong company name in outreach emails

**Root Cause:** All outreach was generated using `companies[0]` (first lookalike) regardless of which company the contact actually worked at. Contacts from LeadSquared were getting emails that said "At HubSpot".

**Fix:** Match each contact's email domain against the lookalike companies array to find the correct company before generating outreach.

---

## Current Project Status

### Completed
- ✅ Ocean v3 Integration — lookalike discovery
- ✅ Company Discovery Stage — all 5 companies
- ✅ Prospeo Search Integration — decision makers across all companies
- ✅ Prospeo Enrich Integration — email resolution for all people
- ✅ Decision Maker Stage
- ✅ Email Resolution Stage
- ✅ Outreach Generation — personalized per person per company
- ✅ Brevo Integration — emails actually send
- ✅ Safety Checkpoint UI — confirm before send
- ✅ Frontend Rendering
- ✅ Results Panel
- ✅ Pipeline Status Tracking
- ✅ Rate limit handling — sequential calls with delays
- ✅ Graceful degradation — partial failures don't crash pipeline

---

## Known Limitations

1. Prospeo may return no results for some lookalike domains — handled gracefully with empty array
2. Ocean v3 occasionally returns low-quality lookalike domains (e.g. `wthubspot.com`) — no filtering applied
3. Prospeo free tier limits — sequential delays help but credits are finite
4. Full pipeline takes 15–20 seconds due to sequential API calls with delays

---

## Interview Notes

**Q: Why did you use Ocean v3 lookalike instead of enrich?**

The assignment specifies that Ocean's job is to expand a seed domain into lookalike companies — similar firmographics and market. I initially misunderstood this and tried the enrich endpoint, which returns data on the seed company itself. Once I re-read the spec, I corrected the flow: the seed domain goes in, 5 target companies come out, and Prospeo runs on all of them.

---

**Q: What was the most difficult bug?**

The hardest issue was the data contract mismatch between Ocean and Prospeo. Ocean returned domains like `wthubspot.com` which Prospeo couldn't find anyone for. I tested multiple API versions, logged every response, and used AI-assisted debugging to identify that the core problem was a misunderstanding of the pipeline's intent — not a code bug. Once I understood that lookalikes are the targets, everything fell into place.

---

**Q: What did you learn?**

That integrating multiple third-party APIs is mostly about understanding data contracts and reading docs carefully. Most of the bugs weren't logic errors — they were wrong field names, wrong enum values, wrong endpoint versions, or wrong mental models about what each API is supposed to do. AI-assisted debugging was useful for fetching docs in real time and identifying payload mismatches faster.

---

**Q: How does the safety checkpoint work?**

The pipeline runs all four stages and returns the full results to the UI — companies, decision makers, contacts, and generated outreach previews — without sending anything. The user reviews every email before it fires. Only when they click "Confirm & Send All" does the frontend call `/api/send`, which loops through each contact and sends via Brevo with a delay between calls.

---

**Q: How did you handle rate limits?**

Two places. For Prospeo search, I replaced `Promise.all` with a sequential `for` loop and added a 1 second delay between company lookups. For enrich, I added a 500ms delay between each person. For Brevo sending, I added a 300ms delay between emails. Partial failures at any stage return empty arrays rather than crashing — the pipeline continues with whatever data it has.

---

**Q: What's left?**

Deploy to Vercel, record the demo video, and submit. The pipeline is fully functional end to end.

---

## Personal Note

This project was not built by following a tutorial.

Major challenges included:
- Ocean API version selection and understanding lookalike vs enrich
- Domain normalization and downstream data quality
- Prospeo payload debugging across multiple error types and invalid enum values
- Rate limit handling across sequential API calls at three different stages
- Frontend rendering issues from changing data shapes mid-build
- Data contract mismatches between pipeline stages
- Outreach company mismatch — fixing personalization to use the correct lookalike company per contact

The final solution was reached through iterative debugging, structured logging, AI-assisted doc lookup and error analysis, and refinement across multiple attempts — not a single clean implementation from the start.