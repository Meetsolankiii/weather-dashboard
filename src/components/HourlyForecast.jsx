import React from "react";

const HourlyForecast = ({ forecast }) => {

  if (!forecast || !forecast.list) return null;

  return (

    <div className="hourly-card">

      <h3>Hourly Forecast</h3>

      <div className="hourly-grid">

        {forecast.list.slice(0, 8).map((item, index) => (

          <div
            key={index}
            className="hourly-item"
          >

            <p>
              {new Date(
                item.dt * 1000
              ).toLocaleTimeString(
                [],
                {
                  hour: "numeric"
                }
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

export default HourlyForecast;