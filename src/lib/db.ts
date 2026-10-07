import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Serverless functions can be invoked concurrently and reuse warm containers,
// so the connection must be cached on `global` rather than a module-level
// variable, which would otherwise be reinitialized per bundle in dev.
const globalForMongoose = globalThis as unknown as { mongooseCache?: MongooseCache };

const cache: MongooseCache = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Read lazily, not at module load time: scripts that call dotenv's config()
  // after their other imports (e.g. scripts/seed.ts) would otherwise capture
  // `undefined` here, since import statements are hoisted above other
  // top-level code by the TS/esbuild CJS transform.
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
