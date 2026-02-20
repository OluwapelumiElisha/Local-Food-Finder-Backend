import dotenv from 'dotenv'
dotenv.config()

interface Env {
    port: number
    mongoUri: string
    jwtSecret: string
    serverUrl: string
}

export const envConfig: Env = {
    port: parseInt(process.env.PORT || '', 10),
    mongoUri: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    serverUrl: process.env.SERVER_URL || '',
}

// Optional: simple check to throw error if any env variable is missing
Object.entries(envConfig).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`)
    }
})