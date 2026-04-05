import mongoose, { Document } from 'mongoose';

export interface ILouage extends Document {
  driverId: mongoose.Types.ObjectId;
  
  // Route details
  routeId?: mongoose.Types.ObjectId; // Reference to predefined route if exists
  startPoint: {
    name: string; // e.g., "Place de la Gare, Tunis"
    latitude: number;
    longitude: number;
  };
  endPoint: {
    name: string; // e.g., "Sfax Central Station"
    latitude: number;
    longitude: number;
  };
  intermediaryStops?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    order: number;
  }>;
  distance: number;
  estimatedDuration: number; // in minutes
  
  // Vehicle details
  vehicleType: 'minibus' | 'van' | 'station_wagon';
  totalSeats: number;
  availableSeats: number;
  registrationNumber: string;
  
  // Pricing
  pricePerSeat: number;
  fixedRoute: boolean; // true for fixed louage routes
  schedule?: Array<{
    day: string; // 'monday', 'tuesday', etc.
    departureTime: string; // HH:MM format
    recurring: boolean;
  }>;
  
  // Current journey
  status: 'available' | 'full' | 'in_transit' | 'completed' | 'cancelled';
  departureTime?: Date;
  estimatedArrivalTime?: Date;
  actualArrivalTime?: Date;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  
  // Passengers
  passengers: Array<{
    userId: mongoose.Types.ObjectId;
    bookedSeat?: number;
    boardedAt?: Date;
    status: 'booked' | 'boarded' | 'completed' | 'cancelled';
  }>;
  
  // Amenities and features
  amenities: string[]; // e.g., ["AC", "WiFi", "USB charger"]
  wheelchairAccessible: boolean;
  
  // Rating
  averageRating: number;
  totalRatings: number;
  
  // Timeline
  createdAt: Date;
  updatedAt: Date;
}

const LouageSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  routeId: mongoose.Schema.Types.ObjectId,
  startPoint: {
    name: {
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
  endPoint: {
    name: {
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
  intermediaryStops: [
    {
      name: String,
      latitude: Number,
      longitude: Number,
      order: Number,
    },
  ],
  distance: {
    type: Number,
    required: true,
  },
  estimatedDuration: {
    type: Number,
    required: true,
  },
  
  vehicleType: {
    type: String,
    enum: ['minibus', 'van', 'station_wagon'],
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  
  pricePerSeat: {
    type: Number,
    required: true,
  },
  fixedRoute: {
    type: Boolean,
    default: false,
  },
  schedule: [
    {
      day: String,
      departureTime: String,
      recurring: Boolean,
    },
  ],
  
  status: {
    type: String,
    enum: ['available', 'full', 'in_transit', 'completed', 'cancelled'],
    default: 'available',
  },
  departureTime: Date,
  estimatedArrivalTime: Date,
  actualArrivalTime: Date,
  currentLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: Date,
  },
  
  passengers: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      bookedSeat: Number,
      boardedAt: Date,
      status: {
        type: String,
        enum: ['booked', 'boarded', 'completed', 'cancelled'],
        default: 'booked',
      },
    },
  ],
  
  amenities: [String],
  wheelchairAccessible: {
    type: Boolean,
    default: false,
  },
  
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Indexes
LouageSchema.index({ status: 1, driverId: 1 });
LouageSchema.index({ 'startPoint.latitude': 1, 'startPoint.longitude': 1 });
LouageSchema.index({ 'endPoint.latitude': 1, 'endPoint.longitude': 1 });
LouageSchema.index({ driverId: 1 });
LouageSchema.index({ fixedRoute: 1, status: 1 });

export default mongoose.model<ILouage>('Louage', LouageSchema);
