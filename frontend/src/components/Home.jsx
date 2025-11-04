import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [thinking, setThinking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('lawUser'));
    if (!user) {
      navigate('/');
    } else {
      setUsername(user.username);
    }
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleSubmit = async () => {
    const prompt = input.trim();
    if (!prompt) return;

    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setThinking(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, username })
      });
      const data = await res.json().catch(() => ({}));
      const reply = res.ok ? (data.reply || 'No response') : (data.message || 'Error');
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setThinking(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('lawUser');
    navigate('/');
  };

  return (
    <div
      style={{
        background: `url('law.webp') no-repeat center center fixed`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative'
      }}
    >
      <button
        onClick={logout}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 14px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(14px)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          color: '#2c3e50'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255,255,255,0.25)',
            padding: '15px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.3)',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: '600',
            color: '#000'
          }}
        >
          ⚖️ Law Assistant — Welcome, {username}
        </div>

        {/* Chat Section */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: m.role === 'user' ? 'rgba(52,152,219,0.85)' : 'rgba(255,255,255,0.7)',
                color: m.role === 'user' ? 'white' : '#2c3e50',
                padding: '12px 16px',
                borderRadius: '14px',
                maxWidth: '70%',
                lineHeight: '1.4',
                whiteSpace: 'pre-wrap',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              {m.content}
            </div>
          ))}
          {thinking && (
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.7)',
                color: '#555',
                padding: '12px 16px',
                borderRadius: '14px',
                maxWidth: '60%',
                alignSelf: 'flex-start',
                fontStyle: 'italic'
              }}
            >
              Thinking...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.2)',
            gap: '10px'
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your legal question..."
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.5)',
              color: '#2c3e50',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '16px',
              resize: 'none',
              minHeight: '60px',
              maxHeight: '120px',
              outline: 'none',
              fontWeight: '500'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!thinking) handleSubmit();
              }
            }}
            disabled={thinking}
          />
          <button
            onClick={handleSubmit}
            disabled={thinking}
            style={{
              backgroundColor: '#3498db',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: thinking ? 0.6 : 1,
              transition: '0.2s'
            }}
          >
            <Send size={20} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
