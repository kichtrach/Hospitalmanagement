const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const sidebar=$('#sidebar'),overlay=$('#overlay');
$('#openSidebar')?.addEventListener('click',()=>{sidebar?.classList.add('open');overlay?.classList.add('show')});
$('#closeSidebar')?.addEventListener('click',()=>{sidebar?.classList.remove('open');overlay?.classList.remove('show')});
overlay?.addEventListener('click',()=>{sidebar?.classList.remove('open');overlay?.classList.remove('show')});
const pb=$('#profileBtn'),pm=$('#profileMenu');
pb?.addEventListener('click',e=>{e.stopPropagation();pm?.classList.toggle('show')});
document.addEventListener('click',()=>$$('.dropdown').forEach(d=>d.classList.remove('show')));
function toast(msg){let t=$('.toast')||document.body.appendChild(Object.assign(document.createElement('div'),{className:'toast'}));t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
$$('.tab').forEach(tab=>tab.addEventListener('click',()=>{const key=tab.dataset.tab; const wrap=tab.closest('.page-content')||document; $$('.tab',wrap).forEach(t=>t.classList.remove('active'));tab.classList.add('active'); if(key){$$('.tab-panel',wrap).forEach(p=>p.classList.toggle('active',p.dataset.panel===key));}}));
$$('select.control').forEach(s=>s.addEventListener('change',()=>toast('Selected: '+s.value)));
$$('input[type="date"]').forEach(i=>i.addEventListener('change',()=>{ if(i.id==='dob'){ const age=$('#age'); if(age&&i.value){ const d=new Date(i.value), n=new Date(); let a=n.getFullYear()-d.getFullYear(); if(n<new Date(n.getFullYear(),d.getMonth(),d.getDate())) a--; age.value=a+' Years'; }} }));
$$('textarea[maxlength]').forEach(t=>{const cc=t.parentElement.querySelector('.char-count'); const upd=()=>cc&&(cc.textContent=t.value.length+'/'+t.maxLength); t.addEventListener('input',upd); upd()});
$$('.upload,.file-drop').forEach(u=>{u.addEventListener('click',()=>toast('Upload selector opened'));u.addEventListener('dragover',e=>{e.preventDefault();u.style.background='#fbf8ff'});u.addEventListener('dragleave',()=>u.style.background='');u.addEventListener('drop',e=>{e.preventDefault();u.style.background='';toast('File attached')})});
let step=1;function showStep(n){step=n;$$('[data-step-panel]').forEach(p=>p.classList.toggle('hidden',+p.dataset.stepPanel!==n));$$('.step').forEach(s=>{let x=+s.dataset.step;s.classList.toggle('active',x===n);s.classList.toggle('done',x<n);const b=s.querySelector('b'); if(b)b.innerHTML=x<n?'<i class="fa-solid fa-check"></i>':x});window.scrollTo({top:0,behavior:'smooth'})}
$$('[data-next]').forEach(b=>b.addEventListener('click',()=>{ if(step<4) showStep(step+1); else toast('Family member added successfully') }));
$$('[data-back]').forEach(b=>b.addEventListener('click',()=> step>1?showStep(step-1):history.back()));
$$('[data-edit-step]').forEach(b=>b.addEventListener('click',()=>showStep(+b.dataset.editStep)));if($('[data-step-panel]')) showStep(1);
$$('[data-action]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.action)));
