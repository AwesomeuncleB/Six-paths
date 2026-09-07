import * as schema from "./schema";

export async function getDb() {
  try {
    // Dynamic import prevents module resolution errors during Vercel builds
    // @ts-ignore
    const cf = await import("cloudflare:workers");
    if (!cf.env?.DB) {
      throw new Error("Cloudflare D1 binding `DB` is unavailable.");
    }
    const { drizzle } = await import("drizzle-orm/d1");
    return drizzle(cf.env.DB, { schema });
  } catch {
    throw new Error("Cloudflare D1 database is only available when running on Cloudflare Workers.");
  }
}
