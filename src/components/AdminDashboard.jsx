import React, { useState, useEffect } from "react";
import { ref, get, remove } from "firebase/database";
import { db } from "../firebase";
import { FaUsers, FaTrashAlt, FaSearchLocation } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [highestCity, setHighestCity] = useState("None");
  const [highestCount, setHighestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const compileAdminMetrics = async () => {
    setLoading(true);
    try {
      // 1. Fetch all user entries
      const usersSnapshot = await get(ref(db, "users"));
      const historySnapshot = await get(ref(db, "history"));
      
      const userList = [];
      if (usersSnapshot.exists()) {
        const data = usersSnapshot.val();
        Object.keys(data).forEach((key) => {
          userList.push({
            username: key,
            ...data[key],
            searches: historySnapshot.exists() && historySnapshot.val()[key] ? historySnapshot.val()[key] : []
          });
        });
        setUsers(userList);
      }

      // 2. Compute Top Searched City Algorithm across full DB clusters
      if (historySnapshot.exists()) {
        const historyData = historySnapshot.val();
        const cityFrequencyMap = {};

        Object.keys(historyData).forEach((userKey) => {
          const userHistoryArray = historyData[userKey];
          if (Array.isArray(userHistoryArray)) {
            userHistoryArray.forEach((city) => {
              if (city) {
                const cleanCity = city.trim();
                cityFrequencyMap[cleanCity] = (cityFrequencyMap[cleanCity] || 0) + 1;
              }
            });
          }
        });

        let topCity = "None";
        let topCount = 0;
        Object.keys(cityFrequencyMap).forEach((city) => {
          if (cityFrequencyMap[city] > topCount) {
            topCount = cityFrequencyMap[city];
            topCity = city;
          }
        });

        setHighestCity(topCity);
        setHighestCount(topCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    compileAdminMetrics();
  }, []);

  const handleDeleteUser = async (username) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently wipe user node "${username}" from the database core grid!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove them'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(ref(db, `users/${username}`));
          await remove(ref(db, `history/${username}`));
          Swal.fire('Deleted!', 'User record dropped successfully.', 'success');
          compileAdminMetrics(); // Re-compile list instantly
        } catch (err) {
          Swal.fire('Error', 'Database dropped access thread parameters.', 'error');
        }
      }
    });
  };

  if (loading) return <div className="loader-box"><div className="inline-spinner"></div><p>Compiling Platform Cluster Metrics...</p></div>;

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-hero-header">
        <h2>System Command Engine Dashboard</h2>
        <p>Operational registry tracking database states, telemetry query charts, and identity authorization sequences.</p>
      </div>

      {/* SYSTEM SUMMARY METRIC WIDGET BALANCES */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-circle blue-icon"><FaUsers /></div>
          <div>
            <h4>Total Registered Profiles</h4>
            <h3>{users.length} Nodes</h3>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon-circle orange-icon"><FaSearchLocation /></div>
          <div>
            <h4>Top Frequency Target City</h4>
            <h3>{highestCity}</h3>
            <p>Queried {highestCount} times globally</p>
          </div>
        </div>
      </div>

      {/* CORE DATA TABLE MATRIX VIEW */}
      <div className="admin-table-container">
        <h3>Platform Profile Security Registry</h3>
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Username ID</th>
              <th>Home Baseline Location</th>
              <th>Recent Tracking Matrix Queries</th>
              <th>Command Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td><strong>{user.fullName}</strong> {user.role === 'admin' && <span className="admin-badge-tag">ADMIN</span>}</td>
                <td>@{user.username}</td>
                <td>📍 {user.defaultCity}</td>
                <td>
                  <div className="user-history-tags-flex">
                    {user.searches && user.searches.length > 0 ? (
                      user.searches.map((c, i) => <span key={i} className="history-tag">{c}</span>)
                    ) : (
                      <em style={{color: '#94a3b8'}}>No history records found</em>
                    )}
                  </div>
                </td>
                <td>
                  {user.role !== 'admin' ? (
                    <button className="table-delete-btn" onClick={() => handleDeleteUser(user.username)}>
                      <FaTrashAlt /> Drop User
                    </button>
                  ) : (
                    <span style={{color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold'}}>System Pinned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;