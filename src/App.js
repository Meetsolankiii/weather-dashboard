import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

// UI Layout Components
import WeatherCard from './components/WeatherCard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import Navbar from './components/Navbar'; 

// Core Subsections
import ForecastCard from './components/ForecastCard';
import HourlyForecast from './components/HourlyForecast';
import AQICard from './components/AQICard';
import SunriseSunset from './components/SunriseSunset';
import TemperatureChart from './components/TemperatureChart';
import WeatherComparison from './components/WeatherComparison';

// Administration Layout Panel
import AdminDashboard from './components/AdminDashboard';

// Authentication Interfaces
import Login from './Authentication/Login';
import Register from './Authentication/Register';

// Services Layer
import { fetchWeatherData, fetchForecastData, fetchAQIData } from './services/weatherApi';

// Firebase Modules
import { ref, get, set } from "firebase/database";
import { db } from "./firebase";

import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState(null);
  const [activeTab, setActiveTab] = useState("home"); 
  
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  // DUAL-FACTOR AUTHENTICATION STATE MACHINES
  const [isAdminVerifying, setIsAdminVerifying] = useState(false);
  const [pendingAdminData, setPendingAdminData] = useState(null);
  const [inputOtp, setInputOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [wasTabUnlockedBySearch, setWasTabUnlockedBySearch] = useState(false);
  const [deviceLocation, setDeviceLocation] = useState({
    cityName: "Loading...",
    temp: "--",
    country: ""
  });

  // Core Search Function: Automatically handles saving and deduplicating recent searches
  const handleSearch = useCallback(async (city) => {
    if (!city || city.trim() === "") return;
    setIsLoading(true);
    setError(null);
    try {
      const weather = await fetchWeatherData(city);
      const forecast = await fetchForecastData(city);
      const aqi = await fetchAQIData(weather.coord.lat, weather.coord.lon);
      
      setWeatherData(weather);
      setForecastData(forecast);
      setAqiData(aqi);
      
      setWasTabUnlockedBySearch(true);
      setActiveTab("weather");

      // RECENT SEARCH LOGIC: If a user is logged in, save history to state and database
      if (currentUser) {
        const filtered = searchHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
        const completeNewHistory = [city, ...filtered].slice(0, 5); // Limit to top 5 recent searches
        setSearchHistory(completeNewHistory);
        
        // Sync straight to Firebase node
        await set(ref(db, `history/${currentUser.username}`), completeNewHistory);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Location Not Found',
        text: `The city "${city}" could not be located inside global climate databases.`,
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, searchHistory]);

  const handleInitialLoad = useCallback(async (city) => {
    setIsLoading(true);
    try {
      const weather = await fetchWeatherData(city);
      setWeatherData(weather);
      setForecastData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fallbackToDefault = useCallback(() => {
    setDeviceLocation({ cityName: "Rajkot", temp: "39", country: "IN" });
    handleInitialLoad("Rajkot");
  }, [handleInitialLoad]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
            );
            if (response.ok) {
              const data = await response.json();
              setDeviceLocation({
                cityName: data.name,
                temp: Math.round(data.main?.temp),
                country: data.sys?.country
              });
              handleInitialLoad(data.name);
            } else {
              fallbackToDefault();
            }
          } catch (err) {
            fallbackToDefault();
          }
        },
        () => fallbackToDefault()
      );
    } else {
      fallbackToDefault();
    }
  }, [handleInitialLoad, fallbackToDefault]);

  const interceptAuthenticationRole = async (userData) => {
    if (userData.role === 'admin') {
      setIsAdminVerifying(true);
      setPendingAdminData(userData);
      setInputOtp(""); 
      
      const cryptographicOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(cryptographicOtp);

      try {
        await fetch('http://localhost:5000/api/dispatch-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userData.email,
            otp: cryptographicOtp,
            adminName: userData.fullName
          })
        });

        Swal.fire({
          icon: 'info',
          title: '2FA OTP Dispatched ✉️',
          text: `A cryptographic verification token was routed straight to verified administrative nodes. Check your inbox.`,
          confirmButtonColor: '#2563eb'
        });
      } catch (nodemailerErr) {
        console.error("Routing error:", nodemailerErr);
      }
    } else {
      finalizeUserSession(userData);
    }
  };

  const handleOtpVerificationSubmit = (e) => {
    e.preventDefault();
    if (inputOtp.trim() === generatedOtp) {
      Swal.fire({
        icon: 'success',
        title: 'Security Verified',
        text: 'Administrative clearance unlocked.',
        timer: 1500,
        showConfirmButton: false
      });
      setIsAdminVerifying(false);
      finalizeUserSession(pendingAdminData);
      setActiveTab("admin"); 
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'The entered cryptographic token does not match structural matrices.',
      });
    }
  };

  const finalizeUserSession = async (userData) => {
    const { password: _, ...safeUser } = userData;
    setCurrentUser(safeUser);
    setAuthView(null);
    setWasTabUnlockedBySearch(false);

    try {
      const historyRef = ref(db, `history/${safeUser.username}`);
      const snapshot = await get(historyRef);
      if (snapshot.exists()) {
        setSearchHistory(snapshot.val());
      }
      
      // Load user metrics dynamically based on their baseline home city node properties
      if (safeUser.defaultCity && safeUser.role !== 'admin') {
        setIsLoading(true); 
        const weather = await fetchWeatherData(safeUser.defaultCity);
        const forecast = await fetchForecastData(safeUser.defaultCity);
        const aqi = await fetchAQIData(weather.coord.lat, weather.coord.lon);
        
        setWeatherData(weather);
        setForecastData(forecast);
        setAqiData(aqi);
        
        setIsLoading(false); 
      }
    } catch (err) {
      console.error("Error auto-loading user home city arrays:", err);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSearchHistory([]);
    setAuthView(null);
    setWasTabUnlockedBySearch(false);
    setActiveTab("home");
    handleInitialLoad("Rajkot");
  };

  const clearHistoryHandler = async () => {
    if (currentUser) {
      setSearchHistory([]);
      await set(ref(db, `history/${currentUser.username}`), null);
    }
  };

  if (isAdminVerifying) {
    return (
      <div className="auth-container">
        <h1>Skyline Gatekeeper System</h1>
        <div className="auth-card bounce-in">
          <h2>Two-Factor Admin Verification</h2>
          <p style={{color: '#64748b', marginBottom: '20px'}}>Enter the secure code token channeled down your administrative email relay grid node.</p>
          <form onSubmit={handleOtpVerificationSubmit} className="auth-form">
            <div className="input-group">
              <label>Secure 6-Digit Pin Matrix</label>
              <input 
                type="text" 
                maxLength="6" 
                placeholder="••••••" 
                value={inputOtp}
                style={{textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem'}}
                onChange={(e) => setInputOtp(e.target.value)} 
              />
            </div>
            <button type="submit" className="auth-btn">Verify Access Clearance</button>
            <button type="button" className="auth-bypass-btn" onClick={() => setIsAdminVerifying(false)}>Cancel Portal Request</button>
          </form>
        </div>
      </div>
    );
  }

  if (authView === 'login' || authView === 'register') {
    return (
      <div className="auth-container">
        <h1 onClick={() => { setAuthView(null); setActiveTab("home"); }} style={{ cursor: 'pointer' }}>
          Skyline Weather
        </h1>
        <div className="auth-card">
          {authView === 'login' ? (
            <Login onLoginSuccess={interceptAuthenticationRole} onSwitchToRegister={() => setAuthView('register')} />
          ) : (
            <Register onSwitchToLogin={() => setAuthView('login')} />
          )}
          <button className="auth-bypass-btn" onClick={() => { setAuthView(null); setActiveTab("home"); }}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Navbar component cleanly wrapping our search metrics and histories dropdown variables */}
      {activeTab !== "admin" && (
        <Navbar 
          currentUser={currentUser} 
          onLogout={currentUser ? handleLogout : () => setAuthView('login')} 
          onSearch={handleSearch}
          isLoading={isLoading}
          activeTab={activeTab}
          setActiveTab={(target) => {
            if (!currentUser && target !== "home") setWasTabUnlockedBySearch(false);
            setActiveTab(target);
          }}
          searchHistory={searchHistory}
          onClearHistory={clearHistoryHandler}
        />
      )}

      {activeTab === "admin" && currentUser?.role === "admin" && (
        <div className="admin-top-logout-strip">
          <span>Logged in as Admin Matrix: <strong>{currentUser.fullName}</strong></span>
          <button className="admin-exit-btn" onClick={handleLogout}>Secure Log Out</button>
        </div>
      )}

      <main className="dashboard-main">
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}

        <div className="tabbed-content-container">
          
          {activeTab === "home" && (
            <div className="fade-in-tab-view home-view-wrapper">
              <div className="welcome-hero-banner">
                <h2>Welcome to Skyline Atmospheric Core Center ✨</h2>
                <p>Real-time analytics engine tracking dynamic microclimate variants, structural air tracking grids, and long-range high-precision forecast models.</p>
              </div>

              {!currentUser && (
                <div className="hero-marketing-panel">
                  <div className="hero-accent-blur"></div>
                  <h2>Unlock Personalized Engineering Features 🚀</h2>
                  <p>Register a standard user account to map custom localized default coordinates, track continuous session query history matrices, and secure immediate severe alerts.</p>
                  <button className="hero-cta-button" onClick={() => setAuthView('login')}>Secure Free Profile</button>
                </div>
              )}

              <div className="quick-glance-grid">
                <div className="feature-info-card physical-tracker-highlight">
                  <h4>📍 Real-Time Physical Device Position</h4>
                  <h3>{deviceLocation.cityName}{deviceLocation.country ? `, ${deviceLocation.country}` : ''}</h3>
                  <p>Your hardware sensor environment is currently registering temperatures at <strong>{deviceLocation.temp}°C</strong>.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "weather" && (
            <div className="fade-in-tab-view">
              {currentUser || wasTabUnlockedBySearch ? (
                weatherData ? (
                  <>
                    <WeatherCard data={weatherData} />
                    <SunriseSunset weather={weatherData} />
                    <AQICard aqi={aqiData} />
                  </>
                ) : (
                  <div className="forecast-locked-notice">
                    <h3>📊 Initializing Weather Tracking Workspace</h3>
                    <p>Please utilize the tracking look-up input field above to parse climate metrics for your requested destination city area.</p>
                  </div>
                )
              ) : (
                <div className="forecast-locked-notice">
                  <h3>🔒 Weather Analytics Matrix Locked</h3>
                  <p>To view comprehensive weather metrics, please sign into your profile or perform a city look-up above.</p>
                  <button className="hero-cta-button" style={{ marginTop: '15px' }} onClick={() => setAuthView('login')}>Sign Into Profile</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "forecast" && (
            <div className="fade-in-tab-view">
              {currentUser || wasTabUnlockedBySearch ? (
                forecastData ? (
                  <>
                    <HourlyForecast forecast={forecastData} />
                    <ForecastCard forecast={forecastData} />
                    <TemperatureChart forecast={forecastData} />
                  </>
                ) : (
                  <div className="forecast-locked-notice">
                    <h3>📊 Ready to Analyze Weather Telemetry</h3>
                    <p>Please enter a city target in the top search terminal field to generate your localized meteorological charts and forecast models.</p>
                  </div>
                )
              ) : (
                <div className="forecast-locked-notice">
                  <h3>🔒 Long-Range Forecast Matrix Locked</h3>
                  <p>To view the comprehensive meteorological forecast dataset, please sign into your account profile or search above.</p>
                  <button className="hero-cta-button" style={{ marginTop: '15px' }} onClick={() => setAuthView('login')}>Sign Into Profile</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "compare" && (
            <div className="fade-in-tab-view">
              <WeatherComparison />
            </div>
          )}

          {activeTab === "admin" && currentUser?.role === "admin" && (
            <div className="fade-in-tab-view">
              <AdminDashboard />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;