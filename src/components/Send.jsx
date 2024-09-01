// components/Send.jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';

function Send({ signer }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('')

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
        data: ethers.toUtf8Bytes(message),
      });
      
      await tx.wait();
      setStatus('Transaction sent successfully!');
    } catch (error) {
      console.error('Error sending transaction:', error);
      setStatus('Failed to send transaction.');
    }
  };

  return (
    <main className="main-content glass">
      <h2>Send ETH</h2>
      <form className='send-container' onSubmit={handleSend}>
        <input
          className='glass'
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
        className='glass'
          type="text"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
        className='glass'
          placeholder='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn glass">Send</button>
      </form>
      {status && <p>{status}</p>}
    </main>
  );
}

export default Send;