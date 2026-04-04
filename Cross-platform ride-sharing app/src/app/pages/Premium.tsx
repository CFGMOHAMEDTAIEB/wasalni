import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Crown, Check, Zap, BadgeCheck, TrendingUp, Star } from "lucide-react";

export function Premium() {
  const features = [
    {
      icon: TrendingUp,
      title: "Commission réduite à 5%",
      description:
        "Économisez 50% sur les frais de service par rapport aux 10% standards",
    },
    {
      icon: Crown,
      title: "Mise en vedette gratuite",
      description: "Tous vos trajets apparaissent en premier dans les recherches",
    },
    {
      icon: BadgeCheck,
      title: "Badge vérifié Premium",
      description: "Augmentez la confiance et obtenez plus de réservations",
    },
    {
      icon: Star,
      title: "Support prioritaire",
      description: "Assistance 24/7 avec temps de réponse garanti sous 2h",
    },
    {
      icon: Zap,
      title: "Statistiques avancées",
      description: "Analysez vos performances et optimisez vos revenus",
    },
  ];

  const pricingPlans = [
    {
      name: "Mensuel",
      price: "29",
      period: "par mois",
      savings: "",
    },
    {
      name: "Trimestriel",
      price: "69",
      period: "pour 3 mois",
      savings: "Économisez 18 DT",
      popular: true,
    },
    {
      name: "Annuel",
      price: "249",
      period: "par an",
      savings: "Économisez 99 DT",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4">
            <Crown className="size-5" />
            <span className="font-semibold">Wassalni Premium</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Gagnez plus avec Premium
          </h1>
          <p className="text-xl text-gray-600">
            Réduisez vos frais, augmentez votre visibilité et maximisez vos revenus
          </p>
        </div>

        {/* ROI Calculator */}
        <Card className="max-w-2xl mx-auto mb-16 border-2 border-yellow-400">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="text-center">
              Calculateur d'économies Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Sans Premium (10%)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>5 trajets × 20 DT</span>
                    <span>100 DT</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Commission (10%)</span>
                    <span>-10 DT</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Mise en vedette</span>
                    <span>-25 DT</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Revenu net</span>
                    <span>65 DT</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Crown className="size-4 text-yellow-600" />
                  Avec Premium (5%)
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>5 trajets × 20 DT</span>
                    <span>100 DT</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Commission (5%)</span>
                    <span>-5 DT</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Mise en vedette</span>
                    <span className="line-through">0 DT</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Revenu net</span>
                    <span className="text-green-600">95 DT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-lg font-bold text-green-700">
                Économie mensuelle: 30 DT
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Le Premium se rentabilise dès le premier mois !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tout ce dont vous avez besoin pour réussir
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <feature.icon className="size-10 text-yellow-600 mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choisissez votre plan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={
                  plan.popular
                    ? "border-2 border-yellow-400 shadow-lg scale-105"
                    : ""
                }
              >
                {plan.popular && (
                  <div className="bg-yellow-400 text-center py-2 font-semibold text-sm">
                    Plus populaire
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600"> DT</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{plan.period}</p>
                  {plan.savings && (
                    <Badge className="bg-green-500 mb-4">{plan.savings}</Badge>
                  )}
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Choisir ce plan
                  </Button>
                  <ul className="mt-6 space-y-3">
                    {features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ce que disent nos membres Premium
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
                    alt="Ahmed"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">Ahmed Ben Salem</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  "Premium m'a fait économiser plus de 200 DT ce mois-ci. La mise
                  en vedette automatique m'apporte beaucoup plus de passagers !"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop"
                    alt="Fatma"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">Fatma Trabelsi</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  "Le badge Premium inspire confiance. Mes réservations ont
                  augmenté de 40% depuis que je suis passée à Premium !"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl text-white max-w-3xl mx-auto">
          <Crown className="size-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Prêt à maximiser vos revenus ?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Rejoignez des centaines de conducteurs Premium qui gagnent plus chaque
            mois
          </p>
          <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100">
            Commencer mon essai gratuit de 7 jours
          </Button>
          <p className="text-sm mt-4 opacity-75">
            Aucune carte de crédit requise • Annulation à tout moment
          </p>
        </div>
      </div>
    </div>
  );
}
