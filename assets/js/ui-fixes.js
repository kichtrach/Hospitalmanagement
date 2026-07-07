
(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
  $$('.app-card').forEach(el=>el.remove());
  function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.style.cssText='position:fixed;right:22px;bottom:22px;background:#10145c;color:#fff;padding:13px 18px;border-radius:8px;z-index:3000;font-weight:700;box-shadow:0 12px 35px rgba(0,0,0,.18)';document.body.appendChild(t);}t.textContent=msg;t.style.opacity='1';clearTimeout(t._to);t._to=setTimeout(()=>t.style.opacity='0',2200)}
  function ensureModal(){let m=$('#globalDetailModal'); if(m) return m; m=document.createElement('div'); m.id='globalDetailModal'; m.className='detail-modal'; m.innerHTML='<div class="detail-panel"><div class="detail-head"><h3>Details</h3><button class="detail-close" type="button">×</button></div><div class="detail-body"></div></div>'; document.body.appendChild(m); m.addEventListener('click',e=>{if(e.target===m||e.target.classList.contains('detail-close'))m.classList.remove('show')}); return m;}
  function rowDetails(row){
    const title=row.querySelector('h3,b,strong')?.textContent?.trim() || 'Record Details';
    let cells=[];
    row.querySelectorAll('.kv').forEach(k=>{const l=k.querySelector('label')?.textContent?.trim();const b=k.querySelector('b')?.textContent?.trim();if(l&&b)cells.push([l,b]);});
    if(!cells.length){ row.querySelectorAll('td').forEach((td,i)=>{const head=td.closest('table')?.querySelectorAll('th')[i]?.textContent?.trim()||('Info '+(i+1)); cells.push([head,td.textContent.trim()]);}); }
    if(!cells.length){ cells=[['Name',title],['Status','Available'],['Action','View details']]; }
    return {title,cells};
  }
  function openDetails(row){const m=ensureModal(), d=rowDetails(row); $('.detail-head h3',m).textContent=d.title; $('.detail-body',m).innerHTML='<div class="detail-grid">'+d.cells.map(c=>`<div class="detail-cell"><span>${c[0]}</span><b>${c[1]}</b></div>`).join('')+'</div>'; m.classList.add('show');}
  document.addEventListener('click',function(e){
    const pageOwned = e.target.closest('.record-row,.mobile-rec-card,.rx-row,.rx-card,.lab-row,.lab-card') || e.target.closest('[data-view],[data-menu],.record-menu,.rx-menu-btn,.lab-menu-btn,#recordContext,#rxContext,#labContext,.med-drawer,.rx-drawer');
    const view=e.target.closest('button,a');
    if(!pageOwned && view && /view details|view profile|view|details/i.test((view.textContent||'').trim()) && !view.closest('.quick-list') && !view.closest('.tabs') && !view.closest('.top-actions')){
      const row=view.closest('.member-row,tr,.token-row,.appointment-row,.card') || view.parentElement; if(row){e.preventDefault(); openDetails(row); return;}
    }
    const ell=e.target.closest('.fa-ellipsis-vertical,.fa-ellipsis,button[aria-label*=menu],.more-btn,.action-menu-btn');
    if(!pageOwned && ell){e.preventDefault(); $$('.action-popover').forEach(p=>p.remove()); const p=document.createElement('div'); p.className='action-popover'; p.innerHTML='<button><i class="fa-regular fa-eye"></i> View Details</button><button><i class="fa-regular fa-pen-to-square"></i> Edit</button><button><i class="fa-regular fa-trash-can"></i> Delete</button>'; document.body.appendChild(p); const r=ell.getBoundingClientRect(); p.style.left=Math.min(r.left,innerWidth-190)+'px'; p.style.top=(r.bottom+8)+'px'; p.querySelector('button').onclick=()=>{openDetails(ell.closest('.member-row,tr,.card')||document.body);p.remove()}; p.querySelectorAll('button')[1].onclick=()=>{toast('Edit option opened');p.remove()}; p.querySelectorAll('button')[2].onclick=()=>{toast('Delete action selected');p.remove()}; return;}
    if(!e.target.closest('.action-popover')) $$('.action-popover').forEach(p=>p.remove());
  });
  // Profile photo upload preview
  $$('.camera,.profile-photo,.upload-photo,[data-upload-photo]').forEach(el=>{el.style.cursor='pointer'; el.addEventListener('click',()=>{let inp=$('#profilePhotoInput'); if(!inp){inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.id='profilePhotoInput'; inp.style.display='none'; document.body.appendChild(inp); inp.addEventListener('change',()=>{const f=inp.files&&inp.files[0]; if(!f)return; const url=URL.createObjectURL(f); const img=$('.profile-photo')||$('.avatar'); if(img) img.src=url; toast('Profile image updated');});} inp.click();});});
  // Generic upload blocks real file picker
  $$('.upload,.file-drop').forEach(el=>{el.addEventListener('click',()=>{let inp=document.createElement('input'); inp.type='file'; inp.multiple=true; inp.onchange=()=>toast((inp.files?.length||0)+' file(s) attached'); inp.click();});});
})();
