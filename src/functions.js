// functions.js
import { ethers } from 'ethers';

export const connectWallet = async (setProvider, setSigner, setAddress, setBalance, setIsConnected) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const signer = await provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      setAddress(address);
      await updateBalance(address, provider, setBalance);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
    }
  } else {
    console.log('Please install MetaMask!');
  }
};

export const createWallet = async (setProvider, setSigner, setAddress, setBalance, setIsConnected) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    localStorage.setItem('ethWallet', JSON.stringify(wallet.privateKey));
    setAddress(wallet.address);
    setIsConnected(true);
    const provider = new ethers.InfuraProvider('mainnet');
    setProvider(provider);
    setSigner(wallet.connect(provider));
    await updateBalance(wallet.address, provider, setBalance);
    alert(`New wallet created! Address: ${wallet.address}\nPlease save your private key securely!`);
  } catch (error) {
    console.error('Failed to create wallet:', error);
  }
};

export const disconnectWallet = (setProvider, setSigner, setAddress, setBalance, setIsConnected) => {
  setProvider(null);
  setSigner(null);
  setAddress('');
  setBalance('');
  setIsConnected(false);
};

export const deleteAccount = (setProvider, setSigner, setAddress, setBalance, setIsConnected) => {
  setProvider(null);
  setSigner(null);
  setAddress('');
  setBalance('');
  localStorage.removeItem('ethWallet');
  localStorage.clear()
  setIsConnected(false);
}

export const updateBalance = async (addr, prov, setBalance) => {
  if (prov && addr) {
    const balance = await prov.getBalance(addr);
    setBalance(ethers.formatEther(balance));
  }
};

export const loadSavedWallet = async (setProvider, setSigner, setAddress, setBalance, setIsConnected) => {
  const savedWallet = localStorage.getItem('ethWallet');
  if (savedWallet) {
    const wallet = new ethers.Wallet(JSON.parse(savedWallet));
    setAddress(wallet.address);
    setIsConnected(true);
    const provider = new ethers.InfuraProvider('mainnet');
    setProvider(provider);
    setSigner(wallet.connect(provider));
    await updateBalance(wallet.address, provider, setBalance);
  }
};

  export const exportPrivateKey = async (signer) => {
    try {
      let privateKey;
      if (signer instanceof ethers.Wallet) {
        privateKey = signer.privateKey;
      } else if (signer._signingKey && signer._signingKey()) {
        privateKey = signer._signingKey().privateKey;
      } else {
        throw new Error("Unable to export private key. This may not be supported for your current wallet type.");
      }
      if (privateKey) {
        alert(`Your private key is: ${privateKey}\nPlease store it securely and never share it with anyone!`);
      } else {
        throw new Error("Private key not found.");
      }
    } catch (error) {
      console.error('Failed to export private key:', error);
      alert(`Failed to export private key: ${error.message}`);
    }
  };