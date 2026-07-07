
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.toggle-password').forEach(btn=>btn.addEventListener('click',()=>{const input=btn.closest('.input-box').querySelector('input');input.type=input.type==='password'?'text':'password';btn.querySelector('i').className=input.type==='password'?'fa-regular fa-eye':'fa-regular fa-eye-slash';}));
  document.querySelectorAll('.get-otp').forEach(btn=>btn.addEventListener('click',()=>{let t=59;const box=btn.closest('.input-box');let timer=document.querySelector('.otp-timer'); if(!timer){timer=document.createElement('span');timer.className='otp-timer';box.appendChild(timer)} btn.textContent='Resend';timer.textContent='00:59';const id=setInterval(()=>{t--;timer.textContent='00:'+String(t).padStart(2,'0'); if(t<=0){clearInterval(id);timer.textContent='';btn.textContent='Get OTP'}},1000);toast('OTP sent successfully');}));
  document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault(); const target=f.dataset.target||'patient-dashboard.html'; toast('Login successful'); setTimeout(()=>location.href=target,500);}));
  function toast(msg){let el=document.querySelector('.toast'); if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el)} el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
});
