import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Automate Your Client Follow-ups</h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
              Save hours every week with AI-powered emails.
            </p>
            <a href="/dashboard">
              <button style={{ padding: '12px 24px', fontSize: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Get Started
              </button>
            </a>
          </div>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;