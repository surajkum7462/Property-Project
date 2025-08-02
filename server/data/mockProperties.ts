import { Property } from '@shared/api';

export const mockProperties: Property[] = [
  // BANGALORE PROPERTIES (10)
  {
    _id: "bang1",
    title: "Luxury 3BHK Apartment in Koramangala",
    description: "Modern luxury apartment with premium amenities, close to IT parks and shopping centers. Features include modular kitchen, gym, swimming pool, and 24/7 security.",
    price: 8500000,
    location: {
      city: "Bangalore",
      state: "Karnataka", 
      pincode: "560034",
      address: "Koramangala 5th Block, Bangalore",
      coordinates: {
        lat: 12.9352,
        lng: 77.6245
      }
    },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1450,
    amenities: ["Swimming Pool", "Gym", "Club House", "Children's Play Area", "Power Backup", "Car Parking"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-15",
    status: "available"
  },
  {
    _id: "bang2",
    title: "Spacious 4BHK Villa in Whitefield",
    description: "Independent villa with private garden, modern interiors, and excellent connectivity to tech parks. Perfect for families seeking luxury and privacy.",
    price: 15000000,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066", 
      address: "Whitefield, Bangalore",
      coordinates: {
        lat: 12.9698,
        lng: 77.7500
      }
    },
    propertyType: "villa",
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    amenities: ["Private Garden", "Car Parking", "Power Backup", "Security", "Modular Kitchen"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-10",
    status: "available"
  },
  {
    _id: "bang3",
    title: "Modern 2BHK Apartment in Indiranagar", 
    description: "Stylish apartment in the heart of Indiranagar with easy access to restaurants, cafes, and metro station. Fully furnished with contemporary design.",
    price: 6200000,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038",
      address: "Indiranagar, Bangalore", 
      coordinates: {
        lat: 12.9784,
        lng: 77.6408
      }
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    amenities: ["Metro Connectivity", "Restaurants Nearby", "Power Backup", "Car Parking"],
    images: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-20",
    status: "available"
  },
  {
    _id: "bang4",
    title: "Premium 3BHK Penthouse in HSR Layout",
    description: "Exclusive penthouse with panoramic city views, private terrace, and world-class amenities in the heart of HSR Layout.",
    price: 18500000,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560102",
      address: "HSR Layout Sector 1, Bangalore",
      coordinates: {
        lat: 12.9180,
        lng: 77.6410
      }
    },
    propertyType: "penthouse",
    bedrooms: 3,
    bathrooms: 4,
    area: 2200,
    amenities: ["Private Terrace", "City Views", "Swimming Pool", "Gym", "Concierge Service"],
    images: [
      "https://images.unsplash.com/photo-1600607688960-e095ff8d5e68?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-05",
    status: "available"
  },
  {
    _id: "bang5",
    title: "Elegant 1BHK Studio in Electronic City",
    description: "Perfect starter home for IT professionals. Modern studio apartment with all amenities and excellent connectivity to tech parks.",
    price: 3200000,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560100",
      address: "Electronic City Phase 1, Bangalore",
      coordinates: {
        lat: 12.8456,
        lng: 77.6603
      }
    },
    propertyType: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    amenities: ["IT Park Proximity", "24/7 Security", "Power Backup", "Car Parking"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-18",
    status: "available"
  },
  {
    _id: "bang6",
    title: "Luxury 4BHK Duplex in Jayanagar",
    description: "Spacious duplex with traditional charm and modern amenities. Perfect for large families with private garden and parking.",
    price: 12500000,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560011",
      address: "Jayanagar 4th Block, Bangalore",
      coordinates: {
        lat: 12.9287,
        lng: 77.5831
      }
    },
    propertyType: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    amenities: ["Private Garden", "Traditional Architecture", "Car Parking", "Power Backup"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-12",
    status: "available"
  },
  {
    _id: "bang7",
    title: "Contemporary 2BHK in Marathahalli",
    description: "Ultra-modern apartment with smart home features, premium fittings, and excellent connectivity to ORR and metro.",
    price: 7800000,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560037",
      address: "Marathahalli, Bangalore",
      coordinates: {
        lat: 12.9591,
        lng: 77.6974
      }
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1300,
    amenities: ["Smart Home", "Metro Access", "Swimming Pool", "Gym", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-08",
    status: "available"
  },
  {
    _id: "bang8",
    title: "Garden Villa in Sarjapur Road",
    description: "Beautiful independent villa with lush gardens, premium interiors, and peaceful environment away from city chaos.",
    price: 22000000,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560035",
      address: "Sarjapur Road, Bangalore",
      coordinates: {
        lat: 12.8692,
        lng: 77.6907
      }
    },
    propertyType: "villa",
    bedrooms: 5,
    bathrooms: 5,
    area: 3500,
    amenities: ["Large Garden", "Swimming Pool", "Home Theater", "Gym", "Servant Quarters"],
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-03",
    status: "available"
  },
  {
    _id: "bang9",
    title: "Modern 3BHK in Bellandur",
    description: "Contemporary apartment with lake views, premium amenities, and close proximity to major IT companies and shopping malls.",
    price: 9200000,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560103",
      address: "Bellandur, Bangalore",
      coordinates: {
        lat: 12.9279,
        lng: 77.6758
      }
    },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1650,
    amenities: ["Lake Views", "IT Park Proximity", "Club House", "Swimming Pool", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-25",
    status: "available"
  },
  {
    _id: "bang10",
    title: "Luxury Studio in MG Road",
    description: "Prime location studio apartment in the heart of Bangalore's business district. Perfect for young professionals and investors.",
    price: 4800000,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      address: "MG Road, Bangalore",
      coordinates: {
        lat: 12.9756,
        lng: 77.6071
      }
    },
    propertyType: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    amenities: ["Prime Location", "Metro Access", "24/7 Security", "Concierge Service"],
    images: [
      "https://images.unsplash.com/photo-1600566752734-f8de5f484360?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-28",
    status: "available"
  },

  // MUMBAI PROPERTIES (10)
  {
    _id: "mum1",
    title: "Premium 3BHK Penthouse in Bandra",
    description: "Luxurious penthouse with stunning city views, private terrace, and world-class amenities. Located in the heart of Bandra West.",
    price: 25000000,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      address: "Bandra West, Mumbai",
      coordinates: {
        lat: 19.0596,
        lng: 72.8295
      }
    },
    propertyType: "penthouse",
    bedrooms: 3,
    bathrooms: 4,
    area: 2200,
    amenities: ["Private Terrace", "Swimming Pool", "Gym", "Concierge Service", "Valet Parking"],
    images: [
      "https://images.unsplash.com/photo-1600047508897-98bb7a983d72?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-05",
    status: "available"
  },
  {
    _id: "mum2",
    title: "Cozy 1BHK Studio in Powai",
    description: "Perfect starter home or investment property. Compact yet comfortable with modern fittings and great connectivity.",
    price: 4500000,
    location: {
      city: "Mumbai", 
      state: "Maharashtra",
      pincode: "400076",
      address: "Powai, Mumbai",
      coordinates: {
        lat: 19.1176,
        lng: 72.9060
      }
    },
    propertyType: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    amenities: ["24/7 Security", "Power Backup", "Car Parking"],
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-18",
    status: "available"
  },
  {
    _id: "mum3",
    title: "Sea View 2BHK Apartment in Marine Drive",
    description: "Iconic apartment with breathtaking sea views on Marine Drive. Prime Mumbai location with heritage charm.",
    price: 18000000,
    location: {
      city: "Mumbai",
      state: "Maharashtra", 
      pincode: "400020",
      address: "Marine Drive, Mumbai",
      coordinates: {
        lat: 18.9434,
        lng: 72.8238
      }
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1300,
    amenities: ["Sea View", "Heritage Building", "Prime Location", "24/7 Security"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-08",
    status: "available"
  },
  {
    _id: "mum4",
    title: "Luxury 4BHK in Juhu",
    description: "Beachfront luxury apartment with panoramic sea views, premium amenities, and close to Juhu Beach and airport.",
    price: 35000000,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400049",
      address: "Juhu, Mumbai",
      coordinates: {
        lat: 19.1075,
        lng: 72.8263
      }
    },
    propertyType: "apartment",
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    amenities: ["Sea View", "Beach Access", "Swimming Pool", "Gym", "Valet Parking"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-02",
    status: "available"
  },
  {
    _id: "mum5",
    title: "Modern 3BHK in Andheri East",
    description: "Contemporary apartment near international airport with excellent connectivity to BKC and other business districts.",
    price: 12500000,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400069",
      address: "Andheri East, Mumbai",
      coordinates: {
        lat: 19.1136,
        lng: 72.8697
      }
    },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    amenities: ["Airport Proximity", "Metro Access", "Swimming Pool", "Gym", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-15",
    status: "available"
  },
  {
    _id: "mum6",
    title: "Elegant 2BHK in Lower Parel",
    description: "Prime business district location with modern amenities, shopping malls, and excellent transport connectivity.",
    price: 16000000,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400013",
      address: "Lower Parel, Mumbai",
      coordinates: {
        lat: 19.0009,
        lng: 72.8302
      }
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    amenities: ["Business District", "Shopping Malls", "Metro Access", "Gym", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-20",
    status: "available"
  },
  {
    _id: "mum7",
    title: "Luxury Villa in Versova",
    description: "Independent villa with private garden, swimming pool, and close to beach. Perfect for families seeking luxury lifestyle.",
    price: 45000000,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400061",
      address: "Versova, Mumbai",
      coordinates: {
        lat: 19.1317,
        lng: 72.8064
      }
    },
    propertyType: "villa",
    bedrooms: 5,
    bathrooms: 5,
    area: 4000,
    amenities: ["Private Garden", "Swimming Pool", "Beach Proximity", "Gym", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-01",
    status: "available"
  },
  {
    _id: "mum8",
    title: "Compact 1BHK in Thane",
    description: "Affordable yet comfortable apartment in emerging Thane area with good connectivity and modern amenities.",
    price: 6200000,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400601",
      address: "Thane West, Mumbai",
      coordinates: {
        lat: 19.2183,
        lng: 72.9781
      }
    },
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    amenities: ["Good Connectivity", "Shopping Centers", "Power Backup", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-22",
    status: "available"
  },
  {
    _id: "mum9",
    title: "Premium 3BHK in Worli",
    description: "Ultra-luxury apartment with sea views, premium fittings, and world-class amenities in Mumbai's premier location.",
    price: 28000000,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400025",
      address: "Worli, Mumbai",
      coordinates: {
        lat: 19.0176,
        lng: 72.8142
      }
    },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    amenities: ["Sea View", "Ultra Luxury", "Swimming Pool", "Gym", "Concierge"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-10",
    status: "available"
  },
  {
    _id: "mum10",
    title: "Modern 2BHK in Malad West",
    description: "Well-designed apartment with modern amenities, good transportation links, and family-friendly environment.",
    price: 8500000,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400064",
      address: "Malad West, Mumbai",
      coordinates: {
        lat: 19.1864,
        lng: 72.8396
      }
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ["Family Friendly", "Transportation", "Shopping Centers", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600566752734-f8de5f484360?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-26",
    status: "available"
  },

  // DELHI PROPERTIES (10)
  {
    _id: "del1",
    title: "Elegant 4BHK House in Gurgaon",
    description: "Spacious independent house in prime Gurgaon location with modern amenities and excellent schools nearby.",
    price: 12000000,
    location: {
      city: "Delhi",
      state: "Delhi",
      pincode: "122001", 
      address: "Sector 47, Gurgaon",
      coordinates: {
        lat: 28.4595,
        lng: 77.0266
      }
    },
    propertyType: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    amenities: ["Private Garden", "Car Parking", "Schools Nearby", "Shopping Mall", "Metro Access"],
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-12",
    status: "available"
  },
  {
    _id: "del2",
    title: "Luxury 3BHK in South Delhi",
    description: "Premium apartment in upscale South Delhi with heritage charm, modern amenities, and excellent connectivity.",
    price: 18500000,
    location: {
      city: "Delhi",
      state: "Delhi",
      pincode: "110024",
      address: "Greater Kailash, New Delhi",
      coordinates: {
        lat: 28.5494,
        lng: 77.2427
      }
    },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1900,
    amenities: ["Heritage Area", "Premium Location", "Metro Access", "Shopping", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-06",
    status: "available"
  },
  {
    _id: "del3",
    title: "Modern 2BHK in Noida",
    description: "Contemporary apartment in upcoming Noida with IT park proximity and modern lifestyle amenities.",
    price: 7200000,
    location: {
      city: "Delhi",
      state: "Uttar Pradesh",
      pincode: "201301",
      address: "Sector 62, Noida",
      coordinates: {
        lat: 28.6139,
        lng: 77.3910
      }
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    amenities: ["IT Park Proximity", "Metro Planned", "Swimming Pool", "Gym", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600607688960-e095ff8d5e68?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-19",
    status: "available"
  },
  {
    _id: "del4",
    title: "Luxury Villa in Vasant Kunj",
    description: "Independent villa with lush gardens, premium interiors, and close to diplomatic enclave. Perfect for VIP families.",
    price: 32000000,
    location: {
      city: "Delhi",
      state: "Delhi",
      pincode: "110070",
      address: "Vasant Kunj, New Delhi",
      coordinates: {
        lat: 28.5244,
        lng: 77.1671
      }
    },
    propertyType: "villa",
    bedrooms: 5,
    bathrooms: 5,
    area: 3800,
    amenities: ["Diplomatic Area", "Large Garden", "Swimming Pool", "Home Theater", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600047508897-98bb7a983d72?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-04",
    status: "available"
  },
  {
    _id: "del5",
    title: "Stylish 1BHK in Connaught Place",
    description: "Prime central Delhi location with heritage architecture, excellent connectivity, and vibrant commercial area.",
    price: 8900000,
    location: {
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      address: "Connaught Place, New Delhi",
      coordinates: {
        lat: 28.6315,
        lng: 77.2167
      }
    },
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    amenities: ["Prime Location", "Heritage Building", "Metro Access", "Commercial Area"],
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-16",
    status: "available"
  },
  {
    _id: "del6",
    title: "Premium 4BHK in Dwarka",
    description: "Spacious apartment in well-planned Dwarka with metro connectivity, modern amenities, and family-friendly environment.",
    price: 14500000,
    location: {
      city: "Delhi",
      state: "Delhi",
      pincode: "110075",
      address: "Dwarka Sector 12, New Delhi",
      coordinates: {
        lat: 28.6072,
        lng: 77.0365
      }
    },
    propertyType: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    amenities: ["Metro Connectivity", "Planned City", "Shopping Malls", "Schools", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-11",
    status: "available"
  },
  {
    _id: "del7",
    title: "Contemporary 3BHK in Faridabad",
    description: "Modern apartment with smart home features, premium fittings, and excellent connectivity to Delhi NCR.",
    price: 9800000,
    location: {
      city: "Delhi",
      state: "Haryana",
      pincode: "121006",
      address: "Sector 15, Faridabad",
      coordinates: {
        lat: 28.4089,
        lng: 77.3178
      }
    },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1650,
    amenities: ["Smart Home", "Metro Planned", "Swimming Pool", "Gym", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-14",
    status: "available"
  },
  {
    _id: "del8",
    title: "Luxury Penthouse in Golf Course Road",
    description: "Ultra-luxury penthouse with golf course views, private terrace, and world-class amenities in Gurgaon's premium area.",
    price: 42000000,
    location: {
      city: "Delhi",
      state: "Haryana",
      pincode: "122002",
      address: "Golf Course Road, Gurgaon",
      coordinates: {
        lat: 28.4647,
        lng: 77.0673
      }
    },
    propertyType: "penthouse",
    bedrooms: 4,
    bathrooms: 5,
    area: 3500,
    amenities: ["Golf Course Views", "Private Terrace", "Ultra Luxury", "Concierge", "Valet"],
    images: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-01",
    status: "available"
  },
  {
    _id: "del9",
    title: "Cozy 2BHK in Lajpat Nagar",
    description: "Affordable yet comfortable apartment in vibrant Lajpat Nagar with excellent shopping and metro connectivity.",
    price: 6800000,
    location: {
      city: "Delhi",
      state: "Delhi",
      pincode: "110024",
      address: "Lajpat Nagar, New Delhi",
      coordinates: {
        lat: 28.5677,
        lng: 77.2436
      }
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    amenities: ["Shopping Area", "Metro Access", "Cultural Area", "Markets", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-23",
    status: "available"
  },
  {
    _id: "del10",
    title: "Grand 5BHK House in Karol Bagh",
    description: "Traditional Delhi house with modern renovations, spacious rooms, and central location with excellent connectivity.",
    price: 25000000,
    location: {
      city: "Delhi",
      state: "Delhi",
      pincode: "110005",
      address: "Karol Bagh, New Delhi",
      coordinates: {
        lat: 28.6519,
        lng: 77.1909
      }
    },
    propertyType: "house",
    bedrooms: 5,
    bathrooms: 4,
    area: 2800,
    amenities: ["Central Location", "Traditional Architecture", "Metro Access", "Markets", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600566752734-f8de5f484360?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-07",
    status: "available"
  },

  // PUNE PROPERTIES (10)
  {
    _id: "pune1",
    title: "Tech Park Adjacent 3BHK in Hinjewadi",
    description: "Brand new apartment complex adjacent to major IT parks in Pune. Modern amenities and excellent connectivity.",
    price: 7800000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411057",
      address: "Hinjewadi Phase 2, Pune", 
      coordinates: {
        lat: 18.5908,
        lng: 73.7331
      }
    },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1650,
    amenities: ["IT Park Proximity", "Swimming Pool", "Gym", "Club House", "Metro Planned"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-22",
    status: "available"
  },
  {
    _id: "pune2",
    title: "Luxury 4BHK Villa in Koregaon Park",
    description: "Independent villa in prestigious Koregaon Park with private garden, swimming pool, and premium amenities.",
    price: 18500000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      address: "Koregaon Park, Pune",
      coordinates: {
        lat: 18.5362,
        lng: 73.8954
      }
    },
    propertyType: "villa",
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    amenities: ["Prestigious Area", "Private Garden", "Swimming Pool", "Premium Location"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-05",
    status: "available"
  },
  {
    _id: "pune3",
    title: "Modern 2BHK in Baner",
    description: "Contemporary apartment in rapidly developing Baner area with IT companies nearby and modern lifestyle amenities.",
    price: 6200000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
      address: "Baner, Pune",
      coordinates: {
        lat: 18.5679,
        lng: 73.7785
      }
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ["IT Companies Nearby", "Modern Amenities", "Shopping Centers", "Gym"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-18",
    status: "available"
  },
  {
    _id: "pune4",
    title: "Premium 3BHK in Wakad",
    description: "Spacious apartment with modern amenities, excellent connectivity to IT hubs, and family-friendly environment.",
    price: 8900000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411057",
      address: "Wakad, Pune",
      coordinates: {
        lat: 18.5975,
        lng: 73.7632
      }
    },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1750,
    amenities: ["IT Hub Connectivity", "Family Friendly", "Swimming Pool", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-13",
    status: "available"
  },
  {
    _id: "pune5",
    title: "Elegant 1BHK in Pune Station Area",
    description: "Compact yet comfortable apartment near railway station with excellent connectivity and urban amenities.",
    price: 3800000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      address: "Station Area, Pune",
      coordinates: {
        lat: 18.5314,
        lng: 73.8446
      }
    },
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    amenities: ["Railway Station Nearby", "Urban Amenities", "Transportation", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-25",
    status: "available"
  },
  {
    _id: "pune6",
    title: "Luxury 4BHK Penthouse in Aundh",
    description: "Ultra-luxury penthouse with panoramic city views, private terrace, and world-class amenities in premium Aundh.",
    price: 22000000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411007",
      address: "Aundh, Pune",
      coordinates: {
        lat: 18.5593,
        lng: 73.8070
      }
    },
    propertyType: "penthouse",
    bedrooms: 4,
    bathrooms: 5,
    area: 2900,
    amenities: ["City Views", "Private Terrace", "Ultra Luxury", "Premium Area", "Concierge"],
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-02",
    status: "available"
  },
  {
    _id: "pune7",
    title: "Contemporary 2BHK in Magarpatta",
    description: "Modern apartment in well-planned Magarpatta City with integrated township amenities and IT park proximity.",
    price: 7200000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411028",
      address: "Magarpatta, Pune",
      coordinates: {
        lat: 18.5157,
        lng: 73.9297
      }
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1350,
    amenities: ["Integrated Township", "IT Park Proximity", "Planned City", "Modern Amenities"],
    images: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-16",
    status: "available"
  },
  {
    _id: "pune8",
    title: "Garden Villa in Kharadi",
    description: "Beautiful independent villa with lush gardens, premium interiors, and peaceful environment in upcoming Kharadi.",
    price: 15000000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411014",
      address: "Kharadi, Pune",
      coordinates: {
        lat: 18.5511,
        lng: 73.9497
      }
    },
    propertyType: "villa",
    bedrooms: 4,
    bathrooms: 4,
    area: 2600,
    amenities: ["Large Garden", "Peaceful Environment", "Premium Interiors", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-09",
    status: "available"
  },
  {
    _id: "pune9",
    title: "Modern 3BHK in Viman Nagar",
    description: "Contemporary apartment near airport with excellent connectivity, modern amenities, and vibrant neighborhood.",
    price: 9500000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411014",
      address: "Viman Nagar, Pune",
      coordinates: {
        lat: 18.5679,
        lng: 73.9143
      }
    },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    amenities: ["Airport Proximity", "Modern Amenities", "Vibrant Area", "Swimming Pool"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-20",
    status: "available"
  },
  {
    _id: "pune10",
    title: "Luxury Studio in Camp Area",
    description: "Premium studio apartment in historic Camp area with heritage charm, modern amenities, and central location.",
    price: 4200000,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      address: "Camp, Pune",
      coordinates: {
        lat: 18.5074,
        lng: 73.8077
      }
    },
    propertyType: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 700,
    amenities: ["Heritage Area", "Central Location", "Modern Amenities", "Cultural Hub"],
    images: [
      "https://images.unsplash.com/photo-1600566752734-f8de5f484360?w=800&h=600&fit=crop"
    ],
    listedDate: "2024-01-27",
    status: "available"
  }
];

export const mockAmenities = {
  school: ["Delhi Public School", "Kendriya Vidyalaya", "St. Xavier's School", "Ryan International", "Narayana School"],
  hospital: ["Apollo Hospital", "Manipal Hospital", "Fortis Healthcare", "Max Healthcare", "Columbia Asia"],
  restaurant: ["Cafe Coffee Day", "McDonald's", "Pizza Hut", "Local Restaurant", "Domino's Pizza"],
  bank: ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra"],
  gym: ["Cult.fit", "Gold's Gym", "Fitness First", "Talwalkar's", "Snap Fitness"],
  shopping_mall: ["Phoenix Mall", "Forum Mall", "Inorbit Mall", "Express Avenue", "Select City Walk"],
  park: ["Cubbon Park", "Lalbagh", "Neighborhood Park", "Central Park", "Rose Garden"],
  metro_station: ["Koramangala Metro", "Indiranagar Metro", "MG Road Metro", "Rajiv Chowk", "Connaught Place"]
};
