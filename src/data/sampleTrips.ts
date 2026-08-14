import { TripPlan } from '../types';

export const mockSampleTrips: TripPlan[] = [
  {
    id: 'kerala-5day-explorer',
    title: '5 Days in Kerala: Backwaters, Spices & Colonial Coast',
    destination: 'Kerala',
    stateOrCountry: 'Kerala, India',
    summary: 'A journey through Fort Kochi’s historic spice quarter, cruising the emerald canals of Alleppey in a private houseboat, and refreshing your senses amidst Munnar tea terraces.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-12',
    endDate: '2026-09-16',
    durationDays: 5,
    travelers: 4,
    travelStyle: 'Balanced',
    interests: ['Nature', 'Culture', 'Houseboat', 'Food'],
    transportMode: 'Private Cab',
    accommodationType: 'Boutique Hotels',
    days: [
      {
        dayNumber: 1,
        title: 'Fort Kochi Heritage & Colonial Harbor Strolls',
        theme: 'Colonial Maritime History & Art',
        date: 'Day 1 (12 Sep)',
        dayEstimatedCost: 6500,
        items: [
          {
            id: 'k1-1',
            time: '09:00',
            title: 'Fort Kochi & Chinese Fishing Nets',
            location: 'Vasco da Gama Square, Fort Kochi',
            type: 'attraction',
            description: 'Stroll along the historic waterfront and watch fishermen operate the 14th-century cantilevered fishing nets gifted by Chinese traders.',
            image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.5,
            distanceFromPrevKm: 0,
            travelDurationMin: 0,
            estimatedCost: 200,
            coordinates: { lat: 9.9675, lng: 76.2420 },
            tips: 'Arrive early to capture fishermen lowering the wooden cantilever frames.'
          },
          {
            id: 'k1-2',
            time: '12:30',
            title: 'Seafood Lunch at History Restaurant',
            location: 'Brunton Boatyard, Fort Kochi',
            type: 'food',
            description: 'Savor traditional Syrian Christian duck roast and Karimeen Pollichathu wrapped in banana leaf overlooking Cochin Harbor.',
            image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
            durationHours: 1.5,
            distanceFromPrevKm: 1.2,
            travelDurationMin: 8,
            estimatedCost: 3200,
            coordinates: { lat: 9.9682, lng: 76.2435 },
            tips: 'Book outdoor courtyard table overlooking the boat channel.'
          },
          {
            id: 'k1-3',
            time: '14:30',
            title: 'Mattancherry Palace & Jew Town Antique Bazaar',
            location: 'Jew Town, Mattancherry, Kochi',
            type: 'attraction',
            description: 'Explore the Portuguese palace famed for mythological Hindu murals, followed by antique brass and spice shopping in the 16th-century Jew Town.',
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.5,
            distanceFromPrevKm: 3.5,
            travelDurationMin: 15,
            estimatedCost: 400,
            coordinates: { lat: 9.9575, lng: 76.2590 },
            tips: 'Photography allowed inside palace courtyard; no shoes inside mural room.'
          },
          {
            id: 'k1-4',
            time: '18:00',
            title: 'Marine Drive Sunset Promenade & Boat Cruise',
            location: 'Marine Drive Walkway, Ernakulam',
            type: 'relaxation',
            description: 'Relax along the scenic promenade as city lights sparkle across Vembanad backwaters with evening sea breezes.',
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 6.8,
            travelDurationMin: 22,
            estimatedCost: 1200,
            coordinates: { lat: 9.9816, lng: 76.2750 },
            tips: 'Try fresh tender coconut water and roasted masala peanuts from street carts.'
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Munnar Scenic Climb & High Altitude Tea Plantations',
        theme: 'Misty Mountains & Tea Aromas',
        date: 'Day 2 (13 Sep)',
        dayEstimatedCost: 7800,
        items: [
          {
            id: 'k2-1',
            time: '08:30',
            title: 'Cheeyappara & Valara Waterfalls en route',
            location: 'NH 85, Idukki District',
            type: 'transit',
            description: 'Scenic hill drive through mountain ghats with stops at seven-tiered cascading mountain waterfalls.',
            image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
            durationHours: 1.0,
            distanceFromPrevKm: 65,
            travelDurationMin: 110,
            estimatedCost: 300,
            coordinates: { lat: 10.0240, lng: 76.8830 }
          },
          {
            id: 'k2-2',
            time: '11:30',
            title: 'Tata Tea Museum & Plantation Walk',
            location: 'Nullatanni Estate, Munnar',
            type: 'attraction',
            description: 'Learn the history of tea making from British colonial times and sample orthodox black tea.',
            image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 32,
            travelDurationMin: 45,
            estimatedCost: 800,
            coordinates: { lat: 10.0910, lng: 77.0600 }
          },
          {
            id: 'k2-3',
            time: '15:30',
            title: 'Eravikulam National Park (Nilgiri Tahr Sanctuary)',
            location: 'Kannan Devan Hills, Munnar',
            type: 'activity',
            description: 'Eco-bus ride and trail trek up to Anamudi peak slopes to spot endangered Nilgiri Tahr mountain goats.',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            durationHours: 3.0,
            distanceFromPrevKm: 14,
            travelDurationMin: 25,
            estimatedCost: 1800,
            coordinates: { lat: 10.1500, lng: 77.0580 }
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Munnar Spice Gardens & Mattupetty Echo Point',
        theme: 'Flora, Fauna & High Dam Lakes',
        date: 'Day 3 (14 Sep)',
        dayEstimatedCost: 6200,
        items: [
          {
            id: 'k3-1',
            time: '09:00',
            title: 'Mattupetty Dam & Speedboating',
            location: 'Mattupetty, Munnar',
            type: 'activity',
            description: 'Cruising through the mountain reservoir with dense green forests on all sides.',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 13,
            travelDurationMin: 25,
            estimatedCost: 1500,
            coordinates: { lat: 10.1080, lng: 77.1240 }
          },
          {
            id: 'k3-2',
            time: '14:00',
            title: 'Organic Spice Garden Tour & Ayurvedic Herbs',
            location: 'Chithirapuram Spice Farms',
            type: 'activity',
            description: 'Guided sensory walk through pepper vines, cardamom pods, cinnamon bark, and vanilla orchids.',
            image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 18,
            travelDurationMin: 35,
            estimatedCost: 1200,
            coordinates: { lat: 10.0240, lng: 77.0250 }
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'Alleppey Private Luxury Houseboat Check-in & Lagoon Cruise',
        theme: 'Emerald Backwater Odyssey',
        date: 'Day 4 (15 Sep)',
        dayEstimatedCost: 10500,
        items: [
          {
            id: 'k4-1',
            time: '12:00',
            title: 'Boarding Traditional Kettuvallam Houseboat',
            location: 'Punnamada Jetty, Alleppey',
            type: 'stay',
            description: 'Welcome tender coconut drink and cruise into the vast waterways of Vembanad Lake.',
            image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
            durationHours: 6.0,
            distanceFromPrevKm: 150,
            travelDurationMin: 240,
            estimatedCost: 8500,
            coordinates: { lat: 9.4981, lng: 76.3388 }
          },
          {
            id: 'k4-2',
            time: '17:30',
            title: 'Canal Village Canoe Safari & Sunset',
            location: 'Kainakary Village, Alleppey',
            type: 'relaxation',
            description: 'Glide into intimate narrow canals where large boats cannot pass, meeting local coir weavers.',
            image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 2,
            travelDurationMin: 10,
            estimatedCost: 1200,
            coordinates: { lat: 9.4890, lng: 76.3810 }
          }
        ]
      },
      {
        dayNumber: 5,
        title: 'Marari Beach Relaxation & Kathakali Finale',
        theme: 'Coastal Serenity & Departure',
        date: 'Day 5 (16 Sep)',
        dayEstimatedCost: 3000,
        items: [
          {
            id: 'k5-1',
            time: '09:30',
            title: 'Marari Golden Sand Beach & Coconut Grove Stroll',
            location: 'Mararikulam Coast',
            type: 'relaxation',
            description: 'Unwind on uncrowded sandy shores fringed with coconut palms.',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.5,
            distanceFromPrevKm: 18,
            travelDurationMin: 30,
            estimatedCost: 500,
            coordinates: { lat: 9.5980, lng: 76.2970 }
          },
          {
            id: 'k5-2',
            time: '14:00',
            title: 'Cochin Souvenir Shopping & Airport Drop',
            location: 'Lulu Mall / Cochin International Airport',
            type: 'transit',
            description: 'Pick up authentic banana chips, spices, and handmade tea before departing.',
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 65,
            travelDurationMin: 90,
            estimatedCost: 1500,
            coordinates: { lat: 10.1518, lng: 76.3930 }
          }
        ]
      }
    ],
    budget: {
      hotel: 12000,
      food: 6000,
      transport: 8000,
      activities: 5000,
      other: 3000,
      total: 34000,
      currency: 'INR'
    },
    recommendations: {
      packing: [
        'Light breathable cotton & linen clothing',
        'Comfortable walking/hiking shoes for tea plantations',
        'Rain jacket or compact umbrella',
        'Eco-friendly mosquito repellent & sunscreen',
        'Light shawl/jacket for Munnar night temperatures'
      ],
      localEtiquette: [
        'Dress modestly when entering traditional temples and synagogues',
        'Remove footwear before entering shrines and private houseboats',
        'Tipping 7-10% at sit-down restaurants is customary'
      ],
      bestPhotoSpots: [
        'Chinese Fishing Nets silhouette during sunset',
        'Kolukkumalai Tea Sunrise (highest tea estate)',
        'Private houseboat bow overlooking Vembanad Lake'
      ],
      curatedFoodStops: [
        'Karimeen Pollichathu at Brunton Boatyard',
        'Malabar Chicken Biryani at Calicut Paragon',
        'Fresh tender coconut and toddy shop cassava curry at Kuttanad'
      ]
    },
    weather: {
      tempAvgC: 26,
      condition: 'Pleasant Breeze & Tropical Warmth',
      forecast: 'Clear mornings with light coastal evening breeze. Perfect for cruising.',
      humidity: '68%',
      uvIndex: '7 of 10'
    },
    sources: [
      'Kerala Tourism Official Guide',
      'Nilgiri & Western Ghats Biosphere Reserve',
      'Vembanad Waterway Authority'
    ],
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'ooty-4day-retreat',
    title: '4 Days in Ooty: Tea Hills, Toy Trains & Mountain Serenity',
    destination: 'Ooty',
    stateOrCountry: 'Tamil Nadu, India',
    summary: 'A rejuvenating retreat in the Nilgiri mountains covering heritage toy train rides, botanical trails, high-altitude peak views, and cozy fireside colonial evenings.',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-10',
    endDate: '2026-09-13',
    durationDays: 4,
    travelers: 2,
    travelStyle: 'Relaxed',
    interests: ['Nature', 'Mountains', 'Heritage', 'Tea'],
    transportMode: 'Self Drive',
    accommodationType: 'Boutique Hotels',
    days: [
      {
        dayNumber: 1,
        title: 'Arrival, Botanical Wonders & Colonial Fireplace Dinner',
        theme: 'Flora & Mountain Atmosphere',
        date: 'Day 1',
        dayEstimatedCost: 4500,
        items: [
          {
            id: 'o1-1',
            time: '10:00',
            title: 'Government Botanical Gardens & Fossil Tree',
            location: 'Vannarapettai, Ooty',
            type: 'attraction',
            description: 'Walk through 55 acres of terraced gardens featuring exotic flowers, Italian floral patterns, and a 20-million-year-old fossilized tree.',
            image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.5,
            distanceFromPrevKm: 0,
            travelDurationMin: 0,
            estimatedCost: 300,
            coordinates: { lat: 11.4172, lng: 76.7118 }
          },
          {
            id: 'o1-2',
            time: '14:00',
            title: 'Ooty Lake Boating & Eucalyptus Forest Walk',
            location: 'West Lake Road, Ooty',
            type: 'relaxation',
            description: 'Paddle boating on the scenic lake framed by tall Nilgiri eucalyptus groves.',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 3.5,
            travelDurationMin: 12,
            estimatedCost: 600,
            coordinates: { lat: 11.4050, lng: 76.6850 }
          },
          {
            id: 'o1-3',
            time: '19:00',
            title: "Anglo-Indian Fireside Dinner at Earl's Secret",
            location: 'Kings Cliff Hotel, Ooty',
            type: 'food',
            description: 'Candlelit dinner in a vintage glass conservatory with crackling fireplace.',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 2.1,
            travelDurationMin: 10,
            estimatedCost: 2200,
            coordinates: { lat: 11.4180, lng: 76.7020 }
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Heritage Toy Train to Coonoor & Tea Sommelier Walk',
        theme: 'UNESCO Heritage & Tea Culture',
        date: 'Day 2',
        dayEstimatedCost: 5200,
        items: [
          {
            id: 'o2-1',
            time: '09:00',
            title: 'Nilgiri Mountain Railway Toy Train Ride',
            location: 'Ooty Railway Station to Coonoor',
            type: 'activity',
            description: 'Iconic steam rack railway journey through mountain gorges and tea valleys.',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 18,
            travelDurationMin: 70,
            estimatedCost: 1300,
            coordinates: { lat: 11.3530, lng: 76.7959 }
          },
          {
            id: 'o2-2',
            time: '13:00',
            title: 'Highfield Tea Estate Cupping & Tasting',
            location: 'Coonoor Tea Country',
            type: 'food',
            description: 'Sommelier-guided tasting of green, orthodox black, and rare silver needle white teas.',
            image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.5,
            distanceFromPrevKm: 4.5,
            travelDurationMin: 15,
            estimatedCost: 900,
            coordinates: { lat: 11.3520, lng: 76.7920 }
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Doddabetta Peak Sunrise & Pykara Waterfalls',
        theme: 'High Altitude Panoramas',
        date: 'Day 3',
        dayEstimatedCost: 4800,
        items: [
          {
            id: 'o3-1',
            time: '06:30',
            title: 'Doddabetta Peak Viewpoint (8,650 ft)',
            location: 'Ooty-Kotagiri Road',
            type: 'attraction',
            description: 'The highest peak in the Nilgiri mountains offering 360-degree views above the morning cloud blanket.',
            image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.5,
            distanceFromPrevKm: 9.0,
            travelDurationMin: 25,
            estimatedCost: 200,
            coordinates: { lat: 11.4010, lng: 76.7360 }
          },
          {
            id: 'o3-2',
            time: '12:30',
            title: 'Pykara Lake Boating & Majestic Waterfalls',
            location: 'Pykara Dam & Forest Reserve',
            type: 'activity',
            description: 'Speedboat cruise in the Toda sacred lake and picnic by the cascades.',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            durationHours: 3.0,
            distanceFromPrevKm: 21,
            travelDurationMin: 40,
            estimatedCost: 1400,
            coordinates: { lat: 11.4580, lng: 76.6020 }
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'Homemade Chocolate Trail & Rose Gardens',
        theme: 'Sweet Flavors & Farewell',
        date: 'Day 4',
        dayEstimatedCost: 3500,
        items: [
          {
            id: 'o4-1',
            time: '10:00',
            title: 'Government Rose Garden (20,000 varieties)',
            location: 'Elk Hill Slopes, Ooty',
            type: 'attraction',
            description: 'Walk through Asia’s highest rose garden featuring multi-colored fragrant blooms.',
            image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 2.5,
            travelDurationMin: 10,
            estimatedCost: 200,
            coordinates: { lat: 11.4040, lng: 76.7140 }
          },
          {
            id: 'o4-2',
            time: '13:00',
            title: 'King Star Fudge & Nilgiri Spices Shopping',
            location: 'Commercial Road, Ooty',
            type: 'food',
            description: 'Handmade chocolate fudge, eucalyptus oil, and freshly ground cardamom.',
            image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
            durationHours: 2.0,
            distanceFromPrevKm: 1.5,
            travelDurationMin: 8,
            estimatedCost: 1800,
            coordinates: { lat: 11.4090, lng: 76.6980 }
          }
        ]
      }
    ],
    budget: {
      hotel: 9500,
      food: 4200,
      transport: 3500,
      activities: 3800,
      other: 2000,
      total: 23000,
      currency: 'INR'
    },
    recommendations: {
      packing: [
        'Warm sweater, hoodie, and scarf for chilly evenings (10-14°C)',
        'Comfortable trail walking shoes',
        'Lip balm and moisturizer for mountain air',
        'Camera with telephoto lens for misty viewpoints'
      ],
      localEtiquette: [
        'Book Toy Train tickets weeks in advance due to high heritage demand',
        'Respect indigenous Toda tribal settlements and forest guidelines',
        'Avoid single-use plastics in the Nilgiri eco-sensitive hill zone'
      ],
      bestPhotoSpots: [
        'Doddabetta Telescope House looking into Coimbatore valley',
        'Pykara Lake boat dock with blue pine reflections',
        'Coonoor steam train crossing stone arch bridge'
      ],
      curatedFoodStops: [
        'Homemade dark roast hazelnut fudge at King Star (since 1942)',
        'Sizzlers and hot apple pie at Kings Cliff',
        'Authentic Chinese steam dumplings at Shinkow’s'
      ]
    },
    weather: {
      tempAvgC: 17,
      condition: 'Misty & Pleasant',
      forecast: 'Cool mountain air with morning mist and crisp sunny afternoons.',
      humidity: '74%',
      uvIndex: '5 of 10'
    },
    sources: [
      'Nilgiri District Tourism Bureau',
      'Southern Railway Heritage Division'
    ],
    createdAt: '2026-08-11T12:00:00Z'
  }
];
