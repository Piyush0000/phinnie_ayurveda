import { NextResponse } from 'next/server'
import { auth } from './auth'
import { DatabaseNotConfiguredError } from './mongodb'

export function dbErrorResponse() {
  return NextResponse.json(
    { error: 'Database not configured. Set MONGODB_URI in .env.local.' },
    { status: 503 },
  )
}

export function handleApiError(err: unknown) {
  if (err instanceof DatabaseNotConfiguredError) return dbErrorResponse()
  console.error('[api error]', err)
  const message = err instanceof Error ? err.message : 'Internal server error'
  return NextResponse.json({ error: message }, { status: 500 })
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      session: null,
    }
  }
  return { error: null, session }
}

export async function requireUser() {
  const session = await auth()
  if (!session?.user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      session: null,
    }
  }
  return { error: null, session }
}
