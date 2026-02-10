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
    description: "Luxury naturist resort nestled in the Mediterranean coast. Experience ultimate freedom and relaxation with our world-class spa, private beaches, and gourmet dining. Azure Resort offers an unparalleled naturist experience where luxury meets liberation. Our 180 elegantly appointed rooms feature private balconies with stunning sea views, premium linens, and modern amenities. The resort spans 15 acres of beautifully landscaped gardens leading to our exclusive private beach. Our award-winning spa offers a full range of treatments including couples massages, aromatherapy, and traditional Mediterranean wellness rituals. Three on-site restaurants serve everything from casual Mediterranean fare to fine dining experiences featuring locally-sourced ingredients. The infinity pool overlooking the sea is the perfect spot to unwind, while our state-of-the-art fitness center and yoga studio help you maintain your wellness routine. Evening entertainment includes live music, themed parties, and cultural performances.",
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
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"
    ],
    price: { perNight: 285, perWeek: 1850, currency: "EUR" },
    rating: 4.8,
    reviewCount: 342,
    propertyType: "resort",
    naturistType: "fully-naturist",
    amenities: ["Pool", "Spa", "Restaurant", "Bar", "Beach Access", "Gym", "Yoga Studio", "Tennis Court", "WiFi", "Parking", "Room Service", "Laundry", "Concierge"],
    features: ["Adults Only", "All-Inclusive Available", "Couples Friendly", "LGBTQ+ Friendly", "Luxury", "Beachfront", "Entertainment Program"],
    capacity: { guests: 400, rooms: 180 },
    availability: true,
    featured: true
  },
  {
    id: "2",
    name: "Hidden Valley Naturist Hotel",
    slug: "hidden-valley-naturist-hotel",
    description: "Peaceful boutique hotel surrounded by nature. Perfect for those seeking tranquility and authentic naturist lifestyle experience. Tucked away in the rolling hills of Provence, Hidden Valley offers an intimate escape from the modern world. Our family-run hotel features 28 individually decorated rooms, each with rustic charm and modern comfort. Wake up to birdsong and breakfast on your private terrace overlooking lavender fields. The property includes extensive gardens perfect for quiet contemplation, a refreshing pool surrounded by olive trees, and a traditional stone sauna. Our restaurant serves organic, locally-sourced cuisine with many ingredients from our own garden. The library offers a curated collection of books about naturism, philosophy, and local culture. We organize regular workshops on topics like meditation, painting, and sustainable living. Bicycle rentals available for exploring the beautiful Provençal countryside.",
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
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800"
    ],
    price: { perNight: 145, perWeek: 920, currency: "EUR" },
    rating: 4.6,
    reviewCount: 189,
    propertyType: "hotel",
    naturistType: "fully-naturist",
    amenities: ["Pool", "Restaurant", "Garden", "Sauna", "Library", "Bike Rental", "WiFi", "Parking", "Pet Friendly"],
    features: ["Pet Friendly", "Eco-Friendly", "Organic Meals", "Quiet Zone", "Family Run", "Workshops Available"],
    capacity: { guests: 60, rooms: 28 },
    availability: true,
    featured: true
  },
  {
    id: "3",
    name: "Sunset Bay Clothing-Optional Resort",
    slug: "sunset-bay-clothing-optional-resort",
    description: "Flexible resort offering both textile and clothing-optional areas. Stunning sunset views and premium facilities for all preferences. Sunset Bay is Miami's premier clothing-optional destination, perfectly balancing freedom and flexibility. The resort features 150 spacious rooms and suites, all with ocean or garden views. Our unique layout includes designated clothing-optional zones (pool, beach, spa) and textile-friendly areas (main restaurant, lobby, fitness center), allowing guests to choose their comfort level. The beachfront location offers direct access to pristine white sand and crystal-clear waters. Water sports enthusiasts will love our complimentary kayaking, paddleboarding, and snorkeling equipment. Three restaurants cater to every taste, from fresh seafood to international cuisine. The nightclub hosts themed parties every weekend, and our entertainment team organizes daily activities including beach volleyball, aqua aerobics, and salsa lessons. Kids club available for families.",
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
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    price: { perNight: 220, perWeek: 1400, currency: "USD" },
    rating: 4.5,
    reviewCount: 267,
    propertyType: "resort",
    naturistType: "clothing-optional",
    amenities: ["Pool", "Beach Access", "Restaurant", "Bar", "Water Sports", "Nightclub", "WiFi", "Gym", "Spa", "Room Service", "Concierge"],
    features: ["Family Friendly", "Kids Club", "Entertainment Program", "Beachfront", "Flexible Zones", "Active Lifestyle"],
    capacity: { guests: 350, rooms: 150 },
    availability: true,
    featured: true
  },
  {
    id: "4",
    name: "Mountain View Naturist Retreat",
    slug: "mountain-view-naturist-retreat",
    description: "Alpine naturist retreat with breathtaking mountain views. Ideal for hiking enthusiasts and nature lovers. Perched at 1,200 meters in the Austrian Alps, Mountain View Retreat offers a unique combination of naturist freedom and mountain adventure. Our 35 cozy alpine rooms feature traditional wood interiors, plush bedding, and balconies with panoramic mountain vistas. The wellness center includes a Finnish sauna, steam room, infrared cabin, and an outdoor hot tub with unbeatable views. Our restaurant specializes in hearty Austrian cuisine with vegetarian and vegan options. During summer, explore 50km of marked hiking trails directly from the property, ranging from gentle walks to challenging summit climbs. Winter brings opportunities for naturist snow bathing and nearby skiing. The property includes a meditation garden, yoga platform, and small fitness room. Weekly events include guided mountain hikes, stargazing sessions, and traditional Austrian music evenings. The peaceful, adults-only atmosphere makes this perfect for couples and solo travelers seeking mountain serenity.",
    location: {
      city: "Innsbruck",
      country: "Austria",
      region: "Tyrol",
      address: "Bergstrasse 56",
      coordinates: { lat: 47.2692, lng: 11.4041 }
    },
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800"
    ],
    price: { perNight: 165, perWeek: 1050, currency: "EUR" },
    rating: 4.7,
    reviewCount: 156,
    propertyType: "hotel",
    naturistType: "fully-naturist",
    amenities: ["Sauna", "Hot Tub", "Restaurant", "Hiking Trails", "Wellness Center", "Steam Room", "WiFi", "Parking", "Meditation Garden"],
    features: ["Mountain Views", "Eco-Friendly", "Quiet Zone", "Adults Only", "Hiking Paradise", "Wellness Focus"],
    capacity: { guests: 80, rooms: 35 },
    availability: true
  },
  {
    id: "5",
    name: "Tropical Paradise Naturist Camp",
    slug: "tropical-paradise-naturist-camp",
    description: "Affordable naturist camping experience in a tropical setting. Bungalows and camping spots available with shared facilities. Located just minutes from some of Portugal's most beautiful beaches, Tropical Paradise offers budget-friendly naturist accommodation without compromising on experience. Choose from our comfortable bungalows with private bathrooms, or bring your own tent/camper to one of our spacious pitches. All accommodations are nestled among pine trees and tropical plants. The communal facilities include modern shower blocks, a well-equipped shared kitchen, and laundry room. Our large swimming pool is the social heart of the camp, surrounded by sun loungers and a poolside bar serving drinks and snacks. The beach is a 10-minute walk through scenic dunes. We have a dedicated BBQ area perfect for evening gatherings, and a volleyball court for friendly games. The atmosphere is relaxed and social, with an international crowd of all ages. Weekly communal dinners and beach parties create a strong sense of community. This is naturism at its most authentic and accessible.",
    location: {
      city: "Algarve",
      country: "Portugal",
      region: "Faro",
      address: "Praia do Sol",
      coordinates: { lat: 37.0179, lng: -7.9304 }
    },
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
    ],
    price: { perNight: 65, perWeek: 400, currency: "EUR" },
    rating: 4.3,
    reviewCount: 98,
    propertyType: "campsite",
    naturistType: "fully-naturist",
    amenities: ["Pool", "Beach Access", "BBQ Area", "Shared Kitchen", "Volleyball Court", "Bar", "Laundry", "WiFi", "Parking"],
    features: ["Budget Friendly", "Social Atmosphere", "Young Crowd", "International Community", "Pet Friendly"],
    capacity: { guests: 120, rooms: 45 },
    availability: true
  },
  {
    id: "6",
    name: "Serenity Naturist Villa Collection",
    slug: "serenity-naturist-villa-collection",
    description: "Exclusive private villas for intimate naturist getaways. Each villa with private pool and complete privacy. The Serenity Collection represents the pinnacle of private naturist luxury in Santorini. Each of our six villas is a self-contained paradise with 2 bedrooms, 2 bathrooms, full kitchen, and expansive living spaces opening onto private terraces. Your infinity pool seems to merge with the Aegean Sea beyond, while the outdoor dining area and sun loungers offer complete seclusion. Interiors feature cycladic architecture with modern luxury touches: handcrafted furniture, premium linens, rain showers, and high-end appliances. Daily cleaning service keeps everything pristine, while our concierge arranges everything from private chef dinners to yacht charters. Each villa includes welcome provisions, wine, and fresh flowers. The location in Oia offers stunning sunset views and easy access to Santorini's attractions, yet complete privacy within your villa compound. Perfect for honeymoons, anniversaries, or simply escaping the world in absolute luxury. Some villas feature outdoor showers, hot tubs, and even small gyms. This is naturist hospitality at its most refined.",
    location: {
      city: "Santorini",
      country: "Greece",
      region: "Cyclades",
      address: "Caldera View 12",
      coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    images: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
    ],
    price: { perNight: 450, perWeek: 2900, currency: "EUR" },
    rating: 4.9,
    reviewCount: 78,
    propertyType: "villa",
    naturistType: "clothing-optional",
    amenities: ["Private Pool", "Kitchen", "Sea View", "Concierge", "Daily Cleaning", "WiFi", "Parking", "Outdoor Dining", "BBQ"],
    features: ["Luxury", "Privacy", "Romantic", "Honeymoon Special", "Complete Independence", "Sunset Views"],
    capacity: { guests: 4, rooms: 2 },
    availability: true,
    featured: true
  },
  {
    id: "7",
    name: "Sunshine Coast Naturist Resort",
    slug: "sunshine-coast-naturist-resort",
    description: "Beachfront naturist paradise with year-round sunshine. Perfect for water sports enthusiasts and beach lovers. Australia's premier naturist resort sits on 300 meters of pristine Gold Coast beachfront. Our 120 rooms range from standard oceanview to luxury beachfront suites, all with private balconies and modern amenities. The resort's crowning glory is direct beach access where you can surf, swim, or simply relax on the golden sand. Our water sports center offers surfing lessons, stand-up paddleboarding, kayaking, and seasonal whale watching tours. Three swimming pools cater to different moods: the activity pool with volleyball net and swim-up bar, the tranquil lap pool for fitness enthusiasts, and the adults-only infinity pool with ocean views. The spa specializes in Australian-inspired treatments using native botanicals. Two restaurants serve everything from casual beachside fare to contemporary Australian cuisine featuring local seafood. The fitness center includes classes like beach yoga, aqua aerobics, and HIIT training. Evening entertainment ranges from live music to trivia nights. The Australian naturist community is welcoming and the year-round sunshine makes this ideal for extended stays.",
    location: {
      city: "Gold Coast",
      country: "Australia",
      region: "Queensland",
      address: "Pacific Highway 456",
      coordinates: { lat: -28.0167, lng: 153.4000 }
    },
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
    ],
    price: { perNight: 195, perWeek: 1250, currency: "AUD" },
    rating: 4.7,
    reviewCount: 234,
    propertyType: "resort",
    naturistType: "fully-naturist",
    amenities: ["Beach Access", "Pool", "Surfing", "Restaurant", "Bar", "Spa", "WiFi", "Gym", "Water Sports Center", "Yoga Studio"],
    features: ["Beachfront", "Water Sports", "Fitness Center", "Year-Round Sunshine", "Surf Lessons", "Entertainment Program"],
    capacity: { guests: 250, rooms: 120 },
    availability: true,
    featured: true
  },
  {
    id: "8",
    name: "Amazon Rainforest Eco-Lodge",
    slug: "amazon-rainforest-eco-lodge",
    description: "Unique naturist eco-lodge deep in the Amazon rainforest. Connect with nature in its purest form. For the truly adventurous naturist, our eco-lodge offers an unparalleled experience deep in the Amazon basin. Accessible only by boat, the lodge consists of 18 elevated bungalows built using sustainable materials and traditional techniques. Each bungalow has mosquito netting, comfortable beds, and private deck with hammocks overlooking the rainforest canopy. Solar power and rainwater collection demonstrate our commitment to environmental responsibility. The communal lodge area includes a restaurant serving fresh, locally-sourced meals and a lounge for evening gatherings. Being naturist in the rainforest creates a profound connection with the natural world. Daily excursions led by indigenous guides include jungle treks, wildlife spotting (monkeys, birds, sloths), piranha fishing, and visits to local communities. Night walks reveal the forest's nocturnal secrets. The experience includes learning about medicinal plants, trying traditional cuisine, and understanding rainforest conservation. This is naturism as our ancestors experienced it - completely at one with nature. The adventure isn't for everyone, but those who come leave transformed.",
    location: {
      city: "Manaus",
      country: "Brazil",
      region: "Amazonas",
      address: "Rio Negro",
      coordinates: { lat: -3.1190, lng: -60.0217 }
    },
    images: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800"
    ],
    price: { perNight: 180, perWeek: 1150, currency: "BRL" },
    rating: 4.8,
    reviewCount: 145,
    propertyType: "eco-lodge",
    naturistType: "fully-naturist",
    amenities: ["Guided Tours", "Restaurant", "Wildlife Watching", "Hammock Garden", "Indigenous Guides", "River Access"],
    features: ["Eco-Friendly", "Adventure", "Remote", "Unique Experience", "Educational", "Conservation Focus"],
    capacity: { guests: 40, rooms: 18 },
    availability: true
  },
  {
    id: "9",
    name: "Adriatic Pearl Naturist Beach Club",
    slug: "adriatic-pearl-naturist-beach-club",
    description: "Stunning naturist resort on the crystal-clear Adriatic Sea. Mediterranean charm meets modern luxury. The Adriatic Pearl epitomizes Croatian coastal elegance in a naturist setting. Set on a rocky peninsula with 200 meters of waterfront, the resort offers 75 rooms in Mediterranean-style buildings surrounded by cypress and olive trees. Most rooms have sea-view balconies where you can watch sailboats glide past. The multi-level sun terraces carved into the natural rock provide endless spots for sunbathing with direct sea access via ladders. The marina welcomes guests arriving by boat and offers rentals for those wanting to explore the coastline. Our diving center is renowned along the coast, offering courses from beginner to advanced, plus daily dive trips to underwater caves and wrecks. The restaurant terrace overhanging the sea serves fresh Adriatic seafood and Croatian specialties paired with local wines. The pool complex includes a main pool, children's pool, and hot tub. Evening entertainment is relaxed - live acoustic music, wine tastings, and traditional Croatian dance performances. The nearby medieval town of Split offers cultural excursions. This is Mediterranean naturism at its finest.",
    location: {
      city: "Split",
      country: "Croatia",
      region: "Dalmatia",
      address: "Obala 88",
      coordinates: { lat: 43.5081, lng: 16.4402 }
    },
    images: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
      "https://images.unsplash.com/photo-1567179679742-ba3d993d4876?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    price: { perNight: 165, perWeek: 1050, currency: "EUR" },
    rating: 4.6,
    reviewCount: 298,
    propertyType: "beach-club",
    naturistType: "clothing-optional",
    amenities: ["Private Beach", "Pool", "Restaurant", "Bar", "Diving Center", "Marina", "WiFi", "Hot Tub", "Boat Rental"],
    features: ["Beachfront", "Water Sports", "Sailing", "Diving", "Mediterranean Cuisine", "Cultural Access"],
    capacity: { guests: 180, rooms: 75 },
    availability: true
  },
  {
    id: "10",
    name: "Thai Paradise Naturist Villa",
    slug: "thai-paradise-naturist-villa",
    description: "Tropical naturist villas surrounded by lush gardens. Experience authentic Thai hospitality in complete freedom. Thai Paradise reimagines naturist accommodation with four beautifully appointed villas set in 2 acres of tropical gardens. Each villa accommodates up to 8 guests with 4 bedrooms, 3 bathrooms, full kitchen, and open-plan living areas that blend indoor and outdoor spaces. Traditional Thai architecture features teak wood, high ceilings, and silk furnishings. Your private swimming pool is surrounded by frangipani trees and lotus ponds, creating a serene tropical oasis. Daily cleaning service and optional Thai cooking classes are included. The on-site restaurant serves authentic Thai cuisine from family recipes, with ingredients from local markets and the property's herb garden. Traditional Thai massage is available in the garden pavilion. While clothing-optional on the property, we provide shuttle service to Patong Beach and local attractions. The location offers the best of both worlds - complete privacy in your villa, with easy access to Phuket's vibrant culture, shopping, and nightlife. The staff's warm Thai hospitality makes you feel like honored guests rather than tourists. Perfect for friend groups or multi-family holidays.",
    location: {
      city: "Phuket",
      country: "Thailand",
      region: "Phuket Province",
      address: "Patong Beach Road 234",
      coordinates: { lat: 7.8804, lng: 98.3923 }
    },
    images: [
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    ],
    price: { perNight: 120, perWeek: 750, currency: "THB" },
    rating: 4.5,
    reviewCount: 187,
    propertyType: "villa",
    naturistType: "clothing-optional",
    amenities: ["Pool", "Thai Restaurant", "Massage", "Garden", "Beach Shuttle", "WiFi", "Kitchen", "Daily Cleaning", "Parking"],
    features: ["Tropical Garden", "Cultural Experience", "Affordable Luxury", "Group Friendly", "Cooking Classes"],
    capacity: { guests: 8, rooms: 4 },
    availability: true
  },
  {
    id: "11",
    name: "Desert Oasis Naturist Retreat",
    slug: "desert-oasis-naturist-retreat",
    description: "Unique desert naturist experience with stunning views and stargazing opportunities. Modern comfort in a wild setting. In the heart of California's desert, our retreat offers a naturist experience unlike any other. The 45 rooms are contemporary desert architecture with floor-to-ceiling windows framing mountain vistas, private patios, and luxurious bathrooms with soaking tubs. The property's design embraces the desert aesthetic with natural materials, warm earth tones, and native landscaping. The pool area is an oasis with palm trees, cascading water features, and underwater music. Hot tubs positioned for sunset viewing are perfect for soaking under the desert sky. The spa offers treatments inspired by indigenous traditions, using desert botanicals like sage and mesquite. Our yoga studio hosts daily classes on an outdoor platform with 360-degree views. The restaurant focuses on farm-to-table cuisine with ingredients from nearby desert farms. But the real magic happens after dark - our on-site observatory and resident astronomer offer nightly stargazing sessions where the Milky Way blazes overhead. Daytime activities include guided desert hikes, rock climbing, and mountain biking on nearby trails. The retreat hosts regular wellness retreats, meditation workshops, and artistic residencies. This is naturism meets desert spirituality.",
    location: {
      city: "Palm Springs",
      country: "United States",
      region: "California",
      address: "Desert View Drive 567",
      coordinates: { lat: 33.8303, lng: -116.5453 }
    },
    images: [
      "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800"
    ],
    price: { perNight: 210, perWeek: 1350, currency: "USD" },
    rating: 4.7,
    reviewCount: 203,
    propertyType: "resort",
    naturistType: "fully-naturist",
    amenities: ["Pool", "Hot Tub", "Restaurant", "Spa", "Yoga Studio", "Observatory", "WiFi", "Hiking Trails", "Bike Rental"],
    features: ["Desert Views", "Stargazing", "Wellness Focus", "Modern Design", "Observatory", "Artistic Community"],
    capacity: { guests: 100, rooms: 45 },
    availability: true
  },
  {
    id: "12",
    name: "Alpine Lakes Naturist Chalet",
    slug: "alpine-lakes-naturist-chalet",
    description: "Cozy naturist chalets overlooking pristine alpine lakes. Perfect for hiking, swimming, and mountain adventures. Set between two crystal-clear alpine lakes in the Swiss Bernese Oberland, our collection of 22 traditional Swiss chalets offers authentic mountain naturist hospitality. Each chalet accommodates 2-4 guests with knotty pine interiors, wood-burning stoves, fully equipped kitchens, and balconies with lake and mountain views. The main lodge houses the restaurant serving hearty Swiss specialties - fondue, raclette, rösti - made with local cheeses and produce. The lakeside sauna complex includes traditional Finnish sauna, bio-sauna, steam room, and relaxation area with lake views. In summer, swim in the refreshing mountain lakes, hike trails leading to waterfalls and alpine meadows filled with wildflowers, or rent mountain bikes for scenic rides. The area is a hiker's paradise with trails for all levels, including challenging routes to glacier viewpoints. In winter, the nearest ski resort is 15 minutes away, and we offer transportation for guests wanting to experience Swiss skiing. Return to your chalet for cozy evenings by the fire. The setting is breathtaking year-round, and the Swiss naturist community is welcoming and active. Weekly events include fondue nights, guided hikes, and lake swimming groups.",
    location: {
      city: "Interlaken",
      country: "Switzerland",
      region: "Bernese Oberland",
      address: "Seestrasse 99",
      coordinates: { lat: 46.6863, lng: 7.8632 }
    },
    images: [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"
    ],
    price: { perNight: 195, perWeek: 1250, currency: "CHF" },
    rating: 4.8,
    reviewCount: 167,
    propertyType: "chalet",
    naturistType: "fully-naturist",
    amenities: ["Sauna", "Lake Access", "Hiking Trails", "Restaurant", "Mountain Bike Rental", "WiFi", "Parking", "Kitchen", "Fireplace"],
    features: ["Mountain Views", "Lake Activities", "Eco-Friendly", "Hiking Paradise", "Winter Sports Access", "Traditional Swiss"],
    capacity: { guests: 50, rooms: 22 },
    availability: true
  }
];

export const reviews: Review[] = [
  // Azure Naturist Resort & Spa reviews
  {
    id: "r1",
    propertyId: "1",
    userId: "u1",
    userName: "Sophie M.",
    rating: 5,
    title: "Absolutely Perfect Paradise",
    comment: "This resort exceeded all expectations. The staff is incredibly professional and respectful, the facilities are pristine, and the atmosphere is wonderfully liberating. The spa treatments were divine, and the Mediterranean cuisine in the fine dining restaurant was exceptional. We spent our days between the infinity pool and private beach, and every moment was pure bliss. The evening entertainment was tasteful and fun. We've already booked our return visit for next year. Worth every euro!",
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
    comment: "My partner and I have visited many naturist resorts across Europe, and this is by far the best. Beautiful grounds maintained to perfection, excellent food in all three restaurants, and a very welcoming international community. The adults-only policy creates a sophisticated atmosphere. The yoga classes overlooking the sea were a highlight, and the tennis courts are professional quality. Can't recommend highly enough for couples seeking luxury naturist holidays.",
    date: "2026-01-10",
    verified: true
  },
  {
    id: "r3",
    propertyId: "1",
    userId: "u3",
    userName: "Lars & Ingrid K.",
    rating: 4,
    title: "Luxurious and Liberating",
    comment: "Wonderful resort with top-notch amenities. Our room was spacious with a gorgeous sea view. The all-inclusive option provided excellent value. Only minor complaint is that the resort can feel crowded during peak season, but the private beach areas help. The spa massages were heavenly, and we loved the live music nights. Great place for a special celebration.",
    date: "2026-01-05",
    verified: true
  },

  // Hidden Valley Naturist Hotel reviews
  {
    id: "r4",
    propertyId: "2",
    userId: "u4",
    userName: "Emma L.",
    rating: 5,
    title: "Charming Boutique Gem",
    comment: "This family-run hotel has real heart and soul. The owners Michel and Claire made us feel like old friends from day one. Our room overlooking the lavender fields was beautifully decorated with antique French furniture. The organic meals using herbs from their garden were delicious. Perfect if you want authentic Provençal experience and genuine naturist philosophy rather than resort glamour. The painting workshop was a wonderful addition. So peaceful!",
    date: "2026-01-18",
    verified: true
  },
  {
    id: "r5",
    propertyId: "2",
    userId: "u5",
    userName: "Robert S.",
    rating: 5,
    title: "Haven of Tranquility",
    comment: "Exactly what we needed after stressful months at work. Hidden Valley is truly hidden - peaceful, quiet, and restorative. Loved cycling through the countryside, reading in the library, and long conversations with interesting fellow guests. The sauna sessions were perfect after days exploring. Food was simple but excellent. This isn't a party resort - it's for people who appreciate simplicity and nature. We'll definitely return.",
    date: "2026-01-12",
    verified: true
  },
  {
    id: "r6",
    propertyId: "2",
    userId: "u6",
    userName: "Patricia D.",
    rating: 4,
    title: "Lovely Peaceful Retreat",
    comment: "Beautiful setting and warm hospitality. The meditation sessions and nature walks were highlights. Rooms are comfortable though not luxurious - but that's not what this place is about. Perfect for solo travelers or couples seeking connection with nature and like-minded people. The other guests were friendly and respectful. Only downside is limited evening entertainment, but honestly that's part of the charm.",
    date: "2026-01-08",
    verified: true
  },

  // Sunset Bay Clothing-Optional Resort reviews
  {
    id: "r7",
    propertyId: "3",
    userId: "u7",
    userName: "Jennifer & Mark T.",
    rating: 5,
    title: "Perfect for First-Timers",
    comment: "We were nervous about our first naturist experience, and Sunset Bay was the perfect introduction. The clothing-optional zones meant we could ease into it at our own pace. By day two we were fully comfortable at the pool and beach. The water sports were fantastic - my husband loved the kayaking and I took paddleboard lessons. Kids club kept our children entertained while we relaxed. The flexibility of having both textile and naturist areas is genius. Highly recommended for families considering this lifestyle!",
    date: "2026-01-20",
    verified: true
  },
  {
    id: "r8",
    propertyId: "3",
    userId: "u8",
    userName: "Carlos M.",
    rating: 4,
    title: "Great Energy and Facilities",
    comment: "Vibrant resort with something for everyone. The beachfront location is unbeatable - white sand and clear water. We did a different water sport every day - snorkeling, jet skiing, parasailing. The themed parties at the nightclub were super fun, great way to meet people. Food quality across the three restaurants was consistently good. The only reason I didn't give 5 stars is that it can feel a bit crowded, but that's also what creates the lively atmosphere. Would come back!",
    date: "2026-01-14",
    verified: true
  },
  {
    id: "r9",
    propertyId: "3",
    userId: "u9",
    userName: "Diana R.",
    rating: 5,
    title: "Active and Fun Resort",
    comment: "Loved every minute! The daily activities kept us busy - beach volleyball tournaments, salsa lessons, aqua aerobics. Made so many friends from around the world. The entertainment team is energetic and inclusive. Rooms are spacious and modern with great ocean views. The swim-up bar at the pool is perfect for lazy afternoons. This resort understands that people want different experiences, and they deliver on all fronts. Miami location means great nightlife nearby too!",
    date: "2026-01-06",
    verified: true
  },

  // Mountain View Naturist Retreat reviews
  {
    id: "r10",
    propertyId: "4",
    userId: "u10",
    userName: "Hans W.",
    rating: 5,
    title: "Alpine Perfection",
    comment: "As an avid hiker, this was paradise. Every morning we'd set off on different trails, all clearly marked and beautifully maintained. The views are absolutely stunning - snow-capped peaks, alpine meadows, pristine forests. Coming back to the hot tub with mountain panoramas after a long hike is unforgettable. The wellness center's sauna circuit was excellent, very authentic Austrian style. Food was hearty and delicious. The adults-only atmosphere was peaceful and sophisticated. Already planning our return in winter!",
    date: "2026-01-19",
    verified: true
  },
  {
    id: "r11",
    propertyId: "4",
    userId: "u11",
    userName: "Sarah & Tom B.",
    rating: 5,
    title: "Breathtaking Mountain Escape",
    comment: "Our anniversary trip was magical. The mountain setting is spectacular, and our balcony was the perfect spot for morning coffee watching the sunrise over the peaks. Guided hikes with Klaus were informative and fun - he knows every plant and bird. The stargazing night was incredibly romantic. Austrian cuisine at the restaurant was authentic and satisfying. The meditation garden became our favorite spot. This place has soul. Highly recommended for couples!",
    date: "2026-01-11",
    verified: true
  },

  // Tropical Paradise Naturist Camp reviews
  {
    id: "r12",
    propertyId: "5",
    userId: "u12",
    userName: "Lukas V.",
    rating: 4,
    title: "Great Value and Community",
    comment: "Don't expect luxury, but do expect authenticity! The bungalows are simple but clean and comfortable. The real treasure here is the community - we made friends from all over Europe. The communal dinners and beach parties create amazing atmosphere. Pool is great for socializing, beach is stunning, and the price can't be beat. Perfect for young travelers or anyone wanting a social naturist experience without breaking the bank. Bring your own booze to save money!",
    date: "2026-01-17",
    verified: true
  },
  {
    id: "r13",
    propertyId: "5",
    userId: "u13",
    userName: "Maya & Felix",
    rating: 5,
    title: "Budget-Friendly Paradise",
    comment: "This camp proves you don't need luxury to have an amazing naturist holiday. We camped with our van and loved it - spacious pitches under pine trees, clean facilities, super friendly staff. The social vibe is incredible - volleyball games, BBQs, beach bonfires. Met people from 15+ countries! The beach is gorgeous and never crowded. If you want fancy resort amenities, look elsewhere. If you want authentic naturist camping with great people, this is it!",
    date: "2026-01-09",
    verified: true
  },

  // Serenity Naturist Villa Collection reviews
  {
    id: "r14",
    propertyId: "6",
    userId: "u14",
    userName: "Alexander & Sophia K.",
    rating: 5,
    title: "Honeymoon Heaven",
    comment: "Our honeymoon villa was absolutely perfect - private infinity pool, stunning caldera views, and complete seclusion. The interior design was impeccable, blending traditional Cycladic style with modern luxury. We used the concierge to arrange a private yacht trip and chef dinner - both exceptional. Daily cleaning kept everything pristine. Watched the famous Santorini sunset from our pool every evening with champagne. This is naturist luxury at its finest. Worth every penny for a special occasion!",
    date: "2026-01-21",
    verified: true
  },
  {
    id: "r15",
    propertyId: "6",
    userId: "u15",
    userName: "James & Victoria",
    rating: 5,
    title: "Ultimate Privacy and Luxury",
    comment: "After years of resort vacations, we wanted something more private and intimate. These villas delivered beyond expectations. Our villa felt like our own Santorini estate - spacious, beautifully appointed, with that magical infinity pool seeming to float above the Aegean. The kitchen allowed us to shop at local markets and cook when we wanted, but the concierge arranged amazing restaurant reservations too. Location in Oia is perfect. This is how naturism should be experienced - in private luxury!",
    date: "2026-01-13",
    verified: true
  },

  // Sunshine Coast Naturist Resort reviews
  {
    id: "r16",
    propertyId: "7",
    userId: "u16",
    userName: "Rebecca L.",
    rating: 5,
    title: "Surfer's Paradise - Literally!",
    comment: "As a surfing enthusiast, this resort is a dream come true. Direct beach access to great waves, surf lessons available, board storage - everything a surfer needs. The beachfront location means you can literally wake up and hit the waves. When not surfing, the pools are amazing and the spa helped with sore muscles. The Australian naturist community is super welcoming and laid-back. Facilities are modern and well-maintained. Year-round sunshine means any time is good time to visit!",
    date: "2026-01-16",
    verified: true
  },
  {
    id: "r17",
    propertyId: "7",
    userId: "u17",
    userName: "David & Michelle",
    rating: 5,
    title: "Perfect Beach Resort",
    comment: "Three weeks in paradise! The Gold Coast location is stunning - 300 meters of private beach with golden sand. We tried all the water sports - paddleboarding, kayaking, even went on the whale watching tour (saw several humpbacks!). The three pools cater to different moods perfectly. Food was consistently excellent, especially the seafood. The Australian contemporary cuisine showcased local ingredients beautifully. Beach yoga at sunrise became our morning ritual. Can't wait to return!",
    date: "2026-01-07",
    verified: true
  },

  // Additional reviews for other properties...
  {
    id: "r18",
    propertyId: "8",
    userId: "u18",
    userName: "Marcus T.",
    rating: 5,
    title: "Life-Changing Amazon Experience",
    comment: "This isn't a typical resort - it's an adventure and education rolled into one. The rainforest setting is incredible, and being naturist in this environment feels completely natural and profound. Our indigenous guide taught us about medicinal plants, survival skills, and rainforest ecology. Saw incredible wildlife - monkeys, macaws, sloths, pink dolphins! The night sounds of the jungle are unforgettable. Accommodations are basic but comfortable. This experience changed how I see naturism and nature. Absolutely unique!",
    date: "2026-01-22",
    verified: true
  },

  {
    id: "r19",
    propertyId: "9",
    userId: "u19",
    userName: "Petra & Klaus",
    rating: 5,
    title: "Croatian Coast at Its Best",
    comment: "The Adriatic Pearl is a gem! The rocky peninsula setting with crystal-clear water is beautiful. We spent days diving - the underwater caves and wrecks were spectacular. The diving center is professional with excellent equipment. The seafood restaurant terrace hanging over the sea is romantic and delicious. Split is nearby for cultural day trips - we visited Diocletian's Palace and local markets. The Mediterranean atmosphere and Croatian hospitality made this special. Highly recommended!",
    date: "2026-01-15",
    verified: true
  },

  {
    id: "r20",
    propertyId: "10",
    userId: "u20",
    userName: "Amanda & Friends",
    rating: 5,
    title: "Thai Paradise for Groups",
    comment: "Our group of 8 rented a villa for two weeks - best decision ever! Having our own private pool and kitchen while experiencing Thailand was perfect. The villa was beautifully designed with traditional Thai elements. Daily cleaning and the on-site Thai restaurant made it easy. The cooking class was so much fun - we learned to make authentic pad thai and curry. Thai massage in the garden pavilion was divine. Staff went above and beyond. Great base for exploring Phuket while having private naturist space. Excellent value!",
    date: "2026-01-04",
    verified: true
  }
];

export const mockProperties: Property[] = properties;