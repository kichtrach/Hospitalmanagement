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
    admin:'admindashboard.html',
    doctor:'doctors/doctors-dashboard.html',
    nurse:'nurse/nurse-dashboard.html',
    reception:'reception/reception-dashboard.html',
    pharmacy:'pharmacy/pharmacy-dashboard.html',
    bloodbank:'blood-bank/blood-bank-dashboard.html',
    patient:'patient/patient-dashboard.html',
    laboratory:'laboratory/laboratory-dashboard.html',
    radiology:'radiology/radiology-dashboard.html'
  };
  const roleIcons={
    admin:'fa-solid fa-user-tie',
    doctor:'fa-solid fa-user-doctor',
    nurse:'fa-solid fa-user-nurse',
    reception:'fa-solid fa-headset',
    pharmacy:'fa-solid fa-pills',
    bloodbank:'fa-solid fa-droplet',
    laboratory:'fa-solid fa-flask-vial',
    radiology:'fa-solid fa-x-ray',
    patient:'fa-solid fa-user-injured'
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
  if(form){form.addEventListener('submit',e=>{e.preventDefault();const role=hiddenRole.value;if(!role){notify('Please select your role');return;}notify('Redirecting to '+roleCurrent.textContent+'...');setTimeout(()=>{window.location.href=routes[role]||'admindashboard.html';},450);});}
})();
