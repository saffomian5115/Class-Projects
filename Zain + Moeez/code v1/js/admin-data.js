/* ============================================
   FOUR WHEELS — ADMIN DATA JS
   Shared demo data for all admin pages
   ============================================ */

window.ADMIN_USERS = [
  { id:1,  name:'Ahmed Raza',       email:'ahmed@gmail.com',    phone:'0312-3456789', city:'Lahore',     listings:4, joined:'Jan 15, 2024', status:'active'  },
  { id:2,  name:'Sara Khan',        email:'sara@gmail.com',     phone:'0333-9876543', city:'Karachi',    listings:2, joined:'Mar 8, 2024',  status:'active'  },
  { id:3,  name:'Bilal Ahmed',      email:'bilal@gmail.com',    phone:'0321-1112233', city:'Islamabad',  listings:1, joined:'Jun 20, 2024', status:'active'  },
  { id:4,  name:'Usman Ali',        email:'usman@gmail.com',    phone:'0300-4445566', city:'Multan',     listings:3, joined:'Feb 3, 2024',  status:'active'  },
  { id:5,  name:'Khan Sahib',       email:'khan@gmail.com',     phone:'0345-7778899', city:'Peshawar',   listings:6, joined:'Nov 12, 2023', status:'active'  },
  { id:6,  name:'Zara Malik',       email:'zara@gmail.com',     phone:'0311-2223344', city:'Lahore',     listings:1, joined:'May 28, 2024', status:'active'  },
  { id:7,  name:'Faisal Brothers',  email:'faisal@gmail.com',   phone:'0341-5556677', city:'Faisalabad', listings:8, joined:'Jan 4, 2025',  status:'active'  },
  { id:8,  name:'Amina Siddiqui',   email:'amina@gmail.com',    phone:'0321-8889900', city:'Karachi',    listings:2, joined:'Sep 14, 2024', status:'active'  },
  { id:9,  name:'Tariq Mehmood',    email:'tariq@gmail.com',    phone:'0303-1234567', city:'Rawalpindi', listings:0, joined:'Dec 1, 2024',  status:'active'  },
  { id:10, name:'Nadia Hassan',     email:'nadia@gmail.com',    phone:'0315-9876543', city:'Multan',     listings:1, joined:'Oct 22, 2024', status:'active'  },
  { id:11, name:'Imran Butt',       email:'imran@gmail.com',    phone:'0322-5551234', city:'Lahore',     listings:5, joined:'Aug 7, 2024',  status:'banned'  },
  { id:12, name:'Sana Akhtar',      email:'sana@gmail.com',     phone:'0335-6667788', city:'Karachi',    listings:0, joined:'Nov 30, 2024', status:'active'  },
  { id:13, name:'Hasan Zubair',     email:'hasan@gmail.com',    phone:'0346-2223333', city:'Islamabad',  listings:2, joined:'Jul 19, 2024', status:'active'  },
  { id:14, name:'Ayesha Nawaz',     email:'ayesha@gmail.com',   phone:'0312-0001111', city:'Quetta',     listings:1, joined:'Feb 15, 2025', status:'active'  },
  { id:15, name:'Rehan Malik',      email:'rehan@gmail.com',    phone:'0333-4445555', city:'Faisalabad', listings:0, joined:'Mar 2, 2025',  status:'banned'  },
];

window.ADMIN_VEHICLES = [
  { id:1,  title:'Toyota Corolla Altis 2022', seller:'Ahmed Raza',      price:6800000, city:'Lahore',     type:'Car',   posted:'Jan 20, 2024', status:'active',   emoji:'🚗' },
  { id:2,  title:'Honda Civic Oriel 2021',    seller:'Sara Khan',       price:7200000, city:'Karachi',    type:'Car',   posted:'Mar 10, 2024', status:'active',   emoji:'🚙' },
  { id:3,  title:'Suzuki Cultus 2023',        seller:'Bilal Ahmed',     price:3100000, city:'Islamabad',  type:'Car',   posted:'Jun 22, 2024', status:'active',   emoji:'🚘' },
  { id:4,  title:'Yamaha YBR 125 2023',       seller:'Usman Ali',       price:380000,  city:'Multan',     type:'Bike',  posted:'Feb 5, 2024',  status:'active',   emoji:'🏍️' },
  { id:5,  title:'Toyota Hilux Revo 2020',    seller:'Khan Sahib',      price:11500000,city:'Peshawar',   type:'Truck', posted:'Nov 14, 2023', status:'active',   emoji:'🛻' },
  { id:6,  title:'KIA Sportage AWD 2022',     seller:'Zara Malik',      price:9800000, city:'Lahore',     type:'SUV',   posted:'May 30, 2024', status:'active',   emoji:'🚐' },
  { id:7,  title:'Honda CD 70 2024',          seller:'Faisal Brothers', price:175000,  city:'Faisalabad', type:'Bike',  posted:'Jan 6, 2025',  status:'active',   emoji:'🏍️' },
  { id:8,  title:'Suzuki Wagon R AGS 2023',   seller:'Amina Siddiqui',  price:3400000, city:'Karachi',    type:'Car',   posted:'Sep 16, 2024', status:'active',   emoji:'🚗' },
  { id:9,  title:'Toyota Fortuner 2021',      seller:'Khan Sahib',      price:14500000,city:'Islamabad',  type:'SUV',   posted:'Nov 20, 2023', status:'active',   emoji:'🚙' },
  { id:10, title:'Honda City 1.2 2022',       seller:'Ahmed Raza',      price:4900000, city:'Rawalpindi', type:'Car',   posted:'Feb 10, 2024', status:'active',   emoji:'🚗' },
  { id:11, title:'Suzuki Alto VXR 2024',      seller:'Nadia Hassan',    price:2650000, city:'Multan',     type:'Car',   posted:'Oct 24, 2024', status:'pending',  emoji:'🚘' },
  { id:12, title:'KIA Picanto 2023',          seller:'Hasan Zubair',    price:4100000, city:'Lahore',     type:'Car',   posted:'Jul 21, 2024', status:'pending',  emoji:'🚗' },
  { id:13, title:'Hyundai Tucson 2022',       seller:'Imran Butt',      price:8900000, city:'Karachi',    type:'SUV',   posted:'Aug 9, 2024',  status:'rejected', emoji:'🚐' },
  { id:14, title:'Toyota Vitz 2019',          seller:'Khan Sahib',      price:2800000, city:'Peshawar',   type:'Car',   posted:'Dec 5, 2023',  status:'active',   emoji:'🚙' },
  { id:15, title:'Yamaha R15 V4 2024',        seller:'Usman Ali',       price:980000,  city:'Multan',     type:'Bike',  posted:'Mar 4, 2025',  status:'pending',  emoji:'🏍️' },
  { id:16, title:'Changan Alsvin 2023',       seller:'Ayesha Nawaz',    price:4800000, city:'Quetta',     type:'Car',   posted:'Feb 17, 2025', status:'pending',  emoji:'🚘' },
  { id:17, title:'MG HS 2023',               seller:'Sara Khan',       price:9500000, city:'Karachi',    type:'SUV',   posted:'Oct 1, 2024',  status:'active',   emoji:'🚐' },
  { id:18, title:'Honda Fit Hybrid 2020',     seller:'Sana Akhtar',     price:4500000, city:'Lahore',     type:'Car',   posted:'Dec 2, 2024',  status:'pending',  emoji:'🚗' },
];

// Shared utility: modal close
window.closeModal = function(id) {
  document.getElementById(id)?.classList.remove('open');
};

// Close modals on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// Logout
document.getElementById('adminLogoutLink')?.addEventListener('click', e => {
  e.preventDefault();
  localStorage.removeItem('fw_admin');
  localStorage.removeItem('fw_admin_token');
  window.location.href = '../login.html';
});

// Sidebar toggle
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
  const sb = document.getElementById('adminSidebar');
  const main = document.querySelector('.admin-main');
  sb.classList.toggle('open');
  sb.classList.toggle('collapsed');
  main?.classList.toggle('full-width');
});

// Topbar date
const dateEl = document.getElementById('topbarDate');
if (dateEl) {
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-PK', { weekday:'short', year:'numeric', month:'short', day:'numeric' }).toUpperCase();
}

// Sidebar badge counts
const sideUserCount = document.getElementById('sideUserCount');
const sidePendingCount = document.getElementById('sidePendingCount');
if (sideUserCount) sideUserCount.textContent = window.ADMIN_USERS.length;
if (sidePendingCount) sidePendingCount.textContent = window.ADMIN_VEHICLES.filter(v => v.status === 'pending').length;
