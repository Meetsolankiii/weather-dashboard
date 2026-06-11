import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
}
from "recharts";

const TemperatureChart = ({ forecast }) => {

  if (!forecast || !forecast.list)
    return null;

  const chartData =
    forecast.list.slice(0, 8).map(
      (item) => ({
        time: new Date(
          item.dt * 1000
        ).getHours(),
        temp: item.main.temp
      })
    );

  return (

    <div className="chart-card">

      <h3>Temperature Trend</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart
          data={chartData}
        >

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="temp"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

};

export default TemperatureChart;