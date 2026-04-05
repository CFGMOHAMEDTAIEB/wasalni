import mongoose, { Document } from 'mongoose';

export interface IShoppingRequest extends Document {
  requesterId: mongoose.Types.ObjectId; // User requesting shopping
  
  // Shopping details
  description: string; // What to buy
  budget: number;
  deliveryLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  
  // Shopping location details
  storeLocation?: string; // Where to shop (e.g., store name/area)
  storeCoordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Handler details
  handlerId?: mongoose.Types.ObjectId; // User handling the shopping
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt?: Date;
  
  // Delivery details
  actualCost?: number;
  returnedChange?: number; // Change returned to requester
  deliveredAt?: Date;
  deliveryProofPhoto?: string;
  
  // Rating after completion
  rating?: number; // 1-5
  review?: string;
  ratedAt?: Date;
  
  // Payment
  isCOD: boolean; // Cash on delivery
  paymentStatus: 'pending' | 'completed' | 'refunded';
  
  // Timeline
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // Request expires if not assigned
}

const ShoppingRequestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  deliveryLocation: {
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  
  storeLocation: String,
  storeCoordinates: {
    latitude: Number,
    longitude: Number,
  },
  
  handlerId: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  assignedAt: Date,
  
  actualCost: Number,
  returnedChange: Number,
  deliveredAt: Date,
  deliveryProofPhoto: String,
  
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: String,
  ratedAt: Date,
  
  isCOD: {
    type: Boolean,
    default: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending',
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
ShoppingRequestSchema.index({ status: 1, createdAt: -1 });
ShoppingRequestSchema.index({ requesterId: 1 });
ShoppingRequestSchema.index({ handlerId: 1 });
ShoppingRequestSchema.index({ status: 1, requesterId: 1 });

export default mongoose.model<IShoppingRequest>('ShoppingRequest', ShoppingRequestSchema);
