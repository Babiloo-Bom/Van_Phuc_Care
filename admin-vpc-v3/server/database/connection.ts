/**
 * MongoDB Connection
 * Database connection configuration
 */

import mongoose from 'mongoose'

// ===== CONNECTION CONFIG =====
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vanphuccare_admin'
const MONGODB_OPTIONS = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
  connectTimeoutMS: 10000, // Connection timeout
  maxIdleTimeMS: 30000 // Close connections after 30 seconds of inactivity
}

// ===== CONNECTION STATE =====
let isConnected = false
let connectionPromise: Promise<typeof mongoose> | null = null

// ===== CONNECT FUNCTION =====
export const connectToDatabase = async (): Promise<typeof mongoose> => {
  // Return existing connection if available
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose
  }

  // Return existing promise if connection is in progress
  if (connectionPromise) {
    return connectionPromise
  }

  // Create new connection promise
  connectionPromise = mongoose.connect(MONGODB_URI, MONGODB_OPTIONS)
    .then((mongoose) => {
      isConnected = true
      return mongoose
    })
    .catch((error) => {
      isConnected = false
      connectionPromise = null
      throw error
    })

  return connectionPromise
}

// ===== DISCONNECT FUNCTION =====
export const disconnectFromDatabase = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.disconnect()
    isConnected = false
    connectionPromise = null
  }
}

// ===== CONNECTION EVENTS =====
mongoose.connection.on('connected', () => {
  isConnected = true
})

mongoose.connection.on('error', (error) => {
  isConnected = false
})

mongoose.connection.on('disconnected', () => {
  isConnected = false
})

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGINT', async () => {
  await disconnectFromDatabase()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await disconnectFromDatabase()
  process.exit(0)
})

// ===== EXPORT =====
export default mongoose
