import React, { useState } from "react";
import Swal from "sweetalert2";
import { fetchWeatherData } from "../services/weatherApi";

const WeatherComparison = () => {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");

  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);

  const compareWeather = async () => {

    if (!city1.trim() || !city2.trim()) {

      Swal.fire({
        icon: "warning",
        title: "Missing Cities",
        text: "Please enter both city names.",
        confirmButtonColor: "#3085d6",
      });

      return;
    }

    try {

      const weather1 = await fetchWeatherData(city1);
      const weather2 = await fetchWeatherData(city2);

      setData1(weather1);
      setData2(weather2);

      Swal.fire({
        icon: "success",
        title: "Comparison Ready",
        text: `${weather1.name} and ${weather2.name} weather loaded successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {

      setData1(null);
      setData2(null);

      Swal.fire({
        icon: "error",
        title: "City Not Found",
        text:
          err.message ||
          "One or both city names are invalid. Please enter valid city names.",
        confirmButtonColor: "#d33",
      });

    }
  };

  return (
    <div className="compare-card">

      <h3>Compare Cities</h3>

      <input
        type="text"
        placeholder="City 1"
        value={city1}
        onChange={(e) => setCity1(e.target.value)}
      />

      <input
        type="text"
        placeholder="City 2"
        value={city2}
        onChange={(e) => setCity2(e.target.value)}
      />

      <button onClick={compareWeather}>
        Compare
      </button>

      {data1 && data2 && (
        <div className="comparison-results">

          <div className="city-box">
            <h4>{data1.name}</h4>
            <p>🌡 Temp: {data1.main.temp}°C</p>
            <p>💧 Humidity: {data1.main.humidity}%</p>
            <p>🌬 Wind: {data1.wind.speed} m/s</p>
          </div>

          <div className="city-box">
            <h4>{data2.name}</h4>
            <p>🌡 Temp: {data2.main.temp}°C</p>
            <p>💧 Humidity: {data2.main.humidity}%</p>
            <p>🌬 Wind: {data2.wind.speed} m/s</p>
          </div>

        </div>
      )}

    </div>
  );
};

export default WeatherComparison;