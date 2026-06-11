import React, { useState } from 'react';

// UI Components
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import SearchHistory from './components/SearchHistory';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

// Authentication Components
import Login from './Authentication/Login';
import Register from './Authentication/Register';

// Weather API
import { fetchWeatherData } from './services/weatherApi';

// Firebase
import { ref, get, set } from "firebase/database";
import { db } from "./firebase";

import './App.css';

const App = () => {

  // Logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  // login / register screen
  const [authView, setAuthView] = useState('login');

  // Weather data
  const [weatherData, setWeatherData] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  // Search history
  const [searchHistory, setSearchHistory] = useState([]);

  // ==========================================================
  // Load user-specific information
  // ==========================================================
  const loadUserData = async (user) => {

    // Automatically load weather of user's default city
    handleSearch(user.defaultCity);

    try {

      const historyRef = ref(
        db,
        `history/${user.username}`
      );

      const snapshot = await get(historyRef);

      if (snapshot.exists()) {

        setSearchHistory(snapshot.val());

      } else {

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
// Login Success
// ==========================================================
const handleLoginSuccess = async (userData) => {

  // Remove password
  const { password: _, ...safeUser } = userData;

  // Set logged in user
  setCurrentUser(safeUser);

  try {

    // Load search history
    const historyRef = ref(
      db,
      `history/${safeUser.username}`
    );

    const snapshot = await get(historyRef);

    if (snapshot.exists()) {

      setSearchHistory(snapshot.val());

    } else {

      setSearchHistory([]);

    }

    // Load default city weather
    const data =
      await fetchWeatherData(
        safeUser.defaultCity
      );

    setWeatherData(data);

  } catch (err) {

    console.error(
      "Error loading user data:",
      err
    );

  }

};

  // ==========================================================
  // Logout
  // ==========================================================
  const handleLogout = () => {

    setCurrentUser(null);

    setWeatherData(null);

    setSearchHistory([]);

    setError(null);

    setAuthView('login');

  };

  // ==========================================================
  // Update Search History
  // ==========================================================
  const updateHistoryOnFirebase = async (
    city,
    currentHistoryList
  ) => {

    if (!currentUser) return;

    const filtered =
      currentHistoryList.filter(
        item =>
          item.toLowerCase() !== city.toLowerCase()
      );

    const completeNewHistory =
      [city, ...filtered].slice(0, 5);

    setSearchHistory(completeNewHistory);

    try {

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
  // Search Weather
  // ==========================================================
  const handleSearch = async (city) => {

    setIsLoading(true);

    setError(null);

    setWeatherData(null);

    try {

      const data =
        await fetchWeatherData(city);

      setWeatherData(data);

      if (currentUser) {

        await updateHistoryOnFirebase(
          data.name,
          searchHistory
        );

      }

    } catch (err) {

      setError(
        err.message ||
        'Something went wrong.'
      );

    } finally {

      setIsLoading(false);

    }

  };

  // ==========================================================
  // Authentication Screen
  // ==========================================================
  if (!currentUser) {

    return (

      <div className="auth-container">

        <h1>Skyline Weather</h1>

        <p>
          Real-time atmospheric insights
        </p>

        <div className="auth-card">

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

      </div>

    );

  }

  // ==========================================================
  // Dashboard
  // ==========================================================
  return (

    <div className="app">

      <header className="dashboard-header">

        <div>

          <h2>
            Welcome, {currentUser.fullName}
          </h2>

          <p>
            Home City: {currentUser.defaultCity}
          </p>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Log Out
        </button>

      </header>

      <main className="dashboard-main">

        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {isLoading && <Loader />}

        {error && (
          <ErrorMessage
            message={error}
          />
        )}

        {
          weatherData &&
          !isLoading && (
            <WeatherCard
              data={weatherData}
            />
          )
        }

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