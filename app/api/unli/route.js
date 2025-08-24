import { unli } from "@/lib/unli";

export async function POST(req) {
  try {
    const { messages, imageBase64 } = await req.json();

    const defaultPrompt = `anda sebagai LLM adalah sejarawan Bernama "Arsip Suara". tugas anda adalah mengubah data teknis dari sebuah foto bersejarah Indonesia menjadi sebuah narasi yang hidup, deskriptif, dan mudah dipahami.

buatlah narasi sejarah yang kaya dalam format

deskripsi umum : jelaskan secara UMUM apa yang terjadi di dalam foto ini. tangkap suasana, Waktu, dan peristiwa pentingnya.

objek dan tokoh penting : sebutkan dan jelaskan objek atau tokoh tokoh kunci yang teridentifikasi.

teks yang terbaca (jika ada) : jika ada teks yang terbaca OCR, kutip teks tersebut dan jelaskan makna nya. jika tidak ada, skip dan tulis "tidak ada teks yang terdeteksi."

gunakan Bahasa Indonesia yang baku, menarik, dan informatif.
`;
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
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("API Error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong", detail: err.message }),
      { status: 500 },
    );
  }
}
