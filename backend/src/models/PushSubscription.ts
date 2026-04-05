import mongoose, { Document } from 'mongoose';

export interface IPushSubscription extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Web Push API subscription details
  endpoint: string; // The push service endpoint
  keys: {
    p256dh: string; // Public key for encryption
    auth: string; // Authentication secret
  };
  
  // Device info
  deviceType: 'web' | 'mobile_web' | 'pwa';
  userAgent?: string;
  
  // Subscription status
  isActive: boolean;
  lastUsed?: Date;
  
  // Preferences
  notificationPreferences: {
    rideUpdates: boolean;
    messages: boolean;
    promotions: boolean;
    systemAlerts: boolean;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const PushSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  endpoint: {
    type: String,
    required: true,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
  
  deviceType: {
    type: String,
    enum: ['web', 'mobile_web', 'pwa'],
    default: 'web',
  },
  userAgent: String,
  
  isActive: {
    type: Boolean,
    default: true,
  },
  lastUsed: Date,
  
  notificationPreferences: {
    rideUpdates: {
      type: Boolean,
      default: true,
    },
    messages: {
      type: Boolean,
      default: true,
    },
    promotions: {
      type: Boolean,
      default: true,
    },
    systemAlerts: {
      type: Boolean,
      default: true,
    },
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
}, { timestamps: true });

// Indexes
PushSubscriptionSchema.index({ userId: 1 });
PushSubscriptionSchema.index({ endpoint: 1 }, { unique: true });
PushSubscriptionSchema.index({ isActive: 1 });

export default mongoose.model<IPushSubscription>('PushSubscription', PushSubscriptionSchema);
