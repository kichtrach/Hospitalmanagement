(() => {
  if (document.body.dataset.rolePage !== 'index') return;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const modules = [
    ['Dashboard', 'Overview and analytics dashboard', 'fa-house', 'reports'],
    ['Appointments', 'Manage appointments and schedules', 'fa-calendar-days', 'clinical'],
    ['Patients', 'Patient registration and management', 'fa-user', 'clinical'],
    ['Doctors & Staff', 'View doctors and hospital staff', 'fa-user-doctor', 'clinical'],
    ['Departments', 'View departments and services', 'fa-building', 'clinical'],
    ['Consultation Rooms', 'View room availability and schedules', 'fa-door-open', 'clinical'],
    ['Services & Procedures', 'View available services and procedures', 'fa-list-check', 'clinical'],
    ['Queue Management', 'Manage patient tokens and front-desk queue', 'fa-sliders', 'clinical'],
    ['Billing & Invoices', 'Create and view patient invoices', 'fa-file-invoice', 'billing'],
    ['Payments', 'Record and view payment transactions', 'fa-credit-card', 'billing'],
    ['Refunds', 'View refund requests and status', 'fa-rotate-left', 'billing'],
    ['Reports & Analytics', 'View and export reception reports', 'fa-chart-simple', 'reports']
  ];

  const profiles = {
    Administrator: {
      badge: 'Super Admin', code: 'ADMIN001', type: 'System Role', status: 'Active',
      description: 'Full access to all modules and settings.', users: [12, 11, 1],
      permissions: modules.map(() => [1, 1, 1, 1, 1]),
      people: [
        ['Ramesh Kumar','ramesh.kumar@hospital.com','EMP1001','Administration','Active',12],
        ['Priya Sharma','priya.sharma@hospital.com','EMP1002','Administration','Active',13],
        ['Arun Patel','arun.patel@hospital.com','EMP1003','Operations','Active',14]
      ],
      audit: [
        ['fa-shield-halved','Permissions updated','Module permissions were updated by Dr. Rajesh Kumar.','10 Jul 2026','10:45 AM'],
        ['fa-user-plus','User assigned','Ramesh Kumar was assigned to Administrator.','09 Jul 2026','03:20 PM'],
        ['fa-circle-plus','Role created','Administrator role was created by Super Admin.','08 Jul 2026','09:15 AM']
      ]
    },
    Receptionist: {
      badge: 'Front Desk', code: 'RECEP001', type: 'System Role', status: 'Active',
      description: 'Manage front desk operations, appointments, patient registration, queue, billing and payments.',
      users: [12, 11, 1],
      permissions: [
        [1,0,0,0,0], [1,1,1,1,1], [1,1,1,0,1], [1,0,0,0,0],
        [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,1,1,1,1],
        [1,1,1,0,1], [1,1,0,0,1], [1,0,0,0,0], [1,0,0,0,1]
      ],
      people: [
        ['Anita Joseph','anita.joseph@hospital.com','EMP1042','Reception','Active',21],
        ['Priya Sharma','priya.sharma@hospital.com','EMP1002','Reception','Active',13],
        ['Lekha S','lekha.s@hospital.com','EMP1188','Reception','Active',44]
      ],
      audit: [
        ['fa-calendar-check','Appointment permission updated','Create, reschedule and cancel appointment permissions were enabled.','11 Jul 2026','04:15 PM'],
        ['fa-user-plus','Users assigned','Anita Joseph and Lekha S were assigned to Receptionist.','10 Jul 2026','02:35 PM'],
        ['fa-file-invoice-dollar','Billing access updated','Invoice creation and payment collection access was granted.','09 Jul 2026','11:10 AM'],
        ['fa-circle-plus','Role created','Receptionist role was created by Dr. Rajesh Kumar.','08 Jul 2026','10:30 AM']
      ]
    }
  };

  let currentRole = 'Administrator';
  let permissionState = profiles.Administrator.permissions.map(r => [...r]);
  let permissionSnapshot = JSON.stringify(permissionState);

  const genericProfile = name => ({
    badge: 'Standard Role', code: name.toUpperCase().replace(/\W/g,'').slice(0,6) + '001', type: 'System Role', status: 'Active',
    description: `${name} role permissions and user access.`, users: [0,0,0],
    permissions: modules.map((_,i) => i < 3 ? [1,0,0,0,0] : [0,0,0,0,0]),
    people: [], audit: [['fa-circle-info','No recent changes',`No audit activity is available for ${name}.`,'—','—']]
  });
  const getProfile = name => profiles[name] || genericProfile(name);

  function renderPermissions() {
    const box = $('#permissionRows'); if (!box) return;
    const q = ($('#moduleSearch')?.value || '').trim().toLowerCase();
    const filter = $('#moduleFilter')?.value || 'all';
    box.innerHTML = '';
    modules.forEach((m, i) => {
      if ((filter !== 'all' && m[3] !== filter) || !(m[0] + ' ' + m[1]).toLowerCase().includes(q)) return;
      const row = document.createElement('div');
      row.className = 'permission-row';
      row.innerHTML = `<div class="permission-main permission-grid"><div class="module-name"><span class="module-icon"><i class="fa-solid ${m[2]}"></i></span><span><b>${m[0]}</b><small>${m[1]}</small></span></div>${permissionState[i].map((v,j)=>`<label class="permission-check"><input type="checkbox" data-rp-i="${i}" data-rp-j="${j}" ${v?'checked':''}></label>`).join('')}<button class="row-toggle" type="button"><i class="fa-solid fa-chevron-right"></i></button></div><div class="permission-children">Advanced ${m[0]} permissions for the ${currentRole} role.</div>`;
      $('.row-toggle', row).addEventListener('click', () => {
        row.classList.toggle('expanded');
        $('.row-toggle i', row).className = 'fa-solid ' + (row.classList.contains('expanded') ? 'fa-chevron-down' : 'fa-chevron-right');
      });
      $$('[data-rp-i]', row).forEach(input => input.addEventListener('change', () => {
        permissionState[+input.dataset.rpI][+input.dataset.rpJ] = input.checked ? 1 : 0;
        updateCounts();
      }));
      box.appendChild(row);
    });
    updateCounts();
  }

  function updateCounts() {
    const total = permissionState.flat().length;
    const granted = permissionState.flat().filter(Boolean).length;
    $('#totalModulesCount').textContent = modules.length;
    $('#grantedCount').textContent = granted;
    $('#deniedCount').textContent = total - granted;
  }

  function updateAssignment(profile) {
    $('#assignedUsersCount').textContent = profile.users[0];
    $('#activeUsersCount').textContent = profile.users[1];
    $('#inactiveUsersCount').textContent = profile.users[2];
    const rows = $$('.assignment-row:not(.assignment-header)', $('#assignmentTable'));
    rows.forEach((row, i) => {
      const p = profile.people[i];
      row.style.display = p ? 'grid' : 'none';
      if (!p) return;
      const user = $('.assigned-user', row), img = $('img', user), b = $('b', user), small = $('small', user);
      img.src = `https://i.pravatar.cc/80?img=${p[5]}`;
      b.childNodes[0].textContent = p[0]; small.textContent = p[1];
      const cells = row.querySelectorAll(':scope > span');
      cells[1].textContent = p[2]; cells[2].textContent = p[3];
      const status = $('.status', row); status.textContent = p[4]; status.className = 'status ' + p[4].toLowerCase();
    });
    $('#assignModalTitle').textContent = `Assign Users to ${currentRole}`;
    $('#assignModalRole').textContent = currentRole;
  }

  function updateDetails(profile) {
    $('#detailRoleName').value = currentRole;
    $('#detailRoleCode').value = profile.code;
    $('#detailRoleType').value = profile.type;
    $('#detailRoleStatus').value = profile.status;
    $('#detailRoleDescription').value = profile.description;
  }

  function updateAudit(profile) {
    $('#roleAuditTable').innerHTML = profile.audit.map(a => `<div class="audit-log"><span class="audit-icon"><i class="fa-solid ${a[0]}"></i></span><span><b>${a[1]}</b><small>${a[2]}</small></span><time>${a[3]}<br><small>${a[4]}</small></time></div>`).join('');
  }

  function selectRole(name) {
    currentRole = name;
    const profile = getProfile(name);
    permissionState = profile.permissions.map(r => [...r]);
    permissionSnapshot = JSON.stringify(permissionState);
    $('#selectedRoleName').textContent = name;
    $('#selectedRoleDescription').textContent = profile.description;
    $('#selectedRoleBadge').textContent = profile.badge;
    updateAssignment(profile); updateDetails(profile); updateAudit(profile); renderPermissions();
  }

  // Remove the old module filter listeners by replacing controls with clean clones.
  ['moduleSearch','moduleFilter'].forEach(id => {
    const old = $('#' + id); if (!old) return;
    const fresh = old.cloneNode(true); old.replaceWith(fresh);
  });
  $('#moduleSearch').addEventListener('input', renderPermissions);
  $('#moduleFilter').addEventListener('change', renderPermissions);

  $('#rolesList').addEventListener('click', e => {
    const item = e.target.closest('.role-item'); if (!item) return;
    const name = $('.role-copy b', item)?.textContent.trim();
    if (name) setTimeout(() => selectRole(name), 0);
  });

  $('#expandAll').addEventListener('click', () => $$('.permission-row').forEach(r => { r.classList.add('expanded'); const i=$('.row-toggle i',r); if(i)i.className='fa-solid fa-chevron-down'; }));
  $('#collapseAll').addEventListener('click', () => $$('.permission-row').forEach(r => { r.classList.remove('expanded'); const i=$('.row-toggle i',r); if(i)i.className='fa-solid fa-chevron-right'; }));
  $('#saveChanges').addEventListener('click', () => { permissionSnapshot = JSON.stringify(permissionState); });
  $('#resetChanges').addEventListener('click', () => { permissionState = JSON.parse(permissionSnapshot); renderPermissions(); });
  $('#assignUsersBtn').addEventListener('click', () => {
    $('#assignModalTitle').textContent = `Assign Users to ${currentRole}`;
    $('#assignModalRole').textContent = currentRole;
  }, true);
  $('#editRoleDetails').addEventListener('click', () => {
    $$('#detailsPane input, #detailsPane textarea, #detailsPane select').forEach(el => el.disabled = false);
    $('#detailRoleName').focus();
  });

  selectRole('Administrator');
})();
