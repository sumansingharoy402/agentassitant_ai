import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Admin from './Admin';
import { useState } from 'react';

// 🚨 ১. সিকিউরিটি গার্ড (ইমেইল সেভ থাকলে তবেই ঢুকতে পারবে)
const ProtectedRoute = ({ children }) => {
  const hasAccess = localStorage.getItem('has_access') === 'true';
  
  if (!hasAccess) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
        <h2>🔒 Access Restricted</h2>
        <p>You do not have access. Please complete your payment to unlock.</p>
        <a href="/" style={{ color: '#3498db', fontWeight: 'bold' }}>Go to Home</a>
      </div>
    );
  }
  return children;
};

// 🚨 ২. ল্যান্ডিং পেজ (ইমেইল দিয়ে অটো আনলক)
function LandingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // আপনার Formspree Endpoint
      const FORMSPREE_ENDPOINT = "https://formspree.io/f/mljjlarz"; 

      // কাস্টমারের ইমেইলটি আপনার Formspree-তে পাঠানো হচ্ছে
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: email, 
            message: "New customer unlocked AgentAssist AI." 
        })
      });

      // সফলভাবে পাঠানোর পর কাস্টমারকে অ্যাক্সেস দেওয়া হচ্ছে
      localStorage.setItem('has_access', 'true');
      localStorage.setItem('customer_email', email); // কাস্টমারের ইমেইল সেভ হলো
      window.location.href = '/dashboard'; 
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
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

      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', display: 'inline-block', backgroundColor: '#f9f9f9', maxWidth: '400px', width: '100%' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Step 2: Unlock Access</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>Enter the email address you used for PayPal to unlock your software instantly.</p>
        
        <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="email" 
            placeholder="Enter your PayPal email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}
          />
          <button 
            type="submit"
            disabled={loading}
            style={{ padding: '12px 20px', fontSize: '1rem', backgroundColor: loading ? '#95a5a6' : '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {loading ? "Verifying & Unlocking..." : "Unlock Access Now"}
          </button>
        </form>
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