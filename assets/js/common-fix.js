
(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function toast(msg){let t=$('.toast-msg'); if(!t){t=document.createElement('div');t.className='toast-msg';t.style.cssText='position:fixed;right:24px;bottom:24px;background:#10145c;color:#fff;padding:12px 16px;border-radius:3px;z-index:5000;box-shadow:0 14px 42px rgba(0,0,0,.18);font:500 13px Poppins,Arial';document.body.appendChild(t)} t.textContent=msg; t.style.display='block'; clearTimeout(t._h); t._h=setTimeout(()=>t.style.display='none',1800)}
  function initSidebar(){const sb=$('#sidebar')||$('.sidebar')||$('.booking-sidebar'), ov=$('#overlay')||Object.assign(document.createElement('div'),{id:'overlay',className:'overlay'}); if(!ov.parentNode) document.body.appendChild(ov); $$('#openSidebar,.hamburger,.menu-toggle').forEach(b=>b.addEventListener('click',()=>{sb&&sb.classList.add('open');ov.classList.add('show')})); $$('#closeSidebar,#overlay').forEach(b=>b.addEventListener('click',()=>{sb&&sb.classList.remove('open');ov.classList.remove('show')}));}
  function initProfileMenu(){const btn=$('#profileBtn')||$('.profile'), menu=$('#profileMenu')||$('.profile-menu'); if(btn&&menu){btn.addEventListener('click',e=>{e.stopPropagation();menu.classList.toggle('show')});document.addEventListener('click',()=>menu.classList.remove('show'))}}
  function initTabs(){ $$('.tab[data-tab]').forEach(tab=>tab.addEventListener('click',()=>{const id=tab.dataset.tab; const wrap=tab.closest('.page-content')||document; $$('.tab[data-tab]',wrap).forEach(t=>t.classList.remove('active')); tab.classList.add('active'); $$('.tab-panel[data-panel]',wrap).forEach(p=>p.classList.toggle('active',p.dataset.panel===id)); })); }
  function initProfilePhoto(){const cam=$('.camera'); if(!cam) return; const img=$('.profile-photo'); let inp=$('#profilePhotoInput'); if(!inp){inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.id='profilePhotoInput';inp.style.display='none';document.body.appendChild(inp)} cam.setAttribute('title','Upload profile photo'); cam.addEventListener('click',()=>inp.click()); inp.addEventListener('change',()=>{const f=inp.files&&inp.files[0]; if(!f) return; const url=URL.createObjectURL(f); if(img) img.src=url; $$('.avatar').forEach(a=>a.src=url); toast('Profile photo updated')});}
  function initUploads(){ $$('.upload,.file-drop').forEach(box=>{ if(box.dataset.uploadReady) return; box.dataset.uploadReady='1'; const inp=document.createElement('input'); inp.type='file'; inp.multiple=true; inp.style.display='none'; if(box.classList.contains('upload')) inp.accept='.jpg,.jpeg,.png,.pdf'; document.body.appendChild(inp); box.addEventListener('click',()=>inp.click()); ['dragenter','dragover'].forEach(ev=>box.addEventListener(ev,e=>{e.preventDefault();box.classList.add('drag-over')})); ['dragleave','drop'].forEach(ev=>box.addEventListener(ev,e=>{e.preventDefault();box.classList.remove('drag-over')})); inp.addEventListener('change',()=>{const n=inp.files.length; if(n) toast(n+' file'+(n>1?'s':'')+' selected')}); });}
  function modal(title, data){let m=$('.detail-modal'); if(!m){m=document.createElement('div');m.className='detail-modal';m.innerHTML='<div class="detail-panel"><div class="detail-head"><h3></h3><button class="detail-close">×</button></div><div class="detail-body"><div class="detail-grid"></div></div></div>';document.body.appendChild(m);m.querySelector('.detail-close').onclick=()=>m.classList.remove('show');m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')})} m.querySelector('h3').textContent=title; const grid=m.querySelector('.detail-grid'); grid.innerHTML=''; Object.entries(data).forEach(([k,v])=>{const c=document.createElement('div');c.className='detail-cell';c.innerHTML='<span>'+k+'</span><b>'+v+'</b>';grid.appendChild(c)}); m.classList.add('show');}
  function initActions(){document.addEventListener('click',e=>{
    const currentPage = (location.pathname || '').split('/').pop();
    const skipDesigned = currentPage === 'medical-records.html' || currentPage === 'lab-reports.html' || e.target.closest('.record-row,.mobile-rec-card,.record-context,.med-drawer,.records-card,.rx-row,.rx-card,.rx-context,.rx-drawer,.lab-row,.lab-card,.lab-context,.lab-page,.lab-detail-page') || e.target.closest('#recordRows,#mobileRecords,#recordContext,#medDrawer,#rxRows,#rxCards,#rxContext,#rxDrawer,#labRows,#labCards,#labContext');
    if(skipDesigned) return;
    const view=e.target.closest('button,a');
    if(view && /view profile|view details|view report|view/i.test((view.textContent||'').trim()) && !view.getAttribute('href')){e.preventDefault(); const row=view.closest('.member-row,.record-row,.appt-row,.token-row,tr,.card')||document.body; const name=(row.querySelector('h3,b,strong')||{}).textContent||'Details'; modal(name.trim()||'Details',{Status:'Active',Patient:'Priya Sharma',Date:'15 May 2025',Reference:'OPT-2025-1042'});}
    const keb=e.target.closest('.kebab,.more-btn,.fa-ellipsis-vertical,[data-menu]');
    if(keb){e.preventDefault(); $$('.action-popover').forEach(p=>p.remove()); const p=document.createElement('div'); p.className='action-popover'; p.innerHTML='<button><i class="fa-regular fa-eye"></i> View Details</button><button><i class="fa-regular fa-pen-to-square"></i> Edit</button><button><i class="fa-regular fa-trash-can"></i> Delete</button>'; document.body.appendChild(p); const r=keb.getBoundingClientRect(); p.style.left=Math.min(r.left,innerWidth-190)+'px'; p.style.top=(r.bottom+8)+'px'; p.querySelector('button').onclick=()=>{p.remove();modal('Details',{Name:'Priya Sharma',Type:'Family Member',Status:'Active'})}; setTimeout(()=>document.addEventListener('click',function h(ev){if(!p.contains(ev.target)){p.remove();document.removeEventListener('click',h)}}, {once:false}),0);}
  })}
  function initCounters(){ $$('textarea[maxlength]').forEach(t=>{const c=t.parentElement.querySelector('.char-count'); const upd=()=>{if(c)c.textContent=t.value.length+'/'+t.maxLength}; t.addEventListener('input',upd); upd();}); }
  document.addEventListener('DOMContentLoaded',()=>{initSidebar();initProfileMenu();initTabs();initProfilePhoto();initUploads();initActions();initCounters();});
})();

(function(){
  function norm(p){return (p||'').split('/').pop().split('#')[0] || 'patient-dashboard.html';}
  document.addEventListener('DOMContentLoaded',function(){
    var cur=norm(location.pathname);
    document.querySelectorAll('.sidebar .menu-item,.booking-sidebar a,.booking-menu a').forEach(function(a){
      var href=norm(a.getAttribute('href')||'');
      if(href && href.indexOf('.html')>-1){
        a.classList.toggle('active', href===cur || (cur==='index.html' && href==='patient-dashboard.html'));
      }
    });
  });
})();


/* Final: keep sidebar active state based on page URL only; never activate hash placeholders */
(function(){
  function fileName(v){
    v=(v||'').split('#')[0].split('?')[0];
    if(!v || v==='#') return '';
    return v.split('/').pop() || 'patient-dashboard.html';
  }
  function expectedForPage(){
    var cur=fileName(location.pathname) || 'patient-dashboard.html';
    if(cur==='index.html') return 'patient-dashboard.html';
    if(cur==='book-appointment.html') return 'my-appointments.html';
    if(cur==='add-family-member.html') return 'my-family.html';
    return cur;
  }
  function repairActive(){
    var expected=expectedForPage();
    document.querySelectorAll('.sidebar .menu-item,.booking-sidebar .menu-item,.booking-menu a').forEach(function(a){
      var href=a.getAttribute('href')||'';
      var f=fileName(href);
      var should=!!f && f===expected && href.indexOf('#')!==0;
      a.classList.toggle('active', should);
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    repairActive();
    document.querySelectorAll('.sidebar .menu-item,.booking-sidebar .menu-item,.booking-menu a').forEach(function(a){
      a.addEventListener('click',function(){ setTimeout(repairActive,0); });
    });
  });
  window.addEventListener('hashchange',repairActive);
})();
