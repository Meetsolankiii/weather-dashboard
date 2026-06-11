import React from "react";

const AQICard = ({ aqi }) => {

  if (!aqi) return null;

  const labels = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor"
  };

  const value = aqi.list[0].main.aqi;

  return (

    <div className="aqi-card">

      <h3>Air Quality Index</h3>

      <h1>{value}</h1>

      <p>{labels[value]}</p>

    </div>

  );

};

export default AQICard;