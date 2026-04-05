import { Link } from "react-router";
import { Star, Users, MapPin, Clock, Crown, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Ride } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

interface RideCardProps {
  ride: Ride;
}

export function RideCard({ ride }: RideCardProps) {
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';
  
  // Calculate commission (10% for regular, 5% for premium)
  const commission = ride.driver.premium ? ride.price * 0.05 : ride.price * 0.10;
  
  return (
    <Card className={ride.featured ? "border-yellow-400 border-2 shadow-md" : ""}>
      {ride.featured && (
        <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-100 flex items-center gap-2">
          <Crown className="size-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-700">Trajet en vedette</span>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Driver Info */}
          <div className="flex-shrink-0">
            <img
              src={ride.driver.image}
              alt={ride.driver.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Driver Name and Badges */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{ride.driver.name}</h3>
              {ride.driver.verified && (
                <BadgeCheck className="size-4 text-blue-500 flex-shrink-0" />
              )}
              {ride.driver.premium && (
                <Crown className="size-4 text-yellow-500 flex-shrink-0" />
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{ride.driver.rating}</span>
              <span className="text-sm text-muted-foreground">({ride.driver.reviews})</span>
            </div>

            {/* Route */}
            <div className="space-y-2 mb-3">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{ride.from}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{ride.to}</p>
                  {ride.stops.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Arrêts: {ride.stops.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Date, Time, Seats */}
            <div className="flex flex-wrap gap-3 mb-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                <span>
                  {new Date(ride.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  à {ride.time}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="size-4" />
                <span>
                  {ride.seatsAvailable} place{ride.seatsAvailable > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Car Model */}
            <p className="text-sm text-muted-foreground mb-3">{ride.carModel}</p>

            {/* Price and Action */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{ride.price} DT</p>
                <p className="text-xs text-muted-foreground">
                  Commission: {commission.toFixed(2)} DT
                </p>
              </div>
              {isGuest ? (
                <Link to="/login">
                  <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                    <AlertCircle className="size-4 mr-1" />
                    Se connecter
                  </Button>
                </Link>
              ) : (
                <Link to={`/ride/${ride.id}`}>
                  <Button>Réserver</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
