import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// OpenWeather API key is now loaded securely from environment variables
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

/**
 * Fetch weather data from OpenWeather API
 *
 * @param {string} city - Name of the city entered by user
 * @returns {Promise<Object>} Weather data object
 */
export const fetchWeatherData = async (city) => {

  if (!city || city.trim() === "") {
    throw new Error("Please enter a city name.");
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY, // Uses the secure token variable
        units: "metric",
      },
    });

    return response.data;

  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("City not found. Please enter a valid city name.");
      }
      if (error.response.status === 401) {
        throw new Error("Invalid API Key. Please check your OpenWeatherMap API key.");
      }
      throw new Error(error.response.data.message || "Failed to fetch weather data.");
    } else if (error.request) {
      throw new Error("Network error. Please check your internet connection.");
    } else {
      throw new Error(error.message || "Something went wrong.");
    }
  }
};