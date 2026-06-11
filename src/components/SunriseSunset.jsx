import React from "react";

const SunriseSunset = ({ weather }) => {

  if (!weather) return null;

  const sunrise =
    new Date(
      weather.sys.sunrise * 1000
    ).toLocaleTimeString();

  const sunset =
    new Date(
      weather.sys.sunset * 1000
    ).toLocaleTimeString();

  return (

    <div className="sun-card">

      <h3>Sunrise & Sunset</h3>

      <p>
        🌅 Sunrise: {sunrise}
      </p>

      <p>
        🌇 Sunset: {sunset}
      </p>

    </div>

  );

};

export default SunriseSunset;