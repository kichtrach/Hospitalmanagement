(() => {
  'use strict';
  const sidebar = document.getElementById('sidebar');
  document.getElementById('menuBtn')?.addEventListener('click', () => {
    if (innerWidth <= 820) { sidebar.classList.remove('collapsed'); sidebar.classList.toggle('mobile-open'); } else { sidebar.classList.toggle('collapsed'); }
  });
  document.getElementById('sidebarMini')?.addEventListener('click', () => { if (innerWidth > 820) sidebar.classList.toggle('collapsed'); });
  // Keep the desktop sidebar expanded on initial load and all submenu groups closed.
  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.classList.remove('active');
    btn.nextElementSibling?.classList.remove('open');
    btn.querySelector('.caret')?.style.setProperty('transform', 'rotate(0)');

    btn.addEventListener('click', () => {
      const willOpen = !btn.nextElementSibling?.classList.contains('open');

      // Accordion behavior: close every other navigation group first.
      document.querySelectorAll('.nav-toggle').forEach(other => {
        other.classList.remove('active');
        other.nextElementSibling?.classList.remove('open');
        other.querySelector('.caret')?.style.setProperty('transform', 'rotate(0)');
      });

      if (willOpen) {
        btn.classList.add('active');
        btn.nextElementSibling?.classList.add('open');
        btn.querySelector('.caret')?.style.setProperty('transform', 'rotate(180deg)');
      }
    });
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    const label = item.querySelector('span')?.textContent?.trim();
    if (label) item.setAttribute('aria-label', label);
  });
  if (sidebar) sidebar.classList.remove('collapsed');
  addEventListener('resize', () => {
    if (!sidebar) return;
    if (innerWidth <= 820) sidebar.classList.remove('collapsed');
  });

  const profileBtn = document.getElementById('profileBtn'), profileMenu = document.getElementById('profileMenu');
  profileBtn?.addEventListener('click', e => { e.stopPropagation(); profileMenu.classList.toggle('open'); });
  document.addEventListener('click', () => profileMenu?.classList.remove('open'));
  const dateInput = document.getElementById('dashboardDate'), dateText = document.getElementById('dateText');
  if (dateInput) {
    dateInput.value = '2025-07-09';
    dateInput.addEventListener('change', () => { const d = new Date(dateInput.value + 'T00:00:00'); dateText.textContent = d.toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}); });
  }
  document.getElementById('downloadReport')?.addEventListener('click', () => {
    const toast = document.getElementById('toast'); toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200);
  });
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); document.querySelector('.top-search input')?.focus(); }});

  function fitCanvas(canvas){ const dpr=devicePixelRatio||1, rect=canvas.getBoundingClientRect(); canvas.width=rect.width*dpr; canvas.height=rect.height*dpr; const ctx=canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); return {ctx,w:rect.width,h:rect.height}; }
  function revenue(){ const c=document.getElementById('revenueChart'); if(!c)return; const {ctx,w,h}=fitCanvas(c); const vals=[8,9,13.5,10,12,15,20.5,15,14,17.5], labels=['01 Jul','02 Jul','03 Jul','04 Jul','05 Jul','06 Jul','07 Jul','08 Jul','09 Jul']; const pad={l:45,r:22,t:14,b:32}, cw=w-pad.l-pad.r,ch=h-pad.t-pad.b,max=25; ctx.clearRect(0,0,w,h); ctx.font='11px Open Sans'; ctx.fillStyle='#596080'; ctx.strokeStyle='#e3e7f2'; ctx.lineWidth=1; for(let i=0;i<=5;i++){const y=pad.t+ch*i/5;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText('₹ '+(25-i*5)+'L',4,y+4)} const pts=vals.map((v,i)=>({x:pad.l+cw*i/(vals.length-1),y:pad.t+ch*(1-v/max)})); const grad=ctx.createLinearGradient(0,pad.t,0,pad.t+ch);grad.addColorStop(0,'rgba(79,43,194,.24)');grad.addColorStop(1,'rgba(79,43,194,.02)');ctx.beginPath();ctx.moveTo(pts[0].x,pad.t+ch);pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.lineTo(pts.at(-1).x,pad.t+ch);ctx.closePath();ctx.fillStyle=grad;ctx.fill();ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle='#4d27b7';ctx.lineWidth=2;ctx.stroke();pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='#4d27b7';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke()});ctx.fillStyle='#596080';ctx.textAlign='center';labels.forEach((lab,i)=>ctx.fillText(lab,pad.l+cw*i/(labels.length-1),h-9));ctx.textAlign='left'; }
  function donut(){ const c=document.getElementById('incomeChart'); if(!c)return; const ctx=c.getContext('2d'),w=c.width,h=c.height,cx=w/2,cy=h/2,r=94,inner=62;ctx.clearRect(0,0,w,h);let start=-Math.PI/2;[[.726,'#43bb70'],[.274,'#ef4d59']].forEach(([p,col])=>{ctx.beginPath();ctx.arc(cx,cy,r,start,start+p*Math.PI*2);ctx.arc(cx,cy,inner,start+p*Math.PI*2,start,true);ctx.closePath();ctx.fillStyle=col;ctx.fill();start+=p*Math.PI*2});ctx.textAlign='center';ctx.fillStyle='#565d7c';ctx.font='14px Open Sans';ctx.fillText('Total',cx,cy-8);ctx.fillStyle='#111';ctx.font='700 17px Open Sans';ctx.fillText('₹ 34,25,500',cx,cy+20);ctx.textAlign='left'; }
  revenue(); donut(); addEventListener('resize',()=>{clearTimeout(window.__acctResize);window.__acctResize=setTimeout(()=>{revenue();donut()},120)});
})();
