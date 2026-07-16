(function () {
  'use strict';

  const BUTTON_SELECTOR = '.hamb, .hamburger, .menu-toggle, #hamb, #sidebarToggle, #menuToggle, [data-sidebar-toggle]';
  const SIDEBAR_SELECTOR = '.sidebar, .role-sidebar, [data-admin-sidebar]';
  const MOBILE_BREAKPOINT = 900;

  function getSidebar() {
    return document.querySelector(SIDEBAR_SELECTOR);
  }

  function ensureOverlay() {
    let overlay = document.querySelector('.hms-sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('button');
      overlay.type = 'button';
      overlay.className = 'hms-sidebar-overlay';
      overlay.setAttribute('aria-label', 'Close navigation');
      document.body.appendChild(overlay);
      overlay.addEventListener('click', closeMobileSidebar);
    }
    return overlay;
  }

  function setExpanded(expanded) {
    document.querySelectorAll(BUTTON_SELECTOR).forEach(function (button) {
      button.setAttribute('aria-expanded', String(expanded));
    });
  }

  function openMobileSidebar() {
    const sidebar = getSidebar();
    if (!sidebar) return;
    document.body.classList.add('hms-sidebar-open', 'sidebar-open');
    sidebar.classList.add('open', 'mobile-open');
    ensureOverlay().classList.add('show');
    setExpanded(true);
  }

  function closeMobileSidebar() {
    const sidebar = getSidebar();
    document.body.classList.remove('hms-sidebar-open', 'sidebar-open');
    sidebar && sidebar.classList.remove('open', 'mobile-open');
    const overlay = document.querySelector('.hms-sidebar-overlay');
    overlay && overlay.classList.remove('show');
    setExpanded(false);
  }


  const FONT_ROOT_SELECTOR = [
    '.main', '.main-content', '.main-area', '.page-main', '.dashboard-main',
    '.module-main', '.content-wrapper', '.page-wrapper', '.content-area',
    '.app-main', '.pharmacy-main', '.doctor-main', '.nurse-main',
    '.patient-main', '.reception-main', '.laboratory-main', '.accounts-main',
    '.radiology-main', '.blood-bank-main', '.al-main', '.topbar', '.top-bar',
    '.header', '.app-header'
  ].join(',');

  const FONT_TARGET_SELECTOR = [
    'h1','h2','h3','h4','h5','h6','p','label','legend','small','strong','span',
    'button','a','input','select','textarea','th','td','dt','dd','li',
    '.btn','.button','.page-title','.page-subtitle','.section-title','.section-subtitle',
    '.card-title','.card-subtitle','.kpi-title','.kpi-label','.kpi-value','.kpi-number',
    '.kpi-description','.tab','.tab-btn','.nav-tab','.badge','.status-badge','.pill',
    '.tag','.pagination','.page-size','.dropdown-item','.select-option','.drawer-title',
    '.drawer-section-title','.drawer-label','.drawer-value','.modal-title','.modal-subtitle'
  ].join(',');

  let fontObserver = null;

  function isInsideSidebar(element) {
    return !!element.closest(SIDEBAR_SELECTOR + ', .hms-sidebar-overlay');
  }

  function applyFontBoost() {
    const roots = Array.from(document.querySelectorAll(FONT_ROOT_SELECTOR));
    const targets = [];
    roots.forEach(function (root) {
      if (isInsideSidebar(root)) return;
      if (root.matches(FONT_TARGET_SELECTOR)) targets.push(root);
      root.querySelectorAll(FONT_TARGET_SELECTOR).forEach(function (element) {
        if (!isInsideSidebar(element) && !element.matches('i,svg,path,.fa,.fa-solid,.fa-regular,.fa-brands')) {
          targets.push(element);
        }
      });
    });

    const uniqueTargets = Array.from(new Set(targets)).filter(function (element) {
      return !element.hasAttribute('data-hms-font-boosted');
    });

    /* Read every computed size before writing any style, preventing nested
       elements from receiving an accidental compounded increase. */
    const sizes = uniqueTargets.map(function (element) {
      return parseFloat(window.getComputedStyle(element).fontSize || '0');
    });

    uniqueTargets.forEach(function (element, index) {
      const size = sizes[index];
      if (!Number.isFinite(size) || size <= 0) return;
      element.dataset.hmsFontOriginalInline = element.style.fontSize || '';
      element.dataset.hmsFontBoosted = '1';
      element.style.setProperty('font-size', (size + 2) + 'px', 'important');
    });
    document.body.classList.add('hms-font-boost-active');
  }

  function removeFontBoost() {
    document.querySelectorAll('[data-hms-font-boosted="1"]').forEach(function (element) {
      const original = element.dataset.hmsFontOriginalInline || '';
      if (original) element.style.fontSize = original;
      else element.style.removeProperty('font-size');
      delete element.dataset.hmsFontOriginalInline;
      delete element.dataset.hmsFontBoosted;
    });
    document.body.classList.remove('hms-font-boost-active');
    if (fontObserver) {
      fontObserver.disconnect();
      fontObserver = null;
    }
  }

  function syncFontBoost(collapsed) {
    removeFontBoost();
    if (!collapsed || window.innerWidth <= MOBILE_BREAKPOINT) return;
    applyFontBoost();
    fontObserver = new MutationObserver(function () {
      window.requestAnimationFrame(applyFontBoost);
    });
    fontObserver.observe(document.body, { childList: true, subtree: true });
  }

  function toggleDesktopSidebar() {
    const collapsed = document.body.classList.toggle('hms-sidebar-collapsed');
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    const sidebar = getSidebar();
    if (sidebar) sidebar.classList.toggle('collapsed', collapsed);
    try { localStorage.setItem('hmsSidebarCollapsed', collapsed ? '1' : '0'); } catch (_) {}
    setExpanded(!collapsed);
    syncFontBoost(collapsed);
    window.dispatchEvent(new Event('resize'));
  }

  function toggleSidebar() {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      if (document.body.classList.contains('hms-sidebar-open')) closeMobileSidebar();
      else openMobileSidebar();
    } else {
      closeMobileSidebar();
      toggleDesktopSidebar();
    }
  }

  function restoreDesktopState() {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return;
    let collapsed = false;
    try { collapsed = localStorage.getItem('hmsSidebarCollapsed') === '1'; } catch (_) {}
    document.body.classList.toggle('hms-sidebar-collapsed', collapsed);
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    const sidebar = getSidebar();
    if (sidebar) sidebar.classList.toggle('collapsed', collapsed);
    setExpanded(!collapsed);
    syncFontBoost(collapsed);
  }

  // Capture phase prevents older page-specific hamburger handlers from firing twice.
  document.addEventListener('click', function (event) {
    const button = event.target.closest(BUTTON_SELECTOR);
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    toggleSidebar();
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMobileSidebar();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      closeMobileSidebar();
      restoreDesktopState();
    }
  });

  function init() {
    ensureOverlay();
    document.querySelectorAll(BUTTON_SELECTOR).forEach(function (button) {
      button.setAttribute('aria-controls', 'hms-sidebar');
      button.setAttribute('aria-expanded', 'true');
      if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', 'Toggle navigation');
    });
    const sidebar = getSidebar();
    if (sidebar && !sidebar.id) sidebar.id = 'hms-sidebar';
    restoreDesktopState();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
