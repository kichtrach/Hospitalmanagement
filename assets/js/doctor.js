document.addEventListener('DOMContentLoaded', () => {
  const primaryDate = new Date(2025, 4, 24);
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function formatDate(date){
    return `${String(date.getDate()).padStart(2,'0')} ${shortMonth[date.getMonth()]} ${date.getFullYear()}`;
  }
  function isoDate(date){
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }

  // Sidebar hamburger and submenu state
  const sidebar = document.getElementById('doctorSidebar');
  const menu = document.getElementById('doctorMenu');
  if (menu && sidebar) {
    menu.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
  document.querySelectorAll('.doctor-nav-group .nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.doctor-nav-group');
      const isOpen = group?.classList.contains('open');
      document.querySelectorAll('.doctor-nav-group').forEach(g => g.classList.remove('open'));
      if (group && !isOpen) group.classList.add('open');
    });
  });
  document.querySelectorAll('.doctor-nav-link:not(.nav-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.doctor-nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.doctor-nav-group').forEach(g => g.classList.remove('open'));
    });
  });
  document.querySelectorAll('.doctor-nav-group .doctor-subnav a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.doctor-nav-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.doctor-nav-group').forEach(g => g.classList.remove('open'));
      const group = link.closest('.doctor-nav-group');
      if (group) {
        group.classList.add('open');
        group.querySelector('.nav-toggle')?.classList.add('active');
      }
    });
  });

  // Tabs
  const rows = [...document.querySelectorAll('#doctorAppointmentsTable tbody tr')];
  document.querySelectorAll('[data-doctor-tabs] button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-doctor-tabs] button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      rows.forEach(row => { row.style.display = (filter === 'all' || row.dataset.status === filter) ? '' : 'none'; });
    });
  });

  // Drawer
  const drawer = document.getElementById('appointmentDrawer');
  document.querySelectorAll('.view-appointment, .doctor-table .mini:first-child').forEach(btn => {
    btn.addEventListener('click', e => {
      if (btn.classList.contains('menu-dot')) return;
      if (!drawer) return;
      e.preventDefault();
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
    });
  });
  document.querySelector('.drawer-close')?.addEventListener('click', () => {
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden', 'true');
  });

  // Action buttons alignment
  document.querySelectorAll('.doctor-table tbody td:last-child').forEach(td => {
    if (td.querySelector('.mini')) td.classList.add('row-actions');
  });

  // Three-dot menu
  document.addEventListener('click', e => {
    const previous = document.querySelector('.doctor-action-menu');
    if (previous && !e.target.closest('.menu-dot') && !e.target.closest('.doctor-action-menu')) previous.remove();
    const dot = e.target.closest('.menu-dot');
    if (!dot) return;
    e.preventDefault();
    e.stopPropagation();
    if (previous) previous.remove();
    const menuEl = document.createElement('div');
    menuEl.className = 'doctor-action-menu';
    menuEl.innerHTML = `
      <button><i class="fa-regular fa-eye"></i> View Details</button>
      <a href="doctor-consultation.html" data-start-consultation class="doctor-menu-link"><i class="fa-solid fa-stethoscope"></i> Start Consultation</a>
      <button><i class="fa-regular fa-pen-to-square"></i> Edit Appointment</button>
      <button><i class="fa-regular fa-calendar-days"></i> Reschedule</button>
      <button><i class="fa-solid fa-xmark"></i> Mark as No Show</button>
      <button class="danger"><i class="fa-regular fa-circle-xmark"></i> Cancel Appointment</button>
      <button><i class="fa-regular fa-bell"></i> Send Reminder</button>
      <button><i class="fa-solid fa-print"></i> Print Slip</button>
      <button><i class="fa-regular fa-file-lines"></i> Generate Invoice</button>
      <button class="danger"><i class="fa-regular fa-trash-can"></i> Delete</button>`;
    document.body.appendChild(menuEl);
    const rect = dot.getBoundingClientRect();
    const width = 224;
    let left = rect.right - width;
    if (left < 12) left = 12;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    menuEl.style.left = `${left}px`;
    menuEl.style.top = `${rect.bottom + 8 + window.scrollY}px`;
  });

  // Topbar notification/profile dropdowns
  function closeTopDropdowns(except){
    document.querySelectorAll('.doctor-top-dropdown.open').forEach(drop => { if (drop !== except) drop.classList.remove('open'); });
  }
  function placeDropdown(drop, anchor){
    const r = anchor.getBoundingClientRect();
    drop.style.top = `${r.bottom + 10}px`;
    drop.style.right = `${Math.max(12, window.innerWidth - r.right)}px`;
  }
  function notificationDropdown(){
    let drop = document.getElementById('doctorNotificationDropdown');
    if (drop) return drop;
    drop = document.createElement('div');
    drop.id = 'doctorNotificationDropdown';
    drop.className = 'doctor-top-dropdown doctor-notification-menu';
    drop.innerHTML = `
      <div class="drop-head"><span>Notifications</span><a href="#">View all</a></div>
      <a class="drop-item" href="#"><i class="fa-regular fa-calendar-check"></i><span><strong>Next appointment at 10:30 AM</strong><span>Ramesh Patel is waiting for review.</span></span></a>
      <a class="drop-item" href="#"><i class="fa-regular fa-file-lines"></i><span><strong>Lab report ready</strong><span>2 reports are pending your review.</span></span></a>
      <a class="drop-item" href="#"><i class="fa-regular fa-message"></i><span><strong>3 unread messages</strong><span>New messages from reception and nurse station.</span></span></a>`;
    document.body.appendChild(drop);
    return drop;
  }
  function profileDropdown(profile){
    let drop = document.getElementById('doctorProfileDropdown');
    if (drop) return drop;
    const img = profile.querySelector('img')?.getAttribute('src') || '';
    drop = document.createElement('div');
    drop.id = 'doctorProfileDropdown';
    drop.className = 'doctor-top-dropdown doctor-profile-menu';
    drop.innerHTML = `
      <div class="profile-mini"><img src="${img}" alt="Doctor"><div><strong>Dr. Priya Sharma</strong><span>Cardiologist</span></div></div>
      <a class="drop-item" href="#"><i class="fa-regular fa-user"></i><span><strong>My Profile</strong><span>View profile and availability.</span></span></a>
      <a class="drop-item" href="#"><i class="fa-solid fa-gear"></i><span><strong>Settings</strong><span>Manage account preferences.</span></span></a>
      <a class="drop-item" href="../login.html"><i class="fa-solid fa-right-from-bracket"></i><span><strong>Logout</strong><span>Sign out of doctor portal.</span></span></a>`;
    document.body.appendChild(drop);
    return drop;
  }
  document.querySelectorAll('.doctor-alert').forEach(btn => {
    btn.setAttribute('aria-haspopup', 'true');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const drop = notificationDropdown();
      const was = drop.classList.contains('open');
      closeTopDropdowns(drop);
      placeDropdown(drop, btn);
      drop.classList.toggle('open', !was);
    });
  });
  document.querySelectorAll('.doctor-profile').forEach(profile => {
    profile.setAttribute('aria-haspopup', 'true');
    profile.addEventListener('click', e => {
      e.stopPropagation();
      const drop = profileDropdown(profile);
      const was = drop.classList.contains('open');
      closeTopDropdowns(drop);
      placeDropdown(drop, profile);
      drop.classList.toggle('open', !was);
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.doctor-top-dropdown') && !e.target.closest('.doctor-alert') && !e.target.closest('.doctor-profile')) closeTopDropdowns();
  });

  // Robust calendar renderer for dashboard, modal, and appointment date filter
  const calendarState = new WeakMap();
  function getState(cal){
    if (!calendarState.has(cal)) calendarState.set(cal, { month: 4, year: 2025, selected: new Date(primaryDate) });
    return calendarState.get(cal);
  }
  function renderCalendar(cal){
    if (!cal) return;
    const state = getState(cal);
    const title = cal.querySelector('.cal-head strong');
    const grid = cal.querySelector('.cal-grid');
    if (!grid) return;
    if (title) title.textContent = `${monthNames[state.month]} ${state.year}`;
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const first = new Date(state.year, state.month, 1).getDay();
    const total = new Date(state.year, state.month + 1, 0).getDate();
    const prevTotal = new Date(state.year, state.month, 0).getDate();
    let html = dayNames.map(d => `<b>${d}</b>`).join('');
    for (let i = first - 1; i >= 0; i--) html += `<button type="button" class="muted" tabindex="-1">${prevTotal - i}</button>`;
    for (let d = 1; d <= total; d++) {
      const date = new Date(state.year, state.month, d);
      const isToday = isoDate(date) === isoDate(primaryDate);
      const isSelected = state.selected && isoDate(date) === isoDate(state.selected);
      html += `<button type="button" data-day="${d}" class="${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}">${d}</button>`;
    }
    const used = first + total;
    for (let d = 1; d <= ((7 - (used % 7)) % 7); d++) html += `<button type="button" class="muted" tabindex="-1">${d}</button>`;
    grid.innerHTML = html;
  }
  function ensureNavButtons(cal){
    const head = cal.querySelector('.cal-head');
    if (!head) return;
    head.querySelectorAll(':scope > i').forEach((icon, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-nav';
      btn.setAttribute('aria-label', index === 0 ? 'Previous month' : 'Next month');
      btn.innerHTML = icon.outerHTML;
      icon.replaceWith(btn);
    });
  }
  function bindCalendar(cal, onSelect){
    if (!cal || cal.dataset.calendarBound === '1') return;
    cal.dataset.calendarBound = '1';
    ensureNavButtons(cal);
    const navs = cal.querySelectorAll('.cal-nav');
    navs[0]?.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const state = getState(cal);
      state.month--; if (state.month < 0) { state.month = 11; state.year--; }
      renderCalendar(cal);
    });
    navs[1]?.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const state = getState(cal);
      state.month++; if (state.month > 11) { state.month = 0; state.year++; }
      renderCalendar(cal);
    });
    cal.addEventListener('click', e => {
      const day = e.target.closest('.cal-grid button[data-day]');
      if (!day) return;
      const state = getState(cal);
      state.selected = new Date(state.year, state.month, Number(day.dataset.day));
      renderCalendar(cal);
      if (typeof onSelect === 'function') onSelect(state.selected, cal);
    });
    renderCalendar(cal);
  }

  document.querySelectorAll('.mini-calendar').forEach(cal => bindCalendar(cal));

  function ensureCalendarModal(){
    let modal = document.getElementById('doctorCalendarModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'doctor-modal';
      modal.id = 'doctorCalendarModal';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = `<div class="doctor-modal-backdrop" data-close-calendar></div>
        <section class="doctor-calendar-modal-card" role="dialog" aria-modal="true" aria-label="Doctor calendar">
          <div class="modal-head"><h2><i class="fa-regular fa-calendar-days"></i> Doctor Calendar</h2><button type="button" data-close-calendar><i class="fa-solid fa-xmark"></i></button></div>
          <div class="mini-calendar modal-calendar"><div class="cal-head"><button type="button" class="cal-nav" aria-label="Previous month"><i class="fa-solid fa-angle-left"></i></button><strong>May 2025</strong><button type="button" class="cal-nav" aria-label="Next month"><i class="fa-solid fa-angle-right"></i></button></div><div class="cal-grid"></div></div>
        </section>`;
      document.body.appendChild(modal);
    }
    const cal = modal.querySelector('.mini-calendar');
    bindCalendar(cal);
    renderCalendar(cal);
    return modal;
  }
  document.querySelectorAll('#viewCalendarBtn, [data-view-calendar], .view-calendar-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const modal = ensureCalendarModal();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-close-calendar]')) return;
    const modal = e.target.closest('.doctor-modal') || document.getElementById('doctorCalendarModal');
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
  });

  // Appointments date control: replace unreliable native input behavior with themed popup calendar.
  function ensureDatePicker(){
    let picker = document.getElementById('doctorDatePicker');
    if (picker) return picker;
    picker = document.createElement('div');
    picker.id = 'doctorDatePicker';
    picker.className = 'doctor-date-picker';
    picker.innerHTML = `<div class="mini-calendar date-picker-calendar"><div class="cal-head"><button type="button" class="cal-nav" aria-label="Previous month"><i class="fa-solid fa-angle-left"></i></button><strong>May 2025</strong><button type="button" class="cal-nav" aria-label="Next month"><i class="fa-solid fa-angle-right"></i></button></div><div class="cal-grid"></div></div>`;
    document.body.appendChild(picker);
    return picker;
  }
  document.querySelectorAll('.doctor-date-control').forEach(control => {
    const input = control.querySelector('input[type="date"]');
    const label = control.querySelector('span');
    control.setAttribute('tabindex', '0');
    control.setAttribute('role', 'button');
    control.addEventListener('click', e => {
      e.preventDefault();
      const picker = ensureDatePicker();
      const cal = picker.querySelector('.mini-calendar');
      const state = getState(cal);
      if (input?.value) {
        const parts = input.value.split('-').map(Number);
        if (parts.length === 3) {
          state.year = parts[0]; state.month = parts[1] - 1; state.selected = new Date(parts[0], parts[1] - 1, parts[2]);
        }
      }
      bindCalendar(cal, selected => {
        if (input) input.value = isoDate(selected);
        if (label) label.textContent = formatDate(selected);
        picker.classList.remove('open');
      });
      renderCalendar(cal);
      const r = control.getBoundingClientRect();
      picker.style.left = `${Math.min(r.left, window.innerWidth - 330)}px`;
      picker.style.top = `${r.bottom + 8 + window.scrollY}px`;
      picker.classList.add('open');
    });
    control.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); control.click(); }
    });
  });
  document.addEventListener('click', e => {
    const picker = document.getElementById('doctorDatePicker');
    if (picker && !e.target.closest('.doctor-date-picker') && !e.target.closest('.doctor-date-control')) picker.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.doctor-modal.open').forEach(m => { m.classList.remove('open'); m.setAttribute('aria-hidden','true'); });
      document.getElementById('doctorDatePicker')?.classList.remove('open');
      closeTopDropdowns();
      document.querySelector('.doctor-action-menu')?.remove();
    }
  });
});



// Consultation timer: starts when a doctor selects Start Consultation and persists across reloads/tabs.
(function(){
  const START_KEY = 'medicareConsultationStartedAt';
  const ACTIVE_KEY = 'medicareConsultationActive';

  function beginConsultation(){
    const now = Date.now();
    sessionStorage.setItem(START_KEY, String(now));
    sessionStorage.setItem(ACTIVE_KEY, '1');
  }

  document.addEventListener('click', function(event){
    const trigger = event.target.closest('[data-start-consultation], a[href*="doctor-consultation.html"]');
    if (!trigger) return;
    beginConsultation();
  }, true);

  function formatElapsed(totalSeconds){
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(' : ');
  }

  function initialiseConsultationTimer(){
    const output = document.getElementById('consultationTimerValue');
    if (!output) return;

    let startedAt = Number(sessionStorage.getItem(START_KEY));
    const active = sessionStorage.getItem(ACTIVE_KEY) === '1';
    const queryStarted = new URLSearchParams(window.location.search).get('start') === '1';

    if ((!startedAt || !active) && queryStarted) {
      beginConsultation();
      startedAt = Number(sessionStorage.getItem(START_KEY));
    }

    // Directly opening the consultation page starts a fresh timer at zero.
    if (!startedAt || !active) {
      beginConsultation();
      startedAt = Number(sessionStorage.getItem(START_KEY));
    }

    const timerBox = output.closest('.consult-timer');
    timerBox?.classList.add('is-running');

    const render = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
      output.textContent = formatElapsed(elapsed);
    };

    render();
    window.setInterval(render, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseConsultationTimer);
  } else {
    initialiseConsultationTimer();
  }
})();

// Doctor consultation workflow tabs and completion modal
(function(){
  function showConsultTab(tab){
    document.querySelectorAll('[data-consult-tabs] button').forEach(btn=>btn.classList.toggle('active', btn.dataset.tab===tab));
    document.querySelectorAll('.consult-pane').forEach(pane=>pane.classList.toggle('active', pane.dataset.pane===tab));
    if (history.replaceState) history.replaceState(null,'',`#${tab}`);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  document.addEventListener('click', function(e){
    const tabBtn=e.target.closest('[data-consult-tabs] button');
    if(tabBtn){ e.preventDefault(); showConsultTab(tabBtn.dataset.tab); }
    const goto=e.target.closest('[data-goto-tab]');
    if(goto){ e.preventDefault(); showConsultTab(goto.dataset.gotoTab); }
    if(e.target.closest('#completeConsultation,#completeConsultationBottom')){
      e.preventDefault();
      const modal=document.getElementById('consultCompleteModal');
      if(modal){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
    }
    if(e.target.closest('.close-complete') || e.target.classList.contains('modal-shade')){
      const modal=document.getElementById('consultCompleteModal');
      if(modal){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
    }
  });
  document.addEventListener('DOMContentLoaded', function(){
    if(document.querySelector('[data-consult-tabs]')){
      const initial=(location.hash||'#consultation').slice(1);
      if(document.querySelector(`[data-pane="${initial}"]`)) showConsultTab(initial);
    }
  });
})();

// Lab order wizard controls
(function(){
  function setLabStep(root, step){
    const stepValue = String(step);
    root.querySelectorAll('[data-lab-step]').forEach(btn => btn.classList.toggle('active', btn.dataset.labStep === stepValue));
    root.querySelectorAll('[data-lab-pane]').forEach(pane => pane.classList.toggle('active', pane.dataset.labPane === stepValue));
  }
  document.querySelectorAll('.lab-order-card').forEach(root => {
    root.addEventListener('click', event => {
      const stepBtn = event.target.closest('[data-lab-step]');
      const nextBtn = event.target.closest('[data-lab-next]');
      const prevBtn = event.target.closest('[data-lab-prev]');
      if (stepBtn) setLabStep(root, stepBtn.dataset.labStep);
      if (nextBtn) setLabStep(root, nextBtn.dataset.labNext);
      if (prevBtn) setLabStep(root, prevBtn.dataset.labPrev);
    });
  });
})();
