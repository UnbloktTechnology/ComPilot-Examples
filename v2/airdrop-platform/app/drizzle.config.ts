import { defineConfig } from "drizzle-kit";
import { env } from "src/env.mjs";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
});
