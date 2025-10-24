/**
 * User Database Model
 * MongoDB schema for user management
 */

import mongoose, { Schema, Document } from 'mongoose'
import '../connection' // Ensure database connection

// ===== USER INTERFACE =====
export interface IUser extends Document {
  email: string
  name: string
  avatar?: string
  provider: 'local' | 'google' | 'facebook' | 'github'
  googleId?: string
  facebookId?: string
  githubId?: string
  password?: string // Only for local users
  isActive: boolean
  role: string
  permissions: string[]
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ===== USER SCHEMA =====
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    required: true,
    enum: ['local', 'google', 'facebook', 'github'],
    default: 'local'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'local'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'superadmin']
  },
  permissions: [{
    type: String
  }],
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'users'
})

// ===== INDEXES =====
// Note: Indexes are defined in schema fields, no need to duplicate here

// ===== VIRTUAL FIELDS =====
UserSchema.virtual('fullName').get(function() {
  return this.name
})

UserSchema.virtual('isGoogleUser').get(function() {
  return this.provider === 'google'
})

UserSchema.virtual('isLocalUser').get(function() {
  return this.provider === 'local'
})

// ===== METHODS =====
UserSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date()
  return this.save()
}

UserSchema.methods.hasPermission = function(permission: string): boolean {
  return this.permissions.includes(permission)
}

UserSchema.methods.addPermission = function(permission: string) {
  if (!this.permissions.includes(permission)) {
    this.permissions.push(permission)
  }
  return this.save()
}

UserSchema.methods.removePermission = function(permission: string) {
  this.permissions = this.permissions.filter(p => p !== permission)
  return this.save()
}

// ===== STATIC METHODS =====
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() })
}

UserSchema.statics.findByGoogleId = function(googleId: string) {
  return this.findOne({ googleId })
}

UserSchema.statics.findByProvider = function(provider: string) {
  return this.find({ provider })
}

UserSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true })
}

// ===== EXPORT MODEL =====
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
