// components/Receive.jsx
import React from 'react';

function Receive({ address }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  return (
    <main className="main-content glass">
      <h2>Receive ETH</h2>
      <div className="qr-code">
        {/* Add QR code component here */}
      </div>
      <p className="wallet-address">Your wallet address: {address.substr(0, 6) + "..."}</p>
      <button className="btn glass" onClick={copyToClipboard}>Copy Address</button>
    </main>
  );
}

export default Receive;