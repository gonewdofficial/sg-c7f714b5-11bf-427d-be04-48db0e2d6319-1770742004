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
    slug: "azure-naturist-resort-spa",
    description: "Luxury naturist resort nestled in the Mediterranean coast. Experience ultimate freedom and relaxation with our world-class spa, private beaches, and gourmet dining.",
    location: {
      city: "Costa del Sol",
      country: "Spain",
      region: "Andalusia",
      address: "Avenida del Sol 123",
      coordinates: { lat: 36.7213, lng: -4.4214 }
    },
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
    ],
    price: { perNight: 285, perWeek: 1850, currency: "EUR" },
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
    slug: "hidden-valley-naturist-hotel",
    description: "Peaceful boutique hotel surrounded by nature. Perfect for those seeking tranquility and authentic naturist lifestyle experience.",
    location: {
      city: "Provence",
      country: "France",
      region: "Var",
      address: "Route de la Vallée 45",
      coordinates: { lat: 43.4832, lng: 6.8431 }
    },
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"
    ],
    price: { perNight: 145, perWeek: 920, currency: "EUR" },
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
    slug: "sunset-bay-clothing-optional-resort",
    description: "Flexible resort offering both textile and clothing-optional areas. Stunning sunset views and premium facilities for all preferences.",
    location: {
      city: "Miami",
      country: "United States",
      region: "Florida",
      address: "Ocean Drive 789",
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"
    ],
    price: { perNight: 220, perWeek: 1400, currency: "USD" },
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
    slug: "mountain-view-naturist-retreat",
    description: "Alpine naturist retreat with breathtaking mountain views. Ideal for hiking enthusiasts and nature lovers.",
    location: {
      city: "Innsbruck",
      country: "Austria",
      region: "Tyrol",
      address: "Bergstrasse 56",
      coordinates: { lat: 47.2692, lng: 11.4041 }
    },
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"
    ],
    price: { perNight: 165, perWeek: 1050, currency: "EUR" },
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
    slug: "tropical-paradise-naturist-camp",
    description: "Affordable naturist camping experience in a tropical setting. Bungalows and camping spots available with shared facilities.",
    location: {
      city: "Algarve",
      country: "Portugal",
      region: "Faro",
      address: "Praia do Sol",
      coordinates: { lat: 37.0179, lng: -7.9304 }
    },
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"
    ],
    price: { perNight: 65, perWeek: 400, currency: "EUR" },
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
    slug: "serenity-naturist-villa-collection",
    description: "Exclusive private villas for intimate naturist getaways. Each villa with private pool and complete privacy.",
    location: {
      city: "Santorini",
      country: "Greece",
      region: "Cyclades",
      address: "Caldera View 12",
      coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    images: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    ],
    price: { perNight: 450, perWeek: 2900, currency: "EUR" },
    rating: 4.9,
    reviewCount: 78,
    propertyType: "villa",
    naturistType: "clothing-optional",
    amenities: ["Private Pool", "Kitchen", "Sea View", "Concierge", "Daily Cleaning"],
    features: ["Luxury", "Privacy", "Romantic", "Honeymoon Special"],
    capacity: { guests: 4, rooms: 2 },
    availability: true,
    featured: true
  },
  {
    id: "7",
    name: "Sunshine Coast Naturist Resort",
    slug: "sunshine-coast-naturist-resort",
    description: "Beachfront naturist paradise with year-round sunshine. Perfect for water sports enthusiasts and beach lovers.",
    location: {
      city: "Gold Coast",
      country: "Australia",
      region: "Queensland",
      address: "Pacific Highway 456",
      coordinates: { lat: -28.0167, lng: 153.4000 }
    },
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800"
    ],
    price: { perNight: 195, perWeek: 1250, currency: "AUD" },
    rating: 4.7,
    reviewCount: 234,
    propertyType: "resort",
    naturistType: "fully-naturist",
    amenities: ["Beach Access", "Pool", "Surfing", "Restaurant", "Bar", "Spa"],
    features: ["Beachfront", "Water Sports", "Fitness Center"],
    capacity: { guests: 250, rooms: 120 },
    availability: true,
    featured: true
  },
  {
    id: "8",
    name: "Amazon Rainforest Eco-Lodge",
    slug: "amazon-rainforest-eco-lodge",
    description: "Unique naturist eco-lodge deep in the Amazon rainforest. Connect with nature in its purest form.",
    location: {
      city: "Manaus",
      country: "Brazil",
      region: "Amazonas",
      address: "Rio Negro",
      coordinates: { lat: -3.1190, lng: -60.0217 }
    },
    images: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800"
    ],
    price: { perNight: 180, perWeek: 1150, currency: "BRL" },
    rating: 4.8,
    reviewCount: 145,
    propertyType: "eco-lodge",
    naturistType: "fully-naturist",
    amenities: ["Guided Tours", "Restaurant", "Wildlife Watching", "Hammock Garden"],
    features: ["Eco-Friendly", "Adventure", "Remote", "Unique Experience"],
    capacity: { guests: 40, rooms: 18 },
    availability: true
  },
  {
    id: "9",
    name: "Adriatic Pearl Naturist Beach Club",
    slug: "adriatic-pearl-naturist-beach-club",
    description: "Stunning naturist resort on the crystal-clear Adriatic Sea. Mediterranean charm meets modern luxury.",
    location: {
      city: "Split",
      country: "Croatia",
      region: "Dalmatia",
      address: "Obala 88",
      coordinates: { lat: 43.5081, lng: 16.4402 }
    },
    images: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
      "https://images.unsplash.com/photo-1567179679742-ba3d993d4876?w=800"
    ],
    price: { perNight: 165, perWeek: 1050, currency: "EUR" },
    rating: 4.6,
    reviewCount: 298,
    propertyType: "beach-club",
    naturistType: "clothing-optional",
    amenities: ["Private Beach", "Pool", "Restaurant", "Bar", "Diving Center", "Marina"],
    features: ["Beachfront", "Water Sports", "Sailing"],
    capacity: { guests: 180, rooms: 75 },
    availability: true
  },
  {
    id: "10",
    name: "Thai Paradise Naturist Villa",
    slug: "thai-paradise-naturist-villa",
    description: "Tropical naturist villas surrounded by lush gardens. Experience authentic Thai hospitality in complete freedom.",
    location: {
      city: "Phuket",
      country: "Thailand",
      region: "Phuket Province",
      address: "Patong Beach Road 234",
      coordinates: { lat: 7.8804, lng: 98.3923 }
    },
    images: [
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
    ],
    price: { perNight: 120, perWeek: 750, currency: "THB" },
    rating: 4.5,
    reviewCount: 187,
    propertyType: "villa",
    naturistType: "clothing-optional",
    amenities: ["Pool", "Thai Restaurant", "Massage", "Garden", "Beach Shuttle"],
    features: ["Tropical Garden", "Cultural Experience", "Affordable Luxury"],
    capacity: { guests: 8, rooms: 4 },
    availability: true
  },
  {
    id: "11",
    name: "Desert Oasis Naturist Retreat",
    slug: "desert-oasis-naturist-retreat",
    description: "Unique desert naturist experience with stunning views and stargazing opportunities. Modern comfort in a wild setting.",
    location: {
      city: "Palm Springs",
      country: "United States",
      region: "California",
      address: "Desert View Drive 567",
      coordinates: { lat: 33.8303, lng: -116.5453 }
    },
    images: [
      "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    price: { perNight: 210, perWeek: 1350, currency: "USD" },
    rating: 4.7,
    reviewCount: 203,
    propertyType: "resort",
    naturistType: "fully-naturist",
    amenities: ["Pool", "Hot Tub", "Restaurant", "Spa", "Yoga Studio", "Observatory"],
    features: ["Desert Views", "Stargazing", "Wellness Focus"],
    capacity: { guests: 100, rooms: 45 },
    availability: true
  },
  {
    id: "12",
    name: "Alpine Lakes Naturist Chalet",
    slug: "alpine-lakes-naturist-chalet",
    description: "Cozy naturist chalets overlooking pristine alpine lakes. Perfect for hiking, swimming, and mountain adventures.",
    location: {
      city: "Interlaken",
      country: "Switzerland",
      region: "Bernese Oberland",
      address: "Seestrasse 99",
      coordinates: { lat: 46.6863, lng: 7.8632 }
    },
    images: [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
    ],
    price: { perNight: 195, perWeek: 1250, currency: "CHF" },
    rating: 4.8,
    reviewCount: 167,
    propertyType: "chalet",
    naturistType: "fully-naturist",
    amenities: ["Sauna", "Lake Access", "Hiking Trails", "Restaurant", "Mountain Bike Rental"],
    features: ["Mountain Views", "Lake Activities", "Eco-Friendly"],
    capacity: { guests: 50, rooms: 22 },
    availability: true
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