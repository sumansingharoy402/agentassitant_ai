import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Admin from './Admin';
import { useState, useEffect } from 'react';

// 🚨 ১. আপনার অ্যাডমিন ইমেইল
const ADMIN_EMAIL = "sumansingharoy402@gmail.com";

// 🚨 ২. কাস্টমারদের পাসকোডের তালিকা
const CUSTOMER_PASSCODES = ["CLIENT001", "CLIENT002", "PRO2024"];

// 🚨 ৩. সিক্রেট শব্দ
const CORRECT_SECRET_WORD = "AGENT"; 

// 🚨 ৪. সিকিউরিটি গার্ড
const ProtectedRoute = ({ children }) => {
  const hasAccess = localStorage.getItem('has_access') === 'true';
  
  if (!hasAccess) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
        <h2>🔒 Access Restricted</h2>
        <p>You do not have access. Please verify your payment.</p>
        <a href="/" style={{ color: '#3498db', fontWeight: 'bold' }}>Go to Home</a>
      </div>
    );
  }
  return children;
};

// 🚨 ৫. ল্যান্ডিং পেজ (কাস্টমারের জন্য)
function LandingPage() {
  const [email, setEmail] = useState('');
  const [txnId, setTxnId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [secretWord, setSecretWord] = useState('');
  
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ধাপ ১: কাস্টমার ইমেইল এবং ট্রানজেকশন আইডি দেবে
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!txnId || txnId.length < 5) {
      setError("Please enter the PayPal Transaction ID you received after payment.");
      return;
    }

    // চেক করা হচ্ছে অ্যাডমিন আগেই এই ইমেইলটি অথোরাইজ করেছে কিনা
    const authorizedEmails = JSON.parse(localStorage.getItem('authorized_emails') || '[]');
    if (!authorizedEmails.includes(email.toLowerCase())) {
      setError("This email is not authorized yet. Please wait for the admin to authorize it.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // আপনার Formspree-তে ইমেইল, ট্রানজেকশন আইডি পাঠানো হচ্ছে
      const FORMSPREE_ENDPOINT = "https://formspree.io/f/mljjlarz"; 
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: ADMIN_EMAIL,
            message: `Payment received! Customer Email: ${email}, PayPal TXN ID: ${txnId}` 
        })
      });
      
      setLoading(false);
      setStep(2); // পাসকোড বক্স দেখাবে
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ধাপ ২: পাসকোড এবং সিক্রেট শব্দ ভেরিফাই
  const handleUnlock = (e) => {
    e.preventDefault();
    
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
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Step 2: Verify Payment</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>Enter your authorized email and PayPal Transaction ID to request access.</p>
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}
              />
              <input 
                type="text" 
                placeholder="Enter PayPal Transaction ID" 
                value={txnId} 
                onChange={(e) => setTxnId(e.target.value)}
                required
                style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}
              />
              <button 
                type="submit"
                disabled={loading}
                style={{ padding: '12px 20px', fontSize: '1rem', backgroundColor: loading ? '#95a5a6' : '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
              >
                {loading ? "Sending Request..." : "Request Access"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Step 3: Enter Credentials</h3>
            <p style={{ fontSize: '14px', color: '#27ae60', marginBottom: '15px', fontWeight: 'bold' }}>
              Request sent! Please contact admin to get your passcode and secret word.
            </p>
            <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Enter your passcode" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)}
                required
                style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center', textTransform: 'uppercase' }}
              />
              <input 
                type="text" 
                placeholder="Enter the secret word" 
                value={secretWord} 
                onChange={(e) => setSecretWord(e.target.value)}
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

// 🚨 ৬. আপনার সিক্রেট অ্যাডমিন প্যানেল
function SecretAdminPanel() {
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [authorizedList, setAuthorizedList] = useState([]);

  useEffect(() => {
    const savedEmails = JSON.parse(localStorage.getItem('authorized_emails') || '[]');
    setAuthorizedList(savedEmails);
  }, []);

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      setMessage('Please enter a valid email.');
      return;
    }

    const emailToAdd = newEmail.toLowerCase();
    
    if (!authorizedList.includes(emailToAdd)) {
      const updatedList = [...authorizedList, emailToAdd];
      localStorage.setItem('authorized_emails', JSON.stringify(updatedList));
      setAuthorizedList(updatedList);
      setMessage(`✅ ${emailToAdd} has been authorized successfully.`);
      setNewEmail('');
    } else {
      setMessage(`⚠️ ${emailToAdd} is already authorized.`);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#e74c3c' }}>🔐 Secret Admin Panel</h1>
      <p>Enter the customer's email here to grant them access to the software.</p>
      
      <form onSubmit={handleAuthorize} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Customer Email (e.g., client@gmail.com)" 
          value={newEmail} 
          onChange={(e) => setNewEmail(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', width: '300px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}
        />
        <button 
          type="submit"
          style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Authorize Email
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: message.includes('✅') ? 'green' : '#d35400' }}>{message}</p>}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f4f7f6', display: 'inline-block', borderRadius: '10px', border: '1px solid #ddd' }}>
        <h3>Authorized Emails List:</h3>
        {authorizedList.length === 0 ? (
          <p>No emails authorized yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {authorizedList.map((email, index) => (
              <li key={index} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{email}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/my-secret-admin" element={<SecretAdminPanel />} />
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