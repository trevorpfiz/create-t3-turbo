import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_DISCORD_ID: z.string().min(1),
    AUTH_DISCORD_SECRET: z.string().min(1),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    AUTH_APPLE_ID: z.string().min(1),
    AUTH_APPLE_SECRET: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
