import { Hotel } from '../types';

export const mockHotels: Hotel[] = [
  {
    id: 'savoy-ooty',
    name: 'Savoy – IHCL SeleQtions',
    destinationId: 'ooty',
    destinationName: 'Ooty, Tamil Nadu',
    location: 'Sylks Road, Monterey, Ooty',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 840,
    pricePerNight: 9500,
    category: 'Boutique Heritage',
    amenities: ['Fireplace Suites', 'English High Tea', 'Spa & Wellness', 'Heated Rooms', 'Lush English Gardens', 'Free Wi-Fi'],
    roomTypes: [
      { name: 'Heritage Classic Room', price: 9500, capacity: '2 Adults', features: ['Garden View', 'Fireplace', 'King Bed'] },
      { name: 'Colonial Suite', price: 14500, capacity: '3 Guests', features: ['Separate Living Room', 'Vintage Fireplace', 'Private Lawn'] }
    ],
    coordinates: { lat: 11.4115, lng: 76.6961 },
    featuredTag: 'Top Heritage Pick',
    sustainableBadge: true
  },
  {
    id: 'kumarakom-lake-resort',
    name: 'Kumarakom Lake Resort',
    destinationId: 'kerala',
    destinationName: 'Kerala (Alleppey & Backwaters)',
    location: 'Vembanad Lake Shore, Kumarakom',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 1650,
    pricePerNight: 16500,
    category: 'Luxury Resort',
    amenities: ['Infinity Meandering Pool', 'Ayurvedic Spa Centre', 'Houseboat Dining', 'Sunset Cruise', 'Water Villa Access', 'Organic Farm'],
    roomTypes: [
      { name: 'Heritage Villa with Private Pool', price: 16500, capacity: '2 Adults', features: ['Private Plunge Pool', 'Open-roof Courtyard', 'Lakefront'] },
      { name: 'Presidential Luxury Suite', price: 28000, capacity: '4 Guests', features: ['Direct Lake Access', 'Personal Butler', 'Private Deck'] }
    ],
    coordinates: { lat: 9.6178, lng: 76.4300 },
    featuredTag: 'World Luxury Award Winner',
    sustainableBadge: true
  },
  {
    id: 'the-grand-dragon-ladakh',
    name: 'The Grand Dragon Ladakh',
    destinationId: 'ladakh',
    destinationName: 'Leh Ladakh',
    location: 'Old Road Sheynam, Leh',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewCount: 920,
    pricePerNight: 13500,
    category: 'Modern Premium',
    amenities: ['Oxygen-Enriched Rooms', 'Central Heating', 'Panoramic Mountain View', 'Multi-Cuisine Buffet', 'Airport Shuttle', 'Tour Desk'],
    roomTypes: [
      { name: 'Deluxe Mountain Facing Room', price: 13500, capacity: '2 Adults', features: ['Stok Kangri Mountain View', 'Oxygen Concentrator', 'Heated Floors'] }
    ],
    coordinates: { lat: 34.1610, lng: 77.5810 },
    featuredTag: 'Eco-Solar Powered',
    sustainableBadge: true
  },
  {
    id: 'leela-palace-jaipur',
    name: 'The Leela Palace Jaipur',
    destinationId: 'jaipur',
    destinationName: 'Jaipur, Rajasthan',
    location: 'Delhi-Jaipur Highway, Kukas, Jaipur',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 1420,
    pricePerNight: 19000,
    category: 'Luxury Resort',
    amenities: ['Palatial Architecture', 'Royal Butler Service', 'Heated Royal Pool', 'Heritage Courtyard Dining', 'Spa by ESPA', 'Helipad'],
    roomTypes: [
      { name: 'Royal Palace Room', price: 19000, capacity: '2 Adults', features: ['Marble Inlay Balcony', 'Chandelier', 'Soaking Tub'] },
      { name: 'Maharaja Heritage Villa', price: 34000, capacity: '3 Guests', features: ['Private Plunge Pool', 'Private Peacock Courtyard'] }
    ],
    coordinates: { lat: 27.0315, lng: 75.9080 },
    featuredTag: 'Royal Heritage',
    sustainableBadge: false
  },
  {
    id: 'taj-madikeri-coorg',
    name: 'Taj Madikeri Resort & Spa',
    destinationId: 'coorg',
    destinationName: 'Coorg, Karnataka',
    location: '1st Monnangeri, Galibeedu, Madikeri',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewCount: 1100,
    pricePerNight: 15500,
    category: 'Luxury Resort',
    amenities: ['Rainforest Setting', 'Jiva Spa', 'Heated Temperature Pool', 'Coffee Estate Trails', 'Pottery Workshops', 'Organic Dining'],
    roomTypes: [
      { name: 'Superior Forest View Cottage', price: 15500, capacity: '2 Adults', features: ['Valley Mist View', 'Fireplace', 'Rainforest Balcony'] }
    ],
    coordinates: { lat: 12.4410, lng: 75.7190 },
    featuredTag: 'Rainforest Sanctuary',
    sustainableBadge: true
  },
  {
    id: 'w-goa-vagator',
    name: 'W Goa',
    destinationId: 'goa',
    destinationName: 'Goa',
    location: 'Vagator Beach, Bardez, Goa',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.7,
    reviewCount: 2190,
    pricePerNight: 17500,
    category: 'Luxury Resort',
    amenities: ['Rock Pool Sunset Lounge', 'Direct Beach Access', 'FIT Gym & AWAY Spa', 'Sunset DJ Sessions', 'Curated Mixology', 'Pet Friendly'],
    roomTypes: [
      { name: 'Spectacular Ocean View Room', price: 17500, capacity: '2 Adults', features: ['Arabian Sea View', 'Private Balcony', 'Signature W Bed'] }
    ],
    coordinates: { lat: 15.6028, lng: 73.7345 },
    featuredTag: 'Vibrant Coastal Vibe',
    sustainableBadge: false
  },
  {
    id: 'le-dupleix-pondicherry',
    name: 'Le Dupleix Heritage Hotel',
    destinationId: 'pondicherry',
    destinationName: 'Pondicherry',
    location: 'Rue De La Caserne, White Town, Puducherry',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.7,
    reviewCount: 780,
    pricePerNight: 6200,
    category: 'Boutique Heritage',
    amenities: ['French Courtyard Cafe', 'Teak Wood Interiors', 'Walking distance to Promenade', 'Artisan Breakfast', 'High Speed Wi-Fi'],
    roomTypes: [
      { name: 'Governor Suite', price: 6200, capacity: '2 Adults', features: ['Antiques from 18th Century', 'French Balcony', 'Rain Shower'] }
    ],
    coordinates: { lat: 11.9320, lng: 79.8335 },
    featuredTag: 'French Colonial Gem',
    sustainableBadge: true
  }
];
