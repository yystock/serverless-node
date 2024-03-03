import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getDatabaseUrl } from "../lib/secrets";

export async function getDbClient() {
  const dburl = await getDatabaseUrl();
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dburl);
  return drizzle(sql);
}
