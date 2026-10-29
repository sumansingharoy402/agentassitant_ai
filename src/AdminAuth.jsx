import { useState, useEffect } from 'react';

export default function AdminAuth() {
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [authorizedList, setAuthorizedList] = useState([]);

  // পেজ লোড হলে বর্তমান লিস্ট দেখাবে
  useEffect(() => {
    const savedEmails = JSON.parse(localStorage.getItem('authorized_emails') || '[]');
    setAuthorizedList(savedEmails);
  }, []);

  // নতুন ইমেইল অ্যাড করা (Access দেওয়া)
  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      setMessage('Please enter a valid email.');
      return;
    }

    const emailToAdd = newEmail.toLowerCase();
    
    if (!authorizedList.includes(emailToAdd)) {
      const updatedList = [...authorizedList, emailToAdd];
      localStorage.setItem('authorized_emails', JSON.stringify(updatedList));
      setAuthorizedList(updatedList);
      setMessage(`✅ ${emailToAdd} has been authorized successfully.`);
      setNewEmail('');
    } else {
      setMessage(`⚠️ ${emailToAdd} is already authorized.`);
    }
  };

  // 🚨 অ্যাক্সেস বাতিল করা (Un-access)
  const handleRemoveAccess = (emailToRemove) => {
    const updatedList = authorizedList.filter((email) => email !== emailToRemove);
    localStorage.setItem('authorized_emails', JSON.stringify(updatedList));
    setAuthorizedList(updatedList);
    setMessage(`🚫 ${emailToRemove} access has been revoked.`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#e74c3c' }}>🔐 Secret Admin Panel</h1>
      <p>Enter the customer's email to grant access or revoke access.</p>
      
      <form onSubmit={handleAuthorize} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Customer Email (e.g., client@gmail.com)" 
          value={newEmail} 
          onChange={(e) => setNewEmail(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', width: '300px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}
        />
        <button 
          type="submit"
          style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Authorize Email
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: message.includes('✅') ? 'green' : message.includes('🚫') ? 'red' : '#d35400' }}>{message}</p>}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f4f7f6', display: 'inline-block', borderRadius: '10px', border: '1px solid #ddd', minWidth: '400px' }}>
        <h3>Authorized Emails List:</h3>
        {authorizedList.length === 0 ? (
          <p>No emails authorized yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {authorizedList.map((email, index) => (
              <li key={index} style={{ padding: '12px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{email}</span>
                
                {/* 🚨 Un-access বাটন */}
                <button 
                  onClick={() => handleRemoveAccess(email)}
                  style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                >
                  Un-access
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}