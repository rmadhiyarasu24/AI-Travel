export interface CityWeather {
  destinationId: string;
  cityName: string;
  tempCurrentC: number;
  tempMinC: number;
  tempMaxC: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Misty' | 'Pleasant Breeze' | 'Cool Mountain Air' | 'Tropical Warm';
  humidity: string;
  windSpeed: string;
  uvIndex: string;
  bestMonths: string;
  clothingTip: string;
}

export const mockWeatherData: Record<string, CityWeather> = {
  ooty: {
    destinationId: 'ooty',
    cityName: 'Ooty (Udhagamandalam)',
    tempCurrentC: 17,
    tempMinC: 11,
    tempMaxC: 21,
    condition: 'Misty',
    humidity: '74%',
    windSpeed: '9 km/h',
    uvIndex: '5 (Moderate)',
    bestMonths: 'October through May',
    clothingTip: 'Carry light woollens, a windbreaker jacket, and comfortable walking shoes.'
  },
  kerala: {
    destinationId: 'kerala',
    cityName: 'Kerala (Kochi & Munnar)',
    tempCurrentC: 26,
    tempMinC: 22,
    tempMaxC: 30,
    condition: 'Pleasant Breeze',
    humidity: '68%',
    windSpeed: '12 km/h',
    uvIndex: '7 (High)',
    bestMonths: 'September to March',
    clothingTip: 'Light cotton wear for backwaters; light cardigan for Munnar hill station nights.'
  },
  ladakh: {
    destinationId: 'ladakh',
    cityName: 'Leh Ladakh',
    tempCurrentC: 14,
    tempMinC: 4,
    tempMaxC: 19,
    condition: 'Sunny',
    humidity: '32%',
    windSpeed: '16 km/h',
    uvIndex: '9 (Very High)',
    bestMonths: 'May to September',
    clothingTip: 'Heavy thermal layers, polarized UV sunglasses, SPF 50+ sunscreen, and lip balm.'
  },
  jaipur: {
    destinationId: 'jaipur',
    cityName: 'Jaipur & Udaipur',
    tempCurrentC: 28,
    tempMinC: 19,
    tempMaxC: 33,
    condition: 'Sunny',
    humidity: '41%',
    windSpeed: '11 km/h',
    uvIndex: '8 (Very High)',
    bestMonths: 'October to March',
    clothingTip: 'Breathable linen clothes, wide-brim sunhat, and scarf for fort visits.'
  },
  coorg: {
    destinationId: 'coorg',
    cityName: 'Coorg (Madikeri)',
    tempCurrentC: 21,
    tempMinC: 15,
    tempMaxC: 25,
    condition: 'Cool Mountain Air',
    humidity: '72%',
    windSpeed: '8 km/h',
    uvIndex: '6 (Moderate)',
    bestMonths: 'October to April',
    clothingTip: 'Light sweaters for morning estate strolls; breathable hiking shoes.'
  },
  goa: {
    destinationId: 'goa',
    cityName: 'Goa Coast',
    tempCurrentC: 29,
    tempMinC: 24,
    tempMaxC: 32,
    condition: 'Tropical Warm',
    humidity: '75%',
    windSpeed: '14 km/h',
    uvIndex: '8 (Very High)',
    bestMonths: 'November to February',
    clothingTip: 'Beach resort wear, swimwear, sunglasses, and reef-safe sunscreen.'
  },
  manali: {
    destinationId: 'manali',
    cityName: 'Manali Valley',
    tempCurrentC: 15,
    tempMinC: 6,
    tempMaxC: 20,
    condition: 'Cool Mountain Air',
    humidity: '58%',
    windSpeed: '10 km/h',
    uvIndex: '6 (Moderate)',
    bestMonths: 'March to June & Dec to Feb',
    clothingTip: 'Fleece jackets, thermal innerwear, gloves for high passes.'
  },
  pondicherry: {
    destinationId: 'pondicherry',
    cityName: 'Puducherry',
    tempCurrentC: 28,
    tempMinC: 23,
    tempMaxC: 31,
    condition: 'Pleasant Breeze',
    humidity: '71%',
    windSpeed: '13 km/h',
    uvIndex: '7 (High)',
    bestMonths: 'October to March',
    clothingTip: 'Casual cotton dresses, linen shirts, sunhat, and walking sandals.'
  }
};
