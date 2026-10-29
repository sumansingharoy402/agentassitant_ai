import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Admin from './Admin';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// ১. Supabase কানেকশন
const supabaseUrl = 'https://wbhyimvwcflbnfgmlibr.supabase.co';
const supabaseKey = 'sb_publishable_cGmtLQGIo6n--rYqElY96Q_UbyHUcpv'; 
const supabase = createClient(supabaseUrl, supabaseKey);

// ২. Protected Route (এখানেই ব্লক চেক করা হচ্ছে)
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const userEmail = localStorage.getItem('user_email');
      if (!userEmail) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('is_paid, is_blocked')
        .eq('email', userEmail)
        .single();

      // যদি ইউজার পেইড হয় এবং ব্লকড না থাকে, তবেই ড্যাশবোর্ডে ঢুকতে পারবে
      if (data && data.is_paid && !data.is_blocked) {
        setHasAccess(true);
      }
      setLoading(false);
    };
    checkAccess();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Checking access...</div>;
  
  if (!hasAccess) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
        <h2>🚫 Access Denied</h2>
        <p>Your access is blocked or payment is not completed.</p>
        <a href="/" style={{ color: '#3498db' }}>Go to Home</a>
      </div>
    );
  }
  return children;
};

// ৩. ল্যান্ডিং পেজ
function LandingPage() {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handlePaidClick = () => {
    setShowEmailInput(true);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    
    const { error } = await supabase
      .from('users')
      .upsert({ email: email, is_paid: true, is_blocked: false });
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      localStorage.setItem('user_email', email);
      window.location.href = '/dashboard';
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Automate Your Client Follow-ups</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
        Save hours every week with AI-powered emails.
      </p>
      
      <a href="https://www.paypal.com/paypalme/Sumansingharoy/99" target="_blank" rel="noreferrer">
        <button style={{ padding: '12px 24px', fontSize: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Get Started ($99)
        </button>
      </a>

      <div style={{ marginTop: '20px' }}>
        {!showEmailInput ? (
          <button 
            onClick={handlePaidClick}
            style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            I have paid ($99)
          </button>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', width: '250px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
            <button 
              onClick={handleEmailSubmit}
              style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Activate
            </button>
          </div>
        )}

        {/* No Refund Policy Notice */}
        <div style={{ marginTop: '30px', fontSize: '14px', color: '#e53e3e', fontWeight: 'bold' }}>
          <p>⚠️ No Refund Policy: All sales are final. No refunds will be provided once access is granted.</p>
        </div>

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