// tsx src/cli/migrator.js
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "../db/schema";
import { getDatabaseUrl } from "../lib/secrets";
require("dotenv").config();

import { Pool, neonConfig } from "@neondatabase/serverless";

import ws from "ws";

async function performMigration() {
  const dbUrl = await getDatabaseUrl();
  if (!dbUrl) {
    return;
  }
  // neon serverless pool
  // https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client
  neonConfig.webSocketConstructor = ws; // <-- this is the key bit
  const pool = new Pool({ connectionString: dbUrl });
  pool.on("error", (err) => console.error(err)); // deal with e.g. re-connect
  // ...
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const db = await drizzle(client, { schema });
    await migrate(db, { migrationsFolder: "src/migrations" });
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
  await pool.end();
}

if (require.main === module) {
  console.log("run Migrations!");
  performMigration()
    .then((val) => {
      console.log("Migrations done");
      process.exit(0);
    })
    .catch((err) => {
      console.log("Migrations error");
      process.exit(1);
    });
}
