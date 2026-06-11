import React from "react";

const WeatherTips = ({ weather }) => {

  if (!weather) return null;

  const temp = weather.main.temp;

  const condition =
    weather.weather[0].main.toLowerCase();

  let tip = "Enjoy your day.";

  if (temp > 35)
    tip = "Stay hydrated and avoid direct sunlight.";

  else if (temp < 10)
    tip = "Wear warm clothing.";

  else if (
    condition.includes("rain")
  )
    tip = "Carry an umbrella.";

  else if (
    condition.includes("cloud")
  )
    tip = "Great weather for outdoor walks.";

  return (

    <div className="tips-card">

      <h3>Weather Recommendation</h3>

      <p>{tip}</p>

    </div>

  );

};

export default WeatherTips;