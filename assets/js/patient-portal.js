(function(){
  const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  const sidebar=$('.patient-sidebar');
  $('.patient-hamb')?.addEventListener('click',()=>sidebar?.classList.toggle('open'));
  $$('.patient-nav a').forEach(a=>{if(location.pathname.endsWith(a.getAttribute('href')))a.classList.add('active')});
  $$('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-tab]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const target=btn.dataset.tab;$$('[data-tab-panel]').forEach(p=>p.hidden=p.dataset.tabPanel!==target)}));
  const search=$('[data-search]');
  function filterRows(){const q=(search?.value||'').toLowerCase();const hospital=$('[data-hospital]')?.value||'';const dept=$('[data-dept]')?.value||'';$$('[data-row]').forEach(row=>{const ok=(!q||row.textContent.toLowerCase().includes(q))&&(!hospital||row.dataset.hospital===hospital)&&(!dept||row.dataset.dept===dept);row.style.display=ok?'grid':'none'})}
  search?.addEventListener('input',filterRows);$('[data-hospital]')?.addEventListener('change',filterRows);$('[data-dept]')?.addEventListener('change',filterRows);
  $$('[data-view-prescription]').forEach(btn=>btn.addEventListener('click',()=>{$('.details-drawer')?.classList.add('open');$('.drawer-overlay')?.classList.add('open')}));
  function closeDrawer(){$('.details-drawer')?.classList.remove('open');$('.drawer-overlay')?.classList.remove('open')}
  $('.close-drawer')?.addEventListener('click',closeDrawer);$('.drawer-overlay')?.addEventListener('click',closeDrawer);
  $$('[data-toast]').forEach(btn=>btn.addEventListener('click',()=>{const t=$('.toast');if(!t)return;t.textContent=btn.dataset.toast;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}));
  $('.date-range-input')?.addEventListener('click',function(){this.type='date';this.showPicker?.()});
})();
