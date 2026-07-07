document.addEventListener('DOMContentLoaded',()=>{const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
$$('.hamb').forEach(b=>b.onclick=()=>$('.role-sidebar')?.classList.toggle('open'));
$$('.menu-toggle').forEach(b=>b.onclick=()=>{b.closest('.menu-group')?.classList.toggle('open')});
$$('.cal-grid span').forEach(d=>d.onclick=()=>{$$('.cal-grid span',d.closest('.cal-grid')).forEach(x=>x.classList.remove('active'));d.classList.add('active');toast('Selected '+d.textContent+' May 2025')});
$$('.date-pill').forEach(p=>p.onclick=e=>{e.stopPropagation();p.closest('.date-wrap')?.classList.toggle('open')}); document.addEventListener('click',()=>$$('.date-wrap').forEach(w=>w.classList.remove('open')));
$$('[data-dots]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const m=btn.parentElement.querySelector('.action-menu');$$('.action-menu').forEach(x=>x!==m&&x.classList.remove('show'));m?.classList.toggle('show')});document.addEventListener('click',e=>{if(!e.target.closest('.dots-wrap'))$$('.action-menu').forEach(m=>m.classList.remove('show'))});
$$('.action-menu button,.view-link,.quick-grid button,.btn').forEach(b=>b.addEventListener('click',()=>toast((b.textContent||'Action').trim()+' selected')));
$$('[data-modal]').forEach(b=>b.onclick=()=>$(b.dataset.modal)?.classList.add('show'));$$('[data-close]').forEach(b=>b.onclick=()=>b.closest('.modal')?.classList.remove('show'));
function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),1600)}
});

// Pharmacy interactive helpers
(function(){
 document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.filters-row select').forEach(sel=>sel.addEventListener('change',()=>{document.querySelectorAll('.rx-table tbody tr').forEach(r=>r.style.display='');const t=document.querySelector('.toast')||Object.assign(document.createElement('div'),{className:'toast'});document.body.appendChild(t);t.textContent=sel.value+' applied';t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),1500)}));
  document.querySelectorAll('.search-field input,.top-search input').forEach(inp=>inp.addEventListener('input',()=>{const q=inp.value.toLowerCase();document.querySelectorAll('.rx-table tbody tr').forEach(r=>r.style.display=r.innerText.toLowerCase().includes(q)?'':'none')}));
  document.querySelectorAll('.date-pop .cal-grid span').forEach(day=>day.addEventListener('click',()=>{const wrap=day.closest('.date-wrap');const label=wrap?.querySelector('.date-pill span');if(label)label.textContent=(day.textContent.padStart(2,'0'))+' May 2025';}));
 });
})();


// Pharmacy prescription view popup wiring
(function(){
 document.addEventListener('click', function(e){
  const viewBtn=e.target.closest('.action-menu button, .rx-table .icon-btn, .pharmacy-content table .icon-btn');
  if(!viewBtn) return;
  const text=(viewBtn.textContent||'').trim().toLowerCase();
  const hasEye=!!viewBtn.querySelector('.fa-eye');
  if(hasEye || text.includes('view details')){
    const modal=document.querySelector('#rxModal');
    if(modal){ e.preventDefault(); e.stopPropagation(); modal.classList.add('show'); document.querySelectorAll('.action-menu').forEach(m=>m.classList.remove('show')); }
  }
 });
})();

// Robust modal closing for pharmacy popups
(function(){
 document.addEventListener('click',function(e){
  const close=e.target.closest('[data-close], .rx-view-head button, .rx-view-footer .btn');
  if(close && close.closest('.modal')){e.preventDefault();e.stopPropagation();close.closest('.modal').classList.remove('show');return;}
  if(e.target.classList && e.target.classList.contains('modal')){e.target.classList.remove('show');}
 });
 document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.querySelectorAll('.modal.show').forEach(m=>m.classList.remove('show'));}});
})();


// Pharmacy topbar profile dropdown + status pages interactions
(function(){
 document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.pharmacy-page .user').forEach(function(u){
    if(!u.querySelector('.user-menu')){
      const m=document.createElement('div');m.className='user-menu';m.innerHTML='<a href="#"><i class="fa-regular fa-user"></i> My Profile</a><a href="#"><i class="fa-solid fa-gear"></i> Settings</a><a href="#"><i class="fa-regular fa-bell"></i> Notifications</a><button type="button"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>';u.appendChild(m);
    }
    u.addEventListener('click',function(e){e.stopPropagation();document.querySelectorAll('.user.open').forEach(x=>{if(x!==u)x.classList.remove('open')});u.classList.toggle('open')});
  });
  document.addEventListener('click',()=>document.querySelectorAll('.user.open').forEach(u=>u.classList.remove('open')));
  document.querySelectorAll('[data-pharmacy-status]').forEach(function(page){
    page.querySelectorAll('select').forEach(sel=>sel.addEventListener('change',()=>{const t=document.querySelector('.toast')||Object.assign(document.createElement('div'),{className:'toast'});document.body.appendChild(t);t.textContent=sel.value+' selected';t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),1400)}));
    page.querySelectorAll('.search-field input,.top-search input').forEach(inp=>inp.addEventListener('input',()=>{const q=inp.value.toLowerCase();page.querySelectorAll('.rx-table tbody tr').forEach(r=>r.style.display=r.innerText.toLowerCase().includes(q)?'':'none')}));
  });
 });
})();

// Medicine inventory modal wizard
(function(){
 document.addEventListener('DOMContentLoaded',function(){
  function setStep(modal,n){
   modal.querySelectorAll('.med-step').forEach(p=>p.classList.toggle('active',p.dataset.stepPanel==n));
   modal.querySelectorAll('.step').forEach(s=>{const v=+s.dataset.step;s.classList.toggle('active',v==n);s.classList.toggle('done',v<n)});
   const next=modal.querySelector('[data-med-next]'), prev=modal.querySelector('[data-med-prev]');
   if(prev) prev.style.visibility=n==1?'hidden':'visible';
   if(next) next.innerHTML=n==3?'Save Medicine <i class="fa-solid fa-check"></i>':(n==1?'Next: Pricing &amp; Stock <i class="fa-solid fa-arrow-right"></i>':'Next: Review &amp; Save <i class="fa-solid fa-arrow-right"></i>');
   modal.dataset.currentStep=n;
  }
  document.querySelectorAll('#addMedicineModal').forEach(modal=>{
    setStep(modal,1);
    modal.querySelector('[data-med-next]')?.addEventListener('click',e=>{e.preventDefault();let n=+(modal.dataset.currentStep||1); if(n<3)setStep(modal,n+1); else {modal.classList.remove('show'); const t=document.querySelector('.toast')||Object.assign(document.createElement('div'),{className:'toast'});document.body.appendChild(t);t.textContent='Medicine saved';t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),1500)}});
    modal.querySelector('[data-med-prev]')?.addEventListener('click',e=>{e.preventDefault();let n=+(modal.dataset.currentStep||1); if(n>1)setStep(modal,n-1)});
    modal.querySelectorAll('[data-preview]').forEach(inp=>inp.addEventListener('input',()=>updatePreview(modal)));
    modal.querySelectorAll('select[data-preview]').forEach(inp=>inp.addEventListener('change',()=>updatePreview(modal)));
  });
  function updatePreview(modal){
   modal.querySelectorAll('[data-preview]').forEach(el=>{const key=el.dataset.preview; const value=el.value && !el.value.startsWith('Select')?el.value:'-'; modal.querySelectorAll('.medicine-preview p').forEach(p=>{if((p.querySelector('span')?.textContent||'')==key) p.querySelector('b').textContent=value;});});
  }
 });
})();

// Pharmacy final QA: robust dropdowns, date calendars, profile, menus, wizard links
(function(){
  function qs(s,p=document){return p.querySelector(s)}
  function qsa(s,p=document){return Array.from(p.querySelectorAll(s))}
  function toast(msg){let t=qs('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),1400)}
  function buildCalendar(field){
    if(field.querySelector('.mini-calendar')) return;
    const cal=document.createElement('div'); cal.className='mini-calendar';
    cal.innerHTML='<div class="cal-head"><button type="button">‹</button><b>May 2025</b><button type="button">›</button></div><div class="cal-grid">'+Array.from({length:31},(_,i)=>'<span>'+String(i+1)+'</span>').join('')+'</div>';
    field.appendChild(cal);
  }
  document.addEventListener('DOMContentLoaded',function(){
    // Sidebar: only open nested menus on click, not forced except current page; links in nested menu work.
    qsa('.pharmacy-sidebar .menu-toggle').forEach(btn=>{
      btn.onclick=function(e){ e.preventDefault(); e.stopPropagation(); const g=btn.closest('.menu-group'); if(g){g.classList.toggle('open')} };
    });
    qsa('.pharmacy-sidebar .sub a').forEach(a=>a.addEventListener('click',e=>{ if(a.getAttribute('href')==='#') {e.preventDefault(); toast('Coming soon')} }));

    // Topbar user dropdown
    qsa('.pharmacy-page .user').forEach(u=>{
      if(!u.querySelector('.profile-dropdown') && !u.querySelector('.user-menu')){
        const m=document.createElement('div');m.className='profile-dropdown';m.innerHTML='<a href="#"><i class="fa-regular fa-user"></i> My Profile</a><a href="#"><i class="fa-solid fa-gear"></i> Settings</a><a href="#"><i class="fa-regular fa-bell"></i> Notifications</a><button type="button"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>';u.appendChild(m);
      }
      u.onclick=function(e){ e.stopPropagation(); qsa('.pharmacy-page .user.open').forEach(x=>{if(x!==u)x.classList.remove('open')}); u.classList.toggle('open'); };
    });

    // Date picker support for any date-field/date-input and date-wrap.
    qsa('.pharmacy-page .date-field').forEach(field=>{
      buildCalendar(field);
      field.addEventListener('click',function(e){e.stopPropagation(); qsa('.date-field.open,.date-wrap.open').forEach(x=>{if(x!==field)x.classList.remove('open')}); field.classList.toggle('open')});
      qsa('.cal-grid span',field).forEach(day=>day.addEventListener('click',function(e){e.preventDefault();e.stopPropagation(); qsa('.cal-grid span',field).forEach(x=>x.classList.remove('active')); day.classList.add('active'); const input=qs('input,.date-input',field); if(input) input.value=String(day.textContent).padStart(2,'0')+' May 2025'; field.classList.remove('open'); toast('Date selected'); }));
    });
    qsa('.pharmacy-page input[readonly], .pharmacy-page input').forEach(inp=>{
      const ph=(inp.placeholder||'')+(inp.value||'');
      if(/date|Select Date Range|May 2025/i.test(ph) && !inp.closest('.date-field')){
        const wrap=document.createElement('span'); wrap.className='date-field inline-date'; inp.parentNode.insertBefore(wrap,inp); wrap.appendChild(inp); const i=document.createElement('i'); i.className='fa-regular fa-calendar'; wrap.appendChild(i); buildCalendar(wrap); wrap.addEventListener('click',function(e){e.stopPropagation();wrap.classList.toggle('open')}); qsa('.cal-grid span',wrap).forEach(day=>day.addEventListener('click',function(e){e.preventDefault();e.stopPropagation(); inp.value=String(day.textContent).padStart(2,'0')+' May 2025'; wrap.classList.remove('open')}));
      }
    });

    // Action menus: create designed popup where missing, prevent duplicate defaults.
    qsa('.pharmacy-page .row-actions, .pharmacy-page td:last-child').forEach(cell=>{
      const dots=qs('[data-dots], .fa-ellipsis-vertical',cell)?.closest('button');
      if(dots && !qs('.action-menu',cell)){
        const wrap=document.createElement('span'); wrap.className='dots-wrap'; dots.parentNode.insertBefore(wrap,dots); wrap.appendChild(dots);
        const menu=document.createElement('div'); menu.className='action-menu'; menu.innerHTML='<button type="button" data-action="view"><i class="fa-regular fa-eye"></i> View Details</button><button type="button"><i class="fa-solid fa-pen"></i> Edit</button><button type="button"><i class="fa-solid fa-download"></i> Download</button><button type="button"><i class="fa-solid fa-print"></i> Print</button>'; wrap.appendChild(menu);
      }
    });
    document.addEventListener('click',function(e){
      const dots=e.target.closest('.pharmacy-page [data-dots], .pharmacy-page .dots-wrap > button');
      if(dots){e.preventDefault();e.stopPropagation(); const m=dots.closest('.dots-wrap')?.querySelector('.action-menu'); qsa('.action-menu.show').forEach(x=>{if(x!==m)x.classList.remove('show')}); if(m)m.classList.toggle('show'); return;}
      if(!e.target.closest('.action-menu')) qsa('.action-menu.show').forEach(m=>m.classList.remove('show'));
    });

    // Modal open/close for all designed buttons.
    document.addEventListener('click',function(e){
      const opener=e.target.closest('.pharmacy-page [data-modal]');
      if(opener){const sel=opener.getAttribute('data-modal'); const m=qs(sel); if(m){e.preventDefault();e.stopPropagation();m.classList.add('show');qsa('.action-menu.show').forEach(x=>x.classList.remove('show'));return;}}
      const eye=e.target.closest('.pharmacy-page .icon-btn');
      if(eye && eye.querySelector('.fa-eye')){ const m=qs('#rxModal,#returnView,#poView,#damageView,.modal'); if(m){e.preventDefault();e.stopPropagation();m.classList.add('show');return;} }
      const close=e.target.closest('.pharmacy-page [data-close], .pharmacy-page .modal .fa-xmark, .pharmacy-page .modal .btn');
      if(close && close.closest('.modal')){ if((close.textContent||'').match(/close|cancel/i) || close.hasAttribute('data-close') || close.classList.contains('fa-xmark')){e.preventDefault();e.stopPropagation();close.closest('.modal').classList.remove('show');return;} }
      if(e.target.classList && e.target.classList.contains('modal')) e.target.classList.remove('show');
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape')qsa('.modal.show').forEach(m=>m.classList.remove('show'))});

    // Search and filter feedback
    qsa('.pharmacy-page .top-search input,.pharmacy-page .search-field input').forEach(inp=>inp.addEventListener('input',function(){const q=inp.value.toLowerCase(); const scope=inp.closest('.content')||document; qsa('tbody tr',scope).forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'':'none')}));
    qsa('.pharmacy-page select').forEach(sel=>sel.addEventListener('change',()=>toast((sel.value||'Option')+' selected')));

    // Expiry alert color dropdown + add threshold robust
    qsa('.pharmacy-page .color-select').forEach(box=>{
      box.classList.add('expiry-dropdown');
      if(!box.querySelector('.expiry-dropdown-menu')){const menu=document.createElement('div');menu.className='expiry-dropdown-menu';menu.innerHTML='<button type="button" data-color="yellow"><span class="color-dot color-yellow"></span>Yellow</button><button type="button" data-color="orange"><span class="color-dot color-orange"></span>Orange</button><button type="button" data-color="red"><span class="color-dot color-red"></span>Red</button><button type="button" data-color="purple"><span class="color-dot color-purple"></span>Purple</button>';box.appendChild(menu)}
      box.addEventListener('click',function(e){e.stopPropagation(); qsa('.expiry-dropdown.open').forEach(x=>{if(x!==box)x.classList.remove('open')}); box.classList.toggle('open')});
      qsa('.expiry-dropdown-menu button',box).forEach(btn=>btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation(); const dot=qs(':scope > .color-dot',box); if(dot) dot.className='color-dot color-'+btn.dataset.color; box.classList.remove('open'); toast('Alert color selected')}));
    });
    const add=qs('#addThresholdBtn'); const grid=qs('.threshold-grid');
    if(add && grid && !add.dataset.bound){ add.dataset.bound='1'; add.addEventListener('click',function(e){e.preventDefault();e.stopPropagation(); const card=document.createElement('div'); card.className='threshold-card added'; card.innerHTML='<button type="button" class="remove-threshold"><i class="fa-solid fa-xmark"></i></button><b>Custom Alert</b><div class="threshold-input"><input value="45"><span>Days Before Expiry</span></div><label>Alert Color</label><div class="color-select expiry-dropdown"><span class="color-dot color-yellow"></span><i class="fa-solid fa-chevron-down"></i><div class="expiry-dropdown-menu"><button type="button" data-color="yellow"><span class="color-dot color-yellow"></span>Yellow</button><button type="button" data-color="orange"><span class="color-dot color-orange"></span>Orange</button><button type="button" data-color="red"><span class="color-dot color-red"></span>Red</button><button type="button" data-color="purple"><span class="color-dot color-purple"></span>Purple</button></div></div>'; grid.appendChild(card); card.querySelector('.remove-threshold').onclick=()=>card.remove(); toast('Threshold added'); }); }
  });
  document.addEventListener('click',()=>{qsa('.date-field.open,.date-wrap.open,.user.open,.expiry-dropdown.open,.tag-select.open').forEach(x=>x.classList.remove('open'))});
})();

// Pharmacy final fixes: topbar profile dropdown, search/select behavior, and sidebar logout
(function(){
  function qsa(sel, root=document){return Array.from(root.querySelectorAll(sel));}
  function qs(sel, root=document){return root.querySelector(sel);}
  function ensureToast(){let t=qs('.toast'); if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);} return t;}
  function toast(msg){const t=ensureToast();t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),1300);}
  document.addEventListener('DOMContentLoaded', function(){
    if(!document.body.classList.contains('pharmacy-page')) return;
    // Sidebar logout link fallback for any older page markup
    const menu=qs('.pharmacy-sidebar .role-menu');
    if(menu && !qs('.logout-link', menu)){
      const a=document.createElement('a'); a.className='logout-link'; a.href='index.html'; a.innerHTML='<i class="fa-solid fa-right-from-bracket"></i><span>Logout</span>';
      menu.appendChild(a);
    }
    qsa('.pharmacy-sidebar a').forEach(a=>{
      const text=(a.textContent||'').trim();
      if(text==='Returns' && a.getAttribute('href')==='#') a.setAttribute('href','pharmacy-returns.html');
      if(text==='Sales & Billing' && a.getAttribute('href')==='#') a.setAttribute('href','pharmacy-sales-billing.html');
    });

    // Build topbar profile dropdown if absent and keep it clickable
    qsa('.role-top .user').forEach(user=>{
      let menu=qs('.profile-dropdown,.user-menu', user);
      if(!menu){
        menu=document.createElement('div');
        menu.className='profile-dropdown';
        menu.innerHTML='<a href="#"><i class="fa-regular fa-user"></i> My Profile</a><a href="#"><i class="fa-solid fa-gear"></i> Settings</a><a href="#"><i class="fa-regular fa-bell"></i> Notifications</a><a href="index.html"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>';
        user.appendChild(menu);
      }
      user.setAttribute('tabindex','0');
      user.addEventListener('click', function(e){
        const isLink=e.target.closest('.profile-dropdown a,.profile-dropdown button,.user-menu a,.user-menu button');
        if(isLink) return;
        e.preventDefault(); e.stopPropagation();
        qsa('.role-top .user.open').forEach(u=>{ if(u!==user) u.classList.remove('open'); });
        user.classList.toggle('open');
      });
      user.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){e.preventDefault();user.click();} });
    });

    // Search filters visible rows across table/list content
    qsa('.top-search input,.search-field input,.filter-input input').forEach(input=>{
      input.addEventListener('input', function(){
        const q=input.value.trim().toLowerCase();
        const root=input.closest('.content') || document;
        const rows=qsa('tbody tr,.patient-row,.supplier-row,.update-row', root);
        rows.forEach(row=>{ row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none'; });
      });
    });

    // Select feedback and stable styling state
    qsa('select').forEach(sel=>{
      sel.addEventListener('change', function(){
        sel.classList.toggle('has-value', !!sel.value);
        if(sel.value) toast(sel.options[sel.selectedIndex]?.textContent?.trim() + ' selected');
      });
    });

    document.addEventListener('click', function(e){
      if(!e.target.closest('.role-top .user')) qsa('.role-top .user.open').forEach(u=>u.classList.remove('open'));
    });
  });
})();
