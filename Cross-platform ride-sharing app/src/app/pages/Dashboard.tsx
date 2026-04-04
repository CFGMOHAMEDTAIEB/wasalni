import { useState } from "react";
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Car,
  MessageSquare,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Crown,
} from "lucide-react";
import { mockRides } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { user } = useAuth();
  const userBookings = mockRides.slice(2, 4);
  const userRides = mockRides.slice(0, 2);

  const pendingRequests = [
    {
      id: "req1",
      passenger: "Sarah Souissi",
      from: "Tunis",
      to: "Sousse",
      seats: 2,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: "req2",
      passenger: "Ali Khaled",
      from: "Tunis",
      to: "Sfax",
      seats: 1,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  ];

  const totalEarnings = userRides.reduce((sum, ride) => {
    const commission = ride.driver.premium ? ride.price * 0.05 : ride.price * 0.1;
    const bookedSeats = ride.totalSeats - ride.seatsAvailable;
    return sum + ride.price * bookedSeats - commission * bookedSeats;
  }, 0);

  const totalCommissions = userRides.reduce((sum, ride) => {
    const commission = ride.driver.premium ? ride.price * 0.05 : ride.price * 0.1;
    const bookedSeats = ride.totalSeats - ride.seatsAvailable;
    return sum + commission * bookedSeats;
  }, 0);

  // Owner Dashboard
  if (user?.role === "owner") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord Propriétaire</h1>
            <p className="text-muted-foreground">Gérez vos trajets et demandes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Trajets publiés</p>
                    <p className="text-2xl font-bold">{userRides.length}</p>
                  </div>
                  <Car className="size-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Demandes en attente</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
                  </div>
                  <Clock className="size-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Gains totaux</p>
                    <p className="text-2xl font-bold">{totalEarnings.toFixed(0)} DT</p>
                  </div>
                  <DollarSign className="size-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <p className="text-lg font-bold">
                      {user?.verified ? "✅ Vérifié" : "⏳ En attente"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="rides" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rides">Mes trajets ({userRides.length})</TabsTrigger>
              <TabsTrigger value="requests">Demandes ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="earnings">Revenus</TabsTrigger>
            </TabsList>

            <TabsContent value="rides" className="space-y-4">
              <Button className="bg-primary">+ Publier un trajet</Button>
              {userRides.map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{ride.from} → {ride.to}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(ride.date).toLocaleDateString("fr-FR")} at {ride.time}
                        </p>
                        <p className="text-sm mt-2 font-semibold">{ride.price} DT</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="size-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <img
                          src={request.avatar}
                          alt={request.passenger}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-bold">{request.passenger}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.from} → {request.to} ({request.seats} place)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600">
                          <CheckCircle className="size-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <XCircle className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenus totaux</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-green-600">{totalEarnings.toFixed(2)} DT</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Commissions payées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-orange-600">{totalCommissions.toFixed(2)} DT</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Normal User Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mon Tableau de Bord</h1>
          <p className="text-muted-foreground">Gérez vos réservations et messages</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Réservations</p>
                  <p className="text-2xl font-bold">{userBookings.length}</p>
                </div>
                <Car className="size-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <MessageSquare className="size-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Économies</p>
                  <p className="text-2xl font-bold text-green-600">45.50 DT</p>
                </div>
                <DollarSign className="size-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4 mt-6">
            {userBookings.map((ride) => (
              <Card key={ride.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{ride.from} → {ride.to}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ride.date).toLocaleDateString("fr-FR")} at {ride.time}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={ride.driver.image}
                          alt={ride.driver.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">{ride.driver.name}</span>
                        <span className="text-xs text-muted-foreground">⭐ {ride.driver.rating}</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary">{ride.price} DT</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4 mt-6">
            {[
              { name: "Ahmed Ben Salem", message: "À quelle heure ?", time: "10:30" },
              { name: "Fatma Trabelsi", message: "Confirmé pour demain", time: "09:15" },
            ].map((msg, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{msg.name}</p>
                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mon profil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Button className="mt-4">Éditer profil</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Devenir propriétaire</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Gagnez de l'argent en partageant vos trajets</p>
                <Button className="bg-primary">Devenir propriétaire</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
