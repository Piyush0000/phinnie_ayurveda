import { SignJWT, jwtVerify } from 'jose'

const TOKEN_TYPE = 'password-reset'
const EXPIRY = '1h'

function getKey(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error(
      'NEXTAUTH_SECRET is not configured — required for password reset tokens.',
    )
  }
  return new TextEncoder().encode(secret)
}

/**
 * The first 12 chars of the bcrypt hash. Used as a JWT claim so that any reset
 * token issued before a password change becomes invalid the moment the
 * password changes (the new hash starts with different characters).
 */
export function passwordFingerprint(passwordHash: string): string {
  return passwordHash.slice(0, 12)
}

/** Issue a 1-hour reset token bound to the user's current password hash. */
export async function issuePasswordResetToken(params: {
  userId: string
  passwordHash: string
}): Promise<string> {
  return new SignJWT({
    sub: params.userId,
    type: TOKEN_TYPE,
    pwh: passwordFingerprint(params.passwordHash),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getKey())
}

/**
 * Verify the JWT signature, expiry, and `type` claim. Returns the userId and
 * password fingerprint so the caller can re-check `pwh` against the user's
 * current hash (which catches both already-used tokens after a successful
 * reset, and tokens that were issued before an unrelated password change).
 */
export async function verifyPasswordResetToken(token: string): Promise<{
  userId: string
  pwh: string
} | null> {
  try {
    const { payload } = await jwtVerify(token, getKey())
    if (payload.type !== TOKEN_TYPE) return null
    if (typeof payload.sub !== 'string' || typeof payload.pwh !== 'string') return null
    return { userId: payload.sub, pwh: payload.pwh }
  } catch {
    // jwtVerify throws on bad signature, expired, malformed, etc.
    return null
  }
}
