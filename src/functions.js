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

export const loadSavedWallet = async (setProvider, setSigner, setAddress, setBalance, setIsConnected, setNetwork) => {
  const savedWallet = localStorage.getItem('ethWallet');
  const savedNetwork = localStorage.getItem('currentNetwork') || 'sepolia';
  if (savedWallet) {
    const network = networks[savedNetwork];
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = new ethers.Wallet(JSON.parse(savedWallet), provider);
    setAddress(wallet.address);
    setIsConnected(true);
    setProvider(provider);
    setSigner(wallet);
    setNetwork(savedNetwork);
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

  const key = process.env.REACT_APP_API_KEY;

  const networks = {
    sepolia: {
      name: 'Sepolia',
      chainId: '0xaa36a7',
      rpcUrl: `https://sepolia.infura.io/v3/${key}`
    },
    mainnet: {
      name: 'Mainnet',
      chainId: '0x1',
      rpcUrl: `https://mainnet.infura.io/v3/${key}`
    },
    optimism: {
      name: 'Optimism',
      chainId: '0xa',
      rpcUrl: `https://optimism-mainnet.infura.io/v3/${key}`
    },
    base: {
      name: 'Base',
      chainId: '0x2105',
      rpcUrl: `https://base-mainnet.infura.io/v3/${key}`
    }
  };

  export const switchNetwork = async (networkName, setProvider, setSigner, setAddress, setBalance, setNetwork) => {
    const network = networks[networkName];
    if (!network) {
      throw new Error('Invalid network');
    }
  
    const savedWallet = localStorage.getItem('ethWallet');
  
    if (savedWallet) {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      setProvider(provider);
      const wallet = new ethers.Wallet(JSON.parse(savedWallet), provider);
      setSigner(wallet);
      setAddress(wallet.address);
      await updateBalance(wallet.address, provider, setBalance);
      setNetwork(networkName);
      localStorage.setItem('currentNetwork', networkName);
    } else if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: network.chainId,
                  chainName: network.name,
                  rpcUrls: [network.rpcUrl],
                },
              ],
            });
          } catch (addError) {
            throw addError;
          }
        } else {
          throw switchError;
        }
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const signer = await provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      setAddress(address);
      await updateBalance(address, provider, setBalance);
      setNetwork(networkName);
      localStorage.setItem('currentNetwork', networkName);
    } else {
      throw new Error("No wallet found. Please connect to MetaMask or create a local wallet.");
    }
  };
