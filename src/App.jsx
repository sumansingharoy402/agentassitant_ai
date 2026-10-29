import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';

// 🚨 পেমেন্ট চেক করার জন্য Protected Route
const ProtectedRoute = ({ children }) => {
  const isPaid = localStorage.getItem('payment_status') === 'paid';
  
  if (!isPaid) {
    // পেমেন্ট না হলে সরাসরি PayPal পেজে পাঠিয়ে দেওয়া হবে
    window.location.href = "https://www.paypal.com/paypalme/Sumansingharoy/99";
    return null;
  }
  return children;
};

function App() {
  // 🚨 "I have paid" বাটনের ফাংশন
  const handlePaid = () => {
    localStorage.setItem('payment_status', 'paid');
    window.location.href = '/dashboard';
  };

  return (
    <Router>
      <Routes>
        {/* 🚨 ল্যান্ডিং পেজ */}
        <Route path="/" element={
          <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Automate Your Client Follow-ups</h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
              Save hours every week with AI-powered emails.
            </p>
            
            {/* 🚨 Get Started বাটন (PayPal-এ নিয়ে যাবে) */}
            <a href="https://www.paypal.com/paypalme/Sumansingharoy/99" target="_blank" rel="noreferrer">
              <button style={{ padding: '12px 24px', fontSize: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Get Started ($99)
              </button>
            </a>

            {/* 🚨 নতুন: I have paid বাটন */}
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
        
        {/* 🚨 ড্যাশবোর্ড পেজ (পেমেন্ট করা ছাড়া ঢোকা যাবে না) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;