(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const names = {
    'Dr. Rajesh Kumar':'Administrator','Priya Sharma':'Finance Manager','Arun Verma':'IT Manager',
    'Neha Patel':'HR Executive','Suresh Menon':'Operations Head','Ramesh Iyer':'Billing Manager'
  };
  const seed = [
    ['12 May 2025, 02:15 PM','Dr. Rajesh Kumar','Update','Role & Permission','Updated role details (Administrator)','192.168.1.45','Success'],
    ['12 May 2025, 01:48 PM','Priya Sharma','Create','System Users','Created new user and assigned role','192.168.1.52','Success'],
    ['12 May 2025, 01:32 PM','Arun Verma','Update','Role Permission','Modified permissions (View, Create, Edit)','192.168.1.60','Success'],
    ['12 May 2025, 12:11 PM','Neha Patel','Delete','System Users','Deleted user account (temp.user@hospital.com)','192.168.1.33','Success'],
    ['12 May 2025, 11:05 AM','Suresh Menon','Permission Change','Role Permission','Added permissions to role (Nursing Staff)','192.168.1.21','Success'],
    ['12 May 2025, 10:22 AM','Ramesh Iyer','Login','System Login','User logged in to system','192.168.1.75','Information'],
    ['12 May 2025, 09:58 AM','Dr. Rajesh Kumar','Update','Hospital Settings','Updated general settings','192.168.1.45','Success'],
    ['12 May 2025, 09:10 AM','Priya Sharma','Logout','System Logout','User logged out from system','192.168.1.52','Information'],
    ['12 May 2025, 08:45 AM','Arun Verma','Delete','Inventory','Removed medicine item (Paracetamol 500mg)','192.168.1.60','Warning'],
    ['12 May 2025, 08:02 AM','Neha Patel','Create','System Users','Created new role (Pharmacist)','192.168.1.33','Success']
  ];
  let logs = Array.from({length:80}, (_,i) => {
    const base = seed[i % seed.length];
    return {id:i+1,date:base[0],user:base[1],role:names[base[1]],action:base[2],module:base[3],details:base[4],ip:base[5],status:base[6],logId:`LOG-2025-05-${String(i+1).padStart(5,'0')}`};
  });
  let filtered=[...logs], page=1, size=10, sortKey='', sortDir=1;

  function initials(name){return name.split(' ').map(p=>p[0]).slice(0,2).join('');}
  function slug(v){return v.toLowerCase().replace(/\s+/g,'-');}
  function filter(){
    const q=$('#searchInput').value.trim().toLowerCase();
    const action=$('#actionFilter').value,module=$('#moduleFilter').value,user=$('#userFilter').value,status=$('#statusFilter').value;
    filtered=logs.filter(l=>(!q||[l.user,l.action,l.module,l.details,l.ip].some(v=>v.toLowerCase().includes(q)))&&(!action||l.action===action)&&(!module||l.module===module)&&(!user||l.user===user)&&(!status||l.status===status));
    if(sortKey) filtered.sort((a,b)=>String(a[sortKey]).localeCompare(String(b[sortKey]))*sortDir);
    page=1; render();
  }
  function render(){
    const start=(page-1)*size,end=Math.min(start+size,filtered.length),shown=filtered.slice(start,end);
    $('#rows').innerHTML=shown.map((l,i)=>`<tr><td>${start+i+1}</td><td>${l.date}</td><td><div class="al-user-cell"><span class="al-user-avatar">${initials(l.user)}</span><span><strong>${l.user}</strong><small>${l.role}</small></span></div></td><td><span class="al-chip ${slug(l.action)}">${l.action}</span></td><td>${l.module}</td><td>${l.details}</td><td>${l.ip}</td><td><span class="al-chip ${slug(l.status)}">${l.status}</span></td><td><button class="al-view-btn" data-id="${l.id}" aria-label="View"><i class="fa-regular fa-eye"></i></button></td></tr>`).join('') || `<tr><td colspan="9" style="text-align:center;padding:35px">No matching activity logs found.</td></tr>`;
    const totalLabel=filtered.length?`Showing ${start+1} to ${end} of ${filtered.length===logs.length?'12,458':filtered.length} logs`:'Showing 0 logs';
    $('#topCount').textContent=totalLabel; $('#bottomCount').textContent=totalLabel;
    renderPagination();
  }
  function renderPagination(){
    const total=Math.max(1,Math.ceil(filtered.length/size));
    const pages=[]; if(total<=7){for(let i=1;i<=total;i++)pages.push(i)}else{pages.push(1,2,3,4,5,'…',total)}
    $('#pagination').innerHTML=`<button class="al-page-btn" data-page="prev" ${page===1?'disabled':''}><i class="fa-solid fa-chevron-left"></i></button>${pages.map(p=>p==='…'?`<button class="al-page-btn" disabled>…</button>`:`<button class="al-page-btn ${page===p?'active':''}" data-page="${p}">${p}</button>`).join('')}<button class="al-page-btn" data-page="next" ${page===total?'disabled':''}><i class="fa-solid fa-chevron-right"></i></button>`;
  }
  function openDrawer(log){
    $('#drawerBody').innerHTML=`
      <div class="al-drawer-badge-line"><span class="al-chip ${slug(log.status)}">${log.status}</span><small>Log ID: ${log.logId}</small></div>
      <section class="al-detail-card"><h3>Overview</h3><div class="al-detail-grid"><div class="al-detail-item"><small>Date & Time</small><strong>${log.date}</strong></div><div class="al-detail-item"><small>User Agent</small><strong>Mozilla/5.0 (Windows NT 10.0; Win64; x64)</strong></div><div class="al-detail-item"><small>User</small><div class="al-detail-user"><span class="al-user-avatar">${initials(log.user)}</span><strong>${log.user}<br><small>${log.role}</small></strong></div></div><div class="al-detail-item"><small>Location</small><strong>Trivandrum, Kerala, India</strong></div><div class="al-detail-item"><small>Action</small><span class="al-chip ${slug(log.action)}">${log.action}</span></div><div class="al-detail-item"><small>Browser</small><strong>Chrome 124.0.0.0</strong></div><div class="al-detail-item"><small>Module</small><strong>${log.module}</strong></div><div class="al-detail-item"><small>Platform</small><strong>Windows 10 (64-bit)</strong></div><div class="al-detail-item"><small>IP Address</small><strong>${log.ip}</strong></div></div></section>
      <section class="al-detail-card"><h3>Action Details</h3><div class="al-detail-item"><small>Description</small><strong>${log.details}</strong></div><h3 style="margin-top:14px">Changes Made</h3><table class="al-change-table"><thead><tr><th>Field</th><th>Old Value</th><th>New Value</th></tr></thead><tbody><tr><td>Role Name</td><td>Administrator</td><td>Administrator</td></tr><tr><td>Description</td><td>Full system access</td><td>Full system access with administrative privileges.</td></tr><tr><td>Status</td><td>Active</td><td>Active</td></tr><tr><td>Permissions</td><td>28</td><td>28</td></tr><tr><td>Last Updated By</td><td>Super Admin</td><td>${log.user}</td></tr></tbody></table></section>
      <section class="al-detail-card"><h3>Additional Information</h3><div class="al-detail-grid"><div class="al-detail-item"><small>Session ID</small><strong>SID-20250512-00125</strong></div><div class="al-detail-item"><small>Reference ID</small><strong>REF-ROLE-ADM-001</strong></div><div class="al-detail-item"><small>Performed On</small><strong>Web Application</strong></div></div></section>`;
    $('#drawer').classList.add('open'); $('#drawerOverlay').classList.add('open'); $('#drawer').setAttribute('aria-hidden','false');
  }
  function closeDrawer(){ $('#drawer').classList.remove('open'); $('#drawerOverlay').classList.remove('open'); $('#drawer').setAttribute('aria-hidden','true'); }
  function showToast(text){const t=$('#toast'); $('span',t).textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
  function formatDate(v){return new Date(v+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).replace(/ /g,' ')}
  function placeDatePopover(){const b=$('#dateRangeBtn').getBoundingClientRect(),p=$('#datePopover');p.hidden=false;const left=Math.min(window.innerWidth-p.offsetWidth-12,Math.max(12,b.left));p.style.left=left+'px';p.style.top=(b.bottom+8)+'px'}

  ['searchInput','actionFilter','moduleFilter','userFilter','statusFilter'].forEach(id=>$('#'+id).addEventListener(id==='searchInput'?'input':'change',filter));
  $('#rows').addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b)openDrawer(logs.find(l=>l.id===+b.dataset.id))});
  $('#pagination').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b||b.disabled)return;const total=Math.max(1,Math.ceil(filtered.length/size));page=b.dataset.page==='prev'?Math.max(1,page-1):b.dataset.page==='next'?Math.min(total,page+1):+b.dataset.page;render()});
  $('#pageSize').addEventListener('change',e=>{size=+e.target.value;$('#pageSizeBottom').value=e.target.value;page=1;render()});
  $('#pageSizeBottom').addEventListener('change',e=>{size=+e.target.value;$('#pageSize').value=e.target.value;page=1;render()});
  $$('[data-sort]').forEach(b=>b.addEventListener('click',()=>{sortDir=sortKey===b.dataset.sort?-sortDir:1;sortKey=b.dataset.sort;filter()}));
  $('#drawerClose').onclick=$('#drawerCloseBottom').onclick=$('#drawerOverlay').onclick=closeDrawer;
  $('#profileBtn').onclick=e=>{e.stopPropagation();$('#profileMenu').classList.toggle('open')};
  document.addEventListener('click',e=>{if(!e.target.closest('#profileMenu')&&!e.target.closest('#profileBtn'))$('#profileMenu').classList.remove('open')});
  $('#dateRangeBtn').onclick=e=>{e.stopPropagation();placeDatePopover()};
  $('#dateClose').onclick=$('#dateCancel').onclick=()=>$('#datePopover').hidden=true;
  $('#dateApply').onclick=()=>{const s=$('#startDate').value,e=$('#endDate').value;if(!s||!e||s>e){showToast('Please select a valid date range');return}$('#dateRangeText').innerHTML=`${formatDate(s)} &nbsp; - &nbsp; ${formatDate(e)}`;$('#datePopover').hidden=true;showToast('Date range applied')};
  $$('.al-presets button').forEach(b=>b.onclick=()=>{const end=new Date(2025,4,12),start=new Date(end);if(b.dataset.days==='month')start.setDate(1);else start.setDate(end.getDate()-(+b.dataset.days||0));const iso=d=>d.toISOString().slice(0,10);$('#startDate').value=iso(start);$('#endDate').value=iso(end)});
  document.addEventListener('click',e=>{if(!e.target.closest('#datePopover')&&!e.target.closest('#dateRangeBtn'))$('#datePopover').hidden=true});
  $('#filterBtn').onclick=()=>{filter();showToast('Filters applied')};
  $('#exportBtn').onclick=()=>{const rows=[['Date & Time','User','Role','Action','Module','Details','IP Address','Status'],...filtered.map(l=>[l.date,l.user,l.role,l.action,l.module,l.details,l.ip,l.status])];const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='activity-logs.csv';a.click();URL.revokeObjectURL(a.href);showToast('Activity logs exported')};
  $('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){$('#searchInput').value=e.target.value;filter()}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();$('#datePopover').hidden=true;$('#profileMenu').classList.remove('open')}});
  render();
})();
