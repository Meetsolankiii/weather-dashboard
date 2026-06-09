import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import SearchHistory from './components/SearchHistory';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { fetchWeatherData } from './services/weatherApi';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Update localStorage whenever searchHistory changes
  const updateHistory = (city) => {
    setSearchHistory((prevHistory) => {
      // Remove city if it already exists to avoid duplicates and push to top
      const filtered = prevHistory.filter((item) => item.toLowerCase() !== city.toLowerCase());
      const newHistory = [city, ...filtered].slice(0, 5); // Keep max 5 items
      localStorage.setItem('weatherSearchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = async (city) => {
    setIsLoading(true);
    setError(null);
    setWeatherData(null); // Hide previous weather data while loading

    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
      // Use the actual name returned by the API for consistent formatting
      updateHistory(data.name);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Skyline Weather</h1>
        <p>Real-time atmospheric insights</p>
      </header>

      <main className="dashboard-main">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {weatherData && !isLoading && <WeatherCard data={weatherData} />}

        <SearchHistory history={searchHistory} onHistoryItemClick={handleSearch} />
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Skyline Dashboard. Built with React.</p>
      </footer>
    </div>
  );
};

export default App;