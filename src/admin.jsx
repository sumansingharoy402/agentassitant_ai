import { useState } from 'react';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [blocked, setBlocked] = useState(false);

  const handleBlock = () => {
    const blockedList = JSON.parse(localStorage.getItem('blocked_emails') || '[]');
    if (!blockedList.includes(email)) {
      blockedList.push(email);
      localStorage.setItem('blocked_emails', JSON.stringify(blockedList));
      setBlocked(true);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔒 Admin Panel: Block User</h1>
      <p>Enter the email address of the user you want to block.</p>
      
      <input 
        type="email" 
        placeholder="user@example.com" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        style={{ padding: '10px', fontSize: '16px', width: '300px', marginRight: '10px' }}
      />
      <button 
        onClick={handleBlock}
        style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Block Access
      </button>

      {blocked && <p style={{ color: 'green', marginTop: '10px' }}>✅ User blocked successfully!</p>}
    </div>
  );
}