import React, { useState, useRef, useEffect } from "react";
import { FaCloudSun, FaSearch, FaTimes, FaUserCircle, FaSignOutAlt, FaChartBar, FaExchangeAlt, FaHome, FaCloud, FaHistory } from "react-icons/fa";

const Navbar = ({ currentUser, onLogout, onSearch, isLoading, activeTab, setActiveTab, searchHistory = [], onClearHistory }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle clicking outside the search bar to close the dropdown cleanly
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
      setIsSearchOpen(false);
    }
  };

  const handleChipClick = (city) => {
    onSearch(city);
    setInput("");
    setIsSearchOpen(false);
  };

  const handleCancelSearch = () => {
    setInput("");
    setIsSearchOpen(false);
    setActiveTab("home"); 
  };

  return (
    <nav className="navbar">
      {/* STANDARD NAVIGATION LINKS */}
      {!isSearchOpen && (
        <>
          <div className="navbar-logo" onClick={() => setActiveTab("home")} style={{ cursor: 'pointer' }}>
            <FaCloudSun className="logo-icon" />
            <span>Skyline Weather</span>
          </div>

          <div className="navbar-links">
            <button className={`nav-tab-btn ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
              <FaHome /> Home
            </button>
            <button className={`nav-tab-btn ${activeTab === "weather" ? "active" : ""}`} onClick={() => setActiveTab("weather")}>
              <FaCloud /> Weather
            </button>
            <button className={`nav-tab-btn ${activeTab === "forecast" ? "active" : ""}`} onClick={() => setActiveTab("forecast")}>
              <FaChartBar /> Forecast
            </button>
            <button className={`nav-tab-btn ${activeTab === "compare" ? "active" : ""}`} onClick={() => setActiveTab("compare")}>
              <FaExchangeAlt /> Compare
            </button>
          </div>
        </>
      )}

      {/* PROFESSIONAL NAVBAR SEARCH WITH INTEGRATED RECENT DROPDOWN */}
      <div className={`navbar-search-wrapper ${isSearchOpen ? "expanded" : ""}`} ref={containerRef}>
        {isSearchOpen ? (
          <div className="search-input-field-group" style={{ width: '100%', position: 'relative' }}>
            <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type city name and press Enter..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="navbar-search-input"
              />
              {isLoading && <div className="inline-spinner"></div>}
              
              <button type="submit" className="search-submit-icon-btn" style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginRight: '10px' }}>
                <FaSearch />
              </button>
              
              <button type="button" className="search-close-btn" onClick={handleCancelSearch} style={{ color: '#64748b' }}>
                <FaTimes />
              </button>
            </form>

            {/* THE DROPDOWN LIST (Appears directly beneath the search input when active) */}
            {currentUser && currentUser.role !== 'admin' && searchHistory.length > 0 && (
              <div className="navbar-recent-dropdown-box animate-slide-down">
                <div className="dropdown-search-header">
                  <span>Recent Searches</span>
                  <button type="button" className="clear-all-search-link" onClick={onClearHistory}>Clear All</button>
                </div>
                <div className="dropdown-search-list">
                  {searchHistory.map((city, idx) => (
                    <div key={idx} className="dropdown-search-item" onClick={() => handleChipClick(city)}>
                      <FaHistory className="history-item-icon" />
                      <span className="history-item-text">{city}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="navbar-search-trigger" onClick={() => setIsSearchOpen(true)}>
            <span className="trigger-placeholder">Search city...</span>
            <FaSearch className="search-trigger-icon" />
          </button>
        )}
      </div>

      {/* ACCOUNT AREA */}
      {!isSearchOpen && (
        <div className="navbar-user-area">
          {currentUser ? (
            <div className="profile-dropdown-container">
              <div className="profile-trigger" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="user-avatar-wrapper">
                  <FaUserCircle className="avatar-placeholder" />
                </div>
                <span className="profile-name-text">{currentUser.fullName}</span>
                <span className="dropdown-arrow-icon">▼</span>
              </div>

              {isProfileOpen && (
                <>
                  <div className="dropdown-backdrop" onClick={() => setIsProfileOpen(false)} />
                  <div className="profile-dropdown-menu">
                    <div className="dropdown-header">
                      <h4>{currentUser.fullName}</h4>
                      <p>{currentUser.username}</p>
                      <span className="city-tag">📍 {currentUser.defaultCity}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-action" onClick={() => { setIsProfileOpen(false); onLogout(); }}>
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button className="navbar-auth-trigger-btn" onClick={() => onLogout()}>
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;