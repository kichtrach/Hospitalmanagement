document.addEventListener('DOMContentLoaded',()=>{
  const root=document.documentElement;
  document.querySelectorAll('[data-theme]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-theme]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    const p=btn.dataset.theme;root.style.setProperty('--ui-primary',p);root.style.setProperty('--primary',p);
    localStorage.setItem('hms-ui-theme',p);
  }));
  const saved=localStorage.getItem('hms-ui-theme');if(saved){root.style.setProperty('--ui-primary',saved);root.style.setProperty('--primary',saved);document.querySelectorAll('[data-theme]').forEach(x=>x.classList.toggle('active',x.dataset.theme===saved));}

  document.querySelectorAll('.ui-check').forEach(cb=>{
    cb.addEventListener('click',()=>{
      if(cb.indeterminate){
        cb.indeterminate=false;
        cb.checked=true;
      }
    });
  });
  document.querySelectorAll('.switch').forEach(sw=>sw.addEventListener('click',()=>sw.classList.toggle('on')));
  document.querySelectorAll('.tab-demo').forEach(tab=>tab.addEventListener('click',()=>{const wrap=tab.closest('.ui-card');wrap.querySelectorAll('.tab-demo').forEach(t=>t.classList.remove('active'));tab.classList.add('active');const panel=wrap.querySelector('.tab-panel');if(panel)panel.textContent=tab.dataset.content||'This is the content of the active tab.';}));
  document.querySelectorAll('.page-btn').forEach(b=>b.addEventListener('click',()=>{if(!/^\d+$/.test(b.textContent.trim()))return;const p=b.parentElement;p.querySelectorAll('.page-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
  document.querySelectorAll('.cal-grid span:not(.muted)').forEach(d=>d.addEventListener('click',()=>{const g=d.parentElement;g.querySelectorAll('span').forEach(x=>x.classList.remove('selected'));d.classList.add('selected');document.querySelector('#dateValue').value=`24/05/2025`;}));
  document.querySelectorAll('.time-option').forEach(t=>t.addEventListener('click',()=>{t.parentElement.querySelectorAll('.time-option').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.querySelector('#timeValue').value=t.textContent.trim();}));
  document.querySelectorAll('.accordion-head').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));
  const modal=document.querySelector('#componentModal');document.querySelectorAll('[data-open-modal]').forEach(b=>b.addEventListener('click',()=>modal.classList.add('open')));document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>modal.classList.remove('open')));
  const toastBtn=document.querySelector('#showToast');toastBtn?.addEventListener('click',()=>{const n=document.createElement('div');n.className='global-toast';n.innerHTML='<i class="fa-solid fa-circle-check"></i><span>Component action completed successfully.</span>';document.body.appendChild(n);setTimeout(()=>n.classList.add('show'),10);setTimeout(()=>{n.classList.remove('show');setTimeout(()=>n.remove(),250)},2200)});
  const search=document.querySelector('#componentSearch');search?.addEventListener('input',()=>{const q=search.value.toLowerCase();document.querySelectorAll('.ui-card').forEach(c=>c.style.display=c.textContent.toLowerCase().includes(q)?'':'none')});
});
