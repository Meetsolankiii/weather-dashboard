import React, { useState } from 'react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setValidationError('Please enter a city name.');
      return;
    }

    setValidationError('');
    onSearch(trimmedInput);
    setInput('');
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for a city (e.g., London, Porbandar)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`search-input ${validationError ? 'input-error' : ''}`}
        />
        <button type="submit" disabled={isLoading} className="search-button">
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {validationError && <p className="validation-text">{validationError}</p>}
    </div>
  );
};

export default SearchBar;