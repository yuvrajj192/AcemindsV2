import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

function arg(name: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : "";
}

function usage(): never {
  console.error(
    'Usage: npm run admin:create -- --email you@aceminds.in --name "Your Name" --password "min-8-chars" [--role owner|editor]'
  );
  process.exit(1);
}

const email = arg("email").toLowerCase().trim();
const name = arg("name").trim();
const password = arg("password");
const role = arg("role") || "owner";

if (!email || !name || !password) usage();
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}
if (role !== "owner" && role !== "editor") {
  console.error("--role must be 'owner' or 'editor'.");
  process.exit(1);
}

async function main() {
  const { db, schema } = await import("../lib/db");
  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await db.query.users.findFirst({ where: eq(schema.users.email, email) });

  if (existing) {
    await db
      .update(schema.users)
      .set({ name, role: role as "owner" | "editor", passwordHash })
      .where(eq(schema.users.email, email));
    console.log(`Updated admin: ${email} (${role})`);
  } else {
    await db.insert(schema.users).values({ email, name, role: role as "owner" | "editor", passwordHash });
    console.log(`Created admin: ${email} (${role})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
