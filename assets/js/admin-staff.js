(() => {
 const q=(s,p=document)=>p.querySelector(s), qa=(s,p=document)=>[...p.querySelectorAll(s)];
 const rows=qa('.staff-table tbody tr');
 function filter(){const text=(q('#staffSearch')?.value||'').toLowerCase();const selects=qa('.staff-filterbar select').map(x=>x.value.toLowerCase()); rows.forEach(r=>{const t=r.innerText.toLowerCase();r.style.display=(!text||t.includes(text))&&selects.every(v=>!v||t.includes(v))?'':'none'})}
 q('#staffSearch')?.addEventListener('input',filter);qa('.staff-filterbar select').forEach(s=>s.addEventListener('change',filter));q('#resetFilters')?.addEventListener('click',()=>{q('#staffSearch').value='';qa('.staff-filterbar select').forEach(x=>x.value='');filter()});
 qa('[data-profile]').forEach(b=>b.addEventListener('click',()=>{const r=b.closest('tr');q('#detailName').textContent=r.dataset.name||'Staff Member';q('#detailRole').textContent=r.dataset.role||'Staff';q('#detailDept').textContent=r.dataset.dept||'General';q('#detailEmail').textContent=r.dataset.email||'staff@opdhms.com';q('#detailPhone').textContent=r.dataset.phone||'+91 98765 43210';q('#detailAvatar').src=r.dataset.avatar||'https://i.pravatar.cc/120?img=12';document.querySelector('.staff-side')?.scrollIntoView({behavior:'smooth',block:'start'})}));
 qa('[data-more]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();alert('Actions: View Profile, Edit Staff, Schedule, Deactivate')}));
 qa('[data-modal-open]').forEach(b=>b.addEventListener('click',()=>q('#staffModal')?.classList.add('open')));qa('[data-modal-close]').forEach(b=>b.addEventListener('click',()=>q('#staffModal')?.classList.remove('open')));q('#staffModal')?.addEventListener('click',e=>{if(e.target.id==='staffModal')e.currentTarget.classList.remove('open')});
 q('#staffForm')?.addEventListener('submit',e=>{e.preventDefault();q('#staffModal').classList.remove('open');const t=q('#staffToast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)});
 qa('.profile-tabs button').forEach(b=>b.addEventListener('click',()=>{qa('.profile-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
 q('#exportStaff')?.addEventListener('click',()=>{const csv=[...q('.staff-table').rows].map(r=>[...r.cells].slice(0,-1).map(c=>'"'+c.innerText.replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='staff.csv';a.click()});
})();


// Shared Add New Staff navigation
document.addEventListener('click', function (event) {
  const trigger = event.target.closest('[data-add-staff-url], #addNewStaffBtn');
  if (!trigger) return;
  event.preventDefault();
  const target = trigger.getAttribute('data-add-staff-url') || 'admin-add-staff-step1.html';
  window.location.assign(target);
});
