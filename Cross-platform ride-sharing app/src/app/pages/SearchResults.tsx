import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { RideCard } from "../components/RideCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { mockRides, Ride } from "../data/mockData";

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "time" | "rating">("time");

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  useEffect(() => {
    let results = mockRides.filter((ride) => {
      if (from && ride.from.toLowerCase() !== from.toLowerCase()) return false;
      if (to && ride.to.toLowerCase() !== to.toLowerCase()) return false;
      if (date && ride.date !== date) return false;
      return true;
    });

    // Sort results
    results = results.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return b.driver.rating - a.driver.rating;
      if (sortBy === "time") return a.time.localeCompare(b.time);
      return 0;
    });

    // Featured rides first
    results = results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    setFilteredRides(results);
  }, [from, to, date, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {filteredRides.length} trajet{filteredRides.length > 1 ? "s" : ""} trouvé
            {filteredRides.length > 1 ? "s" : ""}
          </h1>
          <div className="flex flex-wrap gap-2">
            {from && (
              <Badge variant="secondary">
                Départ: <span className="font-semibold ml-1">{from}</span>
              </Badge>
            )}
            {to && (
              <Badge variant="secondary">
                Arrivée: <span className="font-semibold ml-1">{to}</span>
              </Badge>
            )}
            {date && (
              <Badge variant="secondary">
                Date:{" "}
                <span className="font-semibold ml-1">
                  {new Date(date).toLocaleDateString("fr-FR")}
                </span>
              </Badge>
            )}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="size-4 mr-2" />
            Filtres
          </Button>

          <div className="flex gap-2">
            <Button
              variant={sortBy === "time" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("time")}
            >
              <ArrowUpDown className="size-4 mr-2" />
              Heure
            </Button>
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("price")}
            >
              <ArrowUpDown className="size-4 mr-2" />
              Prix
            </Button>
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("rating")}
            >
              <ArrowUpDown className="size-4 mr-2" />
              Note
            </Button>
          </div>
        </div>

        {/* Results */}
        {filteredRides.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Aucun trajet trouvé</p>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}

        {/* Monetization Info */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2">💡 Astuce pour les conducteurs</h3>
          <p className="text-sm text-gray-700">
            Publiez des trajets réguliers et devenez membre Premium pour réduire les
            frais de service de 10% à 5% et bénéficier de la mise en vedette
            gratuite !
          </p>
        </div>
      </div>
    </div>
  );
}
