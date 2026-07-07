const appointments=[
 {id:'OPT123456',dept:'Cardiology (OP)',case:'General Consultation',icon:'fa-heart-pulse',color:'purple',doctor:'Dr. Arvind Sharma',spec:'MBBS, MD (Cardiology)',img:'assets/images/doctor-arvind.png',rating:'4.8 (120)',date:'20 May 2025',time:'10:30 AM',hospital:'City Care Hospital',city:'Delhi',status:'Upcoming',amount:'₹800',days:'2 days to go'},
 {id:'OPT123457',dept:'Dermatology',case:'Acne Treatment',icon:'fa-hand-holding-medical',color:'pink',doctor:'Dr. Neha Kapoor',spec:'MBBS, MD (Dermatology)',img:'assets/images/doctor-neha.png',rating:'4.7 (98)',date:'22 May 2025',time:'02:00 PM',hospital:'City Care Hospital',city:'Delhi',status:'Upcoming',amount:'₹700',days:'4 days to go'},
 {id:'OPT123458',dept:'Pediatrics',case:'Child Consultation',icon:'fa-user-doctor',color:'blue',doctor:'Dr. Pooja Mehta',spec:'MBBS, DCH',img:'assets/images/doctor-pooja.png',rating:'4.9 (110)',date:'15 May 2025',time:'11:00 AM',hospital:'City Care Hospital',city:'Delhi',status:'Completed',amount:'₹600',feedback:'5.0',feedbackText:'Excellent'},
 {id:'OPT123459',dept:'Gastroenterology',case:'Stomach Pain',icon:'fa-stethoscope',color:'orange',doctor:'Dr. Rohan Mehta',spec:'MBBS, MD (Gastro)',img:'assets/images/doctor-rohan.png',rating:'4.6 (75)',date:'10 May 2025',time:'04:30 PM',hospital:'City Care Hospital',city:'Delhi',status:'Cancelled',amount:'₹700',reason:'Cancelled by You',reasonDate:'01 May 2025'},
 {id:'OPT123460',dept:'Neurology',case:'Migraine Consultation',icon:'fa-head-side-virus',color:'violet',doctor:'Dr. Amit Verma',spec:'MBBS, DM (Neurology)',img:'assets/images/doctor-amit.png',rating:'4.8 (85)',date:'25 May 2025',time:'09:00 AM',hospital:'City Care Hospital',city:'Delhi',status:'Rescheduled',amount:'₹900'},
 {id:'OPT123461',dept:'ENT',case:'Throat Infection',icon:'fa-ear-listen',color:'teal',doctor:'Dr. Simran Kaur',spec:'MBBS, MS (ENT)',img:'assets/images/doctor-neha.png',rating:'4.7 (65)',date:'05 May 2025',time:'10:15 AM',hospital:'City Care Hospital',city:'Delhi',status:'Completed',amount:'₹500',feedback:'4.5',feedbackText:'Very Good'},
 {id:'OPT123410',dept:'Cardiology (OP)',case:'General Consultation',icon:'fa-heart-pulse',color:'purple',doctor:'Dr. Arvind Sharma',spec:'MBBS, MD (Cardiology)',img:'assets/images/doctor-arvind.png',rating:'4.8 (120)',date:'12 May 2025',time:'10:30 AM',hospital:'City Care Hospital',city:'Delhi',status:'Completed',amount:'₹800',feedback:'5.0',feedbackText:'Excellent',reason:'Cancelled by You',reasonDate:'10 May 2025'},
 {id:'OPT123399',dept:'Dermatology',case:'Acne Treatment',icon:'fa-hand-holding-medical',color:'pink',doctor:'Dr. Neha Kapoor',spec:'MBBS, MD (Dermatology)',img:'assets/images/doctor-neha.png',rating:'4.7 (98)',date:'10 May 2025',time:'02:00 PM',hospital:'City Care Hospital',city:'Delhi',status:'Cancelled',amount:'₹700',feedback:'4.0',feedbackText:'Very Good',reason:'Cancelled by Hospital',reasonDate:'09 May 2025'},
 {id:'OPT123388',dept:'Pediatrics',case:'Child Consultation',icon:'fa-user-doctor',color:'blue',doctor:'Dr. Pooja Mehta',spec:'MBBS, DCH',img:'assets/images/doctor-pooja.png',rating:'4.9 (110)',date:'05 May 2025',time:'11:00 AM',hospital:'City Care Hospital',city:'Delhi',status:'Cancelled',amount:'₹600',feedback:'5.0',feedbackText:'Excellent',reason:'Cancelled by You',reasonDate:'04 May 2025'},
 {id:'OPT123377',dept:'Gastroenterology',case:'Stomach Pain',icon:'fa-stethoscope',color:'orange',doctor:'Dr. Rohan Mehta',spec:'MBBS, MD (Gastro)',img:'assets/images/doctor-rohan.png',rating:'4.6 (75)',date:'02 May 2025',time:'04:30 PM',hospital:'City Care Hospital',city:'Delhi',status:'Cancelled',amount:'₹700',feedback:'4.0',feedbackText:'Very Good',reason:'Cancelled by You',reasonDate:'01 May 2025'},
 {id:'OPT123366',dept:'Neurology',case:'Migraine Consultation',icon:'fa-head-side-virus',color:'violet',doctor:'Dr. Amit Verma',spec:'MBBS, DM (Neurology)',img:'assets/images/doctor-amit.png',rating:'4.8 (85)',date:'28 Apr 2025',time:'09:00 AM',hospital:'City Care Hospital',city:'Delhi',status:'Cancelled',amount:'₹900',feedback:'5.0',feedbackText:'Excellent',reason:'Cancelled by Hospital',reasonDate:'27 Apr 2025'},
 {id:'OPT123355',dept:'ENT',case:'Throat Infection',icon:'fa-ear-listen',color:'teal',doctor:'Dr. Simran Kaur',spec:'MBBS, MS (ENT)',img:'assets/images/doctor-neha.png',rating:'4.7 (65)',date:'25 Apr 2025',time:'10:15 AM',hospital:'City Care Hospital',city:'Delhi',status:'Completed',amount:'₹500',feedback:'4.5',feedbackText:'Very Good'}
];
let currentTab = 'all';
const filters = { q:'', hospital:'All Hospitals', department:'All Departments', date:null };
const statusMap = { all:null, upcoming:'Upcoming', completed:'Completed', cancelled:'Cancelled', rescheduled:'Rescheduled' };

function normalizeDate(txt){
  const m = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const parts = txt.split(' ');
  return new Date(+parts[2], m[parts[1]], +parts[0]);
}
function getFilteredData(){
  let data = appointments.slice();
  const wanted = statusMap[currentTab];
  if(wanted) data = data.filter(a => a.status === wanted);
  if(filters.q){
    const q = filters.q.toLowerCase();
    data = data.filter(a => `${a.dept} ${a.case} ${a.doctor} ${a.spec} ${a.hospital} ${a.city} ${a.id}`.toLowerCase().includes(q));
  }
  if(filters.hospital !== 'All Hospitals') data = data.filter(a => a.hospital === filters.hospital);
  if(filters.department !== 'All Departments') data = data.filter(a => a.dept.toLowerCase().includes(filters.department.toLowerCase().replace(' (op)','')));
  if(filters.date) data = data.filter(a => normalizeDate(a.date).toDateString() === filters.date.toDateString());
  if(currentTab==='all') return data.slice(0,6);
  if(currentTab==='upcoming') return data.slice(0,3);
  if(currentTab==='completed') return data.slice(0,8);
  if(currentTab==='cancelled') return data.slice(0,5);
  return data.slice(0,4);
}
function rowHTML(a,mode){
 const base=`<div class="details-cell"><div class="dept-icon ${a.color}"><i class="fa-solid ${a.icon}"></i></div><div class="txt"><b>${a.dept}</b><span>${a.case}</span><br><span>Appointment ID: ${a.id}</span></div></div><div class="doctor-cell"><img src="${a.img}" alt="${a.doctor}"><div><b>${a.doctor}</b><span>${a.spec}</span><div class="rating"><i class="fa-solid fa-star"></i>${a.rating}</div></div></div><div class="date-cell"><i class="fa-regular fa-calendar-days"></i><div>${a.date}<br><i class="fa-regular fa-clock"></i> ${a.time}${a.days?`<br><span class="status-badge paid">${a.days}</span>`:''}</div></div><div class="hospital-cell"><i class="fa-regular fa-hospital"></i><div>${a.hospital}<br>${a.city}</div></div>`;
 const menu=`<button class="kebab" aria-label="Open actions"><i class="fa-solid fa-ellipsis-vertical"></i></button><div class="action-menu"><button><i class="fa-regular fa-eye"></i> View Details</button><button><i class="fa-solid fa-download"></i> Download Receipt</button><button><i class="fa-regular fa-calendar-days"></i> Reschedule</button><button><i class="fa-regular fa-circle-xmark"></i> Cancel Appointment</button></div>`;
 const actionLabel = mode==='cancelled' ? 'Book Again' : 'View Details';
 const actionBlock = `<div class="row-action"><button class="action-btn">${actionLabel}</button>${menu}</div>`;
 if(mode==='all') return `<div class="table-row">${base}<div><span class="status-badge ${a.status.toLowerCase()}">${a.status}</span></div><div class="amount"><b>${a.amount}</b></div>${actionBlock}</div>`;
 if(mode==='upcoming') return `<div class="table-row">${base}<div class="amount"><b>${a.amount}</b><br><span class="status-badge paid">Paid</span></div>${actionBlock}</div>`;
 if(mode==='completed') return `<div class="table-row">${base}<div class="amount"><b>${a.amount}</b><br><span class="status-badge paid">Paid</span></div><div class="feedback"><i class="fa-solid fa-star"></i> <b>${a.feedback||'5.0'}</b><span>${a.feedbackText||'Excellent'}</span></div>${actionBlock}</div>`;
 if(mode==='cancelled') return `<div class="table-row">${base}<div class="amount"><b>${a.amount}</b><br><span class="status-badge paid">Refunded</span></div><div class="reason">${a.reason||'Cancelled'}<span>${a.reasonDate||a.date}</span></div>${actionBlock}</div>`;
 return `<div class="table-row">${base}<div><span class="status-badge rescheduled">Rescheduled</span></div><div class="amount"><b>${a.amount}</b></div>${actionBlock}</div>`;
}
function mobileHTML(a,mode){
 const actionLabel = mode==='cancelled' ? 'Book Again' : 'View Details';
 return `<div class="mobile-card">
  <div class="mobile-top"><div class="dept-icon ${a.color}"><i class="fa-solid ${a.icon}"></i></div><img src="${a.img}" alt="${a.doctor}"><div><b>${a.dept}</b><div class="sub">${a.case}</div><div class="sub">${a.doctor}</div></div></div>
  <div class="mobile-grid"><div><b>Date</b><br>${a.date}, ${a.time}</div><div><b>Hospital</b><br>${a.hospital}</div><div><b>Amount</b><br>${a.amount}</div><div><b>Status</b><br><span class="status-badge ${a.status.toLowerCase()}">${a.status}</span></div></div>
  <div class="mobile-actions"><button class="action-btn">${actionLabel}</button><button class="mobile-kebab" aria-label="Open actions"><i class="fa-solid fa-ellipsis"></i></button><div class="action-menu"><button><i class="fa-regular fa-eye"></i> View Details</button><button><i class="fa-solid fa-download"></i> Download Receipt</button><button><i class="fa-regular fa-calendar-days"></i> Reschedule</button><button><i class="fa-regular fa-circle-xmark"></i> Cancel Appointment</button></div></div>
 </div>`
}
function headers(mode){if(mode==='all')return ['Appointment Details','Doctor','Date & Time','Hospital','Status','Amount','Action'];if(mode==='upcoming')return ['Appointment Details','Doctor','Date & Time','Hospital','Amount','Action'];if(mode==='completed')return ['Appointment Details','Doctor','Date & Time','Hospital','Amount','Feedback','Action'];if(mode==='cancelled')return ['Appointment Details','Doctor','Date & Time','Hospital','Amount','Reason','Action'];return ['Appointment Details','Doctor','Date & Time','Hospital','Status','Amount','Action']}
function render(){
  const panel=document.getElementById('panel');
  const data=getFilteredData();
  const titles={all:`Appointments (${data.length})`,upcoming:`Upcoming Appointments (${data.length})`,completed:`Completed Appointments (${data.length})`,cancelled:`Cancelled Appointments (${data.length})`,rescheduled:`Rescheduled Appointments (${data.length})`};
  const notice=currentTab==='upcoming'?`<div class="notice info"><i class="fa-solid fa-circle-info"></i>These are your upcoming appointments. Get ready for your visit!</div>`:currentTab==='cancelled'?`<div class="notice cancel"><i class="fa-solid fa-circle-info"></i>These appointments have been cancelled. You can book a new appointment anytime.</div>`:'';
  const empty = `<div class="empty-state"><i class="fa-regular fa-calendar-xmark"></i><b>No appointments found</b><span>Try changing the search or filters.</span></div>`;
  panel.className=`tab-panel active ${currentTab}`;
  panel.innerHTML=`<h3 class="tab-title">${titles[currentTab]}</h3>${notice}${data.length?`<div class="appointment-table ${currentTab}"><div class="table-head">${headers(currentTab).map(h=>`<div>${h}</div>`).join('')}</div>${data.map(a=>rowHTML(a,currentTab)).join('')}</div>${data.map(a=>mobileHTML(a,currentTab)).join('')}<div class="table-footer"><span>Showing 1 to ${data.length} of ${data.length} appointments</span><div class="pages"><button class="page-btn"><i class="fa-solid fa-chevron-left"></i></button><button class="page-btn active">1</button><button class="page-btn"><i class="fa-solid fa-chevron-right"></i></button></div></div>`:empty}`;
  bindActions();
}
function bindActions(){
  document.querySelectorAll('.row-action .kebab, .mobile-actions .mobile-kebab').forEach(btn=>{
    btn.onclick=e=>{
      e.stopPropagation();
      const parent = btn.closest('.row-action, .mobile-actions');
      const menu = parent?.querySelector('.action-menu');
      const wasOpen = menu?.classList.contains('show');
      document.querySelectorAll('.action-menu').forEach(m=>m.classList.remove('show','flip-up'));
      if(menu && !wasOpen){
        menu.classList.add('show');
        const rect = menu.getBoundingClientRect();
        if(rect.bottom > window.innerHeight - 12) menu.classList.add('flip-up');
      }
    };
  });
}
document.querySelectorAll('.appt-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.appt-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');currentTab=tab.dataset.tab;render()}));

document.querySelectorAll('.custom-select').forEach((sel, idx)=>{
  sel.addEventListener('click',e=>{e.stopPropagation();document.querySelectorAll('.custom-select').forEach(s=>s!==sel&&s.classList.remove('open'));document.getElementById('dateFilter')?.classList.remove('open');sel.classList.toggle('open')});
  sel.querySelectorAll('.select-menu button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();sel.querySelector('.select-label').textContent=b.textContent;sel.querySelectorAll('.select-menu button').forEach(x=>x.classList.remove('active'));b.classList.add('active');sel.classList.remove('open'); if(idx===0) filters.hospital=b.textContent.trim(); if(idx===1) filters.department=b.textContent.trim(); render();}));
});

(function(){
 const dateFilter=document.getElementById('dateFilter'); if(!dateFilter) return;
 const grid=document.getElementById('dateGrid'), label=document.getElementById('dateLabel');
 let view=new Date(2025,4,1), selected=null;
 const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
 function draw(){
  grid.innerHTML=''; label.textContent=months[view.getMonth()]+' '+view.getFullYear();
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=>{const s=document.createElement('span');s.className='dow';s.textContent=d;grid.appendChild(s)});
  const first=new Date(view.getFullYear(),view.getMonth(),1).getDay();
  const prevDays=new Date(view.getFullYear(),view.getMonth(),0).getDate();
  for(let i=first-1;i>=0;i--){const b=document.createElement('button');b.className='muted-day';b.textContent=prevDays-i;grid.appendChild(b)}
  const days=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();
  for(let d=1;d<=days;d++){const b=document.createElement('button');b.textContent=d;if(selected&&selected.getDate()===d&&selected.getMonth()===view.getMonth()&&selected.getFullYear()===view.getFullYear())b.classList.add('active');b.onclick=e=>{e.stopPropagation();selected=new Date(view.getFullYear(),view.getMonth(),d);filters.date=selected;dateFilter.querySelector('.date-text').textContent=selected.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});dateFilter.classList.remove('open');draw();render()};grid.appendChild(b)}
  const total = grid.children.length; for(let i=total;i<49;i++){const b=document.createElement('button');b.className='muted-day';b.textContent=i-total+1;grid.appendChild(b)}
 }
 dateFilter.addEventListener('click',e=>{e.stopPropagation();document.querySelectorAll('.custom-select').forEach(s=>s.classList.remove('open'));dateFilter.classList.toggle('open')});
 document.getElementById('prevDate').onclick=e=>{e.stopPropagation();view=new Date(view.getFullYear(),view.getMonth()-1,1);draw()};
 document.getElementById('nextDate').onclick=e=>{e.stopPropagation();view=new Date(view.getFullYear(),view.getMonth()+1,1);draw()};
 document.getElementById('clearDate').onclick=e=>{e.stopPropagation();selected=null;filters.date=null;dateFilter.querySelector('.date-text').textContent='Select Date Range';dateFilter.classList.remove('open');draw();render()};
 document.getElementById('todayDate').onclick=e=>{e.stopPropagation();selected=new Date();view=new Date(selected.getFullYear(),selected.getMonth(),1);filters.date=selected;dateFilter.querySelector('.date-text').textContent='Today';dateFilter.classList.remove('open');draw();render()};
 draw();
})();

(function(){
 const sidebar=document.getElementById('sidebar'),overlay=document.getElementById('overlay'),open=document.getElementById('openSidebar'),close=document.getElementById('closeSidebar');
 if(open)open.onclick=()=>{sidebar.classList.add('open');overlay&&overlay.classList.add('show');document.body.classList.add('sidebar-open')};
 if(close)close.onclick=()=>{sidebar.classList.remove('open');overlay&&overlay.classList.remove('show');document.body.classList.remove('sidebar-open')};
 if(overlay)overlay.onclick=()=>{sidebar.classList.remove('open');overlay&&overlay.classList.remove('show');document.body.classList.remove('sidebar-open')};
})();
(function(){
 function toggle(btn,menu){if(!btn||!menu)return;btn.addEventListener('click',e=>{e.stopPropagation();document.querySelectorAll('.dropdown').forEach(d=>d!==menu&&d.classList.remove('show'));menu.classList.toggle('show')})}
 toggle(document.getElementById('notifBtn'),document.getElementById('notifMenu'));
 toggle(document.getElementById('profileBtn'),document.getElementById('profileMenu'));
 const search=document.getElementById('searchAppointments');
 if(search) search.addEventListener('input',function(){filters.q=this.value.trim();render();});
 document.addEventListener('click',()=>{document.querySelectorAll('.action-menu,.dropdown').forEach(m=>m.classList.remove('show','flip-up'));document.querySelectorAll('.custom-select').forEach(s=>s.classList.remove('open'));document.getElementById('dateFilter')?.classList.remove('open')});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.action-menu,.dropdown').forEach(m=>m.classList.remove('show','flip-up'));document.querySelectorAll('.custom-select').forEach(s=>s.classList.remove('open'));document.getElementById('dateFilter')?.classList.remove('open')}});
})();
render();


/* Common dropdown close/stacking repair */
(function(){
  function closeFloating(except){
    document.querySelectorAll('.custom-select.open').forEach(el=>{ if(el!==except) el.classList.remove('open'); });
    document.querySelectorAll('.date-filter.open').forEach(el=>{ if(el!==except) el.classList.remove('open'); });
    document.querySelectorAll('.action-menu.show').forEach(el=>{ if(el!==except) el.classList.remove('show','flip-up'); });
  }
  ['notifBtn','profileBtn'].forEach(id=>{
    const btn=document.getElementById(id);
    if(!btn || btn.dataset.commonDropdownFixed) return;
    btn.dataset.commonDropdownFixed='true';
    btn.addEventListener('click',()=>closeFloating(),true);
  });
})();


/* =========================================================
   PATIENT M3 FINAL RESPONSIVE JS - MERGED INTO ORIGINAL
   ========================================================= */
(function(){
  if(window.__patientM3ResponsiveReady) return;
  window.__patientM3ResponsiveReady = true;
  function qs(s,root){return (root||document).querySelector(s)}
  function qsa(s,root){return Array.from((root||document).querySelectorAll(s))}
  function ensureOverlay(){
    var ov = qs('#overlay') || qs('#mobileOverlay');
    if(!ov){ ov=document.createElement('div'); ov.id='overlay'; ov.className='overlay'; document.body.appendChild(ov); }
    return ov;
  }
  function getSidebar(){return qs('#sidebar') || qs('#bookSidebar') || qs('.sidebar') || qs('.booking-sidebar')}
  function openSidebar(){var sb=getSidebar(),ov=ensureOverlay(); if(sb){sb.classList.add('open','show')} ov.classList.add('show'); document.body.classList.add('sidebar-open')}
  function closeSidebar(){var sb=getSidebar(),ov=ensureOverlay(); if(sb){sb.classList.remove('open','show')} ov.classList.remove('show'); document.body.classList.remove('sidebar-open')}
  function closeDrops(except){qsa('.dropdown.show,.select-menu.show,.custom-select.open,.date-filter.open,.action-menu.show,.record-context.show,.rx-context.show,.lab-context.show').forEach(function(el){ if(el!==except && !el.contains(except)){el.classList.remove('show','open','flip-up')}})}
  document.addEventListener('click',function(e){
    var openBtn=e.target.closest('#openSidebar,#sidebarToggle,.hamburger,.sidebar-toggle');
    if(openBtn){ e.preventDefault(); e.stopPropagation(); openSidebar(); return; }
    var closeBtn=e.target.closest('#closeSidebar,.mobile-close');
    if(closeBtn){ e.preventDefault(); e.stopPropagation(); closeSidebar(); return; }
    if(e.target.matches('#overlay,#mobileOverlay,.overlay,.mobile-overlay')){ closeSidebar(); return; }
    var notif=e.target.closest('#notifBtn,.notif,.header-bell');
    if(notif){ e.stopPropagation(); var menu=notif.querySelector('.notif-menu')||qs('#notifMenu'); qsa('.profile-menu.show,.dropdown.show').forEach(function(d){if(d!==menu)d.classList.remove('show')}); if(menu)menu.classList.toggle('show'); return; }
    var profile=e.target.closest('#profileBtn,.profile,.user-profile');
    if(profile){ e.stopPropagation(); var pmenu=profile.querySelector('.profile-menu')||qs('#profileMenu'); qsa('.notif-menu.show,.dropdown.show').forEach(function(d){if(d!==pmenu)d.classList.remove('show')}); if(pmenu)pmenu.classList.toggle('show'); return; }
    if(!e.target.closest('.dropdown,.custom-select,.date-filter,.record-menu,.rx-menu-btn,.lab-menu-btn,.kebab,.action-menu,.record-context,.rx-context,.lab-context')) closeDrops(e.target);
  }, true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){closeSidebar(); closeDrops(null); qsa('.med-drawer.show,.rx-drawer.show,.token-drawer.show').forEach(function(d){d.classList.remove('show')}); document.body.classList.remove('drawer-open'); }});
  qsa('.menu-item').forEach(function(a){a.addEventListener('click',function(){ if(innerWidth<=1180) setTimeout(closeSidebar,80); });});
  function normalizeTables(){
    qsa('.records-card,.rx-table-card,.lab-table-card,.token-table-card,.appt-table-card').forEach(function(card){card.setAttribute('tabindex','0')});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',normalizeTables); else normalizeTables();
})();
