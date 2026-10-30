import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // 🚨 API Key Environment Variable থেকে আসবে
  const GLOBAL_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
  
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
      // 🚨 OpenRouter API এন্ডপয়েন্ট - Fallback Models
      const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GLOBAL_API_KEY}`,
            'HTTP-Referer': 'https://agentassistant-ai.vercel.app',
            'X-Title': 'AgentAssist AI'
        },
        body: JSON.stringify({
          // 🚨 Fallback Models: প্রথমটি ফেইল করলে পরেরটি চেষ্টা করবে
          models: [
            "google/gemma-4-26b-a4b-it:free",
            "nvidia/nemotron-3-ultra-550b-a55b:free",
            "cohere/north-mini-code:free"
          ],
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500
        })
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content) {
        setResult(data.choices[0].message.content);
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
    bg: darkMode ? '#111827' : '#f9fafb',
    sidebar: darkMode ? '#1f2937' : '#ffffff',
    sidebarBorder: darkMode ? '#374151' : '#e5e7eb',
    text: darkMode ? '#f9fafb' : '#111827',
    subText: darkMode ? '#9ca3af' : '#6b7280',
    inputBg: darkMode ? '#374151' : '#ffffff',
    inputBorder: darkMode ? '#4b5563' : '#d1d5db',
    cardBg: darkMode ? '#1f2937' : '#ffffff',
    cardBorder: darkMode ? '#374151' : '#e5e7eb',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    accent: '#10b981',
    danger: '#ef4444',
    resultBg: darkMode ? '#1e293b' : '#f8fafc',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: theme.bg }}>
      
      <div style={{ width: '260px', backgroundColor: theme.sidebar, borderRight: `1px solid ${theme.sidebarBorder}`, padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>A</div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: 0 }}>AgentAssist</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setActiveTab('email')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'email' ? theme.primary : 'transparent', color: activeTab === 'email' ? 'white' : theme.subText, cursor: 'pointer', fontWeight: '500', textAlign: 'left', transition: 'all 0.2s' }}>
            <span>✉️</span> Email Generator
          </button>
          <button onClick={() => setActiveTab('review')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'review' ? theme.primary : 'transparent', color: activeTab === 'review' ? 'white' : theme.subText, cursor: 'pointer', fontWeight: '500', textAlign: 'left', transition: 'all 0.2s' }}>
            <span>⭐</span> Review Replier
          </button>
          <button onClick={() => setActiveTab('description')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'description' ? theme.primary : 'transparent', color: activeTab === 'description' ? 'white' : theme.subText, cursor: 'pointer', fontWeight: '500', textAlign: 'left', transition: 'all 0.2s' }}>
            <span>🏠</span> Property Descriptions
          </button>
        </nav>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: `1px solid ${theme.cardBorder}`, backgroundColor: theme.sidebar }}>
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Dashboard</h1>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: theme.cardBg, cursor: 'pointer', fontSize: '18px' }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {userPlan === 'pro' ? (
              <span style={{ padding: '6px 12px', backgroundColor: theme.accent, color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>⭐ Pro</span>
            ) : (
              <button onClick={() => setShowUpgradeModal(true)} style={{ padding: '8px 16px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Upgrade</button>
            )}
            
            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: theme.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' }}>S</div>
              {showProfileMenu && (
                <div style={{ position: 'absolute', top: '48px', right: '0', backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '160px', zIndex: 10, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.text, fontSize: '14px' }}>👤 My Profile</div>
                  <div style={{ padding: '12px 16px', cursor: 'pointer', color: theme.danger, fontSize: '14px', fontWeight: '500' }}>🚪 Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
            <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.cardBorder}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: 0, color: theme.subText, fontSize: '14px', fontWeight: '500' }}>Total Emails</h4>
              <h2 style={{ margin: '8px 0 0 0', color: theme.text, fontSize: '32px', fontWeight: '700' }}>124</h2>
            </div>
            <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.cardBorder}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: 0, color: theme.subText, fontSize: '14px', fontWeight: '500' }}>Properties Listed</h4>
              <h2 style={{ margin: '8px 0 0 0', color: theme.text, fontSize: '32px', fontWeight: '700' }}>38</h2>
            </div>
            <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.cardBorder}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: 0, color: theme.subText, fontSize: '14px', fontWeight: '500' }}>Reviews Replied</h4>
              <h2 style={{ margin: '8px 0 0 0', color: theme.text, fontSize: '32px', fontWeight: '700' }}>19</h2>
            </div>
          </div>

          {activeTab === 'email' && (
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>✉️ AI Email Generator</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Client Name (e.g., John Smith)" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ padding: '14px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: '10px', outline: 'none' }} />
                <input type="text" placeholder="Property Address (e.g., 10 Downing St, London)" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} style={{ padding: '14px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: '10px', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select value={emailTemplate} onChange={(e) => setEmailTemplate(e.target.value)} style={{ flex: 1, padding: '14px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: '10px', outline: 'none' }}>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Viewing Confirmation">Viewing Confirmation</option>
                    <option value="Price Update">Price Update</option>
                  </select>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ flex: 1, padding: '14px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: '10px', outline: 'none' }}>
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button onClick={generateEmail} disabled={loading} style={{ flex: 1, padding: '14px', backgroundColor: loading ? theme.subText : theme.primary, color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Generating...' : '🪄 Generate Email'}
                  </button>
                  <button onClick={clearEmailForm} style={{ padding: '14px 24px', backgroundColor: 'transparent', color: theme.danger, border: `1px solid ${theme.danger}`, borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Clear</button>
                </div>
              </div>
              {loading && <div style={{ marginTop: '24px', fontSize: '16px', color: theme.primary, fontWeight: '500' }}>🔄 AI is thinking...</div>}
              {email && !loading && (
                <div style={{ marginTop: '32px', padding: '24px', backgroundColor: theme.resultBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px' }}>
                  <h3 style={{ color: theme.text, marginTop: 0, fontSize: '16px', fontWeight: '600' }}>Generated Email ({getWordCount(email)} words):</h3>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: theme.text, fontSize: '15px' }}>{email}</p>
                  <button onClick={() => copyToClipboard(email)} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>📋 Copy to Clipboard</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'review' && (
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>⭐ Google Review Replier</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <textarea placeholder="Paste your client's Google review here..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} style={{ padding: '14px', fontSize: '16px', minHeight: '140px', backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: '10px', outline: 'none', resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={generateReviewReply} disabled={loading} style={{ flex: 1, padding: '14px', backgroundColor: loading ? theme.subText : theme.primary, color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Generating...' : '🪄 Generate Reply'}
                  </button>
                  <button onClick={clearReviewForm} style={{ padding: '14px 24px', backgroundColor: 'transparent', color: theme.danger, border: `1px solid ${theme.danger}`, borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Clear</button>
                </div>
              </div>
              {loading && <div style={{ marginTop: '24px', fontSize: '16px', color: theme.primary, fontWeight: '500' }}>🔄 AI is thinking...</div>}
              {reviewReply && !loading && (
                <div style={{ marginTop: '32px', padding: '24px', backgroundColor: theme.resultBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px' }}>
                  <h3 style={{ color: theme.text, marginTop: 0, fontSize: '16px', fontWeight: '600' }}>Generated Reply ({getWordCount(reviewReply)} words):</h3>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: theme.text, fontSize: '15px' }}>{reviewReply}</p>
                  <button onClick={() => copyToClipboard(reviewReply)} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>📋 Copy to Clipboard</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'description' && (
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>🏠 Property Description Writer</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Property Details (e.g., 3 bed, 2 bath, garden, garage)" value={propertyDetails} onChange={(e) => setPropertyDetails(e.target.value)} style={{ padding: '14px', fontSize: '16px', backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: '10px', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={generateDescription} disabled={loading} style={{ flex: 1, padding: '14px', backgroundColor: loading ? theme.subText : theme.primary, color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Generating...' : '🪄 Generate Description'}
                  </button>
                  <button onClick={clearDescriptionForm} style={{ padding: '14px 24px', backgroundColor: 'transparent', color: theme.danger, border: `1px solid ${theme.danger}`, borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Clear</button>
                </div>
              </div>
              {loading && <div style={{ marginTop: '24px', fontSize: '16px', color: theme.primary, fontWeight: '500' }}>🔄 AI is thinking...</div>}
              {description && !loading && (
                <div style={{ marginTop: '32px', padding: '24px', backgroundColor: theme.resultBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px' }}>
                  <h3 style={{ color: theme.text, marginTop: 0, fontSize: '16px', fontWeight: '600' }}>Generated Description ({getWordCount(description)} words):</h3>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: theme.text, fontSize: '15px' }}>{description}</p>
                  <button onClick={() => copyToClipboard(description)} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>📋 Copy to Clipboard</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showUpgradeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: theme.cardBg, padding: '32px', borderRadius: '16px', width: '400px', position: 'relative', border: `1px solid ${theme.cardBorder}` }}>
            <button onClick={() => setShowUpgradeModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: theme.subText }}>✖</button>
            
            <h1 style={{ color: theme.text, margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>Upgrade to Pro 🚀</h1>
            <p style={{ color: theme.subText, marginBottom: '24px', fontSize: '14px' }}>Unlock unlimited AI generations.</p>
            
            <div style={{ border: `2px solid ${theme.primary}`, borderRadius: '12px', padding: '20px', marginBottom: '16px', position: 'relative' }}>
              <h3 style={{ color: theme.text, margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>Lifetime Deal</h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: theme.primary, margin: '0' }}>$99</p>
              <p style={{ color: theme.subText, fontSize: '13px', margin: '4px 0 0 0' }}>One-time payment.</p>
              <button onClick={() => handlePayment('lifetime')} style={{ width: '100%', padding: '12px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', marginTop: '16px', cursor: 'pointer' }}>Pay Now</button>
            </div>

            <div style={{ border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ color: theme.text, margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>Monthly</h3>
              <p style={{ fontSize: '28px', fontWeight: '700', color: theme.accent, margin: '0' }}>$19/mo</p>
              <p style={{ color: theme.subText, fontSize: '13px', margin: '4px 0 0 0' }}>Cancel anytime.</p>
              <button onClick={() => handlePayment('monthly')} style={{ width: '100%', padding: '12px', backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', marginTop: '16px', cursor: 'pointer' }}>Pay Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}