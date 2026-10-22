export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Basic abuse protection: reject payloads over 20 KB
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 20480) {
    return res.status(413).json({ ok: false, error: 'Payload exceeds 20 KB limit' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    if (Buffer.byteLength(body, 'utf8') > 20480) {
      return res.status(413).json({ ok: false, error: 'Payload exceeds 20 KB limit' });
    }
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid JSON body' });
    }
  } else if (!body) {
    const raw = await new Promise((resolve, reject) => {
      let acc = '';
      let bytes = 0;
      req.on('data', (chunk) => {
        bytes += chunk.length;
        if (bytes > 20480) {
          reject(new Error('PAYLOAD_TOO_LARGE'));
        } else {
          acc += chunk;
        }
      });
      req.on('end', () => resolve(acc));
      req.on('error', reject);
    }).catch((err) => err);

    if (raw instanceof Error) {
      if (raw.message === 'PAYLOAD_TOO_LARGE') {
        return res.status(413).json({ ok: false, error: 'Payload exceeds 20 KB limit' });
      }
      return res.status(400).json({ ok: false, error: 'Failed to read request body' });
    }

    try {
      body = JSON.parse(raw);
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid JSON body' });
    }
  }

  const { name, email, subject, message, _gotcha } = body || {};

  // Bot honeypot protection: if non-empty, silently return 200 { ok: true } without saving
  if (_gotcha) {
    return res.status(200).json({ ok: true });
  }

  // Validate inputs
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    trimmedName.length < 2 ||
    trimmedName.length > 100 ||
    !emailRegex.test(trimmedEmail) ||
    trimmedEmail.length > 254 ||
    trimmedSubject.length < 3 ||
    trimmedSubject.length > 150 ||
    trimmedMessage.length < 10 ||
    trimmedMessage.length > 5000
  ) {
    return res.status(400).json({ ok: false, error: 'Validation failed' });
  }

  // Extract visitor IP ONLY on the server
  let ip = '';
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const headerVal = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
    ip = headerVal.split(',')[0].trim();
  }
  if (!ip) {
    const xRealIp = req.headers['x-real-ip'];
    if (xRealIp) {
      ip = (Array.isArray(xRealIp) ? xRealIp[0] : xRealIp).trim();
    }
  }
  if (!ip && req.socket?.remoteAddress) {
    ip = req.socket.remoteAddress;
  }

  // Database insert into Supabase table "messages"
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase configuration missing');
    return res.status(500).json({ ok: false, error: 'Database service unavailable' });
  }

  let supabaseRes;
  try {
    supabaseRes = await fetch(`${supabaseUrl}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
        ip: ip || null,
      }),
    });
  } catch {
    console.error('Database connection error');
    return res.status(500).json({ ok: false, error: 'Database connection failed' });
  }

  if (!supabaseRes.ok) {
    console.error('Database insert rejected with status:', supabaseRes.status);
    return res.status(500).json({ ok: false, error: 'Failed to record message' });
  }

  // Optional email dispatch via Resend
  const resendKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_TO_EMAIL;

  if (resendKey && contactTo) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio <onboarding@resend.dev>',
          to: [contactTo],
          reply_to: trimmedEmail,
          subject: `Portfolio message: ${trimmedSubject}`,
          text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nSubject: ${trimmedSubject}\n\nMessage:\n${trimmedMessage}`,
        }),
      });
    } catch {
      // Email failure must not fail the request if the database insert succeeded
      console.error('Failed to send notification email');
    }
  }

  // Return { ok: true } ONLY when database insert succeeded
  return res.status(200).json({ ok: true });
}
