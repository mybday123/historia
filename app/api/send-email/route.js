export async function POST(req) {
  try {
    const { to, subject, htmlBody } = await req.json();

    if (!to || !subject || !htmlBody) {
      return new Response(
        JSON.stringify({ message: "Input tidak lengkap" }),
        { status: 400 }
      );
    }

    const payload = {
      emailId: process.env.MAILRY_EMAIL_UUID,
      to,
      subject,
      htmlBody,
    };

    const mailryResponse = await fetch("https://api.mailry.co/ext/inbox/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MAILRY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await mailryResponse.json();
    console.log("Response dari Mailry:", data);

    if (!mailryResponse.ok) {
      return new Response(
        JSON.stringify({
          message: data.message || "Gagal mengirim email",
          error: data,
        }),
        { status: mailryResponse.status }
      );
    }

    return new Response(
      JSON.stringify({ message: "Email berhasil dikirim!", data }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error pada /api/send-email:", error);
    return new Response(
      JSON.stringify({ message: "Gagal mengirim email", error: error.message }),
      { status: 500 }
    );
  }
}
