import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Admin from './Admin';
import { useState } from 'react';

// 🚨 ১. এখানে আপনি কাস্টমারদের পাসকোড যোগ করবেন
const VALID_PASSCODES = [
  "AGENT99",      // প্রথম কাস্টমারের জন্য
  "CLIENT01",     // দ্বিতীয় কাস্টমারের জন্য
  "CLIENT02",     // তৃতীয় কাস্টমারের জন্য
  "PRO2024"       // চতুর্থ কাস্টমারের জন্য
];

// 🚨 ২. সিকিউরিটি গার্ড
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

// 🚨 ৩. ল্যান্ডিং পেজ
function LandingPage() {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  
  // ধাপ ট্র্যাকিং (১. ইমেইল দেওয়া, ২. পাসকোড দেওয়া)
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // প্রথম ধাপ: ইমেইল সাবমিট করা
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const FORMSPREE_ENDPOINT = "https://formspree.io/f/mljjlarz"; 
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, message: "New customer waiting for passcode." })
      });
      
      setLoading(false);
      setStep(2); // ইমেইল পাঠানোর পর পাসকোড বক্স দেখাবে
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // দ্বিতীয় ধাপ: পাসকোড ভেরিফাই করা
  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (VALID_PASSCODES.includes(passcode.toUpperCase())) {
      localStorage.setItem('has_access', 'true');
      localStorage.setItem('customer_email', email); 
      window.location.href = '/dashboard'; 
    } else {
      setError("Invalid passcode. Please check your email.");
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

      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', display: 'inline-block', backgroundColor: '#f9f9f9', maxWidth: '450px', width: '100%' }}>
        
        {step === 1 ? (
          <>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Step 2: Verify Email</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>Enter the email address you used for PayPal.</p>
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                style={{ padding: '12px 20px', fontSize: '1rem', backgroundColor: loading ? '#95a5a6' : '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
              >
                {loading ? "Verifying..." : "Next Step"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Step 3: Enter Passcode</h3>
            <p style={{ fontSize: '14px', color: '#27ae60', marginBottom: '15px', fontWeight: 'bold' }}>
              Email submitted! Please check your inbox for the passcode, or contact support.
            </p>
            <form onSubmit={handlePasscodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Enter Passcode (e.g., AGENT99)" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)}
                required
                style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center', textTransform: 'uppercase' }}
              />
              <button 
                type="submit"
                style={{ padding: '12px 20px', fontSize: '1rem', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Unlock Access
              </button>
            </form>
          </>
        )}
        
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