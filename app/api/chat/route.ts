import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

export async function POST(req: Request) {
    try {
        if (!groq) {
            return NextResponse.json({ error: "Groq API key is not configured" }, { status: 500 });
        }

        const { message, history, context } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const systemPrompt = `
You are an Expert AI Career Advisor and Workforce Analyst. 
You are helping a user with their career path based on a specific career report provided in the context.

CONTEXT (Career Report):
${JSON.stringify(context, null, 2)}

ROLE:
- Be encouraging, professional, and data-driven.
- Use the context provided to answer questions specifically about the recommended careers, skill gaps, and roadmaps.
- If the user asks something outside the scope of the report, still try to be helpful as a career advisor but prioritize the data in the report.
- Keep responses concise and actionable.
- Formatting: Use markdown for structure (bolding, lists).
`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...history.map((h: any) => ({
                role: h.role,
                content: h.content
            })),
            { role: "user", content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
        });

        const text = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

        return NextResponse.json({ message: text });
    } catch (error: any) {
        console.error("Chat API Error:", error);

        if (error?.status === 429) {
            return NextResponse.json(
                { error: "Rate limit reached", isRateLimit: true },
                { status: 429 }
            );
        }

        return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
    }
}
