import React from 'react';

const WeatherCard = ({ data }) => {
  if (!data) return null;

  const { name, sys, main, weather, wind } = data;

  const tempCelsius = Math.round(main.temp);
  const tempFahrenheit = Math.round((main.temp * 9) / 5 + 32);

  const weatherDescription = weather[0]?.description;
  const iconCode = weather[0]?.icon;

  return (
    <div className="weather-card">

      {/* Header */}
      <div className="card-header">
        <div>
          <h2>
            {name}, {sys.country}
          </h2>
          <p className="weather-desc">
            {weatherDescription}
          </p>
        </div>

        {iconCode && (
          <img
            src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
            alt={weatherDescription}
            className="weather-icon"
          />
        )}
      </div>

      {/* Temperature Section */}
      <div className="temperature-section">

        <div className="main-temp">
          {tempCelsius}
          <span>°C</span>
        </div>

        <div className="temp-separator">|</div>

        <div className="secondary-temp">
          {tempFahrenheit}
          <span>°F</span>
        </div>

      </div>

      {/* Weather Details */}
      <div className="details-grid">

        <div className="detail-item">
          <span className="detail-label">
            Humidity
          </span>

          <span className="detail-value">
            {main.humidity}%
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            Wind Speed
          </span>

          <span className="detail-value">
            {wind.speed} m/s
          </span>
        </div>

      </div>

    </div>
  );
};

export default WeatherCard;