// components/Settings.jsx
import { exportPrivateKey, deleteAccount } from '../functions';

function Settings({ signer, setIsConnected, setAddress, setBalance, setProvider, setSigner }) {

  const handleExportPrivateKey = () => {
    exportPrivateKey(signer);
  };

  const handleDeleteAccount = () => {
    deleteAccount(setProvider, setSigner, setAddress, setBalance, setIsConnected)
  }

  return (
    <main className="main-content glass">
      <h2>Settings</h2>
      <div className="setting-item">
        <button className='btn glass' onClick={handleExportPrivateKey}>Export Private Key</button>
        <button className='btn glass' onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </main>
  );
}

export default Settings;