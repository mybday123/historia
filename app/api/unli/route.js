import { unli } from "@/lib/unli";

export async function POST(req) {
  try {
    const { messages, imageBase64 } = await req.json();

    const defaultPrompt = "Tolong analisis gambar ini.";
    let finalMessages = [...(messages || [])];

    if (imageBase64) {
      if (finalMessages.length === 0) {
        finalMessages.push({
          role: "user",
          content: [
            { type: "text", text: defaultPrompt },
            { type: "image_url", image_url: { url: imageBase64 } },
          ],
        });
      } else {
        const lastUserMessage = finalMessages[finalMessages.length - 1];
        const textContent =
          typeof lastUserMessage.content === "string" &&
          lastUserMessage.content.trim()
            ? lastUserMessage.content
            : defaultPrompt;

        lastUserMessage.content = [
          { type: "text", text: textContent },
          { type: "image_url", image_url: { url: imageBase64 } },
        ];

        finalMessages[finalMessages.length - 1] = lastUserMessage;
      }
    }

    if (finalMessages.length === 0) {
      finalMessages.push({
        role: "user",
        content: defaultPrompt,
      });
    }

    const completion = await unli.chat.completions.create({
      model: "auto",
      messages: finalMessages,
    });

    if (
      completion?.choices?.length > 0 &&
      completion.choices[0].message?.content
    ) {
      return Response.json({
        reply: completion.choices[0].message.content,
      });
    } else {
      return Response.json(
        { error: "No reply returned from model", raw: completion },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("API Error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong", detail: err.message }),
      { status: 500 }
    );
  }
}
