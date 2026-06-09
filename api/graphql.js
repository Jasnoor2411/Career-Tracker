const APPSYNC_GRAPHQL_URL = process.env.APPSYNC_GRAPHQL_URL;
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!APPSYNC_GRAPHQL_URL || !APPSYNC_API_KEY) {
    return res.status(500).json({ error: 'GraphQL proxy is not configured' });
  }

  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});

  try {
    const upstream = await fetch(APPSYNC_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': APPSYNC_API_KEY,
      },
      body,
    });

    const text = await upstream.text();
    res.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/json');
    return res.status(upstream.status).send(text);
  } catch {
    return res.status(502).json({ error: 'Could not reach GraphQL upstream' });
  }
};
