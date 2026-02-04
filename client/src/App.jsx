
import React, { useState } from 'react';
import Register from './components/Register';
import Recharge from './components/Recharge';
import Payment from './components/Payment';
import Balance from './components/Balance';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('register');

  const renderContent = () => {
    switch (activeTab) {
      case 'register': return <Register />;
      case 'recharge': return <Recharge />;
      case 'payment': return <Payment />;
      case 'balance': return <Balance />;
      default: return <Register />;
    }
  };

  return (
    <div className="container">
      <h1>Digital Wallet</h1>

      <div className="nav">
        <button
          className={`nav-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register Client
        </button>
        <button
          className={`nav-btn ${activeTab === 'recharge' ? 'active' : ''}`}
          onClick={() => setActiveTab('recharge')}
        >
          Recharge Wallet
        </button>
        <button
          className={`nav-btn ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Make Payment
        </button>
        <button
          className={`nav-btn ${activeTab === 'balance' ? 'active' : ''}`}
          onClick={() => setActiveTab('balance')}
        >
          Check Balance
        </button>
      </div>

      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
