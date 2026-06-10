import React, { useState } from 'react';

// Firebase functions used to read and write data
import { ref, get, set } from "firebase/database";

// Firebase database connection object
import { db } from "../firebase";

// Register component
// onSwitchToLogin -> function used to redirect user to Login page
const Register = ({ onSwitchToLogin }) => {

  // Stores all registration form fields
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    defaultCity: '',
  });

  // Stores validation and Firebase error messages
  const [error, setError] = useState('');

  // Used to show registration success message
  const [success, setSuccess] = useState(false);

  // Controls loading state while registration is processing
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =====================================================
  // Updates form data whenever user types in input fields
  // =====================================================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // =====================================================
  // Called when user clicks Sign Up button
  // =====================================================
  const handleSubmit = async (e) => {

    // Prevent page refresh
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Convert username to lowercase
    // Prevents duplicate usernames like:
    // Meet and meet
    const cleanUsername =
      formData.username.trim().toLowerCase();

    // Validate all required fields
    if (
      !formData.fullName.trim() ||
      !cleanUsername ||
      !formData.password ||
      !formData.defaultCity.trim()
    ) {

      setError('All fields are required.');
      return;
    }

    // Start loading state
    setIsSubmitting(true);

    try {

      // =====================================================
      // Check whether username already exists
      // Example:
      // users/meet
      // users/admin
      // users/john
      // =====================================================
      const userRef = ref(
        db,
        `users/${cleanUsername}`
      );

      const snapshot = await get(userRef);

      // Prevent duplicate usernames
      if (snapshot.exists()) {

        setError('Username is already taken.');

        setIsSubmitting(false);
        return;
      }

      // =====================================================
      // Save new user profile in Firebase Realtime Database
      // =====================================================
      await set(userRef, {

        // User full name
        fullName: formData.fullName.trim(),

        // Unique username
        username: cleanUsername,

        // User password
        // NOTE:
        // Stored as plain text for project purpose only.
        // Real applications should hash passwords.
        password: formData.password,

        // User's default city
        // Weather will automatically load for this city
        defaultCity:
          formData.defaultCity.trim(),
      });

      // Show success message
      setSuccess(true);

      // Wait 1.5 seconds then redirect to Login page
      setTimeout(() => {

        onSwitchToLogin();

      }, 1500);

    } catch (err) {

      // Firebase database error
      setError(
        'Database error. Please verify database URL credentials rules.'
      );

    } finally {

      // Stop loading spinner
      setIsSubmitting(false);

    }
  };

  return (
    <div className="auth-card">

      {/* Registration page title */}
      <h2>Create Account</h2>

      {/* Small description */}
      <p>
        Data synced to Live Firebase Engine
      </p>

      {/* Display error message */}
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      {/* Display success message */}
      {success && (
        <div className="auth-success">
          Registration complete!
          Routing to sign in...
        </div>
      )}

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >

        {/* Full Name Input */}
        <div className="input-group">

          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}

            // Update state while typing
            onChange={handleChange}

            placeholder="Meet Solanki"

            disabled={isSubmitting}
          />

        </div>

        {/* Username Input */}
        <div className="input-group">

          <label>Username</label>

          <input
            type="text"
            name="username"
            value={formData.username}

            onChange={handleChange}

            placeholder="meetsolanki"

            disabled={isSubmitting}
          />

        </div>

        {/* Password Input */}
        <div className="input-group">

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}

            onChange={handleChange}

            placeholder="••••••••"

            disabled={isSubmitting}
          />

        </div>

        {/* Default City Input */}
        <div className="input-group">

          <label>Default Home City</label>

          <input
            type="text"
            name="defaultCity"
            value={formData.defaultCity}

            onChange={handleChange}

            placeholder="e.g., Porbandar"

            disabled={isSubmitting}
          />

        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="auth-btn"
          disabled={isSubmitting}
        >

          {/* Change button text during loading */}
          {isSubmitting
            ? 'Writing to DB...'
            : 'Sign Up'
          }

        </button>

      </form>

      {/* Redirect to Login Page */}
      <p className="auth-footer-text">

        Already have an account?

        <button
          onClick={onSwitchToLogin}
          className="auth-link-btn"
          disabled={isSubmitting}
        >
          Log In
        </button>

      </p>

    </div>
  );
};

export default Register;