import { runPipeline } from "@/services/pipeline";

export async function POST(req) {
    try {
        const body = await req.json();
        const result = await runPipeline(body.company);
        return Response.json(
            {
                success: true,
                data: result
            },
            { status: 200 }
        )
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                message: "Pipeline failed"
            },
            { status: 500 }
        );
    }
}