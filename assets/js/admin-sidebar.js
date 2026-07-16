(function(){
  'use strict';
  const links=[
    ['MAIN'],
    ['admin-dashboard.html','Dashboard','fa-solid fa-house',['admindashboard.html']],
    ['admin-appointments.html','Appointments','fa-solid fa-calendar-check'],
    ['admin-patients.html','Patients','fa-solid fa-user-injured',['admin-add-patient.html']],
    ['admin-doctors-staff.html','Doctors & Staff','fa-solid fa-user-doctor'],
    ['admin-departments.html','Departments','fa-solid fa-hospital'],
    ['admin-consultation-rooms.html','Consultation Rooms','fa-solid fa-door-open'],
    ['admin-services-procedures.html','Services & Procedures','fa-solid fa-list-check'],
    ['admin-queue-management.html','Queue Management','fa-solid fa-sliders'],
    ['BILLING & PAYMENTS'],
    ['admin-billing-invoices.html','Billing & Invoices','fa-solid fa-file-invoice'],
    ['admin-payments.html','Payments','fa-solid fa-credit-card'],
    ['admin-refunds.html','Refunds','fa-solid fa-rotate-left'],
    ['admin-insurance.html','Insurance','fa-solid fa-shield-heart'],
    ['INVENTORY'],
    ['admin-medicine-inventory.html','Medicine Inventory','fa-solid fa-capsules'],
    ['admin-purchase-orders.html','Purchase Orders','fa-solid fa-cart-shopping'],
    ['admin-stock-management.html','Stock Management','fa-solid fa-boxes-stacked'],
    ['admin-expiry-management.html','Expiry Management','fa-solid fa-calendar-xmark'],
    ['REPORTS & SETTINGS'],
    ['admin-reports-analytics.html','Reports & Analytics','fa-solid fa-chart-column'],
    ['admin-hospital-settings.html','Hospital Settings','fa-solid fa-gear'],
    ['admin-system-users.html','System Users','fa-solid fa-users-gear'],
    ['admin-role-permission.html','Role & Permission','fa-solid fa-shield-halved',['admin-add-role.html','admin-add-role-step1.html','admin-add-role-step2.html','admin-add-role-step3.html','admin-add-role-step4.html','admin-role-success.html']],
    ['admin-activity-logs.html','Activity Logs','fa-solid fa-clock-rotate-left']
  ];
  function currentFile(){return (location.pathname.split('/').pop()||'admin-dashboard.html').toLowerCase()}
  function isCommon(){return /\/common\//.test(location.pathname.replace(/\\/g,'/'))}
  function adminHref(file){return isCommon()?'../admin/'+file:file}
  function assetHref(path){return isCommon()?'../assets/'+path:'../assets/'+path}
  function active(item,file,requested){
    if(requested && requested.toLowerCase()===item[0].toLowerCase()) return true;
    if(file===item[0].toLowerCase()) return true;
    return Array.isArray(item[3])&&item[3].map(v=>v.toLowerCase()).includes(file);
  }
  function render(sidebar){
    const file=currentFile();
    const requested=(sidebar.dataset.active||'').trim();
    let nav='';
    links.forEach(item=>{
      if(item.length===1){nav+='<div class="admin-sidebar__section">'+item[0]+'</div>';return;}
      const on=active(item,file,requested);
      nav+='<a class="nav-link'+(on?' active':'')+'" href="'+adminHref(item[0])+'"'+(on?' aria-current="page"':'')+'><i class="'+item[2]+'" aria-hidden="true"></i><span>'+item[1]+'</span></a>';
    });
    const uiActive=file==='ui-components.html'||requested==='ui-components.html';
    sidebar.innerHTML='<div class="admin-sidebar__brand"><img src="'+assetHref('images/medicare-logo-white.png')+'" alt="MediCare+ Hospital Management System"></div><nav class="admin-sidebar__nav" aria-label="Admin navigation">'+nav+'</nav><div class="admin-sidebar__footer"><a class="nav-link'+(uiActive?' active':'')+'" href="'+(isCommon()?'ui-components.html':'../common/ui-components.html')+'"><i class="fa-solid fa-layer-group"></i><span>UI Components</span></a><a class="nav-link'+((file==='admin-help-support.html'||requested==='admin-help-support.html')?' active':'')+'" href="'+adminHref('admin-help-support.html')+'"><i class="fa-regular fa-circle-question"></i><span>Help & Support</span></a><a class="nav-link logout-nav" href="'+(isCommon()?'../login.html':'../login.html')+'"><i class="fa-solid fa-arrow-right-from-bracket"></i><span>Logout</span></a></div>';
  }
  function init(){
    document.querySelectorAll('[data-admin-sidebar]').forEach(render);
    if(!document.querySelector('.admin-sidebar-overlay')){const o=document.createElement('div');o.className='admin-sidebar-overlay';document.body.appendChild(o);o.addEventListener('click',()=>{document.body.classList.remove('sidebar-open');document.querySelector('[data-admin-sidebar]')?.classList.remove('open');o.classList.remove('show')})}
    document.querySelectorAll('.hamb,.hamburger,.menu-toggle,[data-sidebar-toggle]').forEach(btn=>btn.addEventListener('click',()=>{if(innerWidth<=900){const s=document.querySelector('[data-admin-sidebar]'),o=document.querySelector('.admin-sidebar-overlay');s?.classList.toggle('open');document.body.classList.toggle('sidebar-open');o?.classList.toggle('show')} }));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
