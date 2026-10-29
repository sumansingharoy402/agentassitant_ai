import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Admin from './Admin';
import { useState } from 'react';

// 🚨 পাসওয়ার্ড সেট করুন (কাস্টমারকে এটি দিতে হবে)
const SECRET_PASSCODE = "AGENT99"; 

const ProtectedRoute = ({ children }) => {
  const hasAccess = localStorage.getItem('has_access') === 'true';
  
  if (!hasAccess) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
        <h2>🔒 Access Restricted</h2>
        <p>You do not have access. Please complete your payment and enter the passcode.</p>
        <a href="/" style={{ color: '#3498db', fontWeight: 'bold' }}>Go to Home</a>
      </div>
    );
  }
  return children;
};

function LandingPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = () => {
    if (passcode.toUpperCase() === SECRET_PASSCODE) {
      localStorage.setItem('has_access', 'true');
      window.location.href = '/dashboard'; 
    } else {
      setError("Invalid passcode. Please check the email/message we sent you.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Automate Your Client Follow-ups</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
        Save hours every week with AI-powered emails.
      </p>
      
      <a href="https://www.paypal.com/paypalme/Sumansingharoy/99" target="_blank" rel="noreferrer">
        <button style={{ padding: '12px 24px', fontSize: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
          Step 1: Pay $99 via PayPal
        </button>
      </a>

      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', display: 'inline-block', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Step 2: Already Paid?</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>Enter the Secret Passcode sent to you after payment.</p>
        <input 
          type="text" 
          placeholder="Enter Passcode" 
          value={passcode} 
          onChange={(e) => setPasscode(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', width: '250px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center', textTransform: 'uppercase' }}
        />
        <button 
          onClick={handleUnlock}
          style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Unlock Access
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{error}</p>}
      </div>

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#e53e3e', fontWeight: 'bold' }}>
        <p>⚠️ No Refund Policy: All sales are final. No refunds will be provided once access is granted.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;