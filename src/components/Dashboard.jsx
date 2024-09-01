// components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ balance }) {
  return (
    <main className="main-content glass">
      <h2>Dashboard</h2>
      <p>Your balance: {balance} ETH</p>
      <div className="actions">
        <Link to="/send" className="btn glass">Send ETH</Link>
        <Link to="/receive" className="btn glass">Receive ETH</Link>
      </div>
    </main>
  );
}

export default Dashboard;