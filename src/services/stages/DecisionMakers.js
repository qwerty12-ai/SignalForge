import {findDecisionMakers} from "../providers/prospeo";

// decisionMakers.js
// ⚠️ TESTING — loops Prospeo across all companies, flattens results.

export async function decisionMakers(companies) {
    if (!companies?.length) return [];

    const results = [];

    for (const company of companies) {
        const people = await findDecisionMakers(company);
        results.push(...people);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1s gap between calls
    }

    return results;
}