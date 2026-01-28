import { Property, Review } from "@/types";

// Admin managed tags would be fetched from backend
export const adminTags = [
  "Pool", "Spa", "Restaurant", "Bar", "Beach Access", "Gym", "Yoga Studio", "Tennis Court",
  "Adults Only", "All-Inclusive Available", "Couples Friendly", "LGBTQ+ Friendly"
];

export const properties: Property[] = [
  {
    id: "1",
    name: "Azure Naturist Resort & Spa",
    description: "Luxury naturist resort nestled in the Mediterranean coast. Experience ultimate freedom and relaxation with our world-class spa, private beaches, and gourmet dining.",
    location: {
      city: "Costa del Sol",
      country: "Spain",
      region: "Andalusia",
      coordinates: { lat: 36.7213, lng: -4.4214 }
    },
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
    ],
    price: { perNight: 285, currency: "EUR" },
    rating: 4.8,
    reviewCount: 342,
    propertyType: "resort",
    naturistType: "fully-naturist",
    amenities: ["Pool", "Spa", "Restaurant", "Bar", "Beach Access", "Gym", "Yoga Studio", "Tennis Court"],
    features: ["Adults Only", "All-Inclusive Available", "Couples Friendly", "LGBTQ+ Friendly"],
    capacity: { guests: 400, rooms: 180 },
    availability: true,
    featured: true
  },
  {
    id: "2",
    name: "Hidden Valley Naturist Hotel",
    description: "Peaceful boutique hotel surrounded by nature. Perfect for those seeking tranquility and authentic naturist lifestyle experience.",
    location: {
      city: "Provence",
      country: "France",
      region: "Var",
      coordinates: { lat: 43.4832, lng: 6.8431 }
    },
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"
    ],
    price: { perNight: 145, currency: "EUR" },
    rating: 4.6,
    reviewCount: 189,
    propertyType: "hotel",
    naturistType: "fully-naturist",
    amenities: ["Pool", "Restaurant", "Garden", "Sauna", "Library", "Bike Rental"],
    features: ["Pet Friendly", "Eco-Friendly", "Organic Meals"],
    capacity: { guests: 60, rooms: 28 },
    availability: true,
    featured: true
  },
  {
    id: "3",
    name: "Sunset Bay Clothing-Optional Resort",
    description: "Flexible resort offering both textile and clothing-optional areas. Stunning sunset views and premium facilities for all preferences.",
    location: {
      city: "Miami",
      country: "United States",
      region: "Florida",
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"
    ],
    price: { perNight: 220, currency: "USD" },
    rating: 4.5,
    reviewCount: 267,
    propertyType: "resort",
    naturistType: "clothing-optional",
    amenities: ["Pool", "Beach Access", "Restaurant", "Bar", "Water Sports", "Nightclub"],
    features: ["Family Friendly", "Kids Club", "Entertainment Program"],
    capacity: { guests: 350, rooms: 150 },
    availability: true,
    featured: true
  },
  {
    id: "4",
    name: "Mountain View Naturist Retreat",
    description: "Alpine naturist retreat with breathtaking mountain views. Ideal for hiking enthusiasts and nature lovers.",
    location: {
      city: "Innsbruck",
      country: "Austria",
      region: "Tyrol",
      coordinates: { lat: 47.2692, lng: 11.4041 }
    },
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"
    ],
    price: { perNight: 165, currency: "EUR" },
    rating: 4.7,
    reviewCount: 156,
    propertyType: "hotel",
    naturistType: "fully-naturist",
    amenities: ["Sauna", "Hot Tub", "Restaurant", "Hiking Trails", "Wellness Center"],
    features: ["Mountain Views", "Eco-Friendly", "Quiet Zone"],
    capacity: { guests: 80, rooms: 35 },
    availability: true
  },
  {
    id: "5",
    name: "Tropical Paradise Naturist Camp",
    description: "Affordable naturist camping experience in a tropical setting. Bungalows and camping spots available with shared facilities.",
    location: {
      city: "Algarve",
      country: "Portugal",
      region: "Faro",
      coordinates: { lat: 37.0179, lng: -7.9304 }
    },
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"
    ],
    price: { perNight: 65, currency: "EUR" },
    rating: 4.3,
    reviewCount: 98,
    propertyType: "campsite",
    naturistType: "fully-naturist",
    amenities: ["Pool", "Beach Access", "BBQ Area", "Shared Kitchen", "Volleyball Court"],
    features: ["Budget Friendly", "Social Atmosphere", "Young Crowd"],
    capacity: { guests: 120, rooms: 45 },
    availability: true
  },
  {
    id: "6",
    name: "Serenity Naturist Villa Collection",
    description: "Exclusive private villas for intimate naturist getaways. Each villa with private pool and complete privacy.",
    location: {
      city: "Santorini",
      country: "Greece",
      region: "Cyclades",
      coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    images: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    ],
    price: { perNight: 450, currency: "EUR" },
    rating: 4.9,
    reviewCount: 78,
    propertyType: "villa",
    naturistType: "clothing-optional",
    amenities: ["Private Pool", "Kitchen", "Sea View", "Concierge", "Daily Cleaning"],
    features: ["Luxury", "Privacy", "Romantic", "Honeymoon Special"],
    capacity: { guests: 4, rooms: 2 },
    availability: true,
    featured: true
  }
];

export const reviews: Review[] = [
  {
    id: "r1",
    propertyId: "1",
    userId: "u1",
    userName: "Sophie M.",
    rating: 5,
    title: "Absolutely Perfect Paradise",
    comment: "This resort exceeded all expectations. The staff is incredibly professional and respectful, the facilities are pristine, and the atmosphere is wonderfully liberating. The spa treatments were divine!",
    date: "2026-01-15",
    verified: true
  },
  {
    id: "r2",
    propertyId: "1",
    userId: "u2",
    userName: "Michael R.",
    rating: 5,
    title: "Best Naturist Resort Experience",
    comment: "My partner and I have visited many naturist resorts, and this is by far the best. Beautiful grounds, excellent food, and a very welcoming community.",
    date: "2026-01-10",
    verified: true
  },
  {
    id: "r3",
    propertyId: "2",
    userId: "u3",
    userName: "Emma L.",
    rating: 4,
    title: "Charming and Peaceful",
    comment: "Lovely boutique hotel with a real family feel. The owners are wonderful hosts. Only minor downside is limited evening entertainment, but that's perfect if you want peace and quiet.",
    date: "2026-01-05",
    verified: true
  }
];