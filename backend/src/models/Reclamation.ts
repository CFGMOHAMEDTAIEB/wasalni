import mongoose, { Document } from 'mongoose';

export interface IReclamation extends Document {
  reporterId: mongoose.Types.ObjectId;
  
  // What is being reported
  type: 'ride' | 'parcel' | 'shopping' | 'driver' | 'passenger';
  rideId?: mongoose.Types.ObjectId;
  parcelId?: mongoose.Types.ObjectId;
  shoppingRequestId?: mongoose.Types.ObjectId;
  reportedUserId?: mongoose.Types.ObjectId;
  
  // Report details
  category: 'behavior' | 'safety' | 'quality' | 'damage' | 'payment' | 'other';
  title: string;
  description: string;
  evidencePhotos?: string[]; // Array of image URLs
  
  // Status
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Admin actions
  adminNotes?: string;
  resolution?: string;
  resolutionType?: 'refund' | 'warning' | 'ban' | 'other';
  resolvedBy?: mongoose.Types.ObjectId; // Admin who resolved
  
  // Timeline
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const ReclamationSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  type: {
    type: String,
    enum: ['ride', 'parcel', 'shopping', 'driver', 'passenger'],
    required: true,
  },
  rideId: mongoose.Schema.Types.ObjectId,
  parcelId: mongoose.Schema.Types.ObjectId,
  shoppingRequestId: mongoose.Schema.Types.ObjectId,
  reportedUserId: mongoose.Schema.Types.ObjectId,
  
  category: {
    type: String,
    enum: ['behavior', 'safety', 'quality', 'damage', 'payment', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  evidencePhotos: [String],
  
  status: {
    type: String,
    enum: ['open', 'investigating', 'resolved', 'dismissed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  
  adminNotes: String,
  resolution: String,
  resolutionType: {
    type: String,
    enum: ['refund', 'warning', 'ban', 'other'],
  },
  resolvedBy: mongoose.Schema.Types.ObjectId,
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: Date,
}, { timestamps: true });

// Indexes
ReclamationSchema.index({ status: 1, createdAt: -1 });
ReclamationSchema.index({ priority: 1, status: 1 });
ReclamationSchema.index({ reporterId: 1 });
ReclamationSchema.index({ reportedUserId: 1 });
ReclamationSchema.index({ rideId: 1 });
ReclamationSchema.index({ parcelId: 1 });

export default mongoose.model<IReclamation>('Reclamation', ReclamationSchema);
