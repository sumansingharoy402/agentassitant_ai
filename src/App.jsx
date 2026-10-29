import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard';
import { useState, useEffect } from 'react';

// 🚨 পেমেন্ট চেক করার জন্য Protected Route
const ProtectedRoute = ({ children }) => {
  // localStorage থেকে চেক করা হচ্ছে পেমেন্ট হয়েছে কি না
  const isPaid = localStorage.getItem('payment_status') === 'paid';
  
  if (!isPaid) {
    // পেমেন্ট না হলে সরাসরি PayPal পেজে পাঠিয়ে দেওয়া হবে
    window.location.href = "https://www.paypal.com/paypalme/Sumansingharoy/99";
    return null;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🚨 ল্যান্ডিং পেজ (Get Started বাটনে ক্লিক করলে PayPal-এ যাবে) */}
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
            <p style={{ marginTop: '20px', fontSize: '14px', color: '#999' }}>
              Already paid? 
              <a href="/dashboard" style={{ marginLeft: '5px', color: '#3498db', fontWeight: 'bold' }}>Go to Dashboard</a>
            </p>
          </div>
        } />
        
        {/* 🚨 ড্যাশবোর্ড পেজ (পেমেন্ট করা ছাড়া ঢোকা যাবে না) */}
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