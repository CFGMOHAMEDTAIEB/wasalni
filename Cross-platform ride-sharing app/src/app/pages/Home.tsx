import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Calendar, MapPin } from "lucide-react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { tunisianCities } from "../data/mockData";

export function Home() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (date) params.append("date", date);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
            Covoiturage en Tunisie
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Voyagez malin, partagez vos trajets et économisez !
          </p>
        </div>

        {/* Search Card */}
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {/* From */}
              <div className="space-y-2">
                <Label htmlFor="from" className="flex items-center gap-2">
                  <MapPin className="size-4 text-green-600" />
                  Départ
                </Label>
                <Input
                  id="from"
                  placeholder="Ville de départ"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  list="cities-from"
                />
                <datalist id="cities-from">
                  {tunisianCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              {/* To */}
              <div className="space-y-2">
                <Label htmlFor="to" className="flex items-center gap-2">
                  <MapPin className="size-4 text-red-600" />
                  Arrivée
                </Label>
                <Input
                  id="to"
                  placeholder="Ville d'arrivée"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  list="cities-to"
                />
                <datalist id="cities-to">
                  {tunisianCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <Button
              className="w-full md:w-auto px-8"
              size="lg"
              onClick={handleSearch}
            >
              <Search className="size-5 mr-2" />
              Rechercher un trajet
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="size-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Trajets partout en Tunisie</h3>
              <p className="text-sm text-gray-600">
                Trouvez des trajets entre toutes les villes tunisiennes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Économisez de l'argent</h3>
              <p className="text-sm text-gray-600">
                Partagez les frais et voyagez moins cher
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold mb-2">Écologique</h3>
              <p className="text-sm text-gray-600">
                Réduisez votre empreinte carbone ensemble
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Vous proposez un trajet ?</h2>
          <Button size="lg" onClick={() => navigate("/publish")}>
            Publier un trajet
          </Button>
        </div>
      </div>
    </div>
  );
}
