// Import React and useState hook
// React is required to create the component
// useState is used to store and update input values
import React, { useState } from 'react';


// SearchBar component receives two props:
// 1. onSearch -> function from App.js to perform weather search
// 2. isLoading -> indicates whether API request is in progress
const SearchBar = ({ onSearch, isLoading }) => {

  // Stores the city name entered by the user
  const [input, setInput] = useState('');

  // Stores validation error message
  const [validationError, setValidationError] = useState('');


  // Runs when user clicks Search button or presses Enter
  const handleSubmit = (e) => {

    // Prevent page refresh on form submit
    e.preventDefault();

    // Remove extra spaces from start and end
    const trimmedInput = input.trim();


    // Validation: check if input is empty
    if (!trimmedInput) {

      // Show error message
      setValidationError('Please enter a city name.');

      // Stop function execution
      return;
    }

    // Clear previous validation errors
    setValidationError('');

    // Call function received from App.js
    // This sends city name to weather API function
    onSearch(trimmedInput);

    // Clear input box after search
    setInput('');
  };


  return (

    // Form element
    // When submitted it calls handleSubmit()
    <form className="search-form" onSubmit={handleSubmit}>

      {/* City Name Input Field */}
      <input
        type="text"

        // Placeholder text shown before typing
        placeholder="Search for a city (e.g., London, Porbandar)..."

        // Controlled input value
        value={input}

        // Update state whenever user types
        onChange={(e) => setInput(e.target.value)}

        // Add error styling when validation fails
        className={`search-input ${validationError ? 'input-error' : ''}`}
      />


      {/* Search Button */}
      <button
        type="submit"
        className="search-button"
        disabled={isLoading}
      >

        {/* Show different text while API is loading */}
        {isLoading ? 'Searching...' : 'Search'}

      </button>


      {/* Show validation message only when error exists */}
      {validationError && (
        <p className="validation-text">
          {validationError}
        </p>
      )}

    </form>
  );
};

// Export component so App.js can use it
export default SearchBar;