import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "cc646880c8bc6bafb40525b0d4af6c07";

/**
 * Fetch current weather data by city name
 * @param {string} city
 * @returns {Promise<Object>}
 */
export const fetchWeatherData = async (city) => {
  if (!city || city.trim() === "") {
    throw new Error("Please enter a city name.");
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
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
        throw new Error(
          "Invalid API Key. Please check your OpenWeatherMap API key."
        );
      }

      throw new Error(
        error.response.data.message || "Failed to fetch weather data."
      );
    } else if (error.request) {
      throw new Error(
        "Network error. Please check your internet connection."
      );
    } else {
      throw new Error(error.message || "Something went wrong.");
    }
  }
};