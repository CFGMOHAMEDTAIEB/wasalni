import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { MapPin, Calendar, Clock, Users, DollarSign, Crown, AlertCircle } from "lucide-react";
import { tunisianCities } from "../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Alert, AlertDescription } from "../components/ui/alert";

export function PublishRide() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    price: "",
    seats: "3",
    carModel: "",
    stops: "",
    music: true,
    smoking: false,
    pets: false,
    luggage: true,
    featured: false,
  });

  // Check if user is owner
  if (user?.role !== "owner") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="ml-4">
              <p className="font-semibold text-blue-900 mb-2">Devenez propriétaire</p>
              <p className="text-blue-800 text-sm mb-4">
                Vous avez besoin d'un compte propriétaire de véhicule pour publier des trajets.
              </p>
              <Button 
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Mettre à jour mon profil
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseCommission = parseFloat(formData.price) * (user?.rating ? 0.05 : 0.1);
    const featuredFee = formData.featured ? 5 : 0;
    const totalFees = baseCommission + featuredFee;

    toast.success("Trajet publié avec succès !", {
      description: `Frais de service: ${totalFees.toFixed(2)} DT`,
    });

    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const calculateFees = () => {
    if (!formData.price) return 0;
    const price = parseFloat(formData.price);
    const commission = price * (user?.rating ? 0.05 : 0.1); // 5% for premium, 10% standard
    const featuredFee = formData.featured ? 5 : 0;
    return commission + featuredFee;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Publier un trajet</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Route Details */}
            <Card>
              <CardHeader>
                <CardTitle>Itinéraire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from" className="flex items-center gap-2">
                      <MapPin className="size-4 text-green-600" />
                      Ville de départ
                    </Label>
                    <Input
                      id="from"
                      required
                      value={formData.from}
                      onChange={(e) =>
                        setFormData({ ...formData, from: e.target.value })
                      }
                      list="cities-from"
                      placeholder="Ex: Tunis"
                    />
                    <datalist id="cities-from">
                      {tunisianCities.map((city) => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to" className="flex items-center gap-2">
                      <MapPin className="size-4 text-red-600" />
                      Ville d'arrivée
                    </Label>
                    <Input
                      id="to"
                      required
                      value={formData.to}
                      onChange={(e) =>
                        setFormData({ ...formData, to: e.target.value })
                      }
                      list="cities-to"
                      placeholder="Ex: Sousse"
                    />
                    <datalist id="cities-to">
                      {tunisianCities.map((city) => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stops">Arrêts intermédiaires (optionnel)</Label>
                  <Input
                    id="stops"
                    value={formData.stops}
                    onChange={(e) =>
                      setFormData({ ...formData, stops: e.target.value })
                    }
                    placeholder="Ex: Hammamet, Monastir"
                  />
                  <p className="text-xs text-muted-foreground">
                    Séparez les villes par des virgules
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle>Date et heure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="size-4" />
                      Heure
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price & Seats */}
            <Card>
              <CardHeader>
                <CardTitle>Prix et places</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-2">
                      <DollarSign className="size-4" />
                      Prix par personne (DT)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      required
                      min="1"
                      step="0.5"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="Ex: 15"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seats" className="flex items-center gap-2">
                      <Users className="size-4" />
                      Nombre de places
                    </Label>
                    <Input
                      id="seats"
                      type="number"
                      required
                      min="1"
                      max="7"
                      value={formData.seats}
                      onChange={(e) =>
                        setFormData({ ...formData, seats: e.target.value })
                      }
                    />
                  </div>
                </div>

                {formData.price && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium mb-1">Frais de service</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Commission standard: 10% • Mise en vedette: 5 DT
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {calculateFees().toFixed(2)} DT
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vehicle */}
            <Card>
              <CardHeader>
                <CardTitle>Véhicule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="carModel">Modèle de voiture</Label>
                  <Input
                    id="carModel"
                    required
                    value={formData.carModel}
                    onChange={(e) =>
                      setFormData({ ...formData, carModel: e.target.value })
                    }
                    placeholder="Ex: Renault Clio"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Préférences du trajet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="music" className="cursor-pointer">
                    Musique autorisée
                  </Label>
                  <Switch
                    id="music"
                    checked={formData.music}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, music: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="smoking" className="cursor-pointer">
                    Fumeur
                  </Label>
                  <Switch
                    id="smoking"
                    checked={formData.smoking}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, smoking: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="pets" className="cursor-pointer">
                    Animaux acceptés
                  </Label>
                  <Switch
                    id="pets"
                    checked={formData.pets}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, pets: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="luggage" className="cursor-pointer">
                    Bagages permis
                  </Label>
                  <Switch
                    id="luggage"
                    checked={formData.luggage}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, luggage: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Premium Features */}
            <Card className="border-yellow-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="size-5 text-yellow-500" />
                  Options Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Label htmlFor="featured" className="cursor-pointer font-semibold">
                      Mettre en vedette ce trajet
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Votre trajet apparaîtra en premier dans les résultats de
                      recherche (+5 DT)
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1">
                Publier le trajet
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
