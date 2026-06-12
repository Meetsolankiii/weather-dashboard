import React from "react";
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

const WeatherTips = ({ weather, currentUser }) => {
  if (!weather) return null;

  const temp = weather.main?.temp;
  const condition = weather.weather[0]?.main?.toLowerCase() || "";

  let alertConfig = {
    title: "Normal Baseline Conditions",
    message: "Weather parameters are stable inside nominal parameters across your area.",
    type: "info",
    icon: <FaCheckCircle style={{ color: "#22c55e" }} />
  };

  // ADVANCED ALERTER CONDITIONAL BRANCH MATRIX
  if (temp > 35) {
    alertConfig = {
      title: "CRITICAL ALERT: Extreme Thermal Threat",
      message: "Severe high-temperature spikes detected. Restrict exposure windows and maintain immediate hydration cycles.",
      type: "danger",
      icon: <FaExclamationTriangle className="pulse-icon" style={{ color: "#ef4444" }} />
    };
  } else if (temp < 10) {
    alertConfig = {
      title: "ENVIRONMENTAL WARNING: Hypothermic Index Spike",
      message: "Sub-optimal thermal range observed. Layer insulating shielding before pursuing continuous outdoor tasks.",
      type: "warning",
      icon: <FaExclamationTriangle style={{ color: "#f59e0b" }} />
    };
  } else if (condition.includes("rain") || condition.includes("thunderstorm")) {
    alertConfig = {
      title: "ACTIVE SYSTEM ADVISORY: Moisture Front Ingress",
      message: "Precipitation channels opening up. Secure waterproof composite gear or track coverage arrays immediately.",
      type: "warning",
      icon: <FaInfoCircle style={{ color: "#3b82f6" }} />
    };
  } else if (condition.includes("cloud")) {
    alertConfig = {
      title: "Atmospheric Forecast Notice",
      message: "Cumulus cloud shading layer active. Excellent ambient balance context for ongoing physical execution pipelines.",
      type: "info",
      icon: <FaCheckCircle style={{ color: "#10b981" }} />
    };
  }

  return (
    <div className={`alert-toast-card status-${alertConfig.type} shadow-transition`}>
      <div className="alert-toast-header">
        {alertConfig.icon}
        <h4>{alertConfig.title}</h4>
      </div>
      <p className="alert-toast-body">{alertConfig.message}</p>
      {currentUser && (
        <span className="secure-profile-tag">
          🛡️ Profile Verified Protection Enabled for {currentUser.fullName}
        </span>
      )}
    </div>
  );
};

export default WeatherTips;