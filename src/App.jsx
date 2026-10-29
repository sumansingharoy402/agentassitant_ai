import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Admin from './Admin'; // 🚨 নতুন: Admin কম্পোনেন্ট ইমপোর্ট

// 🚨 পেমেন্ট এবং ব্লক চেক করার জন্য Protected Route
const ProtectedRoute = ({ children }) => {
  const isPaid = localStorage.getItem('payment_status') === 'paid';
  const userEmail = localStorage.getItem('user_email'); // কাস্টমারের ইমেইল
  const blockedList = JSON.parse(localStorage.getItem('blocked_emails') || '[]');
  
  // 🚨 যদি কাস্টমার ব্লক লিস্টে থাকে
  if (blockedList.includes(userEmail)) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif', color: '#e74c3c' }}>
        <h2>🚫 Access Blocked</h2>
        <p>Your access has been revoked. Please contact support.</p>
      </div>
    );
  }
  
  // 🚨 যদি পেমেন্ট না করা থাকে
  if (!isPaid) {
    window.location.href = "https://www.paypal.com/paypalme/Sumansingharoy/99";
    return null;
  }
  return children;
};

function App() {
  // 🚨 "I have paid" বাটনের ফাংশন
  const handlePaid = () => {
    // এখানে কাস্টমারের ইমেইল সেভ করা হচ্ছে (আপনি চাইলে ইনপুট নিতে পারেন)
    const email = prompt("Please enter your email to activate access:");
    if (email) {
      localStorage.setItem('user_email', email);
      localStorage.setItem('payment_status', 'paid');
      window.location.href = '/dashboard';
    }
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

            {/* 🚨 I have paid বাটন */}
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
        
        {/* 🚨 ড্যাশবোর্ড পেজ (পেমেন্ট ও ব্লক চেক) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* 🚨 নতুন: Admin Panel (ব্লক করার জন্য) */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;