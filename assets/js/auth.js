(function(){
  const toast=document.querySelector('#toast');
  function show(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}
  document.querySelectorAll('[data-password-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    const input=btn.closest('.input-wrap')?.querySelector('input');
    if(!input)return; input.type=input.type==='password'?'text':'password';
    btn.innerHTML=input.type==='password'?'<i class="fa-regular fa-eye-slash"></i>':'<i class="fa-regular fa-eye"></i>';
  }));
  document.querySelectorAll('[data-next]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault(); const next=form.getAttribute('data-next'); show(form.getAttribute('data-message')||'Processing...'); setTimeout(()=>{window.location.href=next},450);
  }));
  const otpInputs=[...document.querySelectorAll('.code-row input')];
  otpInputs.forEach((inp,i)=>{
    inp.addEventListener('input',()=>{inp.value=inp.value.replace(/\D/g,'').slice(0,1); if(inp.value&&otpInputs[i+1]) otpInputs[i+1].focus();});
    inp.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!inp.value&&otpInputs[i-1]) otpInputs[i-1].focus();});
  });
})();
