export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'method not allowed' });
  }

  const { to, subject, htmlBody } = req.body;
  if (!to || !subject || !htmlBody) {
    return res.status(400).json({ message: 'input tidak lengkap' });
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
        'Authorization': `Bearer ${process.env.MLRY_API_KEY
}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!mailryResponse.ok) {
      const errorData = await mailryResponse.json();
      throw new Error(`error dari mailry: ${errorData.message || mailryResponse.statusText}`);
    }
    
    return res.status(200).json({ message: 'email berhasil dikirim!' });

  } catch (error) {
    console.error('error pada /api/send-email:', error);
    return res.status(500).json({ message: 'gagal mengirim email.', error: error.message });
  }
}
