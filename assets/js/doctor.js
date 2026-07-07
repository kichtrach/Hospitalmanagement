document.addEventListener('DOMContentLoaded',()=>{
  const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  const side=$('.doctor-sidebar');
  $$('.hamb').forEach(b=>b.addEventListener('click',()=>side&&side.classList.toggle('open')));
  $$('.menu-group > .menu-item').forEach(item=>{
    item.addEventListener('click',e=>{ const group=item.closest('.menu-group'); if(!group)return; e.preventDefault(); group.classList.toggle('open'); });
  });
  $$('.submenu a').forEach(a=>a.addEventListener('click',e=>{ const href=a.getAttribute('href'); if(href){e.preventDefault(); location.href=href;} }));
  document.addEventListener('click',e=>{
    const tab=e.target.closest('.tab-btn,.consult-tabs button,[data-tab]');
    if(!tab) return;
    const wrap=tab.closest('.tabs,.consult-tabs,[data-tabs]'); if(!wrap) return;
    [...wrap.children].forEach(b=>b.classList&&b.classList.remove('active')); tab.classList.add('active');
    const panelRoot=wrap.closest('.panel') || document;
    if(wrap.classList.contains('tabs')){ const label=tab.textContent.trim().toLowerCase().split(' ')[0]; $$('tbody tr',panelRoot).forEach(r=>{const txt=r.textContent.toLowerCase(); r.style.display=(label==='all'||txt.includes(label))?'':'none';}); }
    const target=tab.dataset.tab; if(target){ $$('[data-panel]',panelRoot.parentElement||document).forEach(p=>p.style.display=p.dataset.panel===target?'block':'none'); }
  });
  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-open-modal]'); if(open){e.preventDefault(); $(open.dataset.openModal)?.classList.add('show');}
    const close=e.target.closest('[data-close-modal]'); if(close){e.preventDefault(); close.closest('.modal')?.classList.remove('show');}
    if(e.target.classList?.contains('modal')) e.target.classList.remove('show');
  });
  document.addEventListener('click',e=>{
    const select=e.target.closest('[data-select]');
    if(select){ const menu=select.querySelector('.dropdown-menu'); if(e.target.matches('input,.input')){e.stopPropagation(); $$('.dropdown-menu').forEach(m=>m!==menu&&m.classList.remove('show')); menu?.classList.toggle('show');}
      const opt=e.target.closest('.dropdown-menu button'); if(opt){select.querySelector('input').value=opt.textContent.trim(); menu?.classList.remove('show');}
    } else $$('.dropdown-menu').forEach(m=>m.classList.remove('show'));
  });
  document.addEventListener('click',e=>{
    const dots=e.target.closest('[data-dots]');
    if(dots){e.preventDefault(); e.stopPropagation(); const wrap=dots.closest('.dots-wrap')||dots.parentElement; const menu=wrap.querySelector('.action-menu'); $$('.action-menu').forEach(m=>m!==menu&&m.classList.remove('show')); menu?.classList.toggle('show'); return;}
    const action=e.target.closest('.action-menu button');
    if(action){ const text=action.textContent.trim().toLowerCase(); if(text.includes('view')) location.href='doctor-appointment-details.html'; else if(text.includes('reschedule')) showToast('Reschedule option selected'); else if(text.includes('cancel')||text.includes('remove')) showToast('Removed'); else showToast(action.textContent.trim()); $$('.action-menu').forEach(m=>m.classList.remove('show')); return; }
    if(!e.target.closest('.dots-wrap')) $$('.action-menu').forEach(m=>m.classList.remove('show'));
  });
  document.addEventListener('click',e=>{
    const day=e.target.closest('.cal-grid span:not(.muted)'); if(day){ const grid=day.closest('.cal-grid'); $$('span',grid).forEach(x=>x.classList.remove('active')); day.classList.add('active'); showToast('Selected date '+day.textContent.trim()); }
    if(e.target.closest('.cal-head i')) showToast('Calendar month changed');
  });
  document.addEventListener('click',e=>{
    const del=e.target.closest('.rx-table .fa-trash-can'); if(del){del.closest('tr')?.remove(); renumberMeds(); showToast('Medication removed');}
    const add=e.target.closest('[data-add-med]'); if(add){ const tb=$('.rx-table tbody'); if(!tb)return; const n=tb.children.length+1; tb.insertAdjacentHTML('beforeend',`<tr><td>${n}</td><td><input value="New Medicine"/></td><td><select><option>Tablet</option><option>Syrup</option></select></td><td><input value="5 mg"/></td><td><input value="1-0-0"/></td><td><input value="30 Days"/></td><td><input value="Take after food."/></td><td><button class="icon-btn"><i class="fa-regular fa-trash-can"></i></button> <span class="dots-wrap" style="position:relative"><button class="icon-btn" data-dots><i class="fa-solid fa-ellipsis-vertical"></i></button><div class="action-menu"><button>Duplicate</button><button>Save Template</button><button class="danger">Remove</button></div></span></td></tr>`); showToast('Medication added'); }
  });
  document.addEventListener('click',e=>{
    const btn=e.target.closest('button,.view-link'); if(!btn) return; const txt=btn.textContent.trim().toLowerCase(); if(btn.dataset.toast) return showToast(btn.dataset.toast);
    if(txt.includes('new appointment')) showToast('New appointment opened'); if(txt.includes('lab test')) showToast('Lab test opened'); if(txt.includes('add patient')) showToast('Add patient opened'); if(txt.includes('view all')) showToast('View all opened'); if(txt.includes('save as draft')) showToast('Draft saved'); if(txt.includes('save prescription')) showToast('Prescription saved'); if(txt.includes('complete consultation')) showToast('Consultation completed'); if(txt.includes('send to patient')) showToast('Sent to patient'); if(txt.includes('print')) window.print();
  });
  $$('input[type="date"]').forEach(i=>{ if(!i.value) i.value='2025-05-24'; });
  function renumberMeds(){ $$('.rx-table tbody tr').forEach((tr,i)=>{tr.children[0].textContent=i+1}); }
  function showToast(msg){ let t=$('.toast'); if(!t){t=document.createElement('div'); t.className='toast'; document.body.appendChild(t);} t.textContent=msg; t.classList.add('show'); clearTimeout(t._timer); t._timer=setTimeout(()=>t.classList.remove('show'),1700); }
});
