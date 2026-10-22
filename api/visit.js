export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  try {
    // 1. User Agent and Bot check
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling|headless|lighthouse|vercel/i.test(userAgent);
    if (isBot) {
      return res.status(204).end();
    }

    // 2. Read visitor IP ONLY on the server
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

    // 3. Location from Vercel headers
    const country = req.headers['x-vercel-ip-country'] || null;
    const region = req.headers['x-vercel-ip-country-region'] || null;
    let city = null;
    const rawCity = req.headers['x-vercel-ip-city'];
    if (rawCity) {
      try {
        city = decodeURIComponent(Array.isArray(rawCity) ? rawCity[0] : rawCity);
      } catch {
        city = Array.isArray(rawCity) ? rawCity[0] : rawCity;
      }
    }

    // 4. Parse JSON body safely
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body) {
      body = await new Promise((resolve) => {
        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch {
            resolve({});
          }
        });
        req.on('error', () => resolve({}));
      });
    }

    const truncate = (val, max = 300) => {
      if (typeof val !== 'string') return null;
      return val.slice(0, max);
    };

    const referrer = truncate(body?.referrer);
    const path = truncate(body?.path);
    const language = truncate(body?.language);

    // 5. Insert one row into Supabase "visits"
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/visits`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            ip: ip || null,
            country,
            region,
            city,
            user_agent: truncate(userAgent, 300),
            referrer,
            path,
            language,
          }),
        });
      } catch {
        // Never log secrets
        console.error('Failed to log visit to database');
      }
    }

    // Respond 204 without returning stored data or IP
    return res.status(204).end();
  } catch {
    return res.status(204).end();
  }
}
