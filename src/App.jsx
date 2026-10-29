import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Admin from './Admin';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// 🚨 ১. Supabase কানেকশন (আপনার দেওয়া Key ও URL বসানো হয়েছে)
const supabaseUrl = 'https://wbhyimvwcflbnfgmlibr.supabase.co';
const supabaseKey = 'sb_publishable_cGmtLQGIo6n--rYqElY96Q_UbyHUcpv'; 
const supabase = createClient(supabaseUrl, supabaseKey);

// 🚨 ২. Protected Route (ডেটাবেস থেকে চেক করবে)
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

      // ডেটাবেস থেকে ইউজারের স্ট্যাটাস চেক করা
      const { data, error } = await supabase
        .from('users')
        .select('is_paid, is_blocked')
        .eq('email', userEmail)
        .single();

      if (data && data.is_paid && !data.is_blocked) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Checking access...</div>;

  if (!hasAccess) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: '#e74c3c', fontFamily: 'Arial, sans-serif' }}>
        <h2>🚫 Access Denied</h2>
        <p>You have not completed the payment or your access has been revoked.</p>
        <a href="/" style={{ color: '#3498db' }}>Go back to home</a>
      </div>
    );
  }

  return children;
};

function App() {
  // 🚨 "I have paid" বাটনের ফাংশন (ডেটাবেসে সেভ করবে)
  const handlePaid = async () => {
    const email = prompt("Please enter your email to activate access:");
    if (email) {
      const { error } = await supabase
        .from('users')
        .upsert({ email: email, is_paid: true, is_blocked: false });
      
      if (!error) {
        localStorage.setItem('user_email', email);
        window.location.href = '/dashboard';
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
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
              <button 
                onClick={handlePaid}
                style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                I have paid ($99)
              </button>
            </div>
          </div>
        } />
        
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