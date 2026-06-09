import React from 'react';

const WeatherCard = ({ data }) => {
  if (!data) return null;

  const { name, sys, main, weather, wind } = data;
  const tempCelsius = Math.round(main.temp);
  // Convert Celsius to Fahrenheit: (C * 9/5) + 32
  const tempFahrenheit = Math.round((main.temp * 9) / 5 + 32);
  const weatherDescription = weather[0]?.description;
  const iconCode = weather[0]?.icon;

  return (
    <div className="weather-card animate-fade-in">
      <div className="card-header">
        <h2>
          {name}, <span className="country-code">{sys.country}</span>
        </h2>
        {iconCode && (
          <img
            src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
            alt={weatherDescription}
            className="weather-icon"
          />
        )}
      </div>

      <p className="weather-desc">{weatherDescription}</p>

      <div className="temp-container">
        <div className="temp-box">
          <span className="temp-val">{tempCelsius}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="temp-divider"></div>
        <div className="temp-box">
          <span className="temp-val">{tempFahrenheit}</span>
          <span className="temp-unit">°F</span>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{wind.speed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;