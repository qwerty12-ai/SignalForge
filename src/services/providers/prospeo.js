export async function findDecisionMakers(company) {
    console.log("Company received:", company.domain);

    const response = await fetch("https://api.prospeo.io/search-person", {
        method: "POST",
        headers: {
            "X-KEY": process.env.PROSPEO_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "page": 1,
            "filters": {
                "company": {
                    "websites": {
                        "include": [company.domain]
                    }
                },
                "person_seniority": {
                    "include": ["Founder/Owner", "C-Suite", "Vice President", "Director"]
                }
            }
        })
    });

    if (response.status === 400 || response.status === 429) {
        const body = await response.json().catch(() => ({}));
        if (body.error_code === "NO_RESULTS") {
            console.log("Prospeo: no results for", company.domain);
            return [];
        }
        console.error("Prospeo error body:", JSON.stringify(body, null, 2));
        throw new Error(`Prospeo API Error: 400 — ${JSON.stringify(body)}`);
    }

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error("Prospeo error body:", JSON.stringify(errorBody, null, 2));
        throw new Error(`Prospeo API Error: ${response.status} — ${JSON.stringify(errorBody)}`);
    }

    const data = await response.json();
    console.log("Prospeo first result:", data.results?.[0]);

    return (data.results || []).slice(0, 5).map((item) => ({
        name: item.person?.full_name || "Unknown",
        role: item.person?.current_job_title || "Unknown",
        personId: item.person.person_id,
        linkedinUrl: item.person?.linkedin_url,
        companyDomain: company.domain
    }));
}

export async function resolveEmail(person) {
    console.log("Prospeo called: ", person.name)

    const response = await fetch("https://api.prospeo.io/enrich-person", {
        method: "POST",
        headers: {
            "X-KEY": process.env.PROSPEO_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            only_verified_email: false,
            data: {
                person_id: person.personId
            }
        })
    })

    const data = await response.json();
    console.log("enrich response: ")
    console.log(JSON.stringify(data, null, 2))

    if (data.error) {
        return [];
    }

    if (!data.person?.email?.email) {
        return [{
            email: "Unavailable",
            verified: false
        }]
    }

    return [{
        email: data.person.email.email,
        verified: data.person.email.status === "VERIFIED"
    }];
}