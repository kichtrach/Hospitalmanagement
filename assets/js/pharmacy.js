(function(){
  function drawChart(){
    const canvas=document.getElementById('monthlyChart'); if(!canvas)return;
    const rect=canvas.getBoundingClientRect(), dpr=window.devicePixelRatio||1;
    canvas.width=Math.max(600,rect.width*dpr); canvas.height=205*dpr;
    const ctx=canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
    const w=canvas.width/dpr,h=205,pad={l:40,r:10,t:12,b:28};
    const labels=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const prescriptions=[220,250,305,350,330,185,145,185,190,220,240,215];
    const dispensed=[170,230,235,290,280,155,105,130,130,170,175,165];
    ctx.clearRect(0,0,w,h); ctx.font='10px Open Sans'; ctx.fillStyle='#4e5873';
    for(let i=0;i<=4;i++){const y=pad.t+(h-pad.t-pad.b)*i/4;ctx.strokeStyle='#e5e9ef';ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText(String(400-i*100),4,y+3)}
    const slot=(w-pad.l-pad.r)/12, bar=11;
    labels.forEach((label,i)=>{const x=pad.l+i*slot+slot/2;const ph=(prescriptions[i]/400)*(h-pad.t-pad.b);const dh=(dispensed[i]/400)*(h-pad.t-pad.b);ctx.fillStyle='#a60b0b';ctx.fillRect(x-bar-2,h-pad.b-ph,bar,ph);ctx.fillStyle='#4f8d35';ctx.fillRect(x+2,h-pad.b-dh,bar,dh);ctx.fillStyle='#29344f';ctx.textAlign='center';ctx.fillText(label,x,h-8)});
  }

  function formatDate(value){
    const date=value instanceof Date?value:new Date(value+'T00:00:00');
    return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(date);
  }

  function initialiseDateAndClock(){
    const calendar=document.querySelector('[data-dashboard-calendar]');
    const panel=calendar?.querySelector('.dashboard-calendar-panel');
    const dateText=document.getElementById('dashboardDateText');
    const timeText=document.getElementById('dashboardTimeText');
    let selected=new Date();
    let cursor=new Date(selected.getFullYear(),selected.getMonth(),1);

    const formatDashboardDate=(date)=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(date);
    const sameDay=(a,b)=>a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();

    function drawDashboardCalendar(){
      if(!panel)return;
      const title=panel.querySelector('[data-dash-cal-title]');
      const days=panel.querySelector('[data-dash-cal-days]');
      const y=cursor.getFullYear(),m=cursor.getMonth();
      title.textContent=cursor.toLocaleDateString('en-US',{month:'long',year:'numeric'});
      days.innerHTML='';
      const offset=new Date(y,m,1).getDay();
      const today=new Date();
      for(let i=0;i<42;i++){
        const d=new Date(y,m,1-offset+i);
        const b=document.createElement('button');
        b.type='button';
        b.className='cal-day'+(d.getMonth()!==m?' muted':'');
        if(sameDay(d,today))b.classList.add('today');
        if(sameDay(d,selected))b.classList.add('selected');
        b.textContent=d.getDate();
        b.addEventListener('click',(e)=>{
          e.stopPropagation(); selected=new Date(d); cursor=new Date(d.getFullYear(),d.getMonth(),1);
          dateText.textContent=formatDashboardDate(selected); drawDashboardCalendar(); panel.classList.remove('open');
        });
        days.appendChild(b);
      }
    }

    if(calendar&&panel&&dateText){
      dateText.textContent=formatDashboardDate(selected);
      calendar.addEventListener('click',(e)=>{e.stopPropagation();panel.classList.toggle('open');drawDashboardCalendar();});
      panel.addEventListener('click',e=>e.stopPropagation());
      panel.querySelector('[data-dash-prev]')?.addEventListener('click',()=>{cursor.setMonth(cursor.getMonth()-1);drawDashboardCalendar();});
      panel.querySelector('[data-dash-next]')?.addEventListener('click',()=>{cursor.setMonth(cursor.getMonth()+1);drawDashboardCalendar();});
      panel.querySelector('[data-dash-today]')?.addEventListener('click',()=>{selected=new Date();cursor=new Date(selected.getFullYear(),selected.getMonth(),1);dateText.textContent=formatDashboardDate(selected);drawDashboardCalendar();});
      panel.querySelector('[data-dash-close]')?.addEventListener('click',()=>panel.classList.remove('open'));
      document.addEventListener('click',()=>panel.classList.remove('open'));
    }

    function updateClock(){
      if(!timeText)return;
      timeText.textContent=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true}).format(new Date());
    }
    updateClock(); window.setInterval(updateClock,1000);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-submenu]').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('open');document.getElementById(btn.dataset.submenu)?.classList.toggle('open')}));
    document.querySelectorAll('.switch-card button').forEach(btn=>btn.addEventListener('click',()=>{btn.innerHTML='Opening... <i class="fa-solid fa-spinner fa-spin"></i>';setTimeout(()=>btn.innerHTML=btn.closest('.switch-card').querySelector('h3').textContent.includes('IP')?'Go to IP Pharmacy <i class="fa-solid fa-arrow-right"></i>':'Go to OP Pharmacy <i class="fa-solid fa-arrow-right"></i>',700)}));
    initialiseDateAndClock();
    drawChart(); window.addEventListener('resize',drawChart);
  });
})();

// ===== IP Pharmacy patient orders =====
document.addEventListener('DOMContentLoaded', () => {
  const dateField = document.querySelector('[data-calendar-field]');
  const panel = document.querySelector('.calendar-panel');
  if (dateField && panel) {
    const label = dateField.querySelector('input');
    const title = panel.querySelector('[data-cal-title]');
    const days = panel.querySelector('[data-cal-days]');
    let cursor = new Date(); let first = null; let second = null;
    const fmt = d => d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
    function draw(){
      const y=cursor.getFullYear(),m=cursor.getMonth(); title.textContent=cursor.toLocaleDateString('en-US',{month:'long',year:'numeric'}); days.innerHTML='';
      const start=new Date(y,m,1); const offset=start.getDay();
      for(let i=0;i<42;i++){ const d=new Date(y,m,1-offset+i); const b=document.createElement('button'); b.type='button'; b.className='cal-day'+(d.getMonth()!==m?' muted':''); b.textContent=d.getDate();
        if(d.toDateString()===new Date().toDateString()) b.classList.add('today'); if(first&&d.toDateString()===first.toDateString()) b.classList.add('selected'); if(second&&d.toDateString()===second.toDateString()) b.classList.add('selected'); if(first&&second&&d>first&&d<second)b.classList.add('in-range');
        b.addEventListener('click',()=>{ if(!first||second){first=new Date(d);second=null}else if(d<first){second=first;first=new Date(d)}else second=new Date(d); label.value=second?`${fmt(first)} - ${fmt(second)}`:fmt(first); draw(); if(second) setTimeout(()=>panel.classList.remove('open'),120); }); days.appendChild(b); }
    }
    dateField.addEventListener('click',e=>{e.stopPropagation();panel.classList.toggle('open');draw()});
    panel.querySelector('[data-prev]')?.addEventListener('click',e=>{e.stopPropagation();cursor.setMonth(cursor.getMonth()-1);draw()});
    panel.querySelector('[data-next]')?.addEventListener('click',e=>{e.stopPropagation();cursor.setMonth(cursor.getMonth()+1);draw()});
    panel.querySelector('[data-today]')?.addEventListener('click',()=>{first=new Date();second=new Date();label.value=`${fmt(first)} - ${fmt(second)}`;cursor=new Date();draw()});
    panel.querySelector('[data-clear]')?.addEventListener('click',()=>{first=second=null;label.value='';draw()});
    document.addEventListener('click',()=>panel.classList.remove('open')); panel.addEventListener('click',e=>e.stopPropagation());
  }
  const modal=document.getElementById('orderDetailsModal');
  document.querySelectorAll('[data-view-order]').forEach(b=>b.addEventListener('click',()=>modal?.classList.add('open')));
  document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>modal?.classList.remove('open')));
  modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
  document.querySelectorAll('[data-delete-row]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('tr')?.remove()));
  document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.remove('active'));btn.classList.add('active')}));
});
