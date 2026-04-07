import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LANG_LABELS = { english: '🇬🇧 English', urdu: '🇵🇰 اردو', turkish: '🇹🇷 Türkçe' };

const WELCOME = {
  english: {
    title: "Hello! I'm GastroCare AI 🏥",
    sub: 'Ask me anything about stomach health, diet, nutrition, or general wellness.',
    suggestions: ['What foods help digestion?', 'I have stomach pain', 'Diet for acid reflux', 'How to lose weight?']
  },
  urdu: {
    title: 'السلام علیکم! میں GastroCare AI ہوں 🏥',
    sub: 'معدے کی صحت، خوراک، یا عمومی تندرستی کے بارے میں کچھ بھی پوچھیں۔',
    suggestions: ['معدے کی تکلیف', 'تیزابیت کا علاج', 'صحت مند غذا', 'وزن کم کرنا']
  },
  turkish: {
    title: "Merhaba! Ben GastroCare AI 🏥",
    sub: 'Mide sağlığı, diyet veya genel sağlık hakkında istediğinizi sorun.',
    suggestions: ['Mide ağrısı', 'Asit reflü', 'Sağlıklı beslenme', 'Kilo vermek']
  }
};

const Chatbot = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef();
  const textareaRef = useRef();

  useEffect(() => { fetchChats(); }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('/api/chat');
      setChats(data);
    } catch (err) {
      console.error('Fetch chats error:', err);
    }
  };

  const loadChat = async (id) => {
    try {
      const { data } = await axios.get(`/api/chat/${id}`);
      setActiveChatId(id);
      setMessages(data.messages);
      setLanguage(data.language);
      setError('');
      setSidebarOpen(false);
    } catch (err) {
      setError('Could not load chat. Please try again.');
    }
  };

  const newChat = async () => {
    try {
      const { data } = await axios.post('/api/chat/new', { language });
      setChats(prev => [data, ...prev]);
      setActiveChatId(data._id);
      setMessages([]);
      setError('');
      setSidebarOpen(false);
    } catch (err) {
      console.error('New chat error:', err);
      setError('Could not create new chat. Is the server running?');
    }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat?')) return;
    try {
      await axios.delete(`/api/chat/${id}`);
      setChats(prev => prev.filter(c => c._id !== id));
      if (activeChatId === id) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (err) {
      setError('Could not delete chat.');
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError('');
    let chatId = activeChatId;

    // Create new chat if none active
    if (!chatId) {
      try {
        const { data } = await axios.post('/api/chat/new', { language });
        chatId = data._id;
        setActiveChatId(chatId);
        setChats(prev => [data, ...prev]);
      } catch (err) {
        setError('Could not create chat. Make sure the server is running (npm run dev in server folder).');
        return;
      }
    }

    // Show user message immediately
    const userMsg = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post(`/api/chat/${chatId}/message`, {
        message: trimmed,
        language
      });

      const aiMsg = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isEmergency: data.isEmergency
      };
      setMessages(prev => [...prev, aiMsg]);

      // Refresh chat list to update title
      fetchChats();

    } catch (err) {
      const errMsg = err.response?.data?.message || 'Server error. Please check if backend is running.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${errMsg}`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fmtTime = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const initial = user?.name?.[0]?.toUpperCase() || 'U';
  const welcome = WELCOME[language];

  return (
    <div className="page-pt">
      <div className="gc-chatbot-wrap">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 800 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <div className={`gc-sidebar ${sidebarOpen ? 'show' : ''}`}>
          <div className="gc-sidebar-head">
            <h5 className="mb-0">
              <i className="bi bi-chat-dots me-2" />Chats
            </h5>
            <button className="gc-new-btn mt-2" onClick={newChat}>
              <i className="bi bi-plus-lg me-1" /> New Chat
            </button>
            <select
              className="gc-lang-select"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="english">🇬🇧 English</option>
              <option value="urdu">🇵🇰 Urdu / اردو</option>
              <option value="turkish">🇹🇷 Türkçe</option>
            </select>
          </div>

          <div className="gc-chat-list">
            {chats.length === 0 ? (
              <div className="text-center py-4" style={{ color: 'rgba(255,255,255,.45)', fontSize: '.8rem' }}>
                No chats yet.<br />Start a new chat!
              </div>
            ) : (
              chats.map(c => (
                <div
                  key={c._id}
                  className={`gc-chat-item ${activeChatId === c._id ? 'active' : ''}`}
                  onClick={() => loadChat(c._id)}
                >
                  <i className="bi bi-chat-left-text me-2" style={{ fontSize: '.8rem', opacity: .6 }} />
                  <span className="gc-chat-item-title">{c.title}</span>
                  <button className="gc-del-btn" onClick={e => deleteChat(c._id, e)}>
                    <i className="bi bi-trash3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Main Chat Area ── */}
        <div className="gc-chat-main">
          {/* Header */}
          <div className="gc-chat-header">
            <button
              className="btn btn-sm d-lg-none me-2 p-1"
              style={{ color: 'var(--gc-primary)' }}
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-list fs-5" />
            </button>
            <div className="gc-chat-header-icon">🤖</div>
            <div>
              <div className="fw-semibold" style={{ color: 'var(--gc-primary-dark)' }}>GastroCare AI</div>
              <div className="text-muted small d-flex align-items-center gap-1">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#27ae60', display: 'inline-block' }} />
                Online — {LANG_LABELS[language]}
              </div>
            </div>
            <div className="ms-auto d-flex gap-2">
              <span className="badge rounded-pill d-none d-md-inline-flex align-items-center" style={{ background: 'rgba(10,79,60,.1)', color: 'var(--gc-primary)', fontSize: '.75rem' }}>
                <i className="bi bi-shield-check me-1" />Secure
              </span>
              {activeChatId && (
                <button className="btn btn-sm btn-outline-secondary" onClick={newChat}>
                  <i className="bi bi-plus me-1" />New
                </button>
              )}
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="alert alert-warning alert-dismissible m-2 py-2" style={{ fontSize: '.85rem' }}>
              <i className="bi bi-exclamation-triangle me-2" />{error}
              <button className="btn-close btn-sm" onClick={() => setError('')} />
            </div>
          )}

          {/* Messages */}
          <div className="gc-messages">
            {messages.length === 0 ? (
              <div className="gc-welcome">
                <div className="gc-welcome-icon">🏥</div>
                <h4 style={{ color: 'var(--gc-primary)' }}>{welcome.title}</h4>
                <p className="text-muted small">{welcome.sub}</p>
                <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
                  {welcome.suggestions.map(q => (
                    <button
                      key={q}
                      className="btn btn-sm btn-outline-secondary rounded-pill"
                      style={{ fontSize: '.8rem' }}
                      onClick={() => { setInput(q); textareaRef.current?.focus(); }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`gc-msg ${m.role === 'user' ? 'user' : 'ai'} ${m.isEmergency ? 'emergency' : ''}`}
                >
                  <div className="gc-msg-avatar">
                    {m.role === 'user' ? initial : '🤖'}
                  </div>
                  <div>
                    <div className="gc-msg-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                      {m.isEmergency && (
                        <div className="mb-2">
                          <span className="badge bg-danger">🚨 Emergency Detected</span>
                        </div>
                      )}
                      {m.content}
                    </div>
                    <div className={`gc-msg-time ${m.role === 'user' ? 'text-end' : ''}`}>
                      {fmtTime(m.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="gc-msg ai">
                <div className="gc-msg-avatar">🤖</div>
                <div className="gc-msg-bubble">
                  <div className="gc-typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="gc-input-area">
            <form onSubmit={sendMessage} className="gc-input-row">
              <textarea
                ref={textareaRef}
                className="gc-textarea"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === 'urdu'
                    ? 'یہاں اپنا سوال لکھیں... (Enter = Send)'
                    : language === 'turkish'
                    ? 'Sorunuzu buraya yazın... (Enter = Gönder)'
                    : 'Type your health question... (Enter to send)'
                }
                disabled={loading}
              />
              <button
                type="submit"
                className="gc-send-btn"
                disabled={loading || !input.trim()}
              >
                {loading
                  ? <span className="spinner-border spinner-border-sm" />
                  : <i className="bi bi-send-fill" />
                }
              </button>
            </form>
            <div className="text-center mt-2" style={{ fontSize: '.72rem', color: 'var(--gc-text-light)' }}>
              <i className="bi bi-info-circle me-1" />
              GastroCare AI is not a substitute for professional medical advice. Press Enter to send, Shift+Enter for new line.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
