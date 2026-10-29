import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './dashboard';
import Admin from './Admin';
import { useState } from 'react';

// 🚨 ১. সিকিউরিটি গার্ড (লোকাল স্টোরেজ চেক)
const ProtectedRoute = ({ children }) => {
  const hasAccess = localStorage.getItem('has_access') === 'true';
  
  if (!hasAccess) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
        <h2>🔒 Access Restricted</h2>
        <p>You do not have access. Please complete your payment.</p>
        <a href="/" style={{ color: '#3498db', fontWeight: 'bold' }}>Go to Home</a>
      </div>
    );
  }
  return children;
};

// 🚨 ২. অটো আনলক পেজ (পেমেন্টের পর এখানে আসবে)
function AutoUnlockPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAutoUnlock = () => {
    setLoading(true);
    // ১.৫ সেকেন্ডের একটি সিমুলেশন, যাতে মনে হয় সিস্টেম পেমেন্ট চেক করছে
    setTimeout(() => {
      localStorage.setItem('has_access', 'true');
      navigate('/dashboard'); 
    }, 1500);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#27ae60' }}>✅ Payment Successful!</h1>
      <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '30px' }}>
        Thank you for your purchase. Click the button below to unlock your software.
      </p>
      
      <button 
        onClick={handleAutoUnlock}
        disabled={loading}
        style={{ padding: '15px 30px', fontSize: '18px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
      >
        {loading ? "🔄 Unlocking Software..." : "Unlock Access Now"}
      </button>
    </div>
  );
}

// 🚨 ৩. ল্যান্ডিং পেজ
function LandingPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Automate Your Client Follow-ups</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
        Save hours every week with AI-powered emails.
      </p>
      
      {/* স্টেপ ১: পেমেন্ট লিংক */}
      <a href="https://www.paypal.com/paypalme/Sumansingharoy/99" target="_blank" rel="noreferrer">
        <button style={{ padding: '12px 24px', fontSize: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
          Step 1: Pay $99 via PayPal
        </button>
      </a>

      {/* স্টেপ ২: পেমেন্টের পর আনলক লিংক */}
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', display: 'inline-block', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Step 2: Already Paid?</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>Click the button below to unlock your software instantly.</p>
        <a href="/unlock" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Unlock Software
          </button>
        </a>
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
        <Route path="/unlock" element={<AutoUnlockPage />} /> {/* নতুন অটো আনলক রুট */}
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