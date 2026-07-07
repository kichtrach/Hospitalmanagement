(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  let step=1; const total=6;
  const state={hospital:'City Care Hospital, Delhi',department:'Cardiology',doctor:'Dr. Arvind Sharma',date:'15 May 2025, 10:00 AM',patient:'Priya Sharma',fee:800,payment:'UPI'};
  function renderStep(){
    $$('.step-page').forEach(p=>p.classList.toggle('active',+p.dataset.step===step));
    $$('.step').forEach((s,i)=>{s.classList.toggle('active',i+1===step);s.classList.toggle('done',i+1<step)});
    $$('.summary-hospital').forEach(e=>e.textContent=state.hospital);
    $$('.summary-department').forEach(e=>e.textContent=state.department||'Not Selected');
    $$('.summary-doctor').forEach(e=>e.textContent=state.doctor||'Not Selected');
    $$('.summary-date').forEach(e=>e.textContent=state.date||'Not Selected');
    $$('.summary-fee').forEach(e=>e.textContent='₹'+state.fee);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  window.nextStep=()=>{ if(step<total){step++; renderStep();}};
  window.prevStep=()=>{ if(step>1){step--; renderStep();}};
  $$('.next-step').forEach(b=>b.addEventListener('click',window.nextStep));
  $$('.prev-step').forEach(b=>b.addEventListener('click',window.prevStep));
  $$('.dept-card').forEach(card=>card.addEventListener('click',()=>{$$('.dept-card').forEach(c=>c.classList.remove('selected'));card.classList.add('selected');state.department=card.dataset.dept;renderStep();}));
  $$('.doctor-row').forEach(row=>row.addEventListener('click',()=>{
    if(row.classList.contains('is-hidden')) return;
    $$('.doctor-row').forEach(r=>r.classList.remove('selected'));
    row.classList.add('selected');
    state.doctor=row.dataset.doctor;
    state.fee=row.dataset.fee||800;
    renderStep();
  }));

  /* Select Doctor filter/search functionality */
  const doctorList=$('.doctor-list');
  if(doctorList && !$('.doctor-count')){
    const count=document.createElement('div');
    count.className='doctor-count';
    doctorList.before(count);
  }
  function getFilterValue(id){ return $('#'+id)?.value || 'all'; }
  function doctorMatches(row){
    const q=($('#doctorSearchInput')?.value||'').trim().toLowerCase();
    const hospital=getFilterValue('doctorHospitalFilter');
    const dept=getFilterValue('doctorDepartmentFilter');
    const rating=getFilterValue('ratingFilter');
    const exp=getFilterValue('experienceFilter');
    const fee=getFilterValue('feeFilter');
    const availability=getFilterValue('availabilityFilter');
    const topOnly=$('#topRatedOnly')?.checked;
    const femaleOnly=$('#femaleDoctorOnly')?.checked;
    const searchable=(row.textContent+' '+(row.dataset.doctor||'')+' '+(row.dataset.department||'')+' '+(row.dataset.hospital||'')).toLowerCase();
    if(q && !searchable.includes(q)) return false;
    if(hospital!=='all' && row.dataset.hospital!==hospital) return false;
    if(dept!=='all' && row.dataset.department!==dept) return false;
    if(rating!=='all' && Number(row.dataset.rating||0)<Number(rating)) return false;
    if(exp!=='all' && Number(row.dataset.experience||0)<Number(exp)) return false;
    if(fee!=='all' && Number(row.dataset.fee||999999)>Number(fee)) return false;
    if(availability!=='all' && row.dataset.availability!==availability) return false;
    if(topOnly && row.dataset.top!=='true') return false;
    if(femaleOnly && row.dataset.gender!=='female') return false;
    return true;
  }
  function applyDoctorFilters(autoSelect=false){
    const rows=$$('.doctor-row');
    let visible=[];
    rows.forEach(row=>{
      const show=doctorMatches(row);
      row.classList.toggle('is-hidden',!show);
      if(show) visible.push(row);
    });
    const empty=$('#doctorEmptyState');
    if(empty) empty.hidden=visible.length!==0;
    const count=$('.doctor-count');
    if(count) count.innerHTML=`Showing <b>${visible.length}</b> of <b>${rows.length}</b> doctors`;
    if(autoSelect || !$('.doctor-row.selected:not(.is-hidden)')){
      $$('.doctor-row').forEach(r=>r.classList.remove('selected'));
      if(visible[0]){
        visible[0].classList.add('selected');
        state.doctor=visible[0].dataset.doctor;
        state.fee=visible[0].dataset.fee||800;
        renderStep();
      }
    }
  }
  $('#doctorFilterToggle')?.addEventListener('click',()=>{
    const panel=$('#doctorFilterPanel');
    panel?.classList.toggle('show');
    $('#doctorFilterToggle')?.classList.toggle('active',panel?.classList.contains('show'));
    panel?.setAttribute('aria-hidden', panel.classList.contains('show')?'false':'true');
  });
  $('#closeDoctorFilter')?.addEventListener('click',()=>{
    $('#doctorFilterPanel')?.classList.remove('show');
    $('#doctorFilterToggle')?.classList.remove('active');
    $('#doctorFilterPanel')?.setAttribute('aria-hidden','true');
  });
  $('#applyDoctorFilter')?.addEventListener('click',()=>applyDoctorFilters(true));
  function resetDoctorFilters(){
    ['doctorHospitalFilter','doctorDepartmentFilter','ratingFilter','experienceFilter','feeFilter','availabilityFilter'].forEach(id=>{ const el=$('#'+id); if(el) el.value=id==='doctorHospitalFilter'?'City Care Hospital, Delhi':id==='doctorDepartmentFilter'?'Cardiology':'all'; });
    const search=$('#doctorSearchInput'); if(search) search.value='';
    const top=$('#topRatedOnly'); if(top) top.checked=false;
    const female=$('#femaleDoctorOnly'); if(female) female.checked=false;
    applyDoctorFilters(true);
  }
  $('#resetDoctorFilter')?.addEventListener('click',resetDoctorFilters);
  $('#clearDoctorFilters')?.addEventListener('click',resetDoctorFilters);
  $('#doctorSearchInput')?.addEventListener('input',()=>applyDoctorFilters(false));
  ['doctorHospitalFilter','doctorDepartmentFilter','ratingFilter','experienceFilter','feeFilter','availabilityFilter'].forEach(id=>$('#'+id)?.addEventListener('change',()=>applyDoctorFilters(false)));
  ['topRatedOnly','femaleDoctorOnly'].forEach(id=>$('#'+id)?.addEventListener('change',()=>applyDoctorFilters(false)));
  applyDoctorFilters(false);
  $$('.slot').forEach(slot=>slot.addEventListener('click',()=>{$$('.slot').forEach(s=>s.classList.remove('selected'));slot.classList.add('selected');const d=$('.cal-day.selected')?.dataset.label||'15 May 2025';state.date=d+', '+slot.textContent.trim();$('.selected-slot-text').textContent=state.date;renderStep();}));
  $$('.pay-option').forEach(opt=>opt.addEventListener('click',()=>{$$('.pay-option').forEach(o=>o.classList.remove('active'));opt.classList.add('active');state.payment=opt.dataset.pay; $$('.pay-content').forEach(p=>p.hidden=true); const panel=$('#pay-'+opt.dataset.pay); if(panel) panel.hidden=false;}));
  const months=['January','February','March','April','May','June','July','August','September','October','November','December']; let month=4, year=2025;
  function buildCalendar(){
    const grid=$('#calendarGrid'); if(!grid)return; grid.innerHTML=''; $('#calTitle').textContent=months[month]+' '+year;
    ['SUN','MON','TUE','WED','THU','FRI','SAT'].forEach(d=>{const el=document.createElement('div');el.className='day-name';el.textContent=d;grid.appendChild(el)});
    const first=new Date(year,month,1).getDay(); const days=new Date(year,month+1,0).getDate(); const prevDays=new Date(year,month,0).getDate();
    for(let i=first-1;i>=0;i--){const b=document.createElement('button');b.className='cal-day muted';b.textContent=prevDays-i;grid.appendChild(b)}
    for(let d=1;d<=days;d++){const b=document.createElement('button');b.className='cal-day';b.textContent=d;b.dataset.label=d+' '+months[month]+' '+year; if([1,2,3,8,9,10,16,18,20,22,23,27,28].includes(d))b.classList.add('available'); if([29,30,31].includes(d))b.classList.add('few'); if(d===15)b.classList.add('selected'); b.addEventListener('click',()=>{$$('.cal-day').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.date=b.dataset.label+', '+($('.slot.selected')?.textContent.trim()||'10:00 AM');$('.selected-slot-text').textContent=state.date;renderStep();});grid.appendChild(b)}
  }
  $('#prevMonth')?.addEventListener('click',()=>{month--; if(month<0){month=11;year--} buildCalendar()}); $('#nextMonth')?.addEventListener('click',()=>{month++; if(month>11){month=0;year++} buildCalendar()}); buildCalendar();
  $('#sidebarToggle')?.addEventListener('click',()=>{$('#bookSidebar').classList.add('open');$('#mobileOverlay').classList.add('show')});
  $('#mobileOverlay')?.addEventListener('click',()=>{$('#bookSidebar').classList.remove('open');$('#mobileOverlay').classList.remove('show')});
  $$('.input input,.text-input').forEach(inp=>inp.addEventListener('input',()=>inp.classList.toggle('has-value',!!inp.value)));
  $('#copyBooking')?.addEventListener('click',()=>navigator.clipboard?.writeText('OPT12505151024'));
  renderStep();
})();

/* Final common UI glue */
(function(){
  const current=(location.pathname.split('/').pop()||'book-appointment.html');
  document.querySelectorAll('.booking-menu a').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('/').pop();
    a.classList.toggle('active', href===current || (current==='book-appointment.html' && href==='book-appointment.html'));
  });
  document.querySelectorAll('.pay-option').forEach(opt=>{
    opt.setAttribute('tabindex','0');
    opt.setAttribute('role','button');
    opt.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); opt.click(); }});
  });
})();

/* Final select/dropdown dummy data and booking form sync */
(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const hospital=$('#hospitalSelect');
  const dept=$('#departmentSelect');
  hospital?.addEventListener('change',()=>{
    document.querySelectorAll('.summary-hospital').forEach(e=>e.textContent=hospital.value);
  });
  dept?.addEventListener('change',()=>{
    if(!dept.value) return;
    const card=$$('.dept-card').find(c=>c.dataset.dept===dept.value);
    if(card) card.click();
    document.querySelectorAll('.summary-department').forEach(e=>e.textContent=dept.value);
  });
  $$('.dept-card').forEach(card=>card.addEventListener('click',()=>{
    if(dept && card.dataset.dept) dept.value=card.dataset.dept;
  }));
  $$('.select select, select.text-input').forEach(sel=>{
    sel.addEventListener('focus',()=>sel.closest('.select')?.classList.add('is-focused'));
    sel.addEventListener('blur',()=>sel.closest('.select')?.classList.remove('is-focused'));
  });
})();

/* =========================================================
   FINAL BOOKING FLOW REPAIR JS: accessible custom dropdowns,
   select data sync, responsive component polish
   ========================================================= */
(function(){
  const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
  const $=(s,c=document)=>c.querySelector(s);

  function iconForSelect(select){
    const id=select.id || '';
    const wrap=select.closest('.select');
    const existing=wrap?.querySelector('i:first-child');
    if(existing && !existing.classList.contains('fa-chevron-down')) return existing.className;
    if(/hospital/i.test(id)) return 'fa-regular fa-hospital';
    if(/department/i.test(id)) return 'fa-solid fa-heart-pulse';
    if(/state/i.test(id)) return 'fa-solid fa-location-dot';
    if(/blood/i.test(id)) return 'fa-solid fa-droplet';
    if(/gender/i.test(id)) return 'fa-regular fa-user';
    if(/relationship/i.test(id)) return 'fa-solid fa-user-group';
    return 'fa-solid fa-list';
  }

  function buildCustomSelect(select){
    if(select.dataset.customized==='true') return;
    select.dataset.customized='true';
    select.classList.add('native-hidden');
    const wrapper=document.createElement('div');
    wrapper.className='custom-select';
    wrapper.dataset.for=select.id || '';
    const button=document.createElement('button');
    button.type='button';
    button.className='custom-select__button';
    button.setAttribute('aria-haspopup','listbox');
    button.setAttribute('aria-expanded','false');
    const leading=document.createElement('i');
    leading.className='select-leading '+iconForSelect(select);
    const value=document.createElement('span');
    value.className='custom-select__value';
    const chev=document.createElement('i');
    chev.className='custom-select__chevron fa-solid fa-chevron-down';
    const menu=document.createElement('div');
    menu.className='custom-select__menu';
    menu.setAttribute('role','listbox');

    function selectedText(){return select.options[select.selectedIndex]?.text || select.options[0]?.text || 'Select';}
    function renderOptions(){
      menu.innerHTML='';
      Array.from(select.options).forEach((opt,idx)=>{
        const item=document.createElement('div');
        item.className='custom-select__option'+(idx===select.selectedIndex?' is-selected':'');
        item.textContent=opt.text;
        item.dataset.value=opt.value;
        item.setAttribute('role','option');
        item.setAttribute('aria-selected',idx===select.selectedIndex?'true':'false');
        item.addEventListener('click',()=>{
          select.selectedIndex=idx;
          select.dispatchEvent(new Event('change',{bubbles:true}));
          value.textContent=selectedText();
          close();
          renderOptions();
        });
        menu.appendChild(item);
      });
    }
    function open(){
      $$('.custom-select.open').forEach(c=>{if(c!==wrapper)c.classList.remove('open')});
      wrapper.classList.add('open');button.setAttribute('aria-expanded','true');renderOptions();
    }
    function close(){wrapper.classList.remove('open');button.setAttribute('aria-expanded','false');}
    function toggle(){wrapper.classList.contains('open')?close():open();}
    value.textContent=selectedText();
    button.append(leading,value,chev);
    wrapper.append(button,menu);
    select.insertAdjacentElement('afterend',wrapper);
    button.addEventListener('click',toggle);
    button.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}
      if(e.key==='Escape') close();
      if(e.key==='ArrowDown'){e.preventDefault();open();menu.querySelector('.custom-select__option')?.focus?.();}
    });
    select.addEventListener('change',()=>{value.textContent=selectedText();renderOptions();});
  }

  function initCustomSelects(){
    $$('.select select, select.text-input, .doctor-filter-panel select').forEach(buildCustomSelect);
  }
  initCustomSelects();
  document.addEventListener('click',e=>{if(!e.target.closest('.custom-select')) $$('.custom-select.open').forEach(c=>c.classList.remove('open'));});

  /* Ensure every department icon has a Font Awesome icon if an earlier build left it blank */
  const iconMap={
    'Cardiology':'fa-solid fa-heart-pulse','General Physician':'fa-solid fa-stethoscope','Dermatology':'fa-solid fa-allergies','Pediatrics':'fa-solid fa-baby','Orthopedics':'fa-solid fa-bone','Neurology':'fa-solid fa-brain','Gynecology':'fa-solid fa-person-pregnant','Ophthalmology':'fa-regular fa-eye','ENT':'fa-solid fa-ear-listen','Gastroenterology':'fa-solid fa-stomach','Endocrinology':'fa-solid fa-dna','Urology':'fa-solid fa-kidneys','Pulmonology':'fa-solid fa-lungs','Oncology':'fa-solid fa-ribbon','Psychiatry':'fa-solid fa-head-side-virus','Nephrology':'fa-solid fa-kidneys','Rheumatology':'fa-solid fa-bone','Hematology':'fa-solid fa-droplet','Physiotherapy':'fa-solid fa-user-nurse','Allergy & Immunology':'fa-solid fa-shield-virus'
  };
  $$('.dept-card').forEach(card=>{
    const dept=card.dataset.dept || card.querySelector('h3')?.textContent?.trim();
    const holder=card.querySelector('.dept-icon');
    if(holder && !holder.querySelector('i')){
      const i=document.createElement('i'); i.className=iconMap[dept]||'fa-solid fa-heart-pulse'; holder.appendChild(i);
    }
  });

  /* More stable responsive sidebar close button */
  $('#closeSidebar')?.addEventListener('click',()=>{
    $('#bookSidebar')?.classList.remove('open');
    $('#mobileOverlay')?.classList.remove('show');
  });

  /* Keep selected custom values in sync after programmatic updates */
  ['hospitalSelect','departmentSelect','doctorHospitalFilter','doctorDepartmentFilter'].forEach(id=>{
    const el=$('#'+id); if(el) el.dispatchEvent(new Event('change',{bubbles:true}));
  });
})();

/* HOTFIX: remove duplicate native select icons/chevrons after custom select init */
(function(){
  function cleanSelectWrappers(){
    document.querySelectorAll('.select').forEach(w=>{
      if(!w.querySelector('.custom-select')) return;
      w.classList.add('select--customized');
      Array.from(w.children).forEach(ch=>{
        if(ch.matches('i, select')) ch.style.display='none';
      });
    });
  }
  cleanSelectWrappers();
  setTimeout(cleanSelectWrappers,50);
  setTimeout(cleanSelectWrappers,250);
})();

/* FINAL: custom body-level DOB calendar replacing native browser picker */
(function(){
  const input=document.querySelector('.js-dob-input');
  const field=input?.closest('.date-field');
  if(!input||!field) return;

  input.setAttribute('readonly','readonly');
  input.setAttribute('inputmode','none');

  let view=new Date(2026,6,1);
  let selected=null;
  const cal=document.createElement('div');
  cal.className='dob-calendar';
  cal.innerHTML=`
    <div class="dob-calendar__head">
      <button type="button" class="dob-prev" aria-label="Previous month"><i class="fa-solid fa-chevron-left"></i></button>
      <div class="dob-calendar__title"></div>
      <div class="dob-calendar__nav">
        <button type="button" class="dob-today" aria-label="Show current month"><i class="fa-regular fa-calendar-check"></i></button>
        <button type="button" class="dob-next" aria-label="Next month"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    </div>
    <div class="dob-calendar__week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
    <div class="dob-calendar__days"></div>
    <div class="dob-calendar__footer"><button type="button" class="dob-clear">Clear</button><button type="button" class="dob-set-today">Today</button></div>`;
  document.body.appendChild(cal);

  const days=cal.querySelector('.dob-calendar__days');
  const title=cal.querySelector('.dob-calendar__title');
  const pad=n=>String(n).padStart(2,'0');
  const fmt=d=>`${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
  function same(a,b){return a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}

  function render(){
    const y=view.getFullYear(), m=view.getMonth();
    title.textContent=view.toLocaleString('en-US',{month:'long',year:'numeric'});
    days.innerHTML='';
    const first=new Date(y,m,1).getDay();
    const last=new Date(y,m+1,0).getDate();
    const prevLast=new Date(y,m,0).getDate();
    const today=new Date();
    for(let i=0;i<42;i++){
      let d, muted=false;
      if(i<first){d=new Date(y,m-1,prevLast-first+i+1); muted=true;}
      else if(i>=first+last){d=new Date(y,m+1,i-first-last+1); muted=true;}
      else d=new Date(y,m,i-first+1);
      const b=document.createElement('button');
      b.type='button';
      b.className='dob-day'+(muted?' muted':'')+(same(d,today)?' today':'')+(same(d,selected)?' selected':'');
      b.textContent=d.getDate();
      b.addEventListener('click',()=>{
        selected=d;
        input.value=fmt(d);
        view=new Date(d.getFullYear(),d.getMonth(),1);
        render();
        close();
        input.dispatchEvent(new Event('change',{bubbles:true}));
      });
      days.appendChild(b);
    }
  }

  function place(){
    const r=input.getBoundingClientRect();
    const margin=10;
    let left=r.left;
    let top=r.bottom+8;
    const w=Math.min(314, window.innerWidth-28);
    if(left+w>window.innerWidth-margin) left=window.innerWidth-w-margin;
    if(left<margin) left=margin;
    const estimatedH=360;
    if(top+estimatedH>window.innerHeight-margin) top=Math.max(margin, r.top-estimatedH-8);
    cal.style.left=left+'px';
    cal.style.top=top+'px';
    cal.style.width=w+'px';
  }
  function open(){render();place();cal.classList.add('open');}
  function close(){cal.classList.remove('open');}
  function toggle(){cal.classList.contains('open')?close():open();}

  input.addEventListener('click',toggle);
  field.querySelector('i')?.addEventListener('click',(e)=>{e.preventDefault();toggle();});
  cal.querySelector('.dob-prev').addEventListener('click',()=>{view.setMonth(view.getMonth()-1); render();});
  cal.querySelector('.dob-next').addEventListener('click',()=>{view.setMonth(view.getMonth()+1); render();});
  cal.querySelector('.dob-today').addEventListener('click',()=>{const t=new Date(); view=new Date(t.getFullYear(),t.getMonth(),1); render();});
  cal.querySelector('.dob-set-today').addEventListener('click',()=>{const t=new Date(); selected=t; input.value=fmt(t); view=new Date(t.getFullYear(),t.getMonth(),1); render(); close();});
  cal.querySelector('.dob-clear').addEventListener('click',()=>{selected=null; input.value=''; render(); close();});
  document.addEventListener('click',e=>{if(!field.contains(e.target)&&!cal.contains(e.target)) close();});
  window.addEventListener('resize',()=>{if(cal.classList.contains('open')) place();});
  window.addEventListener('scroll',()=>{if(cal.classList.contains('open')) place();}, true);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();} if(e.key==='Escape') close();});
})();


/* === DEPLOYED FINAL FIX: robust body-level DOB calendar === */
(function(){
  const old=document.querySelector('.dob-calendar');
  if(old) old.remove();
  const input=document.querySelector('.js-dob-input');
  const field=input?.closest('.date-field');
  if(!input||!field) return;
  input.type='text';
  input.readOnly=true;
  input.setAttribute('inputmode','none');
  input.setAttribute('autocomplete','off');
  let view=new Date(2026,6,1);
  let selected=null;
  const cal=document.createElement('div');
  cal.className='dob-calendar';
  cal.innerHTML=`
    <div class="dob-calendar__head">
      <button type="button" class="dob-prev" aria-label="Previous month"><i class="fa-solid fa-chevron-left"></i></button>
      <div class="dob-calendar__title"></div>
      <div class="dob-calendar__nav">
        <button type="button" class="dob-today" aria-label="Show current month"><i class="fa-regular fa-calendar-check"></i></button>
        <button type="button" class="dob-next" aria-label="Next month"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    </div>
    <div class="dob-calendar__week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
    <div class="dob-calendar__days"></div>
    <div class="dob-calendar__footer"><button type="button" class="dob-clear">Clear</button><button type="button" class="dob-set-today">Today</button></div>`;
  document.body.appendChild(cal);
  const days=cal.querySelector('.dob-calendar__days');
  const title=cal.querySelector('.dob-calendar__title');
  const pad=n=>String(n).padStart(2,'0');
  const fmt=d=>`${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
  const same=(a,b)=>a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
  function render(){
    const y=view.getFullYear(), m=view.getMonth();
    title.textContent=view.toLocaleString('en-US',{month:'long',year:'numeric'});
    days.innerHTML='';
    const first=new Date(y,m,1).getDay();
    const last=new Date(y,m+1,0).getDate();
    const prevLast=new Date(y,m,0).getDate();
    const today=new Date();
    for(let i=0;i<42;i++){
      let d, muted=false;
      if(i<first){d=new Date(y,m-1,prevLast-first+i+1); muted=true;}
      else if(i>=first+last){d=new Date(y,m+1,i-first-last+1); muted=true;}
      else d=new Date(y,m,i-first+1);
      const b=document.createElement('button');
      b.type='button';
      b.className='dob-day'+(muted?' muted':'')+(same(d,today)?' today':'')+(same(d,selected)?' selected':'');
      b.textContent=d.getDate();
      b.addEventListener('click',()=>{selected=new Date(d); input.value=fmt(d); view=new Date(d.getFullYear(),d.getMonth(),1); render(); close(); input.dispatchEvent(new Event('change',{bubbles:true}));});
      days.appendChild(b);
    }
  }
  function place(){
    const r=field.getBoundingClientRect();
    const margin=12;
    const w=Math.min(314, window.innerWidth-(margin*2));
    let left=r.left;
    if(left+w>window.innerWidth-margin) left=window.innerWidth-w-margin;
    if(left<margin) left=margin;
    let top=r.bottom+8;
    const h=cal.offsetHeight || 358;
    if(top+h>window.innerHeight-margin) top=Math.max(margin, r.top-h-8);
    cal.style.left=left+'px';
    cal.style.top=top+'px';
    cal.style.width=w+'px';
  }
  function open(){render(); cal.classList.add('open'); requestAnimationFrame(place);}
  function close(){cal.classList.remove('open');}
  function toggle(e){ if(e) e.preventDefault(); cal.classList.contains('open')?close():open(); }
  input.addEventListener('click',toggle);
  field.querySelector('i')?.addEventListener('click',toggle);
  field.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){toggle(e)} if(e.key==='Escape') close();});
  cal.querySelector('.dob-prev').addEventListener('click',()=>{view.setMonth(view.getMonth()-1); render(); place();});
  cal.querySelector('.dob-next').addEventListener('click',()=>{view.setMonth(view.getMonth()+1); render(); place();});
  cal.querySelector('.dob-today').addEventListener('click',()=>{const t=new Date(); view=new Date(t.getFullYear(),t.getMonth(),1); render(); place();});
  cal.querySelector('.dob-set-today').addEventListener('click',()=>{const t=new Date(); selected=t; input.value=fmt(t); view=new Date(t.getFullYear(),t.getMonth(),1); render(); close(); input.dispatchEvent(new Event('change',{bubbles:true}));});
  cal.querySelector('.dob-clear').addEventListener('click',()=>{selected=null; input.value=''; render(); close(); input.dispatchEvent(new Event('change',{bubbles:true}));});
  document.addEventListener('click',e=>{if(!field.contains(e.target)&&!cal.contains(e.target)) close();});
  window.addEventListener('resize',()=>{if(cal.classList.contains('open')) place();});
  window.addEventListener('scroll',()=>{if(cal.classList.contains('open')) place();}, true);
})();

/* === HOTFIX V2: Working Patient Information DOB custom calendar === */
(function(){
  function initPatientDobCalendar(){
    document.querySelectorAll('.patient-dob-calendar').forEach(el=>el.remove());
    const oldInput=document.querySelector('.js-dob-input');
    if(!oldInput) return;
    const oldField=oldInput.closest('.date-field');
    if(!oldField) return;

    const input=oldInput.cloneNode(true);
    input.value=oldInput.value || '';
    input.type='text';
    input.readOnly=true;
    input.setAttribute('inputmode','none');
    input.setAttribute('autocomplete','off');
    input.setAttribute('placeholder','DD / MM / YYYY');
    oldInput.replaceWith(input);
    const field=input.closest('.date-field');
    field.classList.add('dob-fixed');

    let selected=null;
    let view=new Date(2026,6,1);
    const parsed=(input.value||'').match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if(parsed){
      selected=new Date(Number(parsed[3]), Number(parsed[2])-1, Number(parsed[1]));
      view=new Date(selected.getFullYear(), selected.getMonth(), 1);
    }

    const cal=document.createElement('div');
    cal.className='patient-dob-calendar';
    cal.innerHTML=`
      <div class="patient-dob-calendar__head">
        <button type="button" class="patient-dob-calendar__btn dob-prev" aria-label="Previous month"><i class="fa-solid fa-chevron-left"></i></button>
        <div class="patient-dob-calendar__title"></div>
        <button type="button" class="patient-dob-calendar__btn dob-next" aria-label="Next month"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
      <div class="patient-dob-calendar__week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
      <div class="patient-dob-calendar__days"></div>
      <div class="patient-dob-calendar__footer"><button type="button" class="dob-clear">Clear</button><button type="button" class="dob-today">Today</button></div>`;
    document.body.appendChild(cal);

    const days=cal.querySelector('.patient-dob-calendar__days');
    const title=cal.querySelector('.patient-dob-calendar__title');
    const pad=n=>String(n).padStart(2,'0');
    const format=d=>`${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
    const same=(a,b)=>!!a&&!!b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();

    function render(){
      const y=view.getFullYear();
      const m=view.getMonth();
      title.textContent=view.toLocaleString('en-US',{month:'long',year:'numeric'});
      days.innerHTML='';
      const first=new Date(y,m,1).getDay();
      const last=new Date(y,m+1,0).getDate();
      const prevLast=new Date(y,m,0).getDate();
      const today=new Date();
      for(let i=0;i<42;i++){
        let d, muted=false;
        if(i<first){ d=new Date(y,m-1,prevLast-first+i+1); muted=true; }
        else if(i>=first+last){ d=new Date(y,m+1,i-first-last+1); muted=true; }
        else { d=new Date(y,m,i-first+1); }
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='patient-dob-calendar__day'+(muted?' muted':'')+(same(d,today)?' today':'')+(same(d,selected)?' selected':'');
        btn.textContent=d.getDate();
        btn.addEventListener('click',function(e){
          e.preventDefault();
          selected=new Date(d);
          input.value=format(selected);
          input.classList.add('has-value');
          view=new Date(selected.getFullYear(), selected.getMonth(), 1);
          render();
          close();
          input.dispatchEvent(new Event('input',{bubbles:true}));
          input.dispatchEvent(new Event('change',{bubbles:true}));
        });
        days.appendChild(btn);
      }
    }

    function place(){
      const r=field.getBoundingClientRect();
      const margin=12;
      const width=Math.min(318, window.innerWidth - margin*2);
      let left=r.left;
      if(left + width > window.innerWidth - margin) left=window.innerWidth - width - margin;
      if(left < margin) left=margin;
      cal.style.width=width+'px';
      cal.style.left=left+'px';
      cal.style.top='0px';
      cal.classList.add('open');
      const h=cal.offsetHeight || 360;
      let top=r.bottom + 8;
      if(top + h > window.innerHeight - margin) top=Math.max(margin, r.top - h - 8);
      cal.style.top=top+'px';
    }
    function open(){ render(); field.classList.add('is-open'); place(); }
    function close(){ cal.classList.remove('open'); field.classList.remove('is-open'); }
    function toggle(e){ if(e) e.preventDefault(); cal.classList.contains('open') ? close() : open(); }

    input.addEventListener('click',toggle);
    input.addEventListener('focus',open);
    field.querySelector('.fa-calendar-days')?.addEventListener('click',toggle);
    cal.querySelector('.dob-prev').addEventListener('click',e=>{ e.preventDefault(); view.setMonth(view.getMonth()-1); render(); place(); });
    cal.querySelector('.dob-next').addEventListener('click',e=>{ e.preventDefault(); view.setMonth(view.getMonth()+1); render(); place(); });
    cal.querySelector('.dob-today').addEventListener('click',e=>{ e.preventDefault(); const t=new Date(); selected=t; input.value=format(t); view=new Date(t.getFullYear(),t.getMonth(),1); render(); close(); input.dispatchEvent(new Event('change',{bubbles:true})); });
    cal.querySelector('.dob-clear').addEventListener('click',e=>{ e.preventDefault(); selected=null; input.value=''; render(); close(); input.dispatchEvent(new Event('change',{bubbles:true})); });
    document.addEventListener('click',e=>{ if(!field.contains(e.target) && !cal.contains(e.target)) close(); });
    window.addEventListener('resize',()=>{ if(cal.classList.contains('open')) place(); });
    window.addEventListener('scroll',()=>{ if(cal.classList.contains('open')) place(); }, true);
    input.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){toggle(e);} if(e.key==='Escape'){close();} });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initPatientDobCalendar); else initPatientDobCalendar();
})();

/* Shared topbar notification/profile dropdown behaviour for booking page */
(function(){
  function setupTopbarDropdown(btnId, menuId){
    const btn=document.getElementById(btnId);
    const menu=document.getElementById(menuId);
    if(!btn||!menu||btn.dataset.topbarReady) return;
    btn.dataset.topbarReady='true';
    btn.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.dropdown').forEach(d=>{if(d!==menu)d.classList.remove('show')});
      document.querySelectorAll('.notif,.profile').forEach(x=>{if(x!==btn)x.classList.remove('show')});
      menu.classList.toggle('show');
      btn.classList.toggle('show', menu.classList.contains('show'));
      btn.setAttribute('aria-expanded', menu.classList.contains('show')?'true':'false');
    });
    menu.addEventListener('click',e=>e.stopPropagation());
  }
  function init(){
    setupTopbarDropdown('notifBtn','notifMenu');
    setupTopbarDropdown('profileBtn','profileMenu');
    document.addEventListener('click',function(){
      document.querySelectorAll('.dropdown').forEach(d=>d.classList.remove('show'));
      document.querySelectorAll('.notif,.profile').forEach(x=>{x.classList.remove('show');x.setAttribute?.('aria-expanded','false')});
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape') document.body.click();});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
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
