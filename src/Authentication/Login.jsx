import React, { useState } from 'react';

// Firebase functions used to read data from Realtime Database
import { ref, get } from "firebase/database";

// Firebase database connection object
import { db } from "../firebase";

// Login component receives two functions from App.js
// onLoginSuccess -> called when login is successful
// onSwitchToRegister -> opens registration page
const Login = ({ onLoginSuccess, onSwitchToRegister }) => {

  // Stores username entered by user
  const [username, setUsername] = useState('');

  // Stores password entered by user
  const [password, setPassword] = useState('');

  // Stores error messages
  const [error, setError] = useState('');

  // Controls loading state while login request is running
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // =====================================================
  // Called when Login button is clicked
  // =====================================================
  const handleSubmit = async (e) => {

    // Prevent page refresh after form submission
    e.preventDefault();

    // Clear previous error message
    setError('');

    // Convert username to lowercase and remove spaces
    // This prevents issues like Meet and meet being treated differently
    const cleanUsername = username.trim().toLowerCase();

    // Check whether both fields are filled
    if (!cleanUsername || !password) {
      setError('Please enter both your credentials.');
      return;
    }

    // Start loading state
    setIsLoggingIn(true);

    try {

      // Create Firebase path:
      // users/meet
      // users/john
      // users/admin
      const userRef = ref(
        db,
        `users/${cleanUsername}`
      );

      // Read user data from Firebase
      const snapshot = await get(userRef);

      // If username does not exist
      if (!snapshot.exists()) {

        setError('User record does not exist.');

        setIsLoggingIn(false);
        return;
      }

      // Convert Firebase data into JavaScript object
      const userData = snapshot.val();

      // Verify password entered by user
      if (userData.password !== password) {

        setError('Incorrect security password entered.');

        setIsLoggingIn(false);
        return;
      }

      // =====================================================
      // Login successful
      // Send user data back to App.js
      // =====================================================
      onLoginSuccess(userData);

    } catch (err) {

      // Firebase connection error
      setError(
        'Connection failure communicating with Firebase server.'
      );

    } finally {

      // Stop loading spinner
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="auth-card">

      {/* Login page heading */}
      <h2>Welcome Back</h2>

      {/* Small description */}
      <p>
        Verify global credentials database profile
      </p>

      {/* Display error message if exists */}
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >

        {/* Username Input */}
        <div className="input-group">

          <label>Username</label>

          <input
            type="text"
            value={username}

            // Update username state while typing
            onChange={(e) =>
              setUsername(e.target.value)
            }

            placeholder="Username"

            // Disable input while login request is running
            disabled={isLoggingIn}
          />
        </div>

        {/* Password Input */}
        <div className="input-group">

          <label>Password</label>

          <input
            type="password"
            value={password}

            // Update password state while typing
            onChange={(e) =>
              setPassword(e.target.value)
            }

            placeholder="••••••••"

            disabled={isLoggingIn}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="auth-btn"
          disabled={isLoggingIn}
        >

          {/* Change button text while loading */}
          {isLoggingIn
            ? 'Authenticating...'
            : 'Log In'
          }

        </button>

      </form>

      {/* Switch to Register Page */}
      <p className="auth-footer-text">

        Need an isolated profile node?

        <button
          onClick={onSwitchToRegister}
          className="auth-link-btn"
          disabled={isLoggingIn}
        >
          Register Here
        </button>

      </p>

    </div>
  );
};

export default Login;