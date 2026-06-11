import React, { useState } from 'react';

// UI Components
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import SearchHistory from './components/SearchHistory';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

// New Components
import ForecastCard from './components/ForecastCard';
import HourlyForecast from './components/HourlyForecast';
import AQICard from './components/AQICard';
import SunriseSunset from './components/SunriseSunset';
import WeatherTips from './components/WeatherTips';
import TemperatureChart from './components/TemperatureChart';
import WeatherComparison from './components/WeatherComparison';

// Authentication
import Login from './Authentication/Login';
import Register from './Authentication/Register';

// Weather API
import {
  fetchWeatherData,
  fetchForecastData,
  fetchAQIData
} from './services/weatherApi';

// Firebase
import { ref, get, set } from "firebase/database";
import { db } from "./firebase";

import './App.css';

const App = () => {

  const [currentUser, setCurrentUser] =
    useState(null);

  const [authView, setAuthView] =
    useState('login');

  const [weatherData, setWeatherData] =
    useState(null);

  const [forecastData, setForecastData] =
    useState(null);

  const [aqiData, setAqiData] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [searchHistory, setSearchHistory] =
    useState([]);

  // =====================================
  // Login Success
  // =====================================
  const handleLoginSuccess = async (
    userData
  ) => {

    const {
      password: _,
      ...safeUser
    } = userData;

    setCurrentUser(safeUser);

    try {

      const historyRef = ref(
        db,
        `history/${safeUser.username}`
      );

      const snapshot =
        await get(historyRef);

      if (snapshot.exists()) {

        setSearchHistory(
          snapshot.val()
        );

      }

      await handleSearch(
        safeUser.defaultCity
      );

    } catch (err) {

      console.error(err);

    }

  };

  // =====================================
  // Logout
  // =====================================
  const handleLogout = () => {

    setCurrentUser(null);

    setWeatherData(null);

    setForecastData(null);

    setAqiData(null);

    setSearchHistory([]);

    setError(null);

    setAuthView('login');

  };

  // =====================================
  // Update History
  // =====================================
  const updateHistoryOnFirebase =
    async (
      city,
      currentHistoryList
    ) => {

      if (!currentUser) return;

      const filtered =
        currentHistoryList.filter(
          item =>
            item.toLowerCase() !==
            city.toLowerCase()
        );

      const completeNewHistory =
        [city, ...filtered].slice(
          0,
          5
        );

      setSearchHistory(
        completeNewHistory
      );

      try {

        await set(
          ref(
            db,
            `history/${currentUser.username}`
          ),
          completeNewHistory
        );

      } catch (err) {

        console.error(err);

      }

    };

  // =====================================
  // Search Weather
  // =====================================
  const handleSearch = async (
    city
  ) => {

    setIsLoading(true);

    setError(null);

    try {

      const weather =
        await fetchWeatherData(
          city
        );

      setWeatherData(weather);

      const forecast =
        await fetchForecastData(
          city
        );

      setForecastData(
        forecast
      );

      const aqi =
        await fetchAQIData(
          weather.coord.lat,
          weather.coord.lon
        );

      setAqiData(aqi);

      if (currentUser) {

        await updateHistoryOnFirebase(
          weather.name,
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

  // =====================================
  // Authentication Screen
  // =====================================
  if (!currentUser) {

    return (

      <div className="auth-container">

        <h1>
          Skyline Weather
        </h1>

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
                    setAuthView(
                      'register'
                    )
                  }
                />
              )
              : (
                <Register
                  onSwitchToLogin={() =>
                    setAuthView(
                      'login'
                    )
                  }
                />
              )
          }

        </div>

      </div>

    );

  }

  // =====================================
  // Dashboard
  // =====================================
  return (

    <div className="app">

      <header className="dashboard-header">

        <div>

          <h2>
            Welcome,
            {" "}
            {currentUser.fullName}
          </h2>

          <p>
            Home City:
            {" "}
            {currentUser.defaultCity}
          </p>

        </div>

        <button
          className="logout-btn"
          onClick={
            handleLogout
          }
        >
          Log Out
        </button>

      </header>

      <main className="dashboard-main">

        <SearchBar
          onSearch={
            handleSearch
          }
          isLoading={
            isLoading
          }
        />

        {isLoading &&
          <Loader />
        }

        {error && (
          <ErrorMessage
            message={error}
          />
        )}

        {weatherData &&
          !isLoading && (
            <>
              <WeatherCard
                data={weatherData}
              />

              <SunriseSunset
                weather={weatherData}
              />

              <WeatherTips
                weather={weatherData}
              />

              <AQICard
                aqi={aqiData}
              />

              <HourlyForecast
                forecast={
                  forecastData
                }
              />

              <ForecastCard
                forecast={
                  forecastData
                }
              />

              <TemperatureChart
                forecast={
                  forecastData
                }
              />
            </>
          )
        }

        <WeatherComparison />

        <SearchHistory
          history={
            searchHistory
          }
          onHistoryItemClick={
            handleSearch
          }
        />

      </main>

    </div>

  );

};

export default App;