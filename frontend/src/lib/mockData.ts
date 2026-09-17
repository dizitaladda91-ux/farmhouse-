import { Property } from "@/types";

export const MOCK_PROPERTIES: Property[] = [
  // 1. Delhi - Farmhouse (Ultra Luxury, ₹32 Cr)
  {
    id: "farmhouse-chhatarpur-1",
    title: "The Oberoi Green Acre Estate",
    slug: "oberoi-green-acre-estate-chhatarpur",
    description: "Expansive 4.5 Acre gated farmhouse sanctuary nestled in the ultra-prime Chhatarpur green belt. Features private mango orchards, Olympic-sized swimming pool, 6-suite luxury residence, and 24/7 high-security perimeter.",
    property_type: "Farmhouse",
    price: 320000000,
    land_area_value: 4.5,
    land_area_unit: "acre",
    land_area_sqft_normalized: 196020,
    built_up_area_sqft: 14500,
    bedrooms: 6,
    bathrooms: 8,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: true,
    owner_id: "seller-1",
    location_id: "loc-1",
    location: {
      id: "loc-1",
      state: "Delhi",
      city: "Delhi",
      locality: "Chhatarpur Farms",
      address: "Lane 4, DLF Chhatarpur Farms",
    },
    media: [
      { id: "m1", property_id: "farmhouse-chhatarpur-1", media_type: "IMAGE", url: "/images/farmhouse-hero.jpg", is_primary: true, display_order: 0 },
      { id: "m2", property_id: "farmhouse-chhatarpur-1", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a1", name: "Private Swimming Pool" },
      { id: "a2", name: "Landscaped Orchards" },
      { id: "a3", name: "Guard House & CCTV" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 2. Delhi - Farmhouse (Budget accessible, ₹8.5 Cr)
  {
    id: "farmhouse-delhi-sultanpur-7",
    title: "The Sultanpur Sanctuary Farmhouse",
    slug: "sultanpur-sanctuary-farmhouse-delhi",
    description: "Serene 2 Acre boutique farmhouse property situated off Sultanpur, Mehrauli-Gurgaon Road, Delhi. Featuring organic herb gardens, heated plunge pool, 4 lavish bedrooms, and tranquil lush greens.",
    property_type: "Farmhouse",
    price: 85000000,
    land_area_value: 2,
    land_area_unit: "acre",
    land_area_sqft_normalized: 87120,
    built_up_area_sqft: 6500,
    bedrooms: 4,
    bathrooms: 5,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: true,
    owner_id: "seller-7",
    location_id: "loc-7",
    location: {
      id: "loc-7",
      state: "Delhi",
      city: "Delhi",
      locality: "Sultanpur Farms",
      address: "Main Sultanpur Road, South Delhi",
    },
    media: [
      { id: "m13", property_id: "farmhouse-delhi-sultanpur-7", media_type: "IMAGE", url: "/images/estate.jpg", is_primary: true, display_order: 0 },
      { id: "m14", property_id: "farmhouse-delhi-sultanpur-7", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a19", name: "Organic Herb Garden" },
      { id: "a20", name: "Plunge Pool" },
      { id: "a21", name: "Power Backup" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 3. Delhi - Villa (₹18 Cr)
  {
    id: "villa-delhi-vasantkunj-8",
    title: "Vasant Enclave Forest Villa",
    slug: "vasant-enclave-forest-villa-delhi",
    description: "Architectural modern forest villa overlooking the South Delhi green ridge in Vasant Kunj. Featuring private zen gardens, 5 king suites, internal lift, and bespoke smart automation.",
    property_type: "Villa",
    price: 180000000,
    land_area_value: 1000,
    land_area_unit: "sqyd",
    land_area_sqft_normalized: 9000,
    built_up_area_sqft: 8200,
    bedrooms: 5,
    bathrooms: 6,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: false,
    owner_id: "seller-8",
    location_id: "loc-8",
    location: {
      id: "loc-8",
      state: "Delhi",
      city: "Delhi",
      locality: "Vasant Kunj & Vasant Vihar",
      address: "Sector B Greens, Vasant Kunj, New Delhi",
    },
    media: [
      { id: "m15", property_id: "villa-delhi-vasantkunj-8", media_type: "IMAGE", url: "/images/villa.jpg", is_primary: true, display_order: 0 },
      { id: "m16", property_id: "villa-delhi-vasantkunj-8", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a22", name: "Private Zen Garden" },
      { id: "a23", name: "Home Elevator" },
      { id: "a24", name: "Ridge Forest View" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 4. Gurgaon - Farmhouse (₹24 Cr)
  {
    id: "farmhouse-dlf-gurgaon-2",
    title: "The Magnolia Meadow Farmhouse",
    slug: "magnolia-meadow-farmhouse-gurgaon",
    description: "Exclusive 3 Acre landscaped farmhouse situated off Golf Course Extension road with world-class landscaping, gazebo, organic vegetable patch, and bespoke entertainment deck.",
    property_type: "Farmhouse",
    price: 240000000,
    land_area_value: 3,
    land_area_unit: "acre",
    land_area_sqft_normalized: 130680,
    built_up_area_sqft: 11000,
    bedrooms: 5,
    bathrooms: 6,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: true,
    owner_id: "seller-2",
    location_id: "loc-2",
    location: {
      id: "loc-2",
      state: "Haryana",
      city: "Gurgaon",
      locality: "DLF Farms",
      address: "Sohna Road Greens, Gurgaon",
    },
    media: [
      { id: "m3", property_id: "farmhouse-dlf-gurgaon-2", media_type: "IMAGE", url: "/images/estate.jpg", is_primary: true, display_order: 0 },
      { id: "m4", property_id: "farmhouse-dlf-gurgaon-2", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a4", name: "Tennis Court" },
      { id: "a5", name: "Organic Farm Patch" },
      { id: "a6", name: "100% Solar Powered" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 5. Gurgaon - Farmhouse (₹6.2 Cr)
  {
    id: "farmhouse-gurgaon-aravalli-9",
    title: "Aravalli Foothills Eco Farmhouse",
    slug: "aravalli-foothills-eco-farmhouse-gurgaon",
    description: "Eco-luxury 1.5 Acre farmhouse nestled under the Aravalli hills off Sohna Road, Gurgaon. Features private fruit plantation, gazebo lounge, and contemporary 4 BHK residence.",
    property_type: "Farmhouse",
    price: 62000000,
    land_area_value: 1.5,
    land_area_unit: "acre",
    land_area_sqft_normalized: 65340,
    built_up_area_sqft: 5200,
    bedrooms: 4,
    bathrooms: 4,
    furnishing: "Semi Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: false,
    owner_id: "seller-9",
    location_id: "loc-9",
    location: {
      id: "loc-9",
      state: "Haryana",
      city: "Gurgaon",
      locality: "Sohna & Damdama",
      address: "Aravalli Range Road, Gurgaon",
    },
    media: [
      { id: "m17", property_id: "farmhouse-gurgaon-aravalli-9", media_type: "IMAGE", url: "/images/farmhouse-hero.jpg", is_primary: true, display_order: 0 },
      { id: "m18", property_id: "farmhouse-gurgaon-aravalli-9", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a25", name: "Aravalli Hills View" },
      { id: "a26", name: "Fruit Plantation" },
      { id: "a27", name: "Perimeter Security" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 6. Gurgaon - Luxury Bungalow (₹18.5 Cr)
  {
    id: "bungalow-gurgaon-3",
    title: "The Horizon Grand Bungalow",
    slug: "horizon-grand-bungalow-gurgaon",
    description: "Ultra-contemporary 8,500 sqft designer architectural bungalow with floor-to-ceiling glass facades, private temperature-controlled pool, and Italian marble finishes.",
    property_type: "Luxury Bungalow",
    price: 185000000,
    land_area_value: 1200,
    land_area_unit: "sqyd",
    land_area_sqft_normalized: 10800,
    built_up_area_sqft: 8500,
    bedrooms: 5,
    bathrooms: 6,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: true,
    owner_id: "seller-3",
    location_id: "loc-3",
    location: {
      id: "loc-3",
      state: "Haryana",
      city: "Gurgaon",
      locality: "Golf Course Road",
      address: "Sector 42, Golf Course Road",
    },
    media: [
      { id: "m5", property_id: "bungalow-gurgaon-3", media_type: "IMAGE", url: "/images/bungalow.jpg", is_primary: true, display_order: 0 },
      { id: "m6", property_id: "bungalow-gurgaon-3", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a7", name: "Smart Home Automation" },
      { id: "a8", name: "Private Elevator" },
      { id: "a9", name: "Rooftop Lounge" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 7. Alibaug - Villa (₹16.5 Cr)
  {
    id: "villa-alibaug-4",
    title: "The Casuarina Coastal Villa",
    slug: "casuarina-coastal-villa-alibaug",
    description: "Secluded 2.2 Acre beachfront sanctuary in Mandwa, Alibaug. Surrounded by tall coconut groves with direct shoreline access and an infinity pool facing the Arabian Sea.",
    property_type: "Villa",
    price: 165000000,
    land_area_value: 2.2,
    land_area_unit: "acre",
    land_area_sqft_normalized: 95832,
    built_up_area_sqft: 7500,
    bedrooms: 4,
    bathrooms: 5,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: true,
    owner_id: "seller-4",
    location_id: "loc-4",
    location: {
      id: "loc-4",
      state: "Maharashtra",
      city: "Alibaug",
      locality: "Mandwa Beach Belt",
      address: "Awas - Mandwa Road",
    },
    media: [
      { id: "m7", property_id: "villa-alibaug-4", media_type: "IMAGE", url: "/images/villa.jpg", is_primary: true, display_order: 0 },
      { id: "m8", property_id: "villa-alibaug-4", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a10", name: "Direct Beach Access" },
      { id: "a11", name: "Private Jetty Access" },
      { id: "a12", name: "Infinity Lap Pool" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 8. Alibaug - Farmhouse (₹5.5 Cr)
  {
    id: "farmhouse-alibaug-awas-10",
    title: "Awas Whispering Palms Estate",
    slug: "awas-whispering-palms-estate-alibaug",
    description: "Serene 1.2 Acre coastal farmhouse in Awas, Alibaug. Features 100+ bearing coconut palms, rustic open-air living pavilions, and quick 7-minute access to the jetty.",
    property_type: "Farmhouse",
    price: 55000000,
    land_area_value: 1.2,
    land_area_unit: "acre",
    land_area_sqft_normalized: 52272,
    built_up_area_sqft: 4200,
    bedrooms: 3,
    bathrooms: 4,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: false,
    owner_id: "seller-10",
    location_id: "loc-10",
    location: {
      id: "loc-10",
      state: "Maharashtra",
      city: "Alibaug",
      locality: "Awas Coastal Enclave",
      address: "Awas Village Coast Road, Alibaug",
    },
    media: [
      { id: "m19", property_id: "farmhouse-alibaug-awas-10", media_type: "IMAGE", url: "/images/estate.jpg", is_primary: true, display_order: 0 },
      { id: "m20", property_id: "farmhouse-alibaug-awas-10", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a28", name: "Coconut Plantation" },
      { id: "a29", name: "Swimming Pool" },
      { id: "a30", name: "Jetty Proximity" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 9. Goa - Villa (₹14.5 Cr)
  {
    id: "villa-goa-5",
    title: "The Heritage Palm Manor",
    slug: "heritage-palm-manor-assagao-goa",
    description: "Restored Portuguese-Goan luxury villa in coveted Assagao. Features grand high-beam wooden ceilings, private courtyard pool, and serene tropical landscaping.",
    property_type: "Villa",
    price: 145000000,
    land_area_value: 1800,
    land_area_unit: "sqyd",
    land_area_sqft_normalized: 16200,
    built_up_area_sqft: 6800,
    bedrooms: 4,
    bathrooms: 5,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: true,
    owner_id: "seller-5",
    location_id: "loc-5",
    location: {
      id: "loc-5",
      state: "Goa",
      city: "Goa",
      locality: "Assagao & Vagator",
      address: "Badem Junction, Assagao",
    },
    media: [
      { id: "m9", property_id: "villa-goa-5", media_type: "IMAGE", url: "/images/hills.jpg", is_primary: true, display_order: 0 },
      { id: "m10", property_id: "villa-goa-5", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a13", name: "Heritage Architecture" },
      { id: "a14", name: "Courtyard Pool" },
      { id: "a15", name: "Chef's Kitchen" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 10. Goa - Villa (Budget friendly, ₹4.8 Cr)
  {
    id: "villa-goa-assagao-11",
    title: "Assagao Tropical Sun Villa",
    slug: "assagao-tropical-sun-villa-goa",
    description: "Contemporary tropical designer villa in lush Assagao, North Goa. Includes open-concept living pavilion, private plunge pool, and lush foliage garden.",
    property_type: "Villa",
    price: 48000000,
    land_area_value: 650,
    land_area_unit: "sqyd",
    land_area_sqft_normalized: 5850,
    built_up_area_sqft: 3400,
    bedrooms: 3,
    bathrooms: 3,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: false,
    owner_id: "seller-11",
    location_id: "loc-11",
    location: {
      id: "loc-11",
      state: "Goa",
      city: "Goa",
      locality: "Assagao",
      address: "Anjuna - Assagao Link, Goa",
    },
    media: [
      { id: "m21", property_id: "villa-goa-assagao-11", media_type: "IMAGE", url: "/images/villa.jpg", is_primary: true, display_order: 0 },
      { id: "m22", property_id: "villa-goa-assagao-11", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a31", name: "Private Plunge Pool" },
      { id: "a32", name: "Lush Tropical Garden" },
      { id: "a33", name: "100% Power Backup" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 11. Lonavala - Farmhouse (₹19.5 Cr)
  {
    id: "farmhouse-lonavala-6",
    title: "The Cloud Crest Hilltop Farm",
    slug: "cloud-crest-hilltop-farm-lonavala",
    description: "Panoramic 5 Acre hilltop farmhouse estate in Tungarli Hills, Lonavala. Boasts misty mountain views, private tea-coffee grove, and outdoor infinity jacuzzi deck.",
    property_type: "Farmhouse",
    price: 195000000,
    land_area_value: 5,
    land_area_unit: "acre",
    land_area_sqft_normalized: 217800,
    built_up_area_sqft: 9200,
    bedrooms: 5,
    bathrooms: 6,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: true,
    owner_id: "seller-6",
    location_id: "loc-6",
    location: {
      id: "loc-6",
      state: "Maharashtra",
      city: "Lonavala",
      locality: "Tungarli Hills",
      address: "Old Khandala Road",
    },
    media: [
      { id: "m11", property_id: "farmhouse-lonavala-6", media_type: "IMAGE", url: "/images/farmhouse-hero.jpg", is_primary: true, display_order: 0 },
      { id: "m12", property_id: "farmhouse-lonavala-6", media_type: "IMAGE", url: "/images/estate.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a16", name: "360° Mountain Views" },
      { id: "a17", name: "Private Helipad" },
      { id: "a18", name: "Heated Jacuzzi" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 12. Lonavala - Villa (₹3.8 Cr)
  {
    id: "villa-lonavala-tigerpoint-12",
    title: "Tiger Point Valley View Villa",
    slug: "tiger-point-valley-view-villa-lonavala",
    description: "Scenic 3 BHK mountain chalet perched near Tiger Point, Lonavala. Features panoramic cliffside canyon views, glass breakfast deck, and fireplace living salon.",
    property_type: "Villa",
    price: 38000000,
    land_area_value: 500,
    land_area_unit: "sqyd",
    land_area_sqft_normalized: 4500,
    built_up_area_sqft: 3100,
    bedrooms: 3,
    bathrooms: 3,
    furnishing: "Fully Furnished",
    status: "AVAILABLE",
    verification_status: "VERIFIED",
    is_featured: false,
    owner_id: "seller-12",
    location_id: "loc-12",
    location: {
      id: "loc-12",
      state: "Maharashtra",
      city: "Lonavala",
      locality: "Tiger Point & Khandala",
      address: "Aamby Valley Road, Lonavala",
    },
    media: [
      { id: "m23", property_id: "villa-lonavala-tigerpoint-12", media_type: "IMAGE", url: "/images/hills.jpg", is_primary: true, display_order: 0 },
      { id: "m24", property_id: "villa-lonavala-tigerpoint-12", media_type: "IMAGE", url: "/images/bedroom.jpg", is_primary: false, display_order: 1 }
    ],
    amenities: [
      { id: "a34", name: "Valley & Canyon View" },
      { id: "a35", name: "Wood Fireplace" },
      { id: "a36", name: "Glass Deck" }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
