import { createHmac } from 'node:crypto';

export type JwtPayload = {
  sub: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  iat?: number;
  exp?: number;
};

function base64UrlEncode(input: Buffer | string) {
  return Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function base64UrlDecode(input: string) {
  const normalized = input.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');

  return Buffer.from(padded, 'base64').toString('utf8');
}

function signPart(data: string, secret: string) {
  return base64UrlEncode(createHmac('sha256', secret).update(data).digest());
}

export function signJwt(payload: JwtPayload, secret: string, expiresInSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));
  const data = `${encodedHeader}.${encodedPayload}`;

  return `${data}.${signPart(data, secret)}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload | null {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = signPart(data, secret);

  if (signature !== expectedSignature) {
    return null;
  }

  let payload: JwtPayload;

  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
  } catch {
    return null;
  }

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
