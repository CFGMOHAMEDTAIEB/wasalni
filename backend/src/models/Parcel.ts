import mongoose, { Document } from 'mongoose';

export interface IParcel extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  
  originCity: string;
  originCoordinates?: {
    latitude: number;
    longitude: number;
  };
  originAddress?: string;
  
  destinationCity: string;
  destinationCoordinates?: {
    latitude: number;
    longitude: number;
  };
  destinationAddress?: string;
  
  // Parcel details
  description: string;
  weight: number; // kg
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  isFragile: boolean;
  requiresSignature: boolean;
  
  // Delivery
  driverId?: mongoose.Types.ObjectId;
  price: number; // DT
  commission: number; // 5% of price
  
  // Status
  status: 'pending' | 'accepted' | 'picked' | 'in-transit' | 'delivered' | 'cancelled';
  trackingCode: string; // Unique tracking identifier
  
  // Timeline
  createdAt: Date;
  acceptedAt?: Date;
  pickedAt?: Date;
  deliveredAt?: Date;
  deliveryProof?: string; // Photo URL
  
  // Contact
  senderNotes?: string;
  driversApproached: mongoose.Types.ObjectId[]; // Drivers who received notification
}

const ParcelSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  receiverPhone: {
    type: String,
    required: true,
  },
  receiverEmail: String,
  
  originCity: {
    type: String,
    required: true,
  },
  originCoordinates: {
    latitude: Number,
    longitude: Number,
  },
  originAddress: String,
  
  destinationCity: {
    type: String,
    required: true,
  },
  destinationCoordinates: {
    latitude: Number,
    longitude: Number,
  },
  destinationAddress: String,
  
  description: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  isFragile: {
    type: Boolean,
    default: false,
  },
  requiresSignature: {
    type: Boolean,
    default: false,
  },
  
  driverId: mongoose.Schema.Types.ObjectId,
  price: {
    type: Number,
    required: true,
  },
  commission: {
    type: Number,
    required: true,
  },
  
  status: {
    type: String,
    enum: ['pending', 'accepted', 'picked', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingCode: {
    type: String,
    unique: true,
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: Date,
  pickedAt: Date,
  deliveredAt: Date,
  deliveryProof: String,
  
  senderNotes: String,
  driversApproached: [mongoose.Schema.Types.ObjectId],
}, { timestamps: true });

// Indexes for efficient queries
ParcelSchema.index({ status: 1, createdAt: -1 });
ParcelSchema.index({ trackingCode: 1 });
ParcelSchema.index({ senderId: 1 });
ParcelSchema.index({ driverId: 1 });
ParcelSchema.index({ originCity: 1, destinationCity: 1, status: 1 });
ParcelSchema.index({ originCoordinates: '2dsphere' });
ParcelSchema.index({ destinationCoordinates: '2dsphere' });

export default mongoose.model<IParcel>('Parcel', ParcelSchema);
