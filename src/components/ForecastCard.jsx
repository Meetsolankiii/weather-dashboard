import React from "react";

const ForecastCard = ({ forecast }) => {

  if (!forecast || !forecast.list) return null;

  const dailyForecast = forecast.list.filter(
    (_, index) => index % 8 === 0
  );

  return (
    <div className="forecast-card">
      <h3>7-Day Forecast</h3>

      <div className="forecast-grid">

        {dailyForecast.slice(0, 7).map((item, index) => (

          <div
            key={index}
            className="forecast-item"
          >

            <p>
              {new Date(
                item.dt * 1000
              ).toLocaleDateString(
                "en-US",
                { weekday: "short" }
              )}
            </p>

            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
              alt=""
            />

            <p>
              {Math.round(item.main.temp)}°C
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ForecastCard;