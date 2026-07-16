(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const state={dept:localStorage.ptDept||'Cardiology',doctor:localStorage.ptDoctor||'Dr. Arvind Sharma',fee:localStorage.ptFee||'800',date:localStorage.ptDate||'15 May 2025',time:localStorage.ptTime||'10:00 AM'};
const toast=m=>{let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.append(t)}t.textContent=m;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),1800)};
function sync(){ $$('[data-dept]').forEach(y=>y.textContent=state.dept||'Not Selected');$$('[data-doctor]').forEach(y=>y.textContent=state.doctor||'Not Selected');$$('[data-fee]').forEach(y=>y.textContent=state.fee?'₹'+state.fee:'—');const dt=`${state.date||'Not Selected'}, ${state.time||''}`.replace(/, $/,'');$$('[data-datetime]').forEach(y=>y.textContent=dt);$$('[data-slot]').forEach(y=>y.textContent=dt)}
sync();

$$('[data-go]').forEach(x=>x.addEventListener('click',()=>location.href=x.dataset.go));$$('[data-back]').forEach(x=>x.addEventListener('click',()=>history.back()));
$$('.dept').forEach(x=>x.addEventListener('click',()=>{$$('.dept').forEach(y=>y.classList.remove('selected'));x.classList.add('selected');state.dept=x.dataset.name||x.querySelector('h4').textContent;localStorage.ptDept=state.dept;sync()}));
$('#departmentSearch')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();$$('.dept').forEach(d=>d.classList.toggle('filtered-out',!d.textContent.toLowerCase().includes(q)))});
$$('.select-doctor,.doc-row').forEach(x=>x.addEventListener('click',e=>{if(e.target.closest('select,input'))return;const r=x.closest('.doc-row')||x;$$('.doc-row').forEach(y=>y.classList.remove('selected'));r.classList.add('selected');state.doctor=r.dataset.name||r.querySelector('h4')?.textContent||'Dr. Arvind Sharma';state.fee=r.dataset.fee||r.querySelector('.fee')?.textContent.replace(/\D/g,'')||'800';localStorage.ptDoctor=state.doctor;localStorage.ptFee=state.fee;sync();toast(state.doctor+' selected')}));
function filterDoctors(){const q=($('#doctorSearch')?.value||'').toLowerCase(),exp=$('#experienceFilter')?.value||'',av=$('#availabilityFilter')?.value||'';$$('.doc-row').forEach(r=>{const txt=r.textContent.toLowerCase();let ok=!q||txt.includes(q);if(exp.includes('10+'))ok=ok&&(/1[0-9]\+? Years|15\+? Years/.test(r.textContent));if(exp.includes('15+'))ok=ok&&(/15\+? Years/.test(r.textContent));if(av!=='All Availability'&&av)ok=ok&&txt.includes(av.toLowerCase());r.classList.toggle('filtered-out',!ok)})}
$('#doctorSearch')?.addEventListener('input',filterDoctors);$('#experienceFilter')?.addEventListener('change',filterDoctors);$('#availabilityFilter')?.addEventListener('change',filterDoctors);
$$('.day:not(.muted)').forEach(x=>x.addEventListener('click',()=>{if(x.classList.contains('disabled'))return;$$('.day').forEach(y=>y.classList.remove('selected'));x.classList.add('selected');state.date=x.dataset.date||`${x.textContent.trim()} May 2025`;localStorage.ptDate=state.date;sync()}));
$$('.slot').forEach(x=>x.addEventListener('click',()=>{$$('.slot').forEach(y=>y.classList.remove('selected'));x.classList.add('selected');state.time=x.textContent.trim();localStorage.ptTime=state.time;sync()}));
// Calendar month navigation with real dates
let shown=new Date(2025,4,1);function renderCal(){const grid=$('#calendarGrid'),lab=$('#calendarMonth');if(!grid||!lab)return;lab.textContent=shown.toLocaleString('en-US',{month:'long',year:'numeric'});const heads=['SUN','MON','TUE','WED','THU','FRI','SAT'];grid.innerHTML=heads.map(h=>`<b>${h}</b>`).join('');const first=shown.getDay(),days=new Date(shown.getFullYear(),shown.getMonth()+1,0).getDate(),prev=new Date(shown.getFullYear(),shown.getMonth(),0).getDate();for(let i=first-1;i>=0;i--)grid.insertAdjacentHTML('beforeend',`<div class="day muted">${prev-i}</div>`);for(let d=1;d<=days;d++){const selected=d===15&&shown.getMonth()===4&&shown.getFullYear()===2025;const few=d%7===3,un=d%11===0;grid.insertAdjacentHTML('beforeend',`<div class="day ${selected?'selected ':''}${un?'unavailable disabled':few?'available few':'available'}" data-date="${d} ${lab.textContent}">${d}</div>`)}while(grid.children.length%7)grid.insertAdjacentHTML('beforeend',`<div class="day muted">${grid.children.length%7}</div>`);$$('.day:not(.muted)',grid).forEach(x=>x.addEventListener('click',()=>{if(x.classList.contains('disabled'))return;$$('.day',grid).forEach(y=>y.classList.remove('selected'));x.classList.add('selected');state.date=x.dataset.date;localStorage.ptDate=state.date;sync()}))}
if($('#calendarGrid'))renderCal();$('#prevMonth')?.addEventListener('click',()=>{shown.setMonth(shown.getMonth()-1);renderCal()});$('#nextMonth')?.addEventListener('click',()=>{shown.setMonth(shown.getMonth()+1);renderCal()});
$$('.method').forEach(x=>x.addEventListener('click',()=>{$$('.method').forEach(y=>y.classList.remove('selected'));x.classList.add('selected');$$('.pay-section').forEach(y=>y.classList.toggle('hidden',y.dataset.method!==x.dataset.method));localStorage.ptPayment=x.dataset.method||x.textContent.trim()}));
$$('.bank-option').forEach(x=>x.addEventListener('click',()=>{$$('.bank-option').forEach(y=>y.classList.remove('selected'));x.classList.add('selected');toast(x.textContent.trim()+' selected')}));
$$('.switch').forEach(x=>x.addEventListener('click',()=>{x.classList.toggle('on');x.setAttribute('aria-checked',x.classList.contains('on'));if(x.id==='existingPatientSwitch'){const existing=x.classList.contains('on');$('#patientModeLabel').textContent=existing?'Yes':'No';$('#uhidCard')?.classList.toggle('hidden',!existing);$('#existingProfile')?.classList.toggle('active',existing);$('#newPatientForm')?.classList.toggle('hidden-mode',existing)}}));
$('[data-edit-profile]')?.addEventListener('click',()=>{$('#existingPatientSwitch')?.classList.remove('on');$('#patientModeLabel').textContent='No';$('#uhidCard')?.classList.add('hidden');$('#existingProfile')?.classList.remove('active');$('#newPatientForm')?.classList.remove('hidden-mode');toast('Profile fields are editable')});
$$('[data-toast]').forEach(x=>x.addEventListener('click',()=>toast(x.dataset.toast||'Done')));
$$('.btn.primary[data-go]').forEach(btn=>btn.addEventListener('click',e=>{const form=btn.closest('.flow');if(form&&form.querySelectorAll('.input[required]').length){let bad=false;form.querySelectorAll('.input[required]').forEach(i=>{i.classList.toggle('field-error',!i.value.trim());bad=bad||!i.value.trim()});if(bad){e.preventDefault();toast('Please complete required fields')}}}));
$('.copy-btn,[data-copy-booking]')?.addEventListener('click',async()=>{const text=$('#bookingId')?.textContent||'OPT12505151024';try{await navigator.clipboard.writeText(text);toast('Booking ID copied')}catch{toast(text)}});
})();
/* Dashboard custom date selector */
(function(){
  const wrap=document.querySelector('.dashboard-date-control');
  if(!wrap)return;
  const btn=wrap.querySelector('#dashboardDateButton');
  const label=wrap.querySelector('#dashboardDateLabel');
  const grid=wrap.querySelector('#dashCalGrid');
  const monthLabel=wrap.querySelector('#dashCalMonth');
  let shown=new Date(2025,4,1);
  let selected=new Date(2025,4,24);
  const fmt=d=>d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})+', '+d.toLocaleDateString('en-GB',{weekday:'long'});
  function render(){
    if(!grid)return;
    monthLabel.textContent=shown.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
    grid.innerHTML='';
    const y=shown.getFullYear(),m=shown.getMonth();
    const first=new Date(y,m,1).getDay();
    const prevDays=new Date(y,m,0).getDate();
    const days=new Date(y,m+1,0).getDate();
    for(let i=first-1;i>=0;i--){const el=document.createElement('button');el.type='button';el.className='muted';el.textContent=prevDays-i;grid.append(el)}
    for(let d=1;d<=days;d++){
      const date=new Date(y,m,d);const el=document.createElement('button');el.type='button';el.textContent=d;
      if(date.toDateString()===selected.toDateString())el.classList.add('selected');
      el.addEventListener('click',()=>{selected=date;label.textContent=fmt(selected);wrap.classList.remove('open');btn.setAttribute('aria-expanded','false');render()});grid.append(el)
    }
    let n=1;while(grid.children.length%7){const el=document.createElement('button');el.type='button';el.className='muted';el.textContent=n++;grid.append(el)}
  }
  btn?.addEventListener('click',e=>{e.stopPropagation();wrap.classList.toggle('open');btn.setAttribute('aria-expanded',String(wrap.classList.contains('open')));render()});
  wrap.querySelector('#dashCalPrev')?.addEventListener('click',e=>{e.stopPropagation();shown.setMonth(shown.getMonth()-1);render()});
  wrap.querySelector('#dashCalNext')?.addEventListener('click',e=>{e.stopPropagation();shown.setMonth(shown.getMonth()+1);render()});
  wrap.querySelector('#dashCalToday')?.addEventListener('click',()=>{selected=new Date();shown=new Date(selected.getFullYear(),selected.getMonth(),1);label.textContent=fmt(selected);wrap.classList.remove('open');render()});
  wrap.querySelector('#dashCalClear')?.addEventListener('click',()=>{label.textContent='Select date';wrap.classList.remove('open')});
  document.addEventListener('click',e=>{if(!wrap.contains(e.target)){wrap.classList.remove('open');btn?.setAttribute('aria-expanded','false')}});
  render();
})();

/* bookingOriginalSidebarFix */
document.addEventListener('click',function(e){
  const h=e.target.closest('.hamb');
  if(!h)return;
  e.preventDefault();
  const s=document.querySelector('.side');
  if(!s)return;
  if(innerWidth<=900)s.classList.toggle('open');
});
/* Step 1 reference initial summary state */
if(location.pathname.endsWith('patient-book-step1.html')){
  document.body.classList.remove('side-collapsed');
  document.querySelectorAll('[data-dept]').forEach(el=>el.textContent='Not Selected');
  document.querySelectorAll('[data-doctor]').forEach(el=>el.textContent='Not Selected');
  document.querySelectorAll('[data-datetime]').forEach(el=>el.textContent='Not Selected');
  document.querySelectorAll('[data-fee]').forEach(el=>el.textContent='—');
}
