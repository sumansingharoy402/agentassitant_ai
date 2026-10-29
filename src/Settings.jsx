import { useState, useEffect } from 'react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // পেজ লোড হলে LocalStorage থেকে Key চেক করবে
  useEffect(() => {
    const savedKey = localStorage.getItem('user_gemini_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      alert("Please enter a valid API key.");
      return;
    }
    localStorage.setItem('user_gemini_key', apiKey);
    setIsSaved(true);
    alert("API Key Saved Successfully! You can now use the AI tools.");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>⚙️ Settings & API Key</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        To use this software, you must enter your own Gemini API Key. This key is stored locally on your browser and is never sent to our servers.
      </p>

      {isSaved ? (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c3e6cb' }}>
          ✅ Your API Key is saved and active!
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
          ⚠️ You have not entered an API key yet. Please add one below.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', gap: '15px' }}>
        <label style={{ fontWeight: 'bold', color: '#333' }}>Enter your Gemini API Key:</label>
        <input 
          type="password" 
          placeholder="Paste your key here (AQ... or AIzaSy...)" 
          value={apiKey} 
          onChange={(e) => setApiKey(e.target.value)} 
          style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '8px' }} 
        />
        <button onClick={saveApiKey} style={{ padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
          💾 Save API Key
        </button>
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: '#3498db', textDecoration: 'none', fontSize: '14px', marginTop: '10px' }}>
          Don't have a key? Get one for free from Google AI Studio here.
        </a>
      </div>
    </div>
  );
}