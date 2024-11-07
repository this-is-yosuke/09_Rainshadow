// import fs from 'node:fs/promises'
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  // cityName: string;
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
  // cityName: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    // this.cityName = cityName;
  };
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
      const response = await fetch(
        // `${this.baseURL}/direct?q=${query}&appid${this.apiKey}`
        // `${this.baseURL}/search.json?key=${this.apiKey}&q=${query}`
        this.buildGeocodeQuery(query)
      );
      // const weathers = await response.json();
      const weatherInfo = await response.json();

      const mappedInfo = await this.destructureLocationData(weatherInfo.data);
      return mappedInfo;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    }
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/data/2.5/weather?q=${city}&appid=${this.apiKey}`
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    // return `${this.baseURL}/current.json?key=${this.apiKey}&q=${coordinates.lat},${coordinates.lon}`
    // The below query is fetched STRAIGHT FROM THE SUBMISSIONS PAGE, FELLAS
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return locationData;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return this.parseCurrentWeather(data);
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.current.city,
      response.current.date,
      response.current.temperature,
      response.current.wind,
      response.current.humidity
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    
    return weatherData.map(day => ({
      date: day.date,
      maxTemp: day.day.maxtemp,
      minTemp: day.day.mintemp,
      condition: day.day.condition.text,
    })
    )

  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return weatherData
  }
}

export default new WeatherService();
