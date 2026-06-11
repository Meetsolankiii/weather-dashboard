import React, { useState } from 'react';

import { ref, get, set } from "firebase/database";
import { db } from "../firebase";

import Swal from 'sweetalert2';

const Register = ({ onSwitchToLogin }) => {

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    defaultCity: '',
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =====================================================
  // Handle Input Changes
  // =====================================================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // =====================================================
  // Handle Registration
  // =====================================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    const cleanUsername =
      formData.username.trim().toLowerCase();

    // Validate Inputs
    if (
      !formData.fullName.trim() ||
      !cleanUsername ||
      !formData.password ||
      !formData.defaultCity.trim()
    ) {

      await Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'All fields are required.'
      });

      return;
    }

    setIsSubmitting(true);

    try {

      // Check if username already exists
      const userRef = ref(
        db,
        `users/${cleanUsername}`
      );

      const snapshot = await get(userRef);

      if (snapshot.exists()) {

        await Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Username is already taken.'
        });

        setIsSubmitting(false);
        return;
      }

      // Save User
      await set(userRef, {

        fullName:
          formData.fullName.trim(),

        username:
          cleanUsername,

        password:
          formData.password,

        defaultCity:
          formData.defaultCity.trim(),

      });

      // Success Alert
      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text:
          'Your account has been created successfully.',
        confirmButtonText: 'Go To Login'
      });

      // Redirect to Login Page
      onSwitchToLogin();

    } catch (err) {

      await Swal.fire({
        icon: 'error',
        title: 'Database Error',
        text:
          'Unable to save user information.'
      });

      console.error(err);

    } finally {

      setIsSubmitting(false);

    }

  };

  return (

    <div>

      {/* Registration Title */}
      <h2>Create Account</h2>

      <p>
        Create your weather dashboard account
      </p>

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >

        {/* Full Name */}
        <div className="input-group">

          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Meet Solanki"
            disabled={isSubmitting}
          />

        </div>

        {/* Username */}
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

        {/* Password */}
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

        {/* Default City */}
        <div className="input-group">

          <label>Default Home City</label>

          <input
            type="text"
            name="defaultCity"
            value={formData.defaultCity}
            onChange={handleChange}
            placeholder="e.g. Jamnagar"
            disabled={isSubmitting}
          />

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="auth-btn"
          disabled={isSubmitting}
        >

          {
            isSubmitting
              ? 'Creating Account...'
              : 'Sign Up'
          }

        </button>

      </form>

      {/* Switch To Login */}
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