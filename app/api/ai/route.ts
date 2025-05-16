import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { promises as fs } from "fs";
import path from "path";

// Cleaner function: allow only emojis, spaces, and common punctuation
function cleanEmojiString(text: string) {
  const allowedRegex = /[\p{Emoji}\s.,!?]/gu;
  const matches = text.match(allowedRegex);
  if (!matches) {
    return "";
  }
  return matches.join("");
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "No content provided." },
        { status: 400 }
      );
    }

    const promptPath = path.join(process.cwd(), "prompt.txt");
    const promptTemplate = await fs.readFile(promptPath, "utf-8");

    const finalPrompt = promptTemplate.replace("{{content}}", content);

    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.9,
    });

    const response = await model.call([
      {
        role: "system",
        content: `You are an assistant that rewrites user text into a JSON format. Respond ONLY in JSON like: {"new_content": "🎉🚀😁"}. No other text, no explanation.`,
      },
      {
        role: "user",
        content: finalPrompt,
      },
    ]);

    const rawContent =
      typeof response.text === "string"
        ? response.text
        : JSON.stringify(response.text);

    let parsedResult;
    try {
      const jsonMatch = rawContent.match(/{[^}]+}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = JSON.parse(rawContent);
      }
    } catch (err) {
      console.error("Failed to parse model response:", response, "Error:", err);
      return NextResponse.json(
        { error: "Failed to parse model output." },
        { status: 500 }
      );
    }

    // Validate that new_content exists
    if (!parsedResult.new_content) {
      console.error("Missing 'new_content' in parsed result:", parsedResult);
      return NextResponse.json(
        { error: "Invalid output from model." },
        { status: 500 }
      );
    }

    // CLEAN the new_content here
    const cleanedContent = cleanEmojiString(parsedResult.new_content);

    return NextResponse.json({ new_content: cleanedContent });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
