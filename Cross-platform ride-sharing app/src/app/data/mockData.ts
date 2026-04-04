export interface Ride {
  id: string;
  driver: {
    name: string;
    rating: number;
    reviews: number;
    verified: boolean;
    premium: boolean;
    image: string;
  };
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seatsAvailable: number;
  totalSeats: number;
  featured: boolean;
  carModel: string;
  preferences: {
    music: boolean;
    smoking: boolean;
    pets: boolean;
    luggage: boolean;
  };
  stops: string[];
}

export const mockRides: Ride[] = [
  {
    id: "1",
    driver: {
      name: "Ahmed Ben Salem",
      rating: 4.8,
      reviews: 142,
      verified: true,
      premium: true,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    from: "Tunis",
    to: "Sousse",
    date: "2026-04-05",
    time: "08:00",
    price: 15,
    seatsAvailable: 3,
    totalSeats: 4,
    featured: true,
    carModel: "Renault Clio",
    preferences: {
      music: true,
      smoking: false,
      pets: false,
      luggage: true
    },
    stops: ["Hammamet"]
  },
  {
    id: "2",
    driver: {
      name: "Fatma Trabelsi",
      rating: 4.9,
      reviews: 89,
      verified: true,
      premium: false,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    from: "Tunis",
    to: "Sfax",
    date: "2026-04-05",
    time: "09:30",
    price: 25,
    seatsAvailable: 2,
    totalSeats: 3,
    featured: false,
    carModel: "Peugeot 208",
    preferences: {
      music: true,
      smoking: false,
      pets: true,
      luggage: true
    },
    stops: ["Sousse", "Monastir"]
  },
  {
    id: "3",
    driver: {
      name: "Mohamed Jebali",
      rating: 4.7,
      reviews: 203,
      verified: true,
      premium: true,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    },
    from: "Tunis",
    to: "Bizerte",
    date: "2026-04-04",
    time: "14:00",
    price: 8,
    seatsAvailable: 4,
    totalSeats: 4,
    featured: true,
    carModel: "Volkswagen Golf",
    preferences: {
      music: true,
      smoking: false,
      pets: false,
      luggage: true
    },
    stops: []
  },
  {
    id: "4",
    driver: {
      name: "Sarra Mansour",
      rating: 4.6,
      reviews: 67,
      verified: false,
      premium: false,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    from: "Sousse",
    to: "Tunis",
    date: "2026-04-05",
    time: "16:00",
    price: 12,
    seatsAvailable: 1,
    totalSeats: 3,
    featured: false,
    carModel: "Fiat Punto",
    preferences: {
      music: false,
      smoking: false,
      pets: false,
      luggage: false
    },
    stops: ["Hammamet"]
  },
  {
    id: "5",
    driver: {
      name: "Karim Bouazizi",
      rating: 4.9,
      reviews: 156,
      verified: true,
      premium: true,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
    },
    from: "Tunis",
    to: "Kairouan",
    date: "2026-04-06",
    time: "10:00",
    price: 18,
    seatsAvailable: 2,
    totalSeats: 3,
    featured: true,
    carModel: "Toyota Corolla",
    preferences: {
      music: true,
      smoking: false,
      pets: false,
      luggage: true
    },
    stops: []
  }
];

export const tunisianCities = [
  "Tunis",
  "Sfax",
  "Sousse",
  "Kairouan",
  "Bizerte",
  "Gabès",
  "Ariana",
  "Gafsa",
  "Monastir",
  "Ben Arous",
  "Kasserine",
  "Médenine",
  "Nabeul",
  "Tataouine",
  "Béja",
  "Jendouba",
  "Mahdia",
  "Sidi Bouzid",
  "Kef",
  "Tozeur",
  "Siliana",
  "Kebili",
  "Zaghouan",
  "Manouba",
  "Hammamet"
];
