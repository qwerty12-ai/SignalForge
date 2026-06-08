export default function generateOutreach(company, person) {
    console.log("Bravo called:", company.name, person.name);

    const firstName = person.name.split(" ")[0];

    const roleContext = person.role
        ? `As ${person.role} at ${company.name}`
        : `At ${company.name}`;

    const companyContext = company.description
        ? company.description.split(".")[0]
        : `${company.name} is a company we've been following`;

    return {
        subject: `A thought on ${company.name}'s growth`,
        body: `Hi ${firstName}, ${companyContext}.
            ${roleContext}, you're likely thinking about how to scale efficiently without adding headcount. That's exactly the problem SignalForge was built to solve — automating the entire outbound pipeline from company discovery to personalized outreach, with zero manual steps.
            I'd love to show you how it works in a 15-minute call. Would any time this week work for you?

            Best,
            Mohd Abdul Sabeeh
            SignalForge
            contact@signal-forge.co.in`
    };
}