import { searchCompanies } from "../providers/ocean"; 

// companyDiscovery.js
// ⚠️ TESTING — returns all 5 lookalike companies, not just first.

export async function companyDiscovery(domain) {
    const cleanDomain = domain.replace(/^www\./, "");
    const data = await searchCompanies(cleanDomain);

    const companies = data.companies || [];
    if (!companies.length) return [];

    return companies.map(({ company: c }) => {
        const resolvedDomain =
            c.domain ||
            c.rootUrl?.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] ||
            cleanDomain;

        return {
            name: c.name,
            domain: resolvedDomain,
            website: c.rootUrl || `https://${resolvedDomain}`,
            description: c.description,
        };
    });
}