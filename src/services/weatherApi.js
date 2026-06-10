// Import Axios library
// Axios is used to send HTTP requests to APIs
import axios from "axios";

// OpenWeather API base URL
// All weather requests will be sent to this URL
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Your OpenWeather API Key
// Used to authenticate requests to OpenWeather servers
const API_KEY = "cc646880c8bc6bafb40525b0d4af6c07";

/**
 * Fetch weather data from OpenWeather API
 *
 * @param {string} city - Name of the city entered by user
 * @returns {Promise<Object>} Weather data object
 */
export const fetchWeatherData = async (city) => {

  // Check if city name is empty
  // Prevent unnecessary API requests
  if (!city || city.trim() === "") {
    throw new Error("Please enter a city name.");
  }

  try {

    // Send GET request to OpenWeather API
    const response = await axios.get(BASE_URL, {

      // Query parameters added to URL automatically
      params: {

        // City name entered by user
        q: city,

        // OpenWeather API key
        appid: API_KEY,

        // Return temperature in Celsius
        units: "metric",
      },

    });

    // Return only the actual weather data
    // response.data contains API response
    return response.data;

  } catch (error) {

    // Check if server returned an error response
    if (error.response) {

      // 404 = City not found
      if (error.response.status === 404) {

        throw new Error(
          "City not found. Please enter a valid city name."
        );
      }

      // 401 = Invalid API Key
      if (error.response.status === 401) {

        throw new Error(
          "Invalid API Key. Please check your OpenWeatherMap API key."
        );
      }

      // Other API errors
      throw new Error(
        error.response.data.message ||
        "Failed to fetch weather data."
      );

    }

    // Request sent but no response received
    else if (error.request) {

      throw new Error(
        "Network error. Please check your internet connection."
      );

    }

    // Any unexpected JavaScript error
    else {

      throw new Error(
        error.message ||
        "Something went wrong."
      );

    }
  }
};