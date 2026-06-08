// import { mockResults } from "@/lib/mockData";
import { companyDiscovery } from "./stages/companyDiscovery";
import { decisionMakers } from "./stages/DecisionMakers";
import { emailResolution } from "./stages/emailResolution";
import { outreachGeneration } from "./stages/outreachGeneration";

export async function runPipeline(companyName) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const companies = await companyDiscovery(companyName);
    const people = await decisionMakers(companies);

    const contacts = [];
    for (const person of people) {
        const resolved = await emailResolution(person);
        contacts.push(...resolved.map(c => ({ ...c, personName: person.name, personRole: person.role })));
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("contacts:", contacts);

    const outreaches = [];
    for (const contact of contacts.filter(c => c.email && c.email !== "Unavailable")) {
        const emailDomain = contact.email.split("@")[1];
        const personCompany = companies.find(c => c.domain === emailDomain) || companies[0];
        const outreach = outreachGeneration(personCompany, {
            name: contact.personName,
            role: contact.personRole
        });
        outreaches.push({ contact, outreach });
    }

    return {
        company: companies[0],
        companies,
        decisionmakers: people,
        contacts,
        outreaches
    };
}