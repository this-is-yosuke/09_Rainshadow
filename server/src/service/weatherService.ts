import fs from 'node:fs/promises'
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  cityName: string;
  lat: number; //latitude
  lon: number; //longitude
}

// TODO: Define a class for the Weather object
class Weather {
city: string;
date: Date;
temperature: number;
wind: number;
humidity: number;
constructor(city: string, date: Date, temperature: number, wind: number, humidity: number) {
  this.city = city;
  this.date = date;
  this.temperature = temperature;
  this.wind = wind;
  this.humidity = humidity;
}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  city: string;
  constructor(city: string) {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.city = city;
  };
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/direct?q=${query}&appid${this.apiKey}`
      );
      const weathers = await response.json();

      const mappedWeathers = await this.destructureLocationData(weathers.data);
      return mappedWeathers;
    } catch (err) {
      console.log('ERROR', err);
      return err
    }
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {

  // }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
