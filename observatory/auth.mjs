const decode = text => Uint8Array.from(atob(text.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0));
const json = text => JSON.parse(new TextDecoder().decode(decode(text)));
const keyCache = new Map();
export async function verifyAccess(request, config, fetchImpl = fetch, now = Date.now()) {
  if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(config.teamDomain) || !config.audience || !config.emails?.length) return false;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token || token.length > 16384) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const header = json(parts[0]), claims = json(parts[1]);
    const issuer = `https://${config.teamDomain}`;
    if (header.alg !== 'RS256' || typeof header.kid !== 'string' || claims.iss !== issuer
      || !Array.isArray(claims.aud) || !claims.aud.includes(config.audience)
      || !Number.isFinite(claims.exp) || claims.exp * 1000 <= now
      || !Number.isFinite(claims.iat) || claims.iat * 1000 > now + 30000
      || (claims.nbf !== undefined && (!Number.isFinite(claims.nbf) || claims.nbf * 1000 > now))
      || typeof claims.email !== 'string' || !config.emails.includes(claims.email.toLowerCase())) return false;
    let cached = keyCache.get(issuer);
    if (!cached || cached.until < now || !cached.keys.some(key => key.kid === header.kid)) {
      // Workers support manual/follow; reject redirects by checking !ok below.
      const response = await fetchImpl(`${issuer}/cdn-cgi/access/certs`, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
      if (!response.ok) return false;
      const body = await response.json();
      if (!Array.isArray(body.keys)) return false;
      cached = { keys: body.keys, until: now + 300000 };
      keyCache.set(issuer, cached);
    }
    const jwk = cached.keys.find(key => key.kid === header.kid && key.kty === 'RSA');
    if (!jwk) return false;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decode(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  } catch { return false; }
}
