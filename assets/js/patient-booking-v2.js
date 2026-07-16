(function(){
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
 $$('.dept-card').forEach(c=>c.addEventListener('click',()=>{$$('.dept-card').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');localStorage.setItem('ptDept',c.dataset.name||'Cardiology');$$('[data-summary-dept]').forEach(x=>x.textContent=c.dataset.name||'Cardiology')}));
 $$('.doctor-row').forEach(c=>c.addEventListener('click',()=>{$$('.doctor-row').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');localStorage.setItem('ptDoctor',c.dataset.name||'Dr. Arvind Sharma');localStorage.setItem('ptFee',c.dataset.fee||'800');$$('[data-summary-doctor]').forEach(x=>x.textContent=c.dataset.name||'Dr. Arvind Sharma');$$('[data-summary-fee]').forEach(x=>x.textContent='₹'+(c.dataset.fee||'800'))}));
 $$('.cal-day:not(.muted)').forEach(c=>c.addEventListener('click',()=>{$$('.cal-day').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');localStorage.setItem('ptDate',c.textContent.trim()+' May 2025');updateSlot()}));
 $$('.slot').forEach(c=>c.addEventListener('click',()=>{$$('.slot').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');localStorage.setItem('ptTime',c.textContent.trim());updateSlot()}));
 function updateSlot(){let d=localStorage.getItem('ptDate')||'15 May 2025',t=localStorage.getItem('ptTime')||'10:00 AM';$$('[data-selected-slot]').forEach(x=>x.textContent=d+' at '+t);$$('[data-summary-datetime]').forEach(x=>x.textContent=d+', '+t)}
 $$('.method').forEach(m=>m.addEventListener('click',()=>{let target=m.dataset.method;$$('.method').forEach(x=>x.classList.toggle('selected',x===m));$$('.payment-pane').forEach(x=>x.hidden=x.dataset.pane!==target);localStorage.setItem('ptPay',target)}));
 $$('[data-go]').forEach(b=>b.addEventListener('click',()=>{let u=b.dataset.go;if(u)location.href=u}));
 $$('[data-download]').forEach(b=>b.addEventListener('click',()=>toast('Download started')));
 $$('[data-toast]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.toast||'Action completed')));
 const patientForm=$('#patientForm'); if(patientForm) patientForm.addEventListener('submit',e=>{e.preventDefault();let fd=new FormData(patientForm);for(const [k,v] of fd)localStorage.setItem('pt_'+k,v);location.href='patient-payment-step1.html'});
 const copy=$('[data-copy]'); if(copy)copy.addEventListener('click',()=>{navigator.clipboard?.writeText(copy.previousElementSibling?.textContent||'OPT12505151024');toast('Booking ID copied')});
 updateSlot();
})();
