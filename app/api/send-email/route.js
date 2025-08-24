export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, subject, htmlBody } = req.body;
  if (!to || !subject || !htmlBody) {
    return res.status(400).json({ message: 'Input tidak lengkap' });
  }

  const payload = {
    from: { email: 'tim@arsipsuarakemerdekaan.id', name: 'Arsip Suara Kemerdekaan' },
    to: [{ email: to }],
    subject: subject,
    html: htmlBody,
  };

  try {
    const mailryResponse = await fetch('https://api.mailry.co/v1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MLRY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!mailryResponse.ok) {
      const errorData = await mailryResponse.json();
      return res.status(500).json({ message: errorData.message || 'Gagal mengirim email.' });
    }

    const responseData = await mailryResponse.json();
    return res.status(200).json({ message: 'Email berhasil dikirim!', data: responseData });
  } catch (error) {
    console.error('Error pada /api/send-email:', error);
    return res.status(500).json({ message: 'Gagal mengirim email.', error: error.message });
  }
}
