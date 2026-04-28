import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache =
  global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null })

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('MONGODB_URI is not configured. Add it to .env.local to enable database features.')
    this.name = 'DatabaseNotConfiguredError'
  }
}

export function isDatabaseConfigured(): boolean {
  return !!process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0
}

async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI || MONGODB_URI.trim().length === 0) {
    throw new DatabaseNotConfiguredError()
  }
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null
        throw err
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
