import dotenv from 'dotenv'
dotenv.config({ quiet: true })

interface Env {
    port: number
    mongoUri: string
    jwtSecret: string
}

const port = Number(process.env.PORT || 4000);

export const envConfig: Env = {
    port: Number.isFinite(port) ? port : 4000,
    mongoUri: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
}

// Validate only required secrets/connection settings.
if (!envConfig.mongoUri) {
    throw new Error('Missing required environment variable: MONGO_URI');
}

if (!envConfig.jwtSecret) {
    throw new Error('Missing required environment variable: JWT_SECRET');
}
