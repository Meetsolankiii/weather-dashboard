import React from 'react';

const SearchHistory = ({ history, onHistoryItemClick }) => {
  if (history.length === 0) return null;

  return (
    <div className="history-section">
      <h3>Recent Searches</h3>
      <div className="history-list">
        {history.map((city, index) => (
          <button
            key={`${city}-${index}`}
            onClick={() => onHistoryItemClick(city)}
            className="history-btn"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;