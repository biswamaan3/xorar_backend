import {prisma} from "@/lib/prisma";

export async function POST(req) {
    const body = await req.json();
    const { email } = body;

    if (!email) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Missing required fields.",
            }),
            { status: 400 }
        );
    }

    try {
        await prisma.EmailSubscriber.create({
            data: {
                email: email,
            },
        });

        return new Response(
            JSON.stringify({ success: true, message: "Email Added." }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error Adding to Subscriber List:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error Adding to Subscriber List.",
            }),
            {
                status: 500,
            }
        );
    }
}
export async function GET(req) {
   

    const url = new URL(req.url);
    const size = parseInt(url.searchParams.get("size"), 10) || 10;
    const page = parseInt(url.searchParams.get("page"), 10) || 1;
    const skip = (page - 1) * size;

    try {
        const subscribers = await prisma.EmailSubscriber.findMany({
            skip,
            take: size,
        });
        return new Response(
            JSON.stringify({success: true, subscribers}),
            {status: 200}
        );
    } catch (error) {
        console.error("Error Fetching Subscribers:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error Fetching Subscribers.",
            }),
            {
                status: 500,
            }
        );
    }
}