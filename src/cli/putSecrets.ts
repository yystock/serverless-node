import { putDatabaseUrl } from "../lib/secrets";
require("dotenv").config();

//export STAGE_DB_URL=${neonctl connection-string --branch dev}
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log("Usage: tsx src/cli/putSecrets.js <stage> <dbUrl>");
  process.exit(1);
}

if (require.main === module) {
  console.log("Updating database URL");
  const [stage, dbUrl] = args;

  putDatabaseUrl(stage, dbUrl)
    .then((val) => {
      console.log(val);
      console.log(`Secret set`);
      process.exit(0);
    })
    .catch((err) => {
      console.log(`Secret not set ${err}`);
      process.exit(1);
    });
}
