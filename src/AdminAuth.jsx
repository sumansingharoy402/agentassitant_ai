import { useState } from 'react';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email.');
      return;
    }

    // লোকাল স্টোরেজ থেকে বর্তমান অথোরাইজড লিস্ট নেওয়া
    const existingEmails = JSON.parse(localStorage.getItem('authorized_emails') || '[]');
    
    if (!existingEmails.includes(email.toLowerCase())) {
      // নতুন ইমেইল লিস্টে যোগ করা
      existingEmails.push(email.toLowerCase());
      localStorage.setItem('authorized_emails', JSON.stringify(existingEmails));
      setMessage(`✅ Success! ${email} has been authorized.`);
      setEmail('');
    } else {
      setMessage(`⚠️ ${email} is already authorized.`);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔐 Admin Authorization</h1>
      <p>Enter the customer's email to authorize them. They will only be able to unlock using this email.</p>
      
      <form onSubmit={handleAuthorize} style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Enter customer's email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', width: '300px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}
        />
        <button 
          type="submit"
          style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Authorize Email
        </button>
      </form>
      
      {message && <p style={{ marginTop: '20px', fontSize: '16px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}