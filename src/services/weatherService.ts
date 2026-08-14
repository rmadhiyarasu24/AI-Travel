import { CityWeather, mockWeatherData } from '../data/weatherData';
import { WeatherInfo } from '../types';

export const weatherService = {
  async getWeather(destinationId: string): Promise<CityWeather> {
    await new Promise((r) => setTimeout(r, 60));
    const normalized = destinationId.toLowerCase().replace(/[^a-z]/g, '');
    const found = Object.values(mockWeatherData).find((w) =>
      w.destinationId.toLowerCase() === normalized ||
      w.cityName.toLowerCase().includes(normalized)
    );

    if (found) return found;

    return {
      destinationId,
      cityName: destinationId.charAt(0).toUpperCase() + destinationId.slice(1),
      tempCurrentC: 22,
      tempMinC: 16,
      tempMaxC: 27,
      condition: 'Pleasant Breeze',
      humidity: '60%',
      windSpeed: '10 km/h',
      uvIndex: '6 (Moderate)',
      bestMonths: 'September through April',
      clothingTip: 'Comfortable cotton layer during day; light jacket for evening.'
    };
  },

  async getWeatherForDestination(destination: string): Promise<WeatherInfo> {
    const raw = await this.getWeather(destination);
    return {
      destinationId: raw.destinationId,
      cityName: raw.cityName,
      tempAvg: raw.tempCurrentC,
      tempHigh: raw.tempMaxC,
      tempLow: raw.tempMinC,
      condition: raw.condition,
      rainProbability: raw.condition.toLowerCase().includes('mist') ? 35 : 15,
      humidity: raw.humidity,
      packingRecommendations: [
        raw.clothingTip,
        'Comfortable trail walking shoes',
        'Sunscreen & UV protection',
        'Reusable insulated water flask'
      ]
    };
  }
};
