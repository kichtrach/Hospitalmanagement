(function(){
  const roleSelect=document.querySelector('[data-role-select]');
  const roleCurrent=document.querySelector('[data-role-current]');
  const hiddenRole=document.querySelector('#selectedRole');
  const form=document.querySelector('#loginForm');
  const toggle=document.querySelector('[data-password-toggle]');
  const pass=document.querySelector('#password');
  const toast=document.querySelector('#toast');
  const selectedIcon=document.querySelector('.role-select .role-icon');
  const routes={
    patient:'patient/patient-dashboard.html',
    reception:'reception/reception-dashboard.html',
    doctor:'doctors/doctors-dashboard.html',
    nurse:'nurse/nurse-dashboard.html',
    pharmacy:'pharmacy/pharmacy-dashboard.html',
    laboratory:'laboratory/laboratory-dashboard.html',
    accounts:'accounts/accounts-dashboard.html',
    bloodbank:'blood-bank/blood-bank-dashboard.html',
    radiology:'radiology/radiology-dashboard.html',
    hospitaladmin:'admin/admin-dashboard.html',
    superadmin:'admin/admindashboard.html'
  };
  const unavailableRoles={
    recordroom:'Record Room',
    ip:'IP',
    ambulance:'Ambulance'
  };
  const roleIcons={
    patient:'fa-solid fa-user-injured',
    reception:'fa-solid fa-headset',
    doctor:'fa-solid fa-user-doctor',
    nurse:'fa-solid fa-user-nurse',
    pharmacy:'fa-solid fa-pills',
    laboratory:'fa-solid fa-flask-vial',
    recordroom:'fa-solid fa-folder-open',
    ip:'fa-solid fa-bed-pulse',
    ambulance:'fa-solid fa-truck-medical',
    accounts:'fa-solid fa-file-invoice-dollar',
    bloodbank:'fa-solid fa-droplet',
    radiology:'fa-solid fa-x-ray',
    hospitaladmin:'fa-solid fa-hospital-user',
    superadmin:'fa-solid fa-user-shield'
  };
  function notify(msg){ if(!toast) return; toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2200); }
  if(roleSelect){
    roleSelect.addEventListener('click',e=>{roleSelect.classList.toggle('open');});
    document.addEventListener('click',e=>{ if(!roleSelect.contains(e.target)) roleSelect.classList.remove('open'); });
    roleSelect.querySelectorAll('.role-option').forEach(opt=>{
      opt.addEventListener('click',e=>{
        e.stopPropagation();
        roleSelect.querySelectorAll('.role-option').forEach(o=>o.classList.remove('active'));
        opt.classList.add('active');
        hiddenRole.value=opt.dataset.role;
        roleCurrent.textContent=opt.querySelector('span').textContent;
        if(selectedIcon){ selectedIcon.className=(roleIcons[opt.dataset.role]||'fa-solid fa-users')+' role-icon'; }
        roleSelect.classList.remove('open');
      });
    });
  }
  if(toggle&&pass){toggle.addEventListener('click',()=>{pass.type=pass.type==='password'?'text':'password';toggle.innerHTML=pass.type==='password'?'<i class="fa-regular fa-eye-slash"></i>':'<i class="fa-regular fa-eye"></i>';});}
  if(form){form.addEventListener('submit',e=>{e.preventDefault();const role=hiddenRole.value;if(!role){notify('Please select your role');return;}if(unavailableRoles[role]){notify(unavailableRoles[role]+' dashboard is not included in this project yet');return;}notify('Redirecting to '+roleCurrent.textContent+'...');setTimeout(()=>{window.location.href=routes[role]||'login.html';},450);});}
})();
