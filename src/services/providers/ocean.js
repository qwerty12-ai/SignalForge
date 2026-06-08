// ocean.js
// ⚠️ TESTING — v3 lookalike, correct per assignment. Returns all 5 companies.

export async function searchCompanies(domain) {
    const cleanDomain = domain.replace(/^www\./, "");

    const response = await fetch("https://api.ocean.io/v3/search/companies", {
        method: "POST",
        headers: {
            "x-api-token": process.env.OCEAN_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "size": 5,
            "companiesFilters": {
                "lookalikeDomains": [cleanDomain],
            },
        }),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error("Ocean API error body:", JSON.stringify(errorBody, null, 2));
        throw new Error(`Ocean API Error: ${response.status} — ${JSON.stringify(errorBody)}`);
    }

    const data = await response.json();
    console.log("Ocean v3 results:", data.companies.map(c => ({
        name: c.company.name,
        domain: c.company.domain
    })));

    return data;
}