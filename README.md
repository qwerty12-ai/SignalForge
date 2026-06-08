# SignalForge

**AI-powered B2B outreach engine.** One seed domain in — lookalike companies discovered, decision makers surfaced, emails resolved, personalized outreach generated and sent. Zero manual steps after the input.

## Live Demo

[Hosted on Vercel →](https://signal-forge-ecru.vercel.app/)

## Pipeline

```
seed domain (e.g. hubspot.com)
        ↓
Ocean.io v3       →  5 lookalike companies discovered
        ↓
Prospeo search    →  C-suite / VP / Director per company
        ↓
Prospeo enrich    →  verified work email per person
        ↓
Bravo             →  personalized email copy per person per company
        ↓
Safety checkpoint →  user reviews all emails before anything sends
        ↓
Brevo SMTP API    →  emails fired to each contact
```

## Tech Stack

- **Next.js 16** — frontend + API routes
- **React 19** + **Tailwind CSS 4**
- **Ocean.io API** — lookalike company discovery
- **Prospeo API** — decision maker search + email enrichment
- **Brevo API** — transactional email sending

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── pipeline/route.js     # POST — runs all 4 stages, returns data without sending
│   │   └── send/route.js         # POST — fires Brevo after user confirms
│   ├── layout.js
│   └── page.js
├── components/
│   ├── CompanyCard.js            # renders all 5 lookalike companies with website links
│   ├── CompanyForm.js            # seed domain input + submit
│   ├── DecisionMakerCard.js      # renders all decision makers across companies
│   ├── ErrorState.js
│   ├── LoadingState.js
│   ├── OutreachCard.js           # previews all emails + Confirm & Send button
│   ├── PipelineStatus.js         # 4-stage status grid (green/red per stage)
│   ├── ProspectTable.js          # contacts with verified email status
│   └── ResultsPanel.js           # composes all result cards
└── services/
    ├── pipeline.js               # orchestrates all stages end to end
    ├── providers/
    │   ├── ocean.js              # Ocean.io v3 API client
    │   ├── prospeo.js            # Prospeo search-person + enrich-person
    │   ├── brevo.js              # Brevo email sender
    │   └── bravo.js              # personalized outreach copy generator
    └── stages/
        ├── companyDiscovery.js   # wraps ocean.js, returns normalized company array
        ├── DecisionMakers.js     # loops Prospeo search across all 5 companies
        ├── emailResolution.js    # loops Prospeo enrich across all people
        └── outreachGeneration.js # calls bravo.js, returns outreach object
```

## Getting Started

```bash
git clone https://github.com/qwerty12-ai/signal-forge
cd signal-forge
npm install
```

Create `.env.local`:

```
OCEAN_API_KEY=your_ocean_api_key
PROSPEO_API_KEY=your_prospeo_api_key
BREVO_API_KEY=your_brevo_api_key
```

```bash
npm run dev
```

Open `http://localhost:3000`, enter a seed domain, watch the pipeline run.

## How Each Stage Works

**Stage 1 — Company Discovery**
Ocean.io v3 `POST /search/companies` takes the seed domain and returns 5 lookalike companies with similar firmographics and market position. These are the targets, not the seed. `companyDiscovery.js` normalizes each into `{ name, domain, website, description }`.

**Stage 2 — Decision Makers**
For each of the 5 companies, Prospeo `/search-person` finds up to 5 C-suite, VP, Director, or Founder/Owner contacts. Runs sequentially with a 1 second delay per company. `NO_RESULTS` and rate limit responses return `[]` so the pipeline continues.

**Stage 3 — Email Resolution**
For each decision maker, Prospeo `/enrich-person` resolves a verified work email using the `person_id`. Runs with a 500ms delay per person. Returns `{ email: "Unavailable", verified: false }` if nothing found — never crashes.

**Stage 4 — Outreach Generation**
For each contact, generates a personalized email using their first name, exact role, and the real company description from Ocean. Each contact's email domain is matched back to the correct lookalike company so copy says "At LeadSquared" not "At HubSpot".

**Stage 5 — Safety Checkpoint + Send**
`/api/pipeline` returns all data to the UI — nothing sent yet. User reviews every email preview. Clicking Confirm & Send All calls `/api/send`, which loops through contacts and fires Brevo with a 300ms delay between sends. Individual failures are logged but don't stop the rest.

## Environment Variables

| Variable | Description |
|---|---|
| `OCEAN_API_KEY` | Ocean.io API token |
| `PROSPEO_API_KEY` | Prospeo API key from app.prospeo.io/api |
| `BREVO_API_KEY` | Brevo API key from app.brevo.com settings |

## Deployment

Connect GitHub repo to Vercel, add the three env variables in project settings, deploy.

## Author

**Mohd Abdul Sabeeh**
[github.com/qwerty12-ai](https://github.com/qwerty12-ai) · contact@signal-forge.co.in

---
