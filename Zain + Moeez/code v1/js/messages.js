/* ============================================
   FOUR WHEELS — MESSAGES JS
   ============================================ */

const DEMO_CONVS = [
  { id:1, sender:'Ahmed Raza',    initials:'AR', vehicle:'Toyota Corolla Altis 2022', vehicleId:1, unread:true,  time:'2h ago',  lastMsg:'Yes it is available! When can you visit?' },
  { id:2, sender:'Sara Khan',     initials:'SK', vehicle:'Honda Civic Oriel 2021',    vehicleId:2, unread:true,  time:'5h ago',  lastMsg:'Can we meet tomorrow for inspection?' },
  { id:3, sender:'Bilal Ahmed',   initials:'BA', vehicle:'Suzuki Cultus 2023',        vehicleId:3, unread:false, time:'1d ago',  lastMsg:'Price is negotiable.' },
  { id:4, sender:'Usman Ali',     initials:'UA', vehicle:'Yamaha YBR 125 2023',       vehicleId:4, unread:false, time:'2d ago',  lastMsg:'Documents are complete.' },
  { id:5, sender:'Khan Sahib',    initials:'KS', vehicle:'Toyota Hilux Revo 2020',    vehicleId:5, unread:true,  time:'3d ago',  lastMsg:'You can test drive on Saturday.' },
];

const DEMO_THREADS = {
  1: [
    { text:'Hi, is this Toyota Corolla still available?',                sent:false, time:'10:20 AM' },
    { text:'Yes it is available! When can you visit?',                   sent:true,  time:'10:25 AM' },
    { text:'I can come this Saturday afternoon.',                        sent:false, time:'10:27 AM' },
    { text:'Perfect! I will be home. Please bring your ID.',             sent:true,  time:'10:30 AM' },
    { text:'Sure, what is the final price you are asking?',              sent:false, time:'10:35 AM' },
    { text:'Price is 68 lacs, not much negotiation possible on this one.',sent:true, time:'10:38 AM' },
  ],
  2: [
    { text:'Hello, is the Honda Civic still available?',                 sent:false, time:'8:00 AM' },
    { text:'Yes! Very well maintained car.',                             sent:true,  time:'8:10 AM' },
    { text:'Can we meet tomorrow for inspection?',                       sent:false, time:'8:12 AM' },
  ],
  3: [
    { text:'Price too high, can you reduce?',                           sent:false, time:'Yesterday' },
    { text:'Price is negotiable.',                                       sent:true,  time:'Yesterday' },
  ],
  4: [
    { text:'Are papers in order?',                                       sent:false, time:'2 days ago' },
    { text:'Documents are complete.',                                    sent:true,  time:'2 days ago' },
  ],
  5: [
    { text:'Is test drive possible?',                                    sent:false, time:'3 days ago' },
    { text:'You can test drive on Saturday.',                            sent:true,  time:'3 days ago' },
  ],
};

let activeConvId = null;

// ===== RENDER CONVERSATIONS =====
function renderConvList(filter = '') {
  const list = document.getElementById('convList');
  const filtered = DEMO_CONVS.filter(c =>
    c.sender.toLowerCase().includes(filter.toLowerCase()) ||
    c.vehicle.toLowerCase().includes(filter.toLowerCase())
  );

  list.innerHTML = filtered.map(c => `
    <div class="conv-item ${c.unread ? 'unread' : ''} ${activeConvId === c.id ? 'active' : ''}"
         onclick="openConv(${c.id})">
      <div class="conv-avatar">${c.initials}</div>
      <div class="conv-info">
        <div class="conv-sender">${c.sender}</div>
        <div class="conv-vehicle">🚗 ${c.vehicle}</div>
        <div class="conv-preview">${c.lastMsg}</div>
      </div>
      <div class="conv-meta">
        <span class="conv-time">${c.time}</span>
        ${c.unread ? '<span class="conv-unread-dot"></span>' : ''}
      </div>
    </div>`).join('');
}

// ===== OPEN CONVERSATION =====
window.openConv = function(id) {
  activeConvId = id;
  const conv = DEMO_CONVS.find(c => c.id === id);
  if (!conv) return;

  // Mark as read
  conv.unread = false;
  renderConvList(document.getElementById('convSearch').value);
  updateUnreadCount();

  // Show chat header
  document.getElementById('chatEmpty').style.display = 'none';
  document.getElementById('chatHeader').style.display = 'flex';
  document.getElementById('chatInputWrap').style.display = 'block';
  document.getElementById('chatAvatar').textContent    = conv.initials;
  document.getElementById('chatName').textContent      = conv.sender;
  document.getElementById('chatVehicleLabel').textContent = conv.vehicle;
  document.getElementById('viewVehicleBtn').href = `vehicle-detail.html?id=${conv.vehicleId}`;

  renderThread(id);
};

// ===== RENDER THREAD =====
function renderThread(id) {
  const msgs = DEMO_THREADS[id] || [];
  const container = document.getElementById('chatMessages');

  container.innerHTML = msgs.map(m => `
    <div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">
      <div class="msg-text">${m.text}</div>
      <span class="msg-time">${m.time}</span>
    </div>`).join('');

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// ===== SEND MESSAGE =====
function sendMessage() {
  if (!activeConvId) return;
  const input = document.getElementById('msgInput');
  const text  = input.value.trim();
  if (!text) return;

  const msgs = DEMO_THREADS[activeConvId] = DEMO_THREADS[activeConvId] || [];
  const now  = new Date().toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit' });
  msgs.push({ text, sent: true, time: now });

  // Update last message in conv list
  const conv = DEMO_CONVS.find(c => c.id === activeConvId);
  if (conv) conv.lastMsg = text;

  input.value = '';
  renderThread(activeConvId);
  renderConvList(document.getElementById('convSearch').value);

  // Simulate reply after 1.5s
  setTimeout(() => {
    const replies = [
      'Thanks for your message! I will get back to you shortly.',
      'Sure, let me check and confirm.',
      'That works for me!',
      'Can you call me on the number in the listing?',
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    msgs.push({ text: reply, sent: false, time: new Date().toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit' }) });
    renderThread(activeConvId);
  }, 1500);
}

document.getElementById('sendMsgBtn').addEventListener('click', sendMessage);
document.getElementById('msgInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

// ===== SEARCH =====
document.getElementById('convSearch').addEventListener('input', function() {
  renderConvList(this.value);
});

// ===== UNREAD COUNT =====
function updateUnreadCount() {
  const count = DEMO_CONVS.filter(c => c.unread).length;
  document.getElementById('unreadCount').textContent = count > 0 ? `${count} unread` : 'All read';
}

// ===== INIT =====
renderConvList();
updateUnreadCount();

// Auto-open first conversation on desktop
if (window.innerWidth > 900) openConv(1);
