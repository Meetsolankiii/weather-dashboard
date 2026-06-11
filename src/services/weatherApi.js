import axios from "axios";

const API_KEY =
  process.env.REACT_APP_OPENWEATHER_API_KEY;

const WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";

const GEO_URL =
  "https://api.openweathermap.org/geo/1.0/direct";

const FORECAST_URL =
  "https://api.openweathermap.org/data/2.5/forecast";

const AIR_URL =
  "https://api.openweathermap.org/data/2.5/air_pollution";

export const fetchWeatherData = async (city) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric"
    }
  });

  return response.data;
};

export const fetchForecastData = async (city) => {

  const geo = await axios.get(GEO_URL, {
    params: {
      q: city,
      limit: 1,
      appid: API_KEY
    }
  });

  const { lat, lon } = geo.data[0];

  const forecast = await axios.get(
    FORECAST_URL,
    {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric"
      }
    }
  );

  return forecast.data;
};

export const fetchAQIData = async (
  lat,
  lon
) => {

  const response = await axios.get(
    AIR_URL,
    {
      params: {
        lat,
        lon,
        appid: API_KEY
      }
    }
  );

  return response.data;
};