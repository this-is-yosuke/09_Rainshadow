// import fs from 'node:fs/promises'
import dayjs, { Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// const Dayjs = require(dayjs);

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number; //latitude
  lon: number; //longitude
  country: string;
  state: string;
}

// TODO: Define a class for the Weather object
class Weather {
city: string;
// date: Date;
date: Dayjs | string;
temperatureF: number;
windSpeed: number;
humidity: number;
icon: string;
iconDescription: string;
constructor(
  city: string,
  date: Dayjs | string,
  temperatureF: number,
  windSpeed: number,
  humidity: number,
  icon: string,
  iconDescription: string
) {
  this.city = city;
  this.date = date;
  this.temperatureF = temperatureF;
  this.windSpeed = windSpeed;
  this.humidity = humidity;
  this.icon = icon;
  this.iconDescription = iconDescription;
}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private city = '';
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  };
  
  // TODO: Create fetchLocationData method ***
  private async fetchLocationData(query: string) {
    try {
      if(!this.baseURL || !this.apiKey) {
        throw new Error("API base URL or API key not found!");
      }
      const response: Coordinates[] = await fetch(query).then((res) =>
        res.json()
      );
      return response[0];

      // const response = await fetch(
        // `${this.baseURL}/direct?q=${query}&appid${this.apiKey}`
        // `${this.baseURL}/search.json?key=${this.apiKey}&q=${query}`
        // this.buildGeocodeQuery();
      // );
      // const weathers = await response.json();
      // const weatherInfo = await response.json();
      // const mappedInfo = await this.destructureLocationData(weatherInfo.data);
      // return mappedInfo;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // TODO: Create destructureLocationData method ***
  private destructureLocationData(locationData: Coordinates): Coordinates {
    // return {
    //   lat: locationData.lat,
    //   lon: locationData.lon,
    // }
    if (!locationData) {
      throw new Error('City not found');
    }

    const { name, lat, lon, country, state } = locationData;

    const coordinates: Coordinates = {
      name,
      lat,
      lon,
      country,
      state,
    };
    return coordinates;
  }

  // TODO: Create buildGeocodeQuery method ***
  // private buildGeocodeQuery(city: string): string {
  //   return `${this.baseURL}/data/2.5/weather?q=${city}&appid=${this.apiKey}`
  // }
  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`
    return geocodeQuery;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    // return `${this.baseURL}/current.json?key=${this.apiKey}&q=${coordinates.lat},${coordinates.lon}`
    // The below query is fetched STRAIGHT FROM THE SUBMISSIONS PAGE, FELLAS
    const weatherQuery =  `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`
    return weatherQuery;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    //   const locationData = await this.fetchLocationData(city);
    //   return locationData;
    // }
    private async fetchAndDestructureLocationData() {
      return await this.fetchLocationData(this.buildGeocodeQuery()).then((data) => 
        this.destructureLocationData(data)
      );
    }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    //   const response = await fetch(this.buildWeatherQuery(coordinates));
    //   const data = await response.json();
    //   return this.parseCurrentWeather(data);
    // }
    private async fetchWeatherData(coordinates: Coordinates) {
      try {
        const response = await fetch(this.buildWeatherQuery(coordinates)).then(
          (res) => res.json()
        );
        if(!response){
          throw new Error('Weather data not found')
        }
        const currentWeather: Weather = this.parseCurrentWeather(
          response.list[0]
        );
        const forecast: Weather[] = this.buildForecastArray(
          currentWeather,
          response.list
        );
        return forecast;
      } catch(error: any) {
        console.log(error);
        return error;
      }
  }
  // TODO: Build parseCurrentWeather method ***
  private parseCurrentWeather(response: any) {
    const parsedDate = dayjs.unix(response.dt).format('M/D/YYYY');
    const currentWeather = new Weather (
      this.city,
      parsedDate,
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description || response.weather[0].main
    );
    return currentWeather;
    // return new Weather(
    //   response.current.city,
    //   response.current.date,
    //   response.current.temperature,
    //   response.current.wind,
    //   response.current.humidity
    // );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[] = [currentWeather];
    const filteredWeatherData = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });
    for(const day of filteredWeatherData){
      weatherForecast.push(
        new Weather(
          this.city,
          dayjs.unix(day.dt).format('M/D/YYYY'),
          day.main.temp,
          day.wind.speed,
          day.main.humidity,
          day.weather[0].icon,
          day.weather[0].description || day.weather[0].main
        )
      );
    }
    return weatherForecast;
    // return weatherData.map(day => ({
    //   date: day.date,
    //   maxTemp: day.day.maxtemp,
    //   minTemp: day.day.mintemp,
    //   condition: day.day.condition.text,
    // })
    // )
  }
  // TODO: Complete getWeatherForCity method ***
  async getWeatherForCity(city: string) {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      if(coordinates) {
        const weatherData = await this.fetchWeatherData(coordinates);
        return weatherData
      }
      throw new Error('Weather data not found');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new WeatherService();
