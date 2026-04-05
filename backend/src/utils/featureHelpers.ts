/**
 * Utility functions for Phase 3-5 features
 */

/**
 * Haversine Formula: Calculate distance between two coordinates (in km)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Calculate CO2 savings for a completed ride
 * Average car emits 120g CO2/km
 * Shared ride with 2 people = 60g/km per passenger
 */
export const calculateCO2Savings = (
  distanceKm: number,
  passengersInCar: number = 2
): number => {
  const CO2_PER_KM = 120; // grams per kilometer
  const savingsPerPassenger = (CO2_PER_KM / passengersInCar) * distanceKm;
  return Math.round(savingsPerPassenger);
};

/**
 * Calculate loyalty tier based on completed trips
 * Bronze: 0-4 trips
 * Silver: 5-14 trips (5% discount)
 * Gold: 15+ trips (10% discount)
 */
export const calculateLoyaltyTier = (
  completedTrips: number
): 'bronze' | 'silver' | 'gold' => {
  if (completedTrips >= 15) return 'gold';
  if (completedTrips >= 5) return 'silver';
  return 'bronze';
};

/**
 * Get loyalty discount percentage
 */
export const getLoyaltyDiscount = (tier: 'bronze' | 'silver' | 'gold'): number => {
  switch (tier) {
    case 'gold':
      return 0.1; // 10%
    case 'silver':
      return 0.05; // 5%
    default:
      return 0; // 0%
  }
};

/**
 * Generate unique referral code
 */
export const generateReferralCode = (userId: string): string => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `W${randomPart}`;
};

/**
 * Calculate rider match score for AI-driven suggestions
 * Exact city match: +50 points
 * Departure time proximity (within 1 hour): +30 points
 * Driver rating >= 4.5: +10 points
 * Driver completed 5+ trips: +5 points
 * Ride has <= 1 seat left (urgency): +5 points
 */
export const calculateMatchScore = (
  rideData: {
    origin: string;
    destination: string;
    departureTime: string;
    driverRating: number;
    driverCompletedTrips: number;
    seatsAvailable: number;
  },
  passengerPreference: {
    preferredOrigin: string;
    preferredDestination: string;
    preferredTime: string;
  }
): number => {
  let score = 0;

  // Exact city match
  if (rideData.origin.toLowerCase() === passengerPreference.preferredOrigin.toLowerCase()) {
    score += 50;
  }
  if (
    rideData.destination.toLowerCase() === passengerPreference.preferredDestination.toLowerCase()
  ) {
    score += 50;
  }

  // Departure time proximity (within 1 hour)
  const rideTime = new Date(rideData.departureTime).getTime();
  const prefTime = new Date(passengerPreference.preferredTime).getTime();
  const diffMinutes = Math.abs(rideTime - prefTime) / (1000 * 60);
  if (diffMinutes <= 60) {
    score += 30;
  }

  // Driver rating >= 4.5
  if (rideData.driverRating >= 4.5) {
    score += 10;
  }

  // Driver completed 5+ trips
  if (rideData.driverCompletedTrips >= 5) {
    score += 5;
  }

  // Urgency: 1 seat or less left
  if (rideData.seatsAvailable <= 1) {
    score += 5;
  }

  return score;
};

/**
 * Check if ride is departing within next 90 minutes (immediate mode)
 */
export const isImmediateWindowActive = (departureTime: Date): boolean => {
  const now = new Date();
  const departureMs = departureTime.getTime();
  const nowMs = now.getTime();
  const ninetyMinutesMs = 90 * 60 * 1000;
  
  return departureMs >= nowMs && departureMs <= nowMs + ninetyMinutesMs;
};

/**
 * Check if ride is departing within next 30 minutes (show "Départ imminent" badge)
 */
export const hasImminentDeparture = (departureTime: Date): boolean => {
  const now = new Date();
  const departureMs = departureTime.getTime();
  const nowMs = now.getTime();
  const thirtyMinutesMs = 30 * 60 * 1000;
  
  return departureMs >= nowMs && departureMs <= nowMs + thirtyMinutesMs;
};

/**
 * Validate women-only booking
 * Returns error message if validation fails, null if valid
 */
export const validateWomenOnlyBooking = (
  rideWomenOnly: boolean,
  passengerGender: string | undefined
): string | null => {
  if (!rideWomenOnly) return null;
  if (passengerGender === 'female') return null;
  
  return 'Ce trajet est réservé aux femmes. Seules les femmes peuvent réserver ce covoiturage.';
};

/**
 * Generate dates for recurring rides
 * Returns array of dates for each matching weekday between start and end
 */
export const generateRecurringRideDates = (
  startDate: Date,
  endDate: Date,
  selectedDays: string[] // ['monday', 'tuesday', etc.]
): Date[] => {
  const dates: Date[] = [];
  const dayMap: { [key: string]: number } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayName = Object.keys(dayMap).find(
      (key) => dayMap[key] === currentDate.getDay()
    );
    if (dayName && selectedDays.includes(dayName)) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
