import dotenv from 'dotenv';

import { z } from 'zod';



dotenv.config();



const envSchema = z.object({

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(8, 'JWT_ACCESS_SECRET is required'),

  JWT_REFRESH_SECRET: z.string().min(8, 'JWT_REFRESH_SECRET is required'),

  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),

  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  COOKIE_SECURE: z

    .enum(['true', 'false'])

    .default('false')

    .transform((value) => value === 'true'),

  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),

  CLOUDINARY_API_KEY: z.string().optional().default(''),

  CLOUDINARY_API_SECRET: z.string().optional().default(''),

});



const parsed = envSchema.safeParse(process.env);



if (!parsed.success) {

  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);

  process.exit(1);

}



export const env = parsed.data;



export function isCloudinaryConfigured(): boolean {

  return Boolean(

    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET

  );

}

