(() => {
  'use strict';
  document.querySelectorAll('[data-toast]').forEach(btn=>btn.addEventListener('click',()=>showToast(btn.dataset.toast||'Action completed')));
  function showToast(message){let t=document.getElementById('toast'); if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
  document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click',()=>location.href=btn.dataset.nav));
  document.querySelectorAll('.action-cell .fa-eye').forEach(icon=>icon.closest('button')?.addEventListener('click',()=>showToast('Details opened')));
  document.querySelectorAll('[data-delete-row]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('tr')?.remove()));
  document.getElementById('addItem')?.addEventListener('click',()=>{const body=document.querySelector('#itemsTable tbody');if(!body)return;const tr=body.lastElementChild.cloneNode(true);tr.querySelectorAll('input').forEach(i=>i.value='');body.appendChild(tr);showToast('New item row added')});
  const file=document.getElementById('supportFile'); document.getElementById('browseFiles')?.addEventListener('click',()=>file?.click()); file?.addEventListener('change',()=>showToast(file.files[0]?.name||'File selected'));
  document.querySelectorAll('[data-filter-input]').forEach(el=>el.addEventListener('input',filterRows));
  function filterRows(){const q=(document.querySelector('[data-filter-input]')?.value||'').toLowerCase();document.querySelectorAll('.data-table tbody tr').forEach(r=>r.style.display=r.innerText.toLowerCase().includes(q)?'':'none')}
  const dateRange=document.querySelector('[data-date-range]'); if(dateRange){dateRange.value='2025-07-09'}
})();
