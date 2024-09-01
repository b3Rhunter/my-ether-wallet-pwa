// components/SignIn.jsx
import React from 'react';

function SignIn({ connectWallet, createWallet }) {
  return (
    <div className="sign-in">
      <div className='signin-cont glass'>
      <button onClick={connectWallet} className="btn glass">Connect Wallet</button>
      <button onClick={createWallet} className="btn glass">Create New Wallet</button>
      </div>
    </div>
  );
}

export default SignIn;