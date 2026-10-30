import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // 🚨 API Key Environment Variable থেকে আসবে
  const GLOBAL_API_KEY = import.meta.env.GEMINI_API_KEY || "";
  
  const [userPlan, setUserPlan] = useState(localStorage.getItem('user_plan') || 'free');
  
  const [clientName, setClientName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [tone, setTone] = useState('Professional');
  const [emailTemplate, setEmailTemplate] = useState('Follow-up');
  const [email, setEmail] = useState('');

  const [reviewText, setReviewText] = useState('');
  const [reviewReply, setReviewReply] = useState('');

  const [propertyDetails, setPropertyDetails] = useState('');
  const [description, setDescription] = useState('');

  const handlePayment = (plan) => {
    const paypalLink = plan === 'lifetime' 
      ? 'https://www.paypal.com/paypalme/Sumansingharoy/99' 
      : 'https://www.paypal.com/paypalme/Sumansingharoy/19';
    
    window.open(paypalLink, '_blank');
    
    const enteredCode = window.prompt("Please enter the Access Code you received after payment:");
    const SECRET_ACCESS_CODE = "PRO999"; 

    if (enteredCode && enteredCode.toUpperCase() === SECRET_ACCESS_CODE) {
      localStorage.setItem('user_plan', 'pro');
      setUserPlan('pro');
      setShowUpgradeModal(false);
      alert("🎉 Payment verified! Welcome to Pro.");
    } else if (enteredCode !== null) {
      alert("❌ Invalid Access Code. Please make sure you have paid and entered the correct code.");
    }
  };

  const callGeminiAPI = async (prompt, setResult) => {
    setLoading(true);
    setResult('');
    
    if (!GLOBAL_API_KEY) {
      setResult("Error: API Key is missing. Please contact admin.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-goog-api-key': GLOBAL_API_KEY 
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setResult(data.candidates[0].content.parts[0].text);
      } else {
        setResult("Error: " + (data.error?.message || "Could not generate response."));
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Error: Network issue or API failed.");
    } finally {
      setLoading(false);
    }
  };

  const generateEmail = () => {
    const prompt = `Write a ${tone} ${emailTemplate} email for a real estate client named ${clientName} regarding the property at ${propertyAddress}. Include a good subject line. Do not include placeholders.`;
    callGeminiAPI(prompt, setEmail);
  };

  const generateReviewReply = () => {
    const prompt = `Write a professional and polite response to this Google review for a real estate agency: "${reviewText}". Do not include placeholders.`;
    callGeminiAPI(prompt, setReviewReply);
  };

  const generateDescription = () => {
    const prompt = `Write an attractive property listing description for a property with these details: ${propertyDetails}. Do not include placeholders.`;
    callGeminiAPI(prompt, setDescription);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const clearEmailForm = () => { setClientName(''); setPropertyAddress(''); setEmail(''); };
  const clearReviewForm = () => { setReviewText(''); setReviewReply(''); };
  const clearDescriptionForm = () => { setPropertyDetails(''); setDescription(''); };

  const getWordCount = (text) => text ? text.trim().split(/\s+/).length : 0;

  const theme = {
    bg: darkMode ? '#1a1a1a' : '#f4f7f6',
    sidebar: darkMode ? '#111827' : '#2c3e50',
    text: darkMode ? '#f3f4f6' : '#333333',
    inputBg: darkMode ? '#374151' : '#ffffff',
    inputText: darkMode ? '#ffffff' : '#000000',
    resultBg: darkMode ? '#374151' : '#ffffff',
    border: darkMode ? '#4b5563' : '#e5e7eb',
    modalBg: darkMode ? '#1f2937' : '#ffffff',
    cardBg: darkMode ? '#1f2937' : '#ffffff'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, Arial, sans-serif', backgroundColor: theme.bg }}>
      <div style={{ width: '260px', backgroundColor: theme.sidebar, color: 'white', padding: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>🤖 AgentAssist AI</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
          <li style={{ padding: '12px 15px', marginBottom: '5px', borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'email' ? '#3498db' : 'transparent', fontWeight: activeTab === 'email' ? 'bold' : 'normal' }} onClick={() => setActiveTab('email')}>✉️ Email Generator</li>
          <li style={{ padding: '12px 15px', marginBottom: '5px', borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'review' ? '#3498db' : 'transparent', fontWeight: activeTab === 'review' ? 'bold' : 'normal' }} onClick={() => setActiveTab('review')}>⭐ Review Replier</li>
          <li style={{ padding: '12px 15px', marginBottom: '5px', borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'description' ? '#3498db' : 'transparent', fontWeight: activeTab === 'description' ? 'bold' : 'normal' }} onClick={() => setActiveTab('description')}>🏠 Property Descriptions</li>
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bg }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: theme.text }}>Dashboard Overview</div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: darkMode ? '#f1f5f9' : '#333', color: darkMode ? '#333' : '#fff' }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {userPlan === 'pro' ? (
              <span style={{ padding: '8px 16px', backgroundColor: '#27ae60', color: 'white', borderRadius: '5px', fontWeight: 'bold' }}>⭐ Pro Member</span>
            ) : (
              <button onClick={() => setShowUpgradeModal(true)} style={{ padding: '8px 16px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>⭐ Upgrade to Pro</button>
            )}
            
            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#3498db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' }}>S</div>
              {showProfileMenu && (
                <div style={{ position: 'absolute', top: '48px', right: '0', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '160px', zIndex: 10 }}>
                  <div style={{ padding: '12px 15px', cursor: 'pointer', borderBottom: `1px solid ${theme.border}`, color: theme.text }}>👤 My Profile</div>
                  <div style={{ padding: '12px 15px', cursor: 'pointer', color: '#e74c3c', fontWeight: 'bold' }}>🚪 Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1, backgroundColor: theme.cardBg, padding: '20px', borderRadius: '10px', border: `1px solid ${theme.border}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: 0, color: theme.text, fontSize: '14px', opacity: 0.7 }}>Total Emails Generated</h4>
              <h2 style={{ margin: '10px 0 0 0', color: '#3498db', fontSize: '28px' }}>124</h2>
            </div>
            <div style={{ flex: 1, backgroundColor: theme.cardBg, padding: '20px', borderRadius: '10px', border: `1px solid ${theme.border}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: 0, color: theme.text, fontSize: '14px', opacity: 0.7 }}>Properties Listed</h4>
              <h2 style={{ margin: '10px 0 0 0', color: '#27ae60', fontSize: '28px' }}>38</h2>
            </div>
            <div style={{ flex: 1, backgroundColor: theme.cardBg, padding: '20px', borderRadius: '10px', border: `1px solid ${theme.border}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: 0, color: theme.text, fontSize: '14px', opacity: 0.7 }}>Reviews Replied</h4>
              <h2 style={{ margin: '10px 0 0 0', color: '#e67e22', fontSize: '28px' }}>19</h2>
            </div>
          </div>

          {activeTab === 'email' && (
            <div>
              <h2 style={{ color: theme.text }}>✉️ AI Email Generator</h2>
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '450px', gap: '15px', marginTop: '20px' }}>
                <input type="text" placeholder="Client Name (e.g., John Smith)" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ padding: '12px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.inputText, border: `1px solid ${theme.border}`, borderRadius: '8px' }} />
                <input type="text" placeholder="Property Address (e.g., 10 Downing St, London)" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} style={{ padding: '12px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.inputText, border: `1px solid ${theme.border}`, borderRadius: '8px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select value={emailTemplate} onChange={(e) => setEmailTemplate(e.target.value)} style={{ flex: 1, padding: '12px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.inputText, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Viewing Confirmation">Viewing Confirmation</option>
                    <option value="Price Update">Price Update</option>
                  </select>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ flex: 1, padding: '12px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.inputText, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={generateEmail} disabled={loading} style={{ flex: 1, padding: '14px', backgroundColor: loading ? '#95a5a6' : '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {loading ? 'Generating...' : '🪄 Generate Email'}
                  </button>
                  <button onClick={clearEmailForm} style={{ padding: '14px', backgroundColor: 'transparent', color: '#e74c3c', border: `1px solid #e74c3c`, borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>Clear</button>
                </div>
              </div>
              {loading && <div style={{ marginTop: '20px', fontSize: '18px', color: '#3498db' }}>🔄 AI is thinking...</div>}
              {email && !loading && (
                <div style={{ marginTop: '30px', padding: '25px', backgroundColor: theme.resultBg, borderLeft: '5px solid #3498db', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: theme.text, marginTop: 0 }}>Generated Email ({getWordCount(email)} words):</h3>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: theme.text, fontSize: '15px' }}>{email}</p>
                  <button onClick={() => copyToClipboard(email)} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📋 Copy to Clipboard</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'review' && (
            <div>
              <h2 style={{ color: theme.text }}>⭐ Google Review Replier</h2>
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '450px', gap: '15px', marginTop: '20px' }}>
                <textarea placeholder="Paste your client's Google review here..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} style={{ padding: '12px', fontSize: '16px', minHeight: '120px', backgroundColor: theme.inputBg, color: theme.inputText, border: `1px solid ${theme.border}`, borderRadius: '8px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={generateReviewReply} disabled={loading} style={{ flex: 1, padding: '14px', backgroundColor: loading ? '#95a5a6' : '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {loading ? 'Generating...' : '🪄 Generate Reply'}
                  </button>
                  <button onClick={clearReviewForm} style={{ padding: '14px', backgroundColor: 'transparent', color: '#e74c3c', border: `1px solid #e74c3c`, borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>Clear</button>
                </div>
              </div>
              {loading && <div style={{ marginTop: '20px', fontSize: '18px', color: '#3498db' }}>🔄 AI is thinking...</div>}
              {reviewReply && !loading && (
                <div style={{ marginTop: '30px', padding: '25px', backgroundColor: theme.resultBg, borderLeft: '5px solid #3498db', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: theme.text, marginTop: 0 }}>Generated Reply ({getWordCount(reviewReply)} words):</h3>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: theme.text, fontSize: '15px' }}>{reviewReply}</p>
                  <button onClick={() => copyToClipboard(reviewReply)} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📋 Copy to Clipboard</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'description' && (
            <div>
              <h2 style={{ color: theme.text }}>🏠 Property Description Writer</h2>
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '450px', gap: '15px', marginTop: '20px' }}>
                <input type="text" placeholder="Property Details (e.g., 3 bed, 2 bath, garden, garage)" value={propertyDetails} onChange={(e) => setPropertyDetails(e.target.value)} style={{ padding: '12px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.inputText, border: `1px solid ${theme.border}`, borderRadius: '8px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={generateDescription} disabled={loading} style={{ flex: 1, padding: '14px', backgroundColor: loading ? '#95a5a6' : '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {loading ? 'Generating...' : '🪄 Generate Description'}
                  </button>
                  <button onClick={clearDescriptionForm} style={{ padding: '14px', backgroundColor: 'transparent', color: '#e74c3c', border: `1px solid #e74c3c`, borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>Clear</button>
                </div>
              </div>
              {loading && <div style={{ marginTop: '20px', fontSize: '18px', color: '#3498db' }}>🔄 AI is thinking...</div>}
              {description && !loading && (
                <div style={{ marginTop: '30px', padding: '25px', backgroundColor: theme.resultBg, borderLeft: '5px solid #3498db', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: theme.text, marginTop: 0 }}>Generated Description ({getWordCount(description)} words):</h3>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: theme.text, fontSize: '15px' }}>{description}</p>
                  <button onClick={() => copyToClipboard(description)} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📋 Copy to Clipboard</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showUpgradeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: theme.modalBg, padding: '40px', borderRadius: '15px', width: '450px', position: 'relative', textAlign: 'center' }}>
            <button onClick={() => setShowUpgradeModal(false)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}>✖</button>
            
            <h1 style={{ color: theme.text, margin: '0 0 10px 0', fontSize: '28px' }}>Upgrade to Pro 🚀</h1>
            <p style={{ color: theme.text, marginBottom: '30px', opacity: 0.8 }}>Unlock unlimited AI generations and premium features.</p>
            
            <div style={{ border: '2px solid #3498db', borderRadius: '12px', padding: '20px', marginBottom: '20px', backgroundColor: darkMode ? '#111827' : '#f0f8ff', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: '#e67e22', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>BEST VALUE</span>
              <h3 style={{ color: theme.text, margin: '0 0 5px 0' }}>Lifetime Deal</h3>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#3498db', margin: '0' }}>$99</p>
              <p style={{ color: theme.text, fontSize: '14px', margin: '5px 0 0 0' }}>One-time payment. Lifetime access.</p>
              <button 
                onClick={() => handlePayment('lifetime')} 
                style={{ width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', marginTop: '15px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Proceed to Payment
              </button>
            </div>

            <div style={{ border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', position: 'relative', zIndex: 10 }}>
              <h3 style={{ color: theme.text, margin: '0 0 5px 0' }}>Monthly</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#e67e22', margin: '0' }}>$19/mo</p>
              <p style={{ color: theme.text, fontSize: '14px', margin: '5px 0 0 0' }}>Cancel anytime.</p>
              <button 
                onClick={() => handlePayment('monthly')} 
                style={{ width: '100%', padding: '12px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', marginTop: '15px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}