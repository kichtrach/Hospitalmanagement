(function () {
  'use strict';

  const STORAGE_KEY = 'hmsAddStaffDraft';
  const PAGES = [
    'admin-add-staff-step1.html','admin-add-staff-step2.html','admin-add-staff-step3.html',
    'admin-add-staff-step4.html','admin-add-staff-step5.html','admin-add-staff-step6.html',
    'admin-add-staff-success.html'
  ];

  function init() {
    let draft = {};
    try { draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch (e) { draft = {}; }
    const toastEl = document.getElementById('staffFlowToast');

    function toast(message) {
      if (!toastEl) return;
      toastEl.textContent = message;
      toastEl.classList.add('show');
      clearTimeout(toastEl._timer);
      toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), 1800);
    }
    function saveForm(form) {
      if (!form) return;
      new FormData(form).forEach((value,key) => { if (!(value instanceof File)) draft[key] = value; });
      form.querySelectorAll('input[type="radio"]').forEach(el => { if (el.checked && el.name) draft[el.name] = el.value; });
      form.querySelectorAll('input[type="checkbox"]').forEach(el => { if (el.name) draft[el.name] = el.checked; });
      document.querySelectorAll('[data-switch]').forEach((el,index) => { draft['switch_'+index] = el.classList.contains('on'); });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
    function restoreForm(form) {
      if (!form) return;
      Array.from(form.elements).forEach(el => {
        if (!el.name || draft[el.name] === undefined) return;
        if (el.type === 'radio') el.checked = String(el.value) === String(draft[el.name]);
        else if (el.type === 'checkbox') el.checked = Boolean(draft[el.name]);
        else if (el.type !== 'file') el.value = draft[el.name];
      });
      document.querySelectorAll('[data-switch]').forEach((el,index) => {
        if (draft['switch_'+index] !== undefined) el.classList.toggle('on', Boolean(draft['switch_'+index]));
        el.setAttribute('role','switch');
        el.setAttribute('tabindex','0');
        el.setAttribute('aria-checked',String(el.classList.contains('on')));
      });
    }
    function go(url) { window.location.href = url; }

    document.querySelectorAll('.staff-step-form').forEach(form => {
      restoreForm(form);
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); toast('Please complete all required fields.'); return; }
        const p = form.querySelector('[name="password"]');
        const cp = form.querySelector('[name="confirmPassword"]');
        if (p && cp && p.value !== cp.value) { cp.setCustomValidity('Passwords do not match.'); cp.reportValidity(); cp.setCustomValidity(''); return; }
        saveForm(form);
        const step = Math.max(1, Number(form.dataset.step || 1));
        go(PAGES[Math.min(step, PAGES.length - 1)]);
      });
    });

    document.addEventListener('click', event => {
      const target = event.target.closest('[data-save-draft],[data-prev],[data-edit-step],[data-switch],[data-password-toggle],[data-view-permissions],[data-doc-delete],[data-doc-change],.staff-step');
      if (!target) return;

      if (target.matches('[data-save-draft]')) { event.preventDefault(); saveForm(target.closest('form')); toast('Draft saved successfully.'); return; }
      if (target.matches('[data-prev]')) { event.preventDefault(); const f=target.closest('form'); saveForm(f); const step=Number(f?.dataset.step||1); go(PAGES[Math.max(0,step-2)]); return; }
      if (target.matches('[data-edit-step]')) { event.preventDefault(); go(PAGES[Math.max(0,Number(target.dataset.editStep||1)-1)]); return; }
      if (target.matches('[data-switch]')) { event.preventDefault(); target.classList.toggle('on'); target.setAttribute('aria-checked',String(target.classList.contains('on'))); saveForm(target.closest('form')); return; }
      if (target.matches('[data-password-toggle]')) { event.preventDefault(); const input=target.closest('.password-wrap')?.querySelector('input'); if(!input)return; input.type=input.type==='password'?'text':'password'; const icon=target.querySelector('i'); if(icon){icon.classList.toggle('fa-eye');icon.classList.toggle('fa-eye-slash');} return; }
      if (target.matches('[data-view-permissions]')) { event.preventDefault(); toast('Permissions include appointments, consultations, prescriptions, patient records, lab orders and reports.'); return; }
      if (target.matches('[data-doc-delete]')) { event.preventDefault(); const card=target.closest('.doc-card'); const preview=card?.querySelector('.doc-preview'); const name=card?.querySelector('.doc-name'); if(preview)preview.innerHTML='<i class="fa-solid fa-cloud-arrow-up"></i>'; if(name)name.textContent='No file selected'; toast('Document removed.'); return; }
      if (target.matches('[data-doc-change]')) { event.preventDefault(); const input=document.createElement('input'); input.type='file'; input.accept='.pdf,.jpg,.jpeg,.png,.doc,.docx'; input.onchange=()=>{const file=input.files?.[0]; if(!file)return; const name=target.closest('.doc-card')?.querySelector('.doc-name'); if(name)name.innerHTML='<i class="fa-solid fa-check" style="color:#159447"></i> '+file.name;}; input.click(); return; }
      if (target.classList.contains('staff-step')) { const steps=[...document.querySelectorAll('.staff-step')]; const index=steps.indexOf(target); if(index>=0&&(target.classList.contains('done')||target.classList.contains('active'))){event.preventDefault();saveForm(document.querySelector('.staff-step-form'));go(PAGES[index]);} }
    });

    document.addEventListener('keydown', event => {
      const sw = event.target.closest?.('[data-switch]');
      if (sw && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); sw.click(); }
    });

    document.querySelectorAll('.doc-upload').forEach(label => {
      const input=label.querySelector('input[type="file"]');
      const update=file=>{if(!file)return;const span=label.querySelector('span');if(span)span.innerHTML='<i class="fa-solid fa-check" style="color:#159447"></i><br><b>'+file.name+'</b>';};
      label.addEventListener('dragover',e=>{e.preventDefault();label.classList.add('dragging');});
      label.addEventListener('dragleave',()=>label.classList.remove('dragging'));
      label.addEventListener('drop',e=>{e.preventDefault();label.classList.remove('dragging');update(e.dataTransfer?.files?.[0]);});
      input?.addEventListener('change',()=>update(input.files?.[0]));
    });

    const photoInput=document.querySelector('[data-preview-input]');
    photoInput?.addEventListener('change',function(){const file=this.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const holder=this.closest('.staff-upload-photo');if(!holder)return;holder.style.backgroundImage=`url(${reader.result})`;holder.style.backgroundSize='cover';holder.style.backgroundPosition='center';holder.classList.add('has-photo');};reader.readAsDataURL(file);});

    if (location.pathname.endsWith('admin-add-staff-step6.html')) {
      const values={fullName:[draft.firstName,draft.middleName,draft.lastName].filter(Boolean).join(' ')||'Dr. Rajesh Kumar S',gender:draft.gender,dob:draft.dob,mobile:draft.mobile,email:draft.email,department:draft.department,role:draft.role,designation:draft.designation,qualification:draft.qualification,joiningDate:draft.joiningDate,employeeId:draft.employeeId,employmentType:draft.employmentType,employmentStatus:draft.employmentStatus,username:draft.username,loginEmail:draft.loginEmail,systemRole:draft.systemRole,permissionTemplate:draft.permissionTemplate};
      Object.entries(values).forEach(([key,value])=>{if(value)document.querySelectorAll(`[data-review="${key}"]`).forEach(el=>el.textContent=value);});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
