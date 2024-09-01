import React from 'react';
import { exportPrivateKey, deleteAccount, switchNetwork } from '../functions';

function Settings({ signer, setIsConnected, setAddress, setBalance, setProvider, setSigner, network, setNetwork }) {
  const handleExportPrivateKey = () => {
    exportPrivateKey(signer);
  };

  const handleDeleteAccount = () => {
    deleteAccount(setProvider, setSigner, setAddress, setBalance, setIsConnected);
  };

  const handleNetworkChange = async (e) => {
    const newNetwork = e.target.value;
    try {
      await switchNetwork(newNetwork, setProvider, setSigner, setAddress, setBalance, setNetwork);
    } catch (error) {
      console.error('Failed to switch network:', error);
      alert(`Failed to switch network: ${error.message}`);
    }
  };

  return (
    <main className="main-content glass">
      <h2>Settings</h2>
      <div className="setting-item">
        <label htmlFor="network-select">Select Network:</label>
        <select id="network-select" value={network} onChange={handleNetworkChange} className="btn glass">
          <option value="sepolia">Sepolia</option>
          <option value="mainnet">Mainnet</option>
          <option value="optimism">Optimism</option>
          <option value="base">Base</option>
        </select>
      </div>
      <div className="setting-item">
        <button className='btn glass' onClick={handleExportPrivateKey}>Export Private Key</button>
        <button className='btn glass' onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </main>
  );
}

export default Settings;