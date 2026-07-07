const sidebar=document.getElementById('sidebar');const overlay=document.getElementById('overlay');document.getElementById('openSidebar').onclick=()=>{sidebar.classList.add('open');overlay&&overlay.classList.add('show');document.body.classList.add('sidebar-open')};document.getElementById('closeSidebar').onclick=()=>{sidebar.classList.remove('open');overlay&&overlay.classList.remove('show');document.body.classList.remove('sidebar-open')};overlay.onclick=()=>{sidebar.classList.remove('open');overlay&&overlay.classList.remove('show');document.body.classList.remove('sidebar-open')};function toggleDrop(btn,menu){btn.addEventListener('click',e=>{e.stopPropagation();document.querySelectorAll('.dropdown').forEach(d=>d!==menu&&d.classList.remove('show'));menu.classList.toggle('show')})}toggleDrop(document.getElementById('notifBtn'),document.getElementById('notifMenu'));toggleDrop(document.getElementById('profileBtn'),document.getElementById('profileMenu'));document.addEventListener('click',()=>document.querySelectorAll('.dropdown').forEach(d=>d.classList.remove('show')));document.querySelectorAll('.menu-item').forEach(item=>item.addEventListener('click',()=>{document.querySelectorAll('.menu-item').forEach(i=>i.classList.remove('active'));item.classList.add('active');if(innerWidth<1025){sidebar.classList.remove('open');overlay&&overlay.classList.remove('show');document.body.classList.remove('sidebar-open')}}));document.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',function(e){const r=document.createElement('span');r.className='ripple';this.appendChild(r);setTimeout(()=>r.remove(),500)}));

/* === Calendar functionality update === */
(function(){
  const modal=document.getElementById('calendarModal');
  const grid=document.getElementById('calendarGrid');
  const label=document.getElementById('calendarMonthLabel');
  const closeBtn=document.getElementById('calendarClose');
  const cancelBtn=document.getElementById('cancelCalendar');
  const confirmBtn=document.getElementById('confirmCalendar');
  const prevBtn=document.getElementById('prevMonth');
  const nextBtn=document.getElementById('nextMonth');
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
  let viewDate=new Date(2025,4,1);
  let selectedDate=new Date(2025,4,24);

  function openCalendar(){
    if(!modal) return;
    modal.classList.add('show');
    document.body.classList.add('calendar-open');
    renderCalendar();
  }
  function closeCalendar(){
    if(!modal) return;
    modal.classList.remove('show');
    document.body.classList.remove('calendar-open');
  }
  function sameDay(a,b){return a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
  function renderCalendar(){
    if(!grid||!label) return;
    grid.innerHTML='';
    label.textContent=monthNames[viewDate.getMonth()]+' '+viewDate.getFullYear();
    const year=viewDate.getFullYear();
    const month=viewDate.getMonth();
    const firstDay=new Date(year,month,1).getDay();
    const daysInMonth=new Date(year,month+1,0).getDate();
    const prevMonthDays=new Date(year,month,0).getDate();
    const totalCells=Math.ceil((firstDay+daysInMonth)/7)*7;
    for(let i=0;i<totalCells;i++){
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='calendar-day';
      let dayNumber;
      if(i<firstDay){
        dayNumber=prevMonthDays-firstDay+i+1;
        btn.textContent=dayNumber;
        btn.classList.add('muted');
        btn.disabled=true;
      }else if(i>=firstDay+daysInMonth){
        dayNumber=i-(firstDay+daysInMonth)+1;
        btn.textContent=dayNumber;
        btn.classList.add('muted');
        btn.disabled=true;
      }else{
        dayNumber=i-firstDay+1;
        const current=new Date(year,month,dayNumber);
        btn.textContent=dayNumber;
        if(sameDay(current,selectedDate)) btn.classList.add('active');
        btn.addEventListener('click',function(){
          selectedDate=current;
          renderCalendar();
        });
      }
      grid.appendChild(btn);
    }
  }
  document.querySelectorAll('.js-open-calendar').forEach(btn=>btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openCalendar()}));
  if(prevBtn) prevBtn.addEventListener('click',()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);renderCalendar()});
  if(nextBtn) nextBtn.addEventListener('click',()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);renderCalendar()});
  [closeBtn,cancelBtn].forEach(btn=>btn&&btn.addEventListener('click',closeCalendar));
  if(modal) modal.addEventListener('click',e=>{if(e.target===modal) closeCalendar()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closeCalendar()});
  if(confirmBtn) confirmBtn.addEventListener('click',function(){
    closeCalendar();
    alert('Appointment date selected: '+selectedDate.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}));
  });
  renderCalendar();
})();

// View All link interaction: smooth scroll + ripple feedback
(function(){
  document.querySelectorAll('.view-link, .stat-card a, .panel-head a, .panel-footer').forEach(function(link){
    if(!link.hasAttribute('href')) link.setAttribute('href','#');
    link.addEventListener('click', function(e){
      var href = link.getAttribute('href') || '';
      link.classList.remove('is-clicked');
      void link.offsetWidth;
      link.classList.add('is-clicked');
      setTimeout(function(){ link.classList.remove('is-clicked'); }, 420);
      if(href.charAt(0) === '#'){
        var target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
        }
      }
    });
  });
})();


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
