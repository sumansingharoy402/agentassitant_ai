import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Admin from './Admin';
import AdminAuth from './AdminAuth'; // নতুন তৈরি করা ফাইল
import { useState } from 'react';

const ADMIN_EMAIL = "sumansingharoy402@gmail.com";
const CUSTOMER_PASSCODES = ["CLIENT001", "CLIENT002", "PRO2024"];
const CORRECT_SECRET_WORD = "AGENT";

// 🚨 সিকিউরিটি গার্ড
const ProtectedRoute = ({ children }) => {
  const hasAccess = localStorage.getItem('has_access') === 'true';
  if (!hasAccess) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
        <h2>🔒 Access Restricted</h2>
        <p>You do not have access.</p>
        <a href="/" style={{ color: '#3498db', fontWeight: 'bold' }}>Go to Home</a>
      </div>
    );
  }
  return children;
};

function LandingPage() {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [secretWord, setSecretWord] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // আপনার কাছে নোটিফিকেশন পাঠানো
      const FORMSPREE_ENDPOINT = "https://formspree.io/f/mljjlarz"; 
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, message: `New access request from: ${email}` })
      });
      setLoading(false);
      setStep(2); 
    } catch (err) {
      setError("Error sending request. Please try again.");
      setLoading(false);
    }
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    
    // 🚨 নতুন লজিক: ইমেইলটি আপনার অ্যাডমিন প্যানেলে অথোরাইজ করা আছে কিনা চেক করা
    const authorizedEmails = JSON.parse(localStorage.getItem('authorized_emails') || '[]');
    const isEmailAuthorized = authorizedEmails.includes(email.toLowerCase());

    if (!isEmailAuthorized) {
      setError("This email is not authorized. Please contact admin.");
      return;
    }

    if (CUSTOMER_PASSCODES.includes(passcode.toUpperCase()) && secretWord.toUpperCase() === CORRECT_SECRET_WORD) {
      localStorage.setItem('has_access', 'true');
      localStorage.setItem('customer_email', email); 
      window.location.href = '/dashboard'; 
    } else {
      setError("Invalid passcode or secret word.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Automate Your Client Follow-ups</h1>
      <p>Save hours every week with AI-powered emails.</p>
      
      <a href="https://www.paypal.com/paypalme/Sumansingharoy/99" target="_blank" rel="noreferrer">
        <button style={{ padding: '12px 24px', fontSize: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
          Step 1: Pay $99 via PayPal
        </button>
      </a>

      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', display: 'inline-block', backgroundColor: '#f9f9f9', maxWidth: '450px', width: '100%' }}>
        {step === 1 ? (
          <>
            <h3>Step 2: Verify Email</h3>
            <p style={{ fontSize: '14px', marginBottom: '15px' }}>Enter your email to request access.</p>
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', textAlign: 'center', borderRadius: '5px', border: '1px solid #ccc' }} />
              <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                {loading ? "Sending..." : "Request Access"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3>Step 3: Enter Credentials</h3>
            <p style={{ fontSize: '14px', color: '#27ae60', marginBottom: '15px' }}>Contact admin for passcode & secret word.</p>
            <form onSubmit={handlePasscodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="email" placeholder="Re-enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', textAlign: 'center', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Enter passcode" value={passcode} onChange={(e) => setPasscode(e.target.value)} required style={{ padding: '12px', textAlign: 'center', borderRadius: '5px', border: '1px solid #ccc', textTransform: 'uppercase' }} />
              <input type="text" placeholder="Enter secret word" value={secretWord} onChange={(e) => setSecretWord(e.target.value)} required style={{ padding: '12px', textAlign: 'center', borderRadius: '5px', border: '1px solid #ccc', textTransform: 'uppercase' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Unlock Access</button>
            </form>
          </>
        )}
        {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{error}</p>}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* 🚨 নতুন অ্যাডমিন অথোরাইজেশন পেজ */}
        <Route path="/admin-auth" element={<AdminAuth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;