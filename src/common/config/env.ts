import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  PORT: z.string().default("3000"),

  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().default("5432"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("password"),
  DB_NAME: z.string().default("quickbite_core"),
  DB_POOL_MAX: z.string().default("10"),
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
  },
};