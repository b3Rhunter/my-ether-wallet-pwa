// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Send from './components/Send';
import Receive from './components/Receive';
import Settings from './components/Settings';
import SignIn from './components/SignIn';
import Matrix from './components/Matrix';
import { connectWallet, createWallet, disconnectWallet, updateBalance, loadSavedWallet } from './functions';
import { IoHome, IoSend, IoWallet, IoSettingsSharp } from "react-icons/io5";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadSavedWallet(setProvider, setSigner, setAddress, setBalance, setIsConnected);
  }, []);

  return (
    <Router>
      <Matrix/>
      <div className='app'>

        <header className='header'>
        
        {isConnected && <div className='balance'>{balance} ETH</div>}
        <h1 className="logo">EtherWallet</h1>
        {isConnected && <div onClick={() => disconnectWallet(setProvider, setSigner, setAddress, setBalance, setIsConnected)} className="btn glass address">{address.substr(0, 6) + "..."}</div>
        }
        </header>


        <Routes>
          <Route path="/" element={
            isConnected ?
              <Navigate to="/dashboard" /> :
              <SignIn
                connectWallet={() => connectWallet(setProvider, setSigner, setAddress, setBalance, setIsConnected)}
                createWallet={() => createWallet(setProvider, setSigner, setAddress, setBalance, setIsConnected)}
              />
          } />
          <Route path="/dashboard" element={
            isConnected ?
              <Dashboard balance={balance} /> :
              <Navigate to="/" />
          } />
          <Route path="/send" element={
            isConnected ?
              <Send signer={signer} updateBalance={() => updateBalance(address, provider, setBalance)} /> :
              <Navigate to="/" />
          } />
          <Route path="/receive" element={
            isConnected ?
              <Receive address={address} /> :
              <Navigate to="/" />
          } />
          <Route path="/settings" element={
            isConnected ?
              <Settings
                signer={signer}
                setIsConnected={setIsConnected}
                setAddress={setAddress}
                setBalance={setBalance}
                setProvider={setProvider}
                setSigner={setSigner}
              /> :
              <Navigate to="/" />
          } />
        </Routes>

        {isConnected && (
          <nav className="nav-links">
            <Link to="/dashboard"><IoHome className='nav-icon' /></Link>
            <Link to="/receive"><IoWallet className='nav-icon'/></Link>
            <Link to="/send"><IoSend className='nav-icon send-icon'/></Link>
            <Link to="/settings"><IoSettingsSharp className='nav-icon'/></Link>
          </nav>
        )}
      </div>
    </Router>
  );
}

export default App;