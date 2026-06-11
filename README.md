# 🌦️ Skyline Weather Dashboard

A modern and responsive weather dashboard built with **React.js**, **Firebase Realtime Database**, and **OpenWeather API**. This application allows users to create accounts, log in securely, search weather information for cities worldwide, and maintain personalized search history.

---


---

# 🚀 Features

## Authentication System

* User Registration
* User Login
* Firebase Realtime Database Integration
* Secure User Validation
* SweetAlert2 Success & Error Notifications

## Weather Dashboard

* Search weather by city name
* Real-time weather information
* Temperature in Celsius (°C)
* Temperature in Fahrenheit (°F)
* Humidity Information
* Wind Speed Information
* Dynamic Weather Icons
* Responsive Weather Display

## Search History

* Stores last 5 searched cities
* Firebase Database Integration
* Quick city re-search functionality
* User-specific history records

## User Experience

* Modern UI Design
* Responsive Layout
* Mobile-Friendly Interface
* Loading Indicators
* Error Handling System

---

# 🏗️ System Architecture

User
 │
 ▼
React Frontend
 │
 ├── Firebase Realtime Database
 │       ├── Users
 │       └── Search History
 │
 └── OpenWeather API
         └── Live Weather Data
```

### Workflow

1. User logs into the application.
2. React frontend validates credentials through Firebase.
3. User searches a city.
4. OpenWeather API returns weather data.
5. Weather information is displayed on dashboard.
6. Search history is stored in Firebase.
7. User can access previous searches instantly.

---

# 📂 Project Structure

weather-dashboard/
│
├── public/
│
├── src/
│   │
│   ├── Authentication/
│   │   ├── Login.js
│   │   └── Register.js
│   │
│   ├── components/
│   │   ├── SearchBar.js
│   │   ├── WeatherCard.js
│   │   ├── SearchHistory.js
│   │   ├── Loader.js
│   │   └── ErrorMessage.js
│   │
│   ├── services/
│   │   └── weatherApi.js
│   │
│   ├── firebase.js
│   ├── App.js
│   ├── App.css
│   └── index.js
│
├── .env
├── package.json
├── package-lock.json
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript (ES6+)
* CSS3

## Backend Services

* Firebase Realtime Database

## APIs

* OpenWeather API

## Libraries

* SweetAlert2

## Version Control

* Git
* GitHub

## Deployment

* Vercel

---

# 📚 Module Documentation

## Login Module

### Purpose

Authenticate existing users.

### Responsibilities

* Validate username and password
* Read user records from Firebase
* Show success/error alerts
* Redirect authenticated users to dashboard

---

## Registration Module

### Purpose

Create new user accounts.

### Responsibilities

* Validate user input
* Check duplicate usernames
* Store user data in Firebase
* Redirect user to login page after successful registration

---

## Search Module

### Purpose

Fetch weather information.

### Responsibilities

* Accept city name
* Call OpenWeather API
* Handle API errors
* Pass data to WeatherCard component

---

## Weather Card Module

### Purpose

Display weather details.

### Information Displayed

* City Name
* Country
* Weather Description
* Weather Icon
* Temperature (°C)
* Temperature (°F)
* Humidity
* Wind Speed

---

## Search History Module

### Purpose

Maintain user search records.

### Responsibilities

* Save searched cities
* Prevent duplicate entries
* Store only latest 5 searches
* Sync with Firebase

---

## Loader Module

### Purpose

Provide visual feedback while API requests are processing.

---

## Error Module

### Purpose

Display user-friendly error messages for API and Firebase failures.

---

# ⚙️ Installation

## Step 1: Clone Repository

```bash
git clone https://github.com/Meetsolankiii/weather-dashboard.git
```

## Step 2: Open Project Folder

```bash
cd weather-dashboard
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Create Environment Variables

Create a `.env` file in the root directory.

## Step 5: Start Development Server

```bash
npm start
```

Application will start on:

```text
http://localhost:3000
```

---

# ▶️ Usage

## User Registration

1. Open application.
2. Click Register Here.
3. Enter:

   * Full Name
   * Username
   * Password
   * Default Home City
4. Click Sign Up.

---

## User Login

1. Enter username.
2. Enter password.
3. Click Log In.
4. Dashboard opens after successful authentication.

---

## Weather Search

1. Enter city name.
2. Click Search.
3. Weather information appears instantly.

---

## Search History

1. Previously searched cities appear below.
2. Click any city to search again instantly.

---

# 📊 Output & Reporting

## Registration Output

* New user profile created in Firebase.

## Login Output

* User successfully authenticated.

## Weather Output

Displays:

* City Name
* Country Code
* Temperature (°C)
* Temperature (°F)
* Humidity
* Wind Speed
* Weather Description
* Weather Icon

## Search History Output

Stores:

* Latest 5 searched cities per user.

---

# 🔑 Environment Variables

Create a `.env` file and add:

```env
REACT_APP_API_KEY=YOUR_OPENWEATHER_API_KEY

REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_DATABASE_URL=YOUR_FIREBASE_DATABASE_URL
REACT_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

---

# 🌐 Deployment

This project is deployed using **Vercel**.

## Deployment Steps

### Push Project to GitHub

```bash
git add .
git commit -m "Project Ready"
git push origin main
```

### Deploy to Vercel

1. Login to Vercel.
2. Click "New Project".
3. Import GitHub Repository.
4. Add Environment Variables.
5. Click Deploy.

---

# 🔮 Future Enhancements

* 7-Day Weather Forecast
* Hourly Forecast
* Dark / Light Theme Toggle
* Current Location Weather
* Favorite Cities
* User Profile Settings
* Weather Maps Integration
* Email Notifications
* Weather Alerts

---

# 👨‍💻 Author

**Meet Solanki**

Computer Engineering Student

### Skills

* React.js
* JavaScript
* Firebase
* HTML5
* CSS3
* Git & GitHub

### GitHub

https://github.com/Meetsolankiii

---

# 📄 License

This project is developed for educational, learning, and portfolio purposes.

Feel free to use, modify, and enhance the project for academic and personal learning.

---

⭐ If you found this project useful, consider giving it a star on GitHub.
