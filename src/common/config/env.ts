//import { env } from './env';
import { config } from "dotenv";
import { z } from "zod";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env") });

//console.log("DOTENV RESULT:", result);
//console.log("DB_USER:", process.env.DB_USER);
//console.log("DB_PASSWORD:", process.env.DB_PASSWORD);


const envSchema = z.object({
  PORT: z.string().default("3000"),

  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().default("5432"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("password"),
  DB_NAME: z.string().default("quickbite_core"),
  DB_POOL_MAX: z.string().default("10"),
  DB_MIGRATIONS_DIR: z.string(),
  DB_MIGRATION_EXTENSION: z.string(),
  ACCESS_SECRET:z.string(),
  REFRESH_SECRET:z.string(),
  ACCESS_EXPIRES:z.string(),
  REFRESH_EXPIRES:z.string()
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  port: parsedEnv.PORT,

  db: {
    host: parsedEnv.DB_HOST,
    port: parsedEnv.DB_PORT,
    user: parsedEnv.DB_USER,        
    password: parsedEnv.DB_PASSWORD,
    name: parsedEnv.DB_NAME,
    poolMax: Number(parsedEnv.DB_POOL_MAX),
    migrationsDir: path.resolve(process.cwd(), parsedEnv.DB_MIGRATIONS_DIR),
    migrationExtension: parsedEnv.DB_MIGRATION_EXTENSION,
  },
  jwt:{
    refreshSecret: parsedEnv.REFRESH_SECRET,
    accessSecret: parsedEnv.ACCESS_SECRET,
    accessExpires: parsedEnv.ACCESS_EXPIRES,
    refreshExpires: parsedEnv.REFRESH_EXPIRES
  }
};