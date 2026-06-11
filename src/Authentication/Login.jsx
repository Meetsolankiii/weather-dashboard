import React, { useState } from 'react';

import { ref, get } from "firebase/database";
import { db } from "../firebase";

import Swal from 'sweetalert2';

const Login = ({
  onLoginSuccess,
  onSwitchToRegister
}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoggingIn, setIsLoggingIn] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const cleanUsername =
      username.trim().toLowerCase();

    if (!cleanUsername || !password) {

      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter username and password.'
      });

      return;
    }

    setIsLoggingIn(true);

    try {

      const userRef = ref(
        db,
        `users/${cleanUsername}`
      );

      const snapshot = await get(userRef);

      // User not found
      if (!snapshot.exists()) {

        await Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'User record does not exist.'
        });

        setIsLoggingIn(false);
        return;
      }

      const userData = snapshot.val();

      // Wrong password
      if (userData.password !== password) {

        await Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Incorrect password.'
        });

        setIsLoggingIn(false);
        return;
      }

      // Success Alert
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome ${userData.fullName}!`,
        timer: 1500,
        showConfirmButton: false
      });

      // Redirect to Dashboard
      onLoginSuccess(userData);

    } catch (err) {

      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text:
          'Unable to communicate with Firebase.'
      });

    } finally {

      setIsLoggingIn(false);

    }

  };

  return (

    <div>

      <h2>Welcome Back</h2>

      <p>
        Verify global credentials database profile
      </p>

      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >

        <div className="input-group">

          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Username"
            disabled={isLoggingIn}
          />

        </div>

        <div className="input-group">

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="••••••••"
            disabled={isLoggingIn}
          />

        </div>

        <button
          type="submit"
          className="auth-btn"
          disabled={isLoggingIn}
        >

          {
            isLoggingIn
              ? 'Authenticating...'
              : 'Log In'
          }

        </button>

      </form>

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