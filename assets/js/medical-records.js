const records = [
  {title:'Prescription',doctor:'Dr. Arvind Sharma',sub:'OP Consultation',type:'Prescription',cls:'prescription',icon:'fa-file-prescription',color:'rec-green',related:'Cardiology (OP)',id:'#TK12345',date:'20 May 2025',time:'10:30 AM',hospital:'City Care Hospital',city:'Delhi',summary:'Consultation prescription for Stage 1 Hypertension with medication advice, diet control and follow-up instructions.',diagnosis:'Hypertension (Stage 1)',attachment:'prescription-OPT12345.pdf'},
  {title:'Blood Test Report',doctor:'Dr. Neha Kapoor',sub:'Pathology',type:'Lab Report',cls:'lab',icon:'fa-flask-vial',color:'rec-pink',related:'General Health Checkup',id:'#TK12344',date:'18 May 2025',time:'09:15 AM',hospital:'City Care Hospital',city:'Delhi',summary:'Complete blood count, lipid profile and routine pathology values for general health checkup.',diagnosis:'Routine health screening',attachment:'blood-test-report-TK12344.pdf'},
  {title:'X-Ray Chest',doctor:'Dr. Rohan Mehta',sub:'Radiology',type:'Imaging Report',cls:'imaging',icon:'fa-x-ray',color:'rec-orange',related:'Chest Pain Evaluation',id:'#TK12342',date:'10 May 2025',time:'04:30 PM',hospital:'City Care Hospital',city:'Delhi',summary:'Chest X-Ray PA view report with radiology impression and image reference.',diagnosis:'Chest pain evaluation',attachment:'xray-chest-TK12342.pdf'},
  {title:'Discharge Summary',doctor:'Dr. Amit Verma',sub:'Inpatient Care',type:'Discharge Summary',cls:'discharge',icon:'fa-file-medical',color:'rec-blue',related:'Hospitalization',id:'#IP98765',date:'05 May 2025',time:'02:45 PM',hospital:'City Care Hospital',city:'Delhi',summary:'Discharge summary including admission notes, treatment course, discharge medication and review advice.',diagnosis:'Post admission recovery',attachment:'discharge-summary-IP98765.pdf'},
  {title:'Prescription',doctor:'Dr. Pooja Mehta',sub:'OP Consultation',type:'Prescription',cls:'prescription',icon:'fa-file-prescription',color:'rec-green',related:'Pediatrics',id:'#TK12343',date:'15 Apr 2025',time:'11:00 AM',hospital:'City Care Hospital',city:'Delhi',summary:'OP prescription with medication schedule and follow-up advice.',diagnosis:'Seasonal fever',attachment:'prescription-TK12343.pdf'},
  {title:'Thyroid Profile',doctor:'Dr. Neha Kapoor',sub:'Pathology',type:'Lab Report',cls:'lab',icon:'fa-flask-vial',color:'rec-pink',related:'Thyroid Evaluation',id:'#TK12340',date:'08 Apr 2025',time:'09:20 AM',hospital:'City Care Hospital',city:'Delhi',summary:'Thyroid profile report covering T3, T4 and TSH levels.',diagnosis:'Thyroid evaluation',attachment:'thyroid-profile-TK12340.pdf'}
];

let current = records.slice();
let activeRecord = records[0];
let zoom = 100;
let calDate = new Date(2025, 4, 1);

const rows = document.getElementById('recordRows');
const mobile = document.getElementById('mobileRecords');
const search = document.getElementById('recordSearch');
const context = document.getElementById('recordContext');
const drawer = document.getElementById('medDrawer');
const pdfPage = document.getElementById('pdfPage');
const zoomValue = document.getElementById('zoomValue');

function iconClass(r){ return `record-icon ${r.color}`; }
function badge(r){ return `<span class="type-badge type-${r.cls}">${r.type}</span>`; }
function iconHtml(r){ return `<span class="${iconClass(r)}"><i class="fa-solid ${r.icon}"></i></span>`; }

function render(list = current){
  if(!rows || !mobile) return;
  rows.innerHTML = list.map((r,i)=>`
    <div class="record-row" data-row="${i}">
      <div class="record-main">${iconHtml(r)}<div><h4>${r.title}</h4><p>${r.doctor}</p><span>${r.sub}</span></div></div>
      <div>${badge(r)}</div>
      <div class="related"><p>${r.related}</p><p>${r.id}</p></div>
      <div class="date-cell"><div class="date-line"><i class="fa-regular fa-calendar-days"></i>${r.date}</div><div class="date-line"><i class="fa-regular fa-clock"></i>${r.time}</div></div>
      <div class="hospital-cell"><p>${r.hospital}</p><p>${r.city}</p></div>
      <div class="record-action"><button type="button" class="view-download" data-view="${i}">View Details</button><button type="button" class="record-menu" data-menu="${i}" aria-label="More actions"><i class="fa-solid fa-ellipsis-vertical"></i></button></div>
    </div>`).join('');
  mobile.innerHTML = list.map((r,i)=>`
    <div class="mobile-rec-card">
      <div class="record-main">${iconHtml(r)}<div><h4>${r.title}</h4><p>${r.doctor}</p><span>${r.sub}</span></div></div>
      <div class="mobile-rec-grid"><span>${badge(r)}</span><span>${r.related}</span><span>${r.date}</span><span>${r.hospital}</span></div>
      <div class="mobile-rec-actions"><button type="button" class="view-download" data-view="${i}">View Details</button><button type="button" class="record-menu" data-menu="${i}" aria-label="More actions"><i class="fa-solid fa-ellipsis-vertical"></i></button></div>
    </div>`).join('');
  const count = document.getElementById('recordCount');
  if(count) count.textContent = `Showing 1 to ${list.length} of 24 records`;
}

function updatePdfContent(r){
  if(!pdfPage) return;
  const title = r.type === 'Lab Report' ? 'Laboratory Report' : r.type === 'Imaging Report' ? 'Imaging Report' : r.type;
  pdfPage.innerHTML = `
    <div class="rx-doc-head">
      <div><h2><i class="fa-solid fa-hospital"></i> ${r.hospital}</h2><p>45, Health Park, Sector 12,<br>${r.city} - 110016<br>Ph: 011-4321 5678</p></div>
      <div><h2>${title}</h2><p><b>Date:</b> ${r.date}</p><p><b>Time:</b> ${r.time}</p><p><b>Ref No:</b> ${r.id}</p></div>
    </div>
    <div class="doc-table"><p><b>Patient Name</b> &nbsp;&nbsp; : &nbsp; Priya Sharma</p><p><b>Age / Gender</b> &nbsp;&nbsp;&nbsp; : &nbsp; 28 Y / Female</p><p><b>Contact No</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : &nbsp; 9876543210</p></div>
    <h4>Diagnosis / Purpose</h4><p>${r.diagnosis}</p>
    <h4>Clinical Summary</h4><p>${r.summary}</p>
    <h4>${r.type === 'Prescription' ? 'Medications' : 'Findings'}</h4>
    <p>1. ${r.type === 'Prescription' ? 'Telma 40 mg Tablet - Once daily after dinner' : 'Report values reviewed and attached for physician reference.'}</p>
    <p>2. ${r.type === 'Prescription' ? 'Ecosprin AV 75 mg Tablet - Once daily after food' : 'No emergency abnormality noted in available summary.'}</p>
    <h4>Advice</h4><ul><li>Keep this record for future consultation.</li><li>Share with doctor during next visit.</li><li>Contact hospital support for certified copy.</li></ul>
    <div style="text-align:right;margin-top:50px"><p style="font-family:cursive;font-size:26px;margin:0">${r.doctor.split(' ')[1] || 'Doctor'}</p><b>${r.doctor}</b><br>${r.related}<br>Reg. No. 12345</div>`;
}

function fillDetails(r){
  const map = {
    drawerRecType:r.type,
    drawerDoctor:r.doctor,
    drawerMeta:`${r.related} • ${r.sub} • ${r.date}, ${r.time}`,
    detailsType:r.type,
    detailsDoctor:r.doctor,
    detailsDepartment:r.related,
    detailsDate:`${r.date}, ${r.time}`,
    detailsId:r.id,
    detailsSummary:r.summary,
    attachmentName:r.attachment
  };
  Object.entries(map).forEach(([id,val])=>{ const el = document.getElementById(id); if(el) el.textContent = val; });
  const badgeEl = document.getElementById('drawerBadge');
  if(badgeEl){ badgeEl.textContent = r.type; badgeEl.className = `type-badge type-${r.cls}`; }
  const iconEl = document.getElementById('drawerIcon');
  if(iconEl){ iconEl.className = iconClass(r); iconEl.innerHTML = `<i class="fa-solid ${r.icon}"></i>`; }
  updatePdfContent(r);
}

function switchTab(tab){
  document.querySelectorAll('.detail-tabs [data-tab]').forEach(btn=>btn.classList.toggle('active', btn.dataset.tab === tab));
  const preview = document.getElementById('pdfViewer');
  const details = document.getElementById('recordDetailsPanel');
  if(preview) preview.style.display = tab === 'preview' ? 'block' : 'none';
  if(details) details.style.display = tab === 'details' ? 'block' : 'none';
}

function openDrawer(r){
  activeRecord = r;
  fillDetails(r);
  switchTab('preview');
  document.body.classList.add('drawer-open');
  drawer?.classList.add('show');
  closeContext();
}
window.openDrawer = openDrawer;

function closeDrawer(){ document.body.classList.remove('drawer-open'); drawer?.classList.remove('show'); }
function closeContext(){ context?.classList.remove('show'); }
function openContext(button, index){
  activeRecord = current[index] || records[index] || records[0];
  if(!context) return;
  context.innerHTML = `
    <button type="button" data-action="view"><i class="fa-regular fa-eye"></i> View Details</button>
    <button type="button" data-action="download"><i class="fa-solid fa-download"></i> Download PDF</button>
    <button type="button" data-action="print"><i class="fa-solid fa-print"></i> Print</button>
    <button type="button" data-action="share"><i class="fa-solid fa-share-nodes"></i> Share Record</button>`;
  const rect = button.getBoundingClientRect();
  const menuWidth = 190;
  let left = window.scrollX + rect.right - menuWidth;
  let top = window.scrollY + rect.bottom + 8;
  if(left < 8) left = 8;
  if(left + menuWidth > window.scrollX + window.innerWidth - 8) left = window.scrollX + window.innerWidth - menuWidth - 8;
  if(top + 160 > window.scrollY + window.innerHeight) top = window.scrollY + rect.top - 150;
  context.style.left = `${left}px`;
  context.style.top = `${top}px`;
  context.classList.add('show');
}

function downloadRecord(r = activeRecord){
  const content = `${r.type}\n${r.title}\n${r.doctor}\n${r.related}\n${r.date}, ${r.time}\n${r.summary}`;
  const blob = new Blob([content], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (r.attachment || 'medical-record.txt').replace(/\.pdf$/i,'.txt');
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(a.href);
}
function printRecord(){ window.print(); }
function shareRecord(){
  const text = `${activeRecord.type} - ${activeRecord.doctor} - ${activeRecord.date}`;
  if(navigator.share){ navigator.share({title:'Medical Record', text}).catch(()=>{}); }
  else { navigator.clipboard?.writeText(text); alert('Record details copied to clipboard'); }
}

function applyZoom(){
  if(zoomValue) zoomValue.textContent = `${zoom}%`;
  if(pdfPage){ pdfPage.style.fontSize = `${Math.max(12, Math.round(14 * zoom / 100))}px`; }
}

function drawCalendar(){
  const grid = document.getElementById('medCalGrid');
  const label = document.getElementById('medCalLabel');
  if(!grid || !label) return;
  const y = calDate.getFullYear(), m = calDate.getMonth();
  label.textContent = calDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const first = new Date(y,m,1).getDay();
  const days = new Date(y,m+1,0).getDate();
  const prev = new Date(y,m,0).getDate();
  let html = ['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<span>${d}</span>`).join('');
  for(let i=first-1;i>=0;i--) html += `<button type="button" class="muted">${prev-i}</button>`;
  for(let d=1; d<=days; d++) html += `<button type="button" data-day="${d}">${d}</button>`;
  for(let i=1;(first+days+i-1)%7;i++) html += `<button type="button" class="muted">${i}</button>`;
  grid.innerHTML = html;
}

function initCalendar(){
  const dateFilter = document.getElementById('medDateFilter');
  const datePop = document.getElementById('medDatePop');
  const dateText = document.querySelector('#medDateFilter .date-text');
  drawCalendar();
  dateFilter?.addEventListener('click', e=>{ e.stopPropagation(); datePop?.classList.toggle('show'); closeContext(); });
  datePop?.addEventListener('click', e=>e.stopPropagation());
  document.getElementById('prevMedCal')?.addEventListener('click', e=>{ e.stopPropagation(); calDate.setMonth(calDate.getMonth()-1); drawCalendar(); });
  document.getElementById('nextMedCal')?.addEventListener('click', e=>{ e.stopPropagation(); calDate.setMonth(calDate.getMonth()+1); drawCalendar(); });
  document.getElementById('clearMedDate')?.addEventListener('click', e=>{ e.stopPropagation(); if(dateText) dateText.textContent='Select Date Range'; datePop?.classList.remove('show'); });
  document.getElementById('todayMedDate')?.addEventListener('click', e=>{ e.stopPropagation(); if(dateText) dateText.textContent='Today'; datePop?.classList.remove('show'); });
  document.addEventListener('click', e=>{ if(!e.target.closest('#medDateFilter')) datePop?.classList.remove('show'); });
  document.addEventListener('click', e=>{
    const day = e.target.closest('#medCalGrid [data-day]');
    if(day){ if(dateText) dateText.textContent = `${String(day.dataset.day).padStart(2,'0')} ${document.getElementById('medCalLabel')?.textContent || ''}`; datePop?.classList.remove('show'); }
  });
}

function initCommon(){
  document.addEventListener('click', e=>{
    const viewBtn = e.target.closest('[data-view]');
    if(viewBtn){ e.preventDefault(); e.stopPropagation(); openDrawer(current[+viewBtn.dataset.view]); return; }
    const menuBtn = e.target.closest('[data-menu]');
    if(menuBtn){ e.preventDefault(); e.stopPropagation(); openContext(menuBtn, +menuBtn.dataset.menu); return; }
    const row = e.target.closest('.record-row[data-row]');
    if(row && !e.target.closest('.record-action')){ openDrawer(current[+row.dataset.row]); return; }
    if(!e.target.closest('#recordContext')) closeContext();
  });
  context?.addEventListener('click', e=>{
    e.stopPropagation();
    const action = e.target.closest('[data-action]')?.dataset.action;
    if(!action) return;
    if(action === 'view') openDrawer(activeRecord);
    if(action === 'download') downloadRecord(activeRecord);
    if(action === 'print') printRecord();
    if(action === 'share') shareRecord();
    closeContext();
  });
  drawer?.addEventListener('click', e=>{ if(e.target === drawer) closeDrawer(); });
  document.getElementById('closeMed')?.addEventListener('click', closeDrawer);
  document.getElementById('closeRec')?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape'){ closeContext(); closeDrawer(); document.querySelectorAll('.dropdown.show').forEach(d=>d.classList.remove('show')); }});
  document.querySelectorAll('.detail-tabs [data-tab]').forEach(btn=>btn.addEventListener('click', ()=>switchTab(btn.dataset.tab)));
  document.getElementById('zoomIn')?.addEventListener('click', e=>{ e.stopPropagation(); zoom = Math.min(160, zoom + 10); applyZoom(); });
  document.getElementById('zoomOut')?.addEventListener('click', e=>{ e.stopPropagation(); zoom = Math.max(70, zoom - 10); applyZoom(); });
  document.getElementById('downloadPdf')?.addEventListener('click', e=>{ e.stopPropagation(); downloadRecord(); });
  document.getElementById('printPdf')?.addEventListener('click', e=>{ e.stopPropagation(); printRecord(); });
  document.querySelector('.download-rec')?.addEventListener('click', ()=>downloadRecord());
  document.querySelector('.mini-download')?.addEventListener('click', ()=>downloadRecord());
  search?.addEventListener('input', ()=>{ const q = search.value.toLowerCase(); current = records.filter(r=>Object.values(r).join(' ').toLowerCase().includes(q)); render(current); });
  document.querySelectorAll('.record-stat').forEach(card=>card.addEventListener('click', ()=>{ document.querySelectorAll('.record-stat').forEach(c=>c.classList.remove('active')); card.classList.add('active'); const type = card.dataset.type; current = type === 'all' ? records.slice() : records.filter(r=>r.cls === type); render(current); }));
  const notifBtn = document.getElementById('notifBtn'), profileBtn = document.getElementById('profileBtn');
  notifBtn?.addEventListener('click', e=>{ e.stopPropagation(); document.getElementById('notifMenu')?.classList.toggle('show'); document.getElementById('profileMenu')?.classList.remove('show'); });
  profileBtn?.addEventListener('click', e=>{ e.stopPropagation(); document.getElementById('profileMenu')?.classList.toggle('show'); document.getElementById('notifMenu')?.classList.remove('show'); });
  document.addEventListener('click', e=>{ if(!e.target.closest('.notif,.profile')) document.querySelectorAll('.dropdown.show').forEach(d=>d.classList.remove('show')); });
  const sidebarEl = document.getElementById('sidebar');
  const openSidebarBtn = document.getElementById('openSidebar');
  const closeSidebarBtn = document.getElementById('closeSidebar');
  let overlay = document.getElementById('overlay') || document.getElementById('mobileOverlay');
  if(!overlay){ overlay = document.createElement('div'); overlay.id = 'overlay'; overlay.className = 'overlay'; document.body.appendChild(overlay); }
  function openSidebar(){ sidebarEl?.classList.add('open','show'); overlay?.classList.add('show'); document.body.classList.add('sidebar-open'); }
  function closeSidebar(){ sidebarEl?.classList.remove('open','show'); overlay?.classList.remove('show'); document.body.classList.remove('sidebar-open'); }
  openSidebarBtn?.addEventListener('click', openSidebar);
  closeSidebarBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);
  document.querySelectorAll('.sidebar .menu-item').forEach(a=>a.addEventListener('click', ()=>{ if(window.innerWidth <= 1024) closeSidebar(); }));
}

initCommon();
initCalendar();
render();
fillDetails(activeRecord);
switchTab('preview');
applyZoom();


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
