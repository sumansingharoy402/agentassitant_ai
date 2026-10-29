import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbhyimvwcflbnfgmlibr.supabase.co';
const supabaseKey = 'sb_publishable_cGmtLQGIo6n--rYqElY96Q_UbyHUcpv'; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Admin() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleBlock = async () => {
    const { error } = await supabase
      .from('users')
      .update({ is_blocked: true })
      .eq('email', email);
    
    if (!error) setStatus('User blocked successfully!');
  };

  const handleUnblock = async () => {
    const { error } = await supabase
      .from('users')
      .update({ is_blocked: false })
      .eq('email', email);
    
    if (!error) setStatus('User unblocked successfully!');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔒 Admin Panel</h1>
      <input 
        type="email" 
        placeholder="user@example.com" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        style={{ padding: '10px', fontSize: '16px', width: '300px' }}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleBlock} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
          Block Access
        </button>
        <button onClick={handleUnblock} style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Unblock Access
        </button>
      </div>
      {status && <p style={{ color: 'green', marginTop: '10px' }}>{status}</p>}
    </div>
  );
}