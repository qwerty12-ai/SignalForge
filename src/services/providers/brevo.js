// brevo.js
export default async function sendOutreach(contact, outreach) {
    console.log("sendOutreach called");
    console.log("contact:", contact);
    console.log("outreach:", outreach);

    const payload = {
        sender: {
            name: "SignalForge",
            email: "contact@signal-forge.co.in"
        },
        to: [{ email: contact.email }],
        subject: outreach.subject,
        textContent: outreach.body
    };

    console.log("Brevo payload:", JSON.stringify(payload, null, 2));

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    console.log("Brevo status:", response.status);

    const data = await response.json().catch(() => ({}));  // read ONCE only
    console.log("Brevo response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
        throw new Error(`Brevo Error: ${response.status} — ${JSON.stringify(data)}`);
    }

    console.log("Brevo email sent successfully. messageId:", data.messageId);
    return data;
}