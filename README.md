# 🌦️ Skyline Weather Dashboard

A modern and responsive weather dashboard built with **React.js**, **Firebase Realtime Database**, and **OpenWeather API**.

## 🚀 Features

### Authentication System
- User Registration
- User Login
- Firebase Realtime Database Integration
- SweetAlert2 Notifications

### Weather Dashboard
- Real-time Weather Data
- Temperature (°C & °F)
- Humidity
- Wind Speed
- Dynamic Weather Icons

### Advanced Weather Features
- 7-Day Forecast
- Hourly Forecast
- Air Quality Index (AQI)
- Sunrise & Sunset Information
- Smart Weather Recommendations
- Weather Comparison Between Cities
- Temperature Charts & Analytics

### Search History
- Last 5 Searches
- User-Specific History
- Firebase Sync

## 📂 Project Structure

src/
├── Authentication/
│   ├── Login.js
│   └── Register.js
├── components/
│   ├── SearchBar.js
│   ├── WeatherCard.js
│   ├── SearchHistory.js
│   ├── Loader.js
│   ├── ErrorMessage.js
│   ├── ForecastCard.jsx
│   ├── HourlyForecast.jsx
│   ├── AQICard.jsx
│   ├── SunriseSunset.jsx
│   ├── WeatherTips.jsx
│   ├── TemperatureChart.jsx
│   └── WeatherComparison.jsx
├── services/
│   └── weatherApi.js
├── firebase.js
├── App.js
└── App.css

## 🛠️ Tech Stack

- React.js
- Firebase Realtime Database
- OpenWeather API
- SweetAlert2
- Chart.js
- Git & GitHub
- Vercel

## ⚙️ Installation

```bash
git clone https://github.com/Meetsolankiii/weather-dashboard.git
cd weather-dashboard
npm install
npm start
```

## 🔑 Environment Variables

Create a `.env` file:

```env
REACT_APP_OPENWEATHER_API_KEY=YOUR_API_KEY

REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_DATABASE_URL=YOUR_FIREBASE_DATABASE_URL
REACT_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

## 🌐 Deployment

Deploy easily using Vercel:

1. Push code to GitHub
2. Import repository into Vercel
3. Add Environment Variables
4. Deploy

## 🔮 Future Enhancements

- Dark / Light Theme
- Favorite Cities
- Weather Maps
- Severe Weather Alerts
- Multi-Language Support
- PWA Support

## 👨‍💻 Author

**Meet Solanki**

Computer Engineering Student

GitHub: https://github.com/Meetsolankiii

## 📄 License

Educational and Portfolio Use.
