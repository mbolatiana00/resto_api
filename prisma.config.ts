import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",        // ⚠️ chaîne littérale, PAS env()
  migrations: {
    path: "prisma/migrations",           // ⚠️ chaîne littérale, PAS env()
  },
  datasource: {
    url: env("DATABASE_URL"),            // ✅ ici seulement env() est correct
  },
});