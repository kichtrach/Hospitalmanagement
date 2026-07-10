// module specific behaviours can be added here; shared HMS components are loaded from component.js

// PATIENT PAGE BEHAVIOURS
(function(){
  function initPatientPage(){
    const table=document.querySelector('#patientsTable');
    if(!table) return;
    document.querySelectorAll('[data-patient-tabs] button').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('[data-patient-tabs] button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const status=btn.dataset.status.toLowerCase();
        table.querySelectorAll('tbody tr').forEach(tr=>{
          tr.style.display=!status || tr.innerText.toLowerCase().includes(status)?'':'none';
        });
      });
    });
    document.querySelectorAll('.reset-btn').forEach(btn=>btn.addEventListener('click',()=>{
      document.querySelectorAll('.patient-filters input').forEach(i=>i.value='');
      document.querySelectorAll('.patient-filters select').forEach(s=>s.selectedIndex=0);
      document.querySelectorAll('[data-patient-tabs] button').forEach(b=>b.classList.remove('active'));
      document.querySelector('[data-patient-tabs] button')?.classList.add('active');
      table.querySelectorAll('tbody tr').forEach(tr=>tr.style.display='');
    }));
    let menu=document.createElement('div');
    menu.className='patient-more-menu';
    menu.innerHTML='<button type="button"><i class="fa-regular fa-pen-to-square"></i> Edit Patient</button><button type="button"><i class="fa-regular fa-file-lines"></i> View Records</button><button type="button"><i class="fa-regular fa-trash-can"></i> Archive</button>';
    document.body.appendChild(menu);
    menu.style.display='none';
    document.querySelectorAll('.more-btn').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        const r=btn.getBoundingClientRect();
        menu.style.left=Math.max(8,r.right-160)+'px';
        menu.style.top=(r.bottom+6)+'px';
        menu.style.display=menu.style.display==='block'?'none':'block';
      });
    });
    document.addEventListener('click',()=>{menu.style.display='none'});
    document.querySelectorAll('.patient-table tbody tr').forEach(tr=>{
      tr.addEventListener('click',e=>{
        if(e.target.closest('button,input'))return;
        document.querySelectorAll('.patient-table tbody tr').forEach(x=>x.classList.remove('selected-row'));
        tr.classList.add('selected-row');
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPatientPage);else initPatientPage();
})();

// ADD NEW PATIENT WIZARD BEHAVIOURS
(function(){
  function initAddPatientWizard(){
    const page=document.querySelector('.add-patient-page');
    if(!page) return;
    const panels=[...page.querySelectorAll('[data-step-panel]')];
    const steps=[...page.querySelectorAll('[data-go-step]')].filter(x=>x.classList.contains('wizard-step'));
    let current=1;
    function show(step){
      current=Math.max(1,Math.min(7,Number(step)||1));
      panels.forEach(panel=>panel.classList.toggle('active',Number(panel.dataset.stepPanel)===current));
      steps.forEach(btn=>{
        const n=Number(btn.dataset.goStep);
        btn.classList.toggle('active',n===current);
        btn.classList.toggle('done',n<current);
      });
      window.scrollTo({top:0,behavior:'smooth'});
    }
    page.addEventListener('click',function(e){
      const next=e.target.closest('[data-next-step]');
      const prev=e.target.closest('[data-prev-step]');
      const go=e.target.closest('[data-go-step]:not(.wizard-step), .wizard-step');
      const copy=e.target.closest('[data-copy]');
      if(next){e.preventDefault();show(current+1)}
      if(prev){e.preventDefault();show(current-1)}
      if(go && go.dataset.goStep){e.preventDefault();show(go.dataset.goStep)}
      if(copy){navigator.clipboard&&navigator.clipboard.writeText(copy.dataset.copy);copy.innerHTML='<i class="fa-solid fa-check"></i>';setTimeout(()=>copy.innerHTML='<i class="fa-regular fa-copy"></i>',1200)}
    });
    page.querySelectorAll('.drop-zone input[type=file]').forEach(input=>{
      input.addEventListener('change',()=>{
        const card=input.closest('.doc-card');
        const file=input.files&&input.files[0];
        if(file){card.querySelector('.file-row b').textContent=file.name;card.querySelector('.file-row small').textContent=Math.max(.01,file.size/1024/1024).toFixed(2)+' MB';}
      });
    });
    show(1);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAddPatientWizard);else initAddPatientWizard();
})();

// FINAL PHOTO UPLOAD FIX: Add Patient sidebar photo card + document choose buttons
(function(){
  function bytesToMb(size){ return Math.max(0.01, size / 1024 / 1024).toFixed(2) + ' MB'; }
  function initPhotoUpload(){
    document.querySelectorAll('[data-photo-upload]').forEach(function(box){
      if(box.dataset.photoReady === '1') return;
      box.dataset.photoReady = '1';
      var input = box.querySelector('input[type="file"]');
      var button = box.querySelector('.choose-photo-btn, button');
      var preview = box.querySelector('[data-photo-preview]');
      var title = box.querySelector('[data-photo-title]');
      var help = box.querySelector('[data-photo-help]');
      if(!input || !button) return;
      function openPicker(ev){
        ev.preventDefault();
        ev.stopPropagation();
        input.click();
      }
      button.addEventListener('click', openPicker);
      box.addEventListener('click', function(ev){
        if(ev.target === input) return;
        if(ev.target.closest('button')) return;
        openPicker(ev);
      });
      input.addEventListener('change', function(){
        var file = input.files && input.files[0];
        if(!file) return;
        if(title) title.textContent = file.name;
        if(help) help.textContent = bytesToMb(file.size);
        if(preview && file.type && file.type.indexOf('image/') === 0){
          var reader = new FileReader();
          reader.onload = function(e){
            preview.innerHTML = '<img src="' + e.target.result + '" alt="Selected patient photo">';
          };
          reader.readAsDataURL(file);
        }
      });
    });

    document.querySelectorAll('.drop-zone').forEach(function(zone){
      if(zone.dataset.dropReady === '1') return;
      zone.dataset.dropReady = '1';
      var input = zone.querySelector('input[type="file"]');
      var button = zone.querySelector('button');
      if(input && button){
        button.addEventListener('click', function(ev){
          ev.preventDefault();
          ev.stopPropagation();
          input.click();
        });
      }
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPhotoUpload);
  else initPhotoUpload();
})();


// PATIENT ENTRY STEP 2 - document notes counter and safe actions
(function(){
  function initUploadDocumentsStep(){
    var page=document.querySelector('.add-patient-page');
    if(!page) return;
    page.querySelectorAll('.doc-notes-card textarea').forEach(function(area){
      var count=area.closest('.doc-notes-card').querySelector('[data-notes-count]');
      function update(){ if(count) count.textContent=String(area.value.length); }
      area.addEventListener('input',update); update();
    });
    page.querySelectorAll('.upload-file-row .danger, .upload-file-row .delete').forEach(function(btn){
      if(btn.dataset.ready==='1') return;
      btn.dataset.ready='1';
      btn.addEventListener('click',function(ev){
        ev.preventDefault(); ev.stopPropagation();
        var row=btn.closest('.upload-file-row');
        var card=btn.closest('.upload-doc-card');
        var input=card && card.querySelector('input[type="file"]');
        if(input) input.value='';
        if(row){
          var name=row.querySelector('b'); var size=row.querySelector('small');
          if(name) name.textContent='No file selected';
          if(size) size.textContent='--';
        }
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initUploadDocumentsStep);
  else initUploadDocumentsStep();
})();


// Confirm & Save checkbox state control
(function(){
  function initConfirmSaveCheckbox(){
    var page=document.querySelector('.add-patient-page');
    if(!page) return;
    var checkbox=page.querySelector('[data-confirm-review]');
    if(!checkbox) return;
    var panel=checkbox.closest('[data-step-panel]');
    var btn=panel && panel.querySelector('.wizard-actions .btn.primary[data-next-step]');
    if(btn) btn.classList.add('confirm-save-btn');
    function sync(){ if(btn) btn.disabled=!checkbox.checked; }
    checkbox.addEventListener('change',sync);
    sync();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initConfirmSaveCheckbox);
  else initConfirmSaveCheckbox();
})();

// Create Visit / Appointment - Select Doctor dropdown
(function(){
  function initDoctorSelect(){
    var select = document.querySelector('.doctor-select');
    if(!select || select.dataset.doctorReady === '1') return;
    select.dataset.doctorReady = '1';
    select.setAttribute('tabindex','0');
    select.setAttribute('role','button');
    select.setAttribute('aria-haspopup','listbox');
    select.setAttribute('aria-expanded','false');

    var doctors = [
      {name:'Dr. Suresh', dept:'Cardiologist', qual:'MBBS, MD (Cardiology)', status:'Available', img:'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80'},
      {name:'Dr. Meera Nair', dept:'General Physician', qual:'MBBS, MD (General Medicine)', status:'Available', img:'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=120&q=80'},
      {name:'Dr. Arun Kumar', dept:'Orthopedics', qual:'MBBS, MS (Ortho)', status:'Available', img:'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'},
      {name:'Dr. Priya Menon', dept:'Pediatrics', qual:'MBBS, DCH', status:'Busy', img:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80'}
    ];

    var menu = document.createElement('div');
    menu.className = 'doctor-select-menu';
    menu.setAttribute('role','listbox');
    menu.innerHTML = doctors.map(function(d,i){
      return '<button type="button" role="option" data-doctor-index="'+i+'">'
        + '<img src="'+d.img+'" alt="'+d.name+'">'
        + '<span><b>'+d.name+' ('+d.dept+')</b><small>'+d.qual+'</small></span>'
        + '<em class="'+(d.status.toLowerCase()==='busy'?'busy':'')+'">'+d.status+'</em>'
        + '</button>';
    }).join('');
    select.insertAdjacentElement('afterend', menu);

    function close(){
      select.classList.remove('open');
      menu.classList.remove('show');
      select.setAttribute('aria-expanded','false');
    }
    function open(){
      select.classList.add('open');
      menu.classList.add('show');
      select.setAttribute('aria-expanded','true');
    }
    function toggle(ev){
      ev.preventDefault();
      ev.stopPropagation();
      menu.classList.contains('show') ? close() : open();
    }
    function setDoctor(d){
      var img = select.querySelector('img');
      var name = select.querySelector('b');
      var qual = select.querySelector('span');
      var status = select.querySelector('em');
      if(img) img.src = d.img;
      if(name) name.textContent = d.name + ' (' + d.dept + ')';
      if(qual) qual.textContent = d.qual;
      if(status){
        status.textContent = d.status;
        status.classList.toggle('busy', d.status.toLowerCase()==='busy');
      }
      document.querySelectorAll('.appointment-summary p').forEach(function(row){
        var label = row.querySelector('span');
        var value = row.querySelector('b');
        if(label && value && label.textContent.trim() === 'Doctor') value.textContent = d.name + ' (' + d.dept + ')';
      });
      close();
    }

    select.addEventListener('click', toggle);
    select.addEventListener('keydown', function(ev){
      if(ev.key === 'Enter' || ev.key === ' '){ toggle(ev); }
      if(ev.key === 'Escape') close();
    });
    menu.querySelectorAll('button').forEach(function(btn){
      btn.addEventListener('click', function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        setDoctor(doctors[Number(btn.dataset.doctorIndex)]);
      });
    });
    document.addEventListener('click', function(ev){
      if(!select.contains(ev.target) && !menu.contains(ev.target)) close();
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDoctorSelect);
  else initDoctorSelect();
})();

// ADMIN APPOINTMENTS PAGE BEHAVIOUR
(function(){
  function initAppointmentsPage(){
    var page=document.querySelector('.appointment-page');
    var table=document.querySelector('#appointmentsTable');
    if(!page || !table) return;
    page.querySelectorAll('[data-appt-tabs] button').forEach(function(btn){
      btn.addEventListener('click',function(){
        page.querySelectorAll('[data-appt-tabs] button').forEach(function(x){x.classList.remove('active')});
        btn.classList.add('active');
        var term=(btn.dataset.apptTab||'').toLowerCase();
        table.querySelectorAll('tbody tr').forEach(function(tr){
          tr.style.display=!term || tr.innerText.toLowerCase().indexOf(term)>-1 ? '' : 'none';
        });
      });
    });
    page.querySelectorAll('.calendar-mini button').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(!/^\d+$/.test(btn.textContent.trim())) return;
        page.querySelectorAll('.calendar-mini button').forEach(function(x){x.classList.remove('active')});
        btn.classList.add('active');
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAppointmentsPage); else initAppointmentsPage();
})();

// ===== Admin appointments polish patch v2 =====
(function(){
  function qsa(sel,root){return Array.from((root||document).querySelectorAll(sel));}
  document.addEventListener('DOMContentLoaded',function(){
    var body=document.body;
    qsa('.hamb').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(window.innerWidth<=900){document.querySelector('.sidebar')?.classList.toggle('open');}
        else{body.classList.toggle('sidebar-collapsed');}
      });
    });
    qsa('.collapse-menu').forEach(function(btn){btn.addEventListener('click',function(){body.classList.toggle('sidebar-collapsed');});});
    qsa('[data-appt-tabs] button').forEach(function(btn){
      btn.addEventListener('click',function(){
        var wrap=btn.closest('[data-appt-tabs]');
        qsa('button',wrap).forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
        var term=(btn.dataset.apptTab||'').toLowerCase();
        var rows=qsa('#appointmentsTable tbody tr');
        rows.forEach(function(row){
          row.style.display = !term || row.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
      });
    });
    qsa('select[data-filter]').forEach(function(sel){
      sel.addEventListener('change',function(){
        var table=document.querySelector(sel.dataset.filter); if(!table) return;
        var filters=qsa('select[data-filter="'+sel.dataset.filter+'"]');
        qsa('tbody tr',table).forEach(function(row){
          var txt=row.textContent.toLowerCase();
          var ok=filters.every(function(f){return !f.value || txt.includes(f.value.toLowerCase());});
          row.style.display=ok?'':'none';
        });
      });
    });
    qsa('[data-search-table]').forEach(function(inp){
      inp.addEventListener('input',function(){
        var table=document.querySelector(inp.dataset.searchTable); if(!table) return;
        var v=inp.value.trim().toLowerCase();
        qsa('tbody tr',table).forEach(function(row){row.style.display=!v || row.textContent.toLowerCase().includes(v)?'':'none';});
      });
    });
    qsa('.mini-head button').forEach(function(btn){
      btn.addEventListener('click',function(){
        var title=btn.closest('.calendar-mini')?.querySelector('.mini-head strong');
        if(!title) return;
        title.textContent = title.textContent.trim()==='May 2025' ? 'June 2025' : 'May 2025';
      });
    });
    qsa('.mini-grid button').forEach(function(btn){
      btn.addEventListener('click',function(){
        qsa('.mini-grid button').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
      });
    });
    document.addEventListener('click',function(e){
      var open=e.target.closest('[data-modal-open]');
      if(open){var m=document.querySelector(open.dataset.modalOpen); if(m) m.classList.add('show');}
      if(e.target.matches('[data-modal-close]') || e.target.classList.contains('modal')){e.target.closest('.modal')?.classList.remove('show');}
      var more=e.target.closest('.more-btn');
      qsa('.row-menu').forEach(function(m){m.remove();});
      if(more){
        e.preventDefault();
        var menu=document.createElement('div');
        menu.className='row-menu';
        menu.innerHTML='<button>Reschedule</button><button>Mark completed</button><button>Cancel appointment</button>';
        Object.assign(menu.style,{position:'absolute',background:'#fff',border:'1px solid #E6EAF2',borderRadius:'3px',boxShadow:'0 10px 24px rgba(16,24,40,.12)',padding:'6px',zIndex:99});
        menu.querySelectorAll('button').forEach(function(b){Object.assign(b.style,{display:'block',width:'150px',height:'34px',border:'0',background:'#fff',textAlign:'left',color:'#07145A',fontWeight:'700',padding:'0 10px'});});
        document.body.appendChild(menu);
        var r=more.getBoundingClientRect(); menu.style.left=(r.left-118+window.scrollX)+'px'; menu.style.top=(r.bottom+6+window.scrollY)+'px';
      }
    });
  });
})();

// Appointment page fixes: date filter calendar + icon action menu
(function(){
  function qs(sel,root){return (root||document).querySelector(sel)}
  function qsa(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel))}
  var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function removePopovers(){qsa('.appointment-date-popover').forEach(function(p){p.remove();});}
  function buildCalendar(anchor){
    removePopovers();
    var pop=document.createElement('div');
    pop.className='appointment-date-popover';
    pop.innerHTML='<div class="date-pop-head"><button type="button" class="prev"><i class="fa-solid fa-angle-left"></i></button><strong>May 2025</strong><button type="button" class="next"><i class="fa-solid fa-angle-right"></i></button></div><div class="date-pop-week"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div class="date-pop-grid"></div><div class="date-pop-actions"><button type="button" class="clear">Clear</button><button type="button" class="apply">Apply</button></div>';
    document.body.appendChild(pop);
    var state={month:4,year:2025,day:24};
    function render(){
      qs('.date-pop-head strong',pop).textContent=months[state.month]+' '+state.year;
      var grid=qs('.date-pop-grid',pop); grid.innerHTML='';
      var first=new Date(state.year,state.month,1).getDay();
      var days=new Date(state.year,state.month+1,0).getDate();
      for(var i=0;i<first;i++){var blank=document.createElement('span');grid.appendChild(blank)}
      for(var d=1;d<=days;d++){
        var b=document.createElement('button'); b.type='button'; b.textContent=d;
        if(d===state.day) b.className='active';
        b.addEventListener('click',function(){state.day=Number(this.textContent);render();});
        grid.appendChild(b);
      }
    }
    render();
    qs('.prev',pop).addEventListener('click',function(){state.month--;if(state.month<0){state.month=11;state.year--;}render();});
    qs('.next',pop).addEventListener('click',function(){state.month++;if(state.month>11){state.month=0;state.year++;}render();});
    qs('.clear',pop).addEventListener('click',function(){anchor.innerHTML='Select date <i class="fa-regular fa-calendar-days"></i>';removePopovers();});
    qs('.apply',pop).addEventListener('click',function(){var dd=String(state.day).padStart(2,'0'), mm=String(state.month+1).padStart(2,'0');anchor.innerHTML=dd+'/'+mm+'/'+state.year+' - '+dd+'/'+mm+'/'+state.year+' <i class="fa-regular fa-calendar-days"></i>';removePopovers();});
    var r=anchor.getBoundingClientRect();
    pop.style.left=(r.left+window.scrollX)+'px';
    pop.style.top=(r.bottom+8+window.scrollY)+'px';
  }
  function init(){
    qsa('.date-filter-btn').forEach(function(btn){
      btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();buildCalendar(btn);});
    });
    document.addEventListener('click',function(e){
      if(!e.target.closest('.appointment-date-popover') && !e.target.closest('.date-filter-btn')) removePopovers();
    });
    document.addEventListener('click',function(e){
      var more=e.target.closest('.more-btn');
      qsa('.row-menu').forEach(function(m){m.remove();});
      if(!more) return;
      e.preventDefault(); e.stopPropagation();
      var menu=document.createElement('div');
      menu.className='row-menu';
      menu.innerHTML='<button type="button"><i class="fa-regular fa-calendar-plus"></i><span>Reschedule</span></button><button type="button"><i class="fa-regular fa-circle-check"></i><span>Mark completed</span></button><button type="button"><i class="fa-regular fa-circle-xmark"></i><span>Cancel appointment</span></button>';
      Object.assign(menu.style,{position:'absolute',background:'#fff',border:'1px solid #E6EAF2',borderRadius:'3px',boxShadow:'0 10px 24px rgba(16,24,40,.12)',zIndex:200});
      document.body.appendChild(menu);
      var r=more.getBoundingClientRect();
      menu.style.left=Math.max(8,(r.right-176+window.scrollX))+'px';
      menu.style.top=(r.bottom+6+window.scrollY)+'px';
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
