import { useParams, useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  BadgeCheck,
  Crown,
  Music,
  Cigarette,
  Dog,
  Luggage,
  MessageCircle,
} from "lucide-react";
import { mockRides } from "../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { GuestPrompt } from "../components/GuestPrompt";

export function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';
  const ride = mockRides.find((r) => r.id === id);

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Trajet non trouvé</h1>
          <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const commission = ride.driver.premium ? ride.price * 0.05 : ride.price * 0.1;
  const totalPrice = ride.price + commission;

  const handleBooking = () => {
    if (isGuest) {
      navigate('/login');
      return;
    }
    toast.success("Demande de réservation envoyée !", {
      description: `Le conducteur ${ride.driver.name} sera notifié de votre demande.`,
    });
  };

  const handleContact = () => {
    if (isGuest) {
      toast.error('Connexion requise', {
        description: 'Vous devez créer un compte pour contacter le conducteur.',
      });
      navigate('/login');
      return;
    }
    toast.info('Nouveau message', {
      description: `Message envoyé à ${ride.driver.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Route Card */}
            <Card>
              <CardHeader>
                <CardTitle>Détails du trajet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">{ride.from}</p>
                    <p className="text-sm text-muted-foreground">Point de départ</p>
                  </div>
                </div>

                <Separator />

                {ride.stops.length > 0 && (
                  <>
                    {ride.stops.map((stop, index) => (
                      <div key={index} className="flex items-start gap-3 pl-8">
                        <div className="size-2 rounded-full bg-gray-400 mt-2"></div>
                        <div>
                          <p className="font-medium">{stop}</p>
                          <p className="text-xs text-muted-foreground">Arrêt</p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                  </>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">{ride.to}</p>
                    <p className="text-sm text-muted-foreground">
                      Point d'arrivée
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(ride.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="size-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Heure</p>
                      <p className="font-medium">{ride.time}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Card */}
            <Card>
              <CardHeader>
                <CardTitle>À propos du conducteur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={ride.driver.image}
                    alt={ride.driver.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">
                        {ride.driver.name}
                      </h3>
                      {ride.driver.verified && (
                        <BadgeCheck className="size-5 text-blue-500" />
                      )}
                      {ride.driver.premium && (
                        <Badge className="bg-yellow-500">
                          <Crown className="size-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Star className="size-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{ride.driver.rating}</span>
                      <span className="text-muted-foreground">
                        ({ride.driver.reviews} avis)
                      </span>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleContact}
                      disabled={isGuest}
                    >
                      <MessageCircle className="size-4 mr-2" />
                      Contacter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle & Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Véhicule et préférences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Car className="size-5 text-primary" />
                  <span className="font-medium">{ride.carModel}</span>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Préférences du trajet
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Music
                        className={`size-5 ${
                          ride.preferences.music
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm">Musique autorisée</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cigarette
                        className={`size-5 ${
                          ride.preferences.smoking
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm">Fumeur</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dog
                        className={`size-5 ${
                          ride.preferences.pets
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm">Animaux acceptés</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Luggage
                        className={`size-5 ${
                          ride.preferences.luggage
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm">Bagages permis</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {isGuest && (
                  <GuestPrompt 
                    title="Créez un compte pour réserver"
                    description="Connectez-vous ou inscrivez-vous pour accéder à toutes les fonctionnalités."
                    className="mb-4"
                  />
                )}
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      {ride.price} DT
                    </p>
                    <p className="text-sm text-muted-foreground">par personne</p>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix du trajet</span>
                      <span>{ride.price.toFixed(2)} DT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Frais de service ({ride.driver.premium ? "5" : "10"}%)
                      </span>
                      <span>{commission.toFixed(2)} DT</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{totalPrice.toFixed(2)} DT</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="size-4" />
                    <span>
                      {ride.seatsAvailable} place{ride.seatsAvailable > 1 ? "s" : ""}{" "}
                      disponible{ride.seatsAvailable > 1 ? "s" : ""}
                    </span>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleBooking}
                    disabled={isGuest}
                  >
                    {isGuest ? 'Connectez-vous pour réserver' : 'Réserver maintenant'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Vous ne serez pas débité maintenant
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
