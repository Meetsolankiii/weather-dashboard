import React, { useState, useEffect } from 'react';

// UI Components used in dashboard
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import SearchHistory from './components/SearchHistory';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

// Authentication Components
import Login from './Authentication/Login';
import Register from './Authentication/Register';

// Weather API function
import { fetchWeatherData } from './services/weatherApi';

// Firebase Realtime Database functions
import { ref, get, set } from "firebase/database";
import { db } from "./firebase";

import './App.css';

const App = () => {

  // Stores currently logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  // Controls whether Login or Register screen is shown
  const [authView, setAuthView] = useState('login');

  // Stores weather information received from OpenWeather API
  const [weatherData, setWeatherData] = useState(null);

  // Controls loading spinner while API request is running
  const [isLoading, setIsLoading] = useState(false);

  // Stores API or Firebase error messages
  const [error, setError] = useState(null);

  // Stores last 5 searched cities
  const [searchHistory, setSearchHistory] = useState([]);

  // ==========================================================
  // Runs once when application starts
  // Checks if user session exists in localStorage
  // ==========================================================
  useEffect(() => {

    const savedUser = localStorage.getItem('fb_weather_session');

    if (savedUser) {

      // Convert JSON string back to JavaScript object
      const parsedUser = JSON.parse(savedUser);

      // Restore logged-in user
      setCurrentUser(parsedUser);

      // Load user's weather and search history
      loadUserData(parsedUser);
    }

  }, []);

  // ==========================================================
  // Load user-specific information
  // ==========================================================
  const loadUserData = async (user) => {

    // Automatically load weather of user's default city
    handleSearch(user.defaultCity);

    try {

      // Read search history from Firebase
      const historyRef = ref(
        db,
        `history/${user.username}`
      );

      const snapshot = await get(historyRef);

      if (snapshot.exists()) {

        // Load history into state
        setSearchHistory(snapshot.val());

      } else {

        // No history found
        setSearchHistory([]);

      }

    } catch (err) {

      console.error(
        "Error reading history from Firebase:",
        err
      );

    }
  };

  // ==========================================================
  // Called after successful login
  // ==========================================================
  const handleLoginSuccess = (userData) => {

    // Remove password before storing session
    const { password: _, ...safeUser } = userData;

    // Save session into browser localStorage
    localStorage.setItem(
      'fb_weather_session',
      JSON.stringify(safeUser)
    );

    // Set logged-in user
    setCurrentUser(safeUser);

    // Load user's weather and history
    loadUserData(safeUser);
  };

  // ==========================================================
  // Logout user
  // ==========================================================
  const handleLogout = () => {

    // Remove stored session
    localStorage.removeItem('fb_weather_session');

    // Clear user information
    setCurrentUser(null);

    // Clear weather card
    setWeatherData(null);

    // Clear search history
    setSearchHistory([]);
  };

  // ==========================================================
  // Save search history into Firebase
  // ==========================================================
  const updateHistoryOnFirebase = async (
    city,
    currentHistoryList
  ) => {

    // Do nothing if no user is logged in
    if (!currentUser) return;

    // Remove duplicate city names
    const filtered =
      currentHistoryList.filter(
        item =>
          item.toLowerCase() !== city.toLowerCase()
      );

    // Add latest city at top and keep only 5 records
    const completeNewHistory =
      [city, ...filtered].slice(0, 5);

    // Update UI instantly
    setSearchHistory(completeNewHistory);

    try {

      // Save updated history to Firebase
      await set(
        ref(
          db,
          `history/${currentUser.username}`
        ),
        completeNewHistory
      );

    } catch (err) {

      console.error(
        "Error writing history to Firebase:",
        err
      );

    }
  };

  // ==========================================================
  // Main Weather Search Function
  // ==========================================================
  const handleSearch = async (city) => {

    // Start loading state
    setIsLoading(true);

    // Clear old errors
    setError(null);

    // Clear previous weather data
    setWeatherData(null);

    try {

      // Call OpenWeather API
      const data =
        await fetchWeatherData(city);

      // Store weather information
      setWeatherData(data);

      // Save search history if user is logged in
      if (currentUser) {

        await updateHistoryOnFirebase(
          data.name,
          searchHistory
        );

      }

    } catch (err) {

      // Show API error
      setError(
        err.message ||
        'Something went wrong.'
      );

    } finally {

      // Stop loading spinner
      setIsLoading(false);

    }
  };

  // ==========================================================
  // Show Authentication Screen
  // ==========================================================
  if (!currentUser) {

    return (

      <div className="auth-container">

        <h1>Skyline Weather</h1>
        <p>Real-time atmospheric insights</p>

        {
          authView === 'login'
            ? (
              <Login
                onLoginSuccess={
                  handleLoginSuccess
                }
                onSwitchToRegister={() =>
                  setAuthView('register')
                }
              />
            )
            : (
              <Register
                onSwitchToLogin={() =>
                  setAuthView('login')
                }
              />
            )
        }

      </div>
    );
  }

  // ==========================================================
  // Show Dashboard After Login
  // ==========================================================
  return (

    <div className="app">

      <header className="dashboard-header">

        <div>
          <h2>
            Welcome, {currentUser.fullName}
          </h2>

          <p>
            Home Node:
            {currentUser.defaultCity}
          </p>
        </div>

        <button
          onClick={handleLogout}
        >
          Log Out
        </button>

      </header>

      <main className="dashboard-main">

        {/* Search City Component */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Loading Spinner */}
        {isLoading && <Loader />}

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
          />
        )}

        {/* Weather Result */}
        {weatherData &&
          !isLoading && (
            <WeatherCard
              data={weatherData}
            />
        )}

        {/* Search History */}
        <SearchHistory
          history={searchHistory}
          onHistoryItemClick={
            handleSearch
          }
        />

      </main>

    </div>
  );
};

export default App;