import sendOutreach from "@/services/providers/brevo";

export async function POST(req) {
    try {
        const { outreaches } = await req.json();

        let sentCount = 0;
        for (const item of outreaches) {
            try {
                await sendOutreach(item.contact, item.outreach);
                sentCount++;
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (err) {
                console.error("Failed to send to", item.contact.email, err.message);
            }
        }

        return Response.json({ success: true, sentCount }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false }, { status: 500 });
    }
}