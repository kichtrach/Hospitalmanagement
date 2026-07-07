document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.toggle-password').forEach(btn=>btn.addEventListener('click',()=>{const input=btn.closest('.input-wrap').querySelector('input');input.type=input.type==='password'?'text':'password';btn.innerHTML=input.type==='password'?'<i class="fa-regular fa-eye-slash"></i>':'<i class="fa-regular fa-eye"></i>';}));
 document.querySelectorAll('[data-toast]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showToast(el.dataset.toast||'Action completed');}));
 const tabs=document.querySelectorAll('.tab-btn');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));tab.classList.add('active');const label=document.querySelector('[data-tab-label]');const input=document.querySelector('[data-tab-input]');if(label&&input){const mob=tab.dataset.tab==='mobile';label.textContent=mob?'Mobile Number':'Email ID';input.placeholder=mob?'Enter your registered mobile number':'Enter your registered email address';}}));
 const newPass=document.querySelector('#newPassword'); if(newPass){newPass.addEventListener('input',()=>{const v=newPass.value;let score=0;if(v.length>=8)score++;if(/[A-Z]/.test(v)&&/[a-z]/.test(v))score++;if(/\d/.test(v))score++;if(/[^A-Za-z0-9]/.test(v))score++;document.querySelectorAll('.bars span').forEach((b,i)=>b.classList.toggle('active',i<Math.max(score,1)));const txt=document.querySelector('.strength-text');if(txt){txt.textContent=score<2?'Weak':score<4?'Medium':'Strong';txt.className='strength-text '+(score<2?'weak':'');}})}
});
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}


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
