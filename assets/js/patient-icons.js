(function(){
  const icons={
    'fa-house':'<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V21h14V10.5"/><path d="M9 21v-6h6v6"/>',
    'fa-calendar-check':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 9h18"/><path d="m9 15 2 2 4-4"/>',
    'fa-calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 9h18"/>',
    'fa-calendar-plus':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 9h18M12 13v5M9.5 15.5h5"/>',
    'fa-ticket':'<path d="M3 7a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4Z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
    'fa-file-lines':'<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/>',
    'fa-pen-to-square':'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/><path d="M15 5l3 3"/>',
    'fa-flask':'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>',
    'fa-credit-card':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
    'fa-wallet':'<path d="M4 6h14a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12"/><path d="M15 12h6v4h-6a2 2 0 0 1 0-4Z"/>',
    'fa-user':'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    'fa-users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    'fa-bell':'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    'fa-circle-question':'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.35-1 1-1 1.7M12 17h.01"/>',
    'fa-gear':'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-3v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 5 15.4a1.7 1.7 0 0 0-1.55-1H3v-3h.45A1.7 1.7 0 0 0 5 10.4a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.12-2.12.06.06A1.7 1.7 0 0 0 8.66 6a1.7 1.7 0 0 0 1-1.55V4h3v.45A1.7 1.7 0 0 0 13.66 6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06A1.7 1.7 0 0 0 18 9.66a1.7 1.7 0 0 0 1.55 1H20v3h-.45A1.7 1.7 0 0 0 19.4 15Z"/>',
    'fa-right-from-bracket':'<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>',
    'fa-plus':'<path d="M12 5v14M5 12h14"/>',
    'fa-heart-pulse':'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/><path d="M3.5 12h4l1.5-3 3 6 1.5-3h7"/>',
    'fa-file-prescription':'<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 11h5M9 15h3M14 14l3 4M17 14l-3 4"/>',
    'fa-droplet':'<path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/>',
    'fa-shield-heart':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M8.5 11a2 2 0 0 1 3-2l.5.5.5-.5a2 2 0 0 1 3 2c0 2-3.5 4-3.5 4s-3.5-2-3.5-4Z"/>',
    'fa-bone':'<path d="M17 3a3 3 0 0 0-3 3L6 14a3 3 0 1 0 4 4l8-8a3 3 0 1 0-1-7Z"/>',
    'fa-vials':'<path d="M9 3v6l-4 8a2 2 0 0 0 2 3h4a2 2 0 0 0 2-3l-4-8M6 3h6M16 3v6l-2 4M14 3h5"/>',
    'fa-download':'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
    'fa-lightbulb':'<path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-.9.8-1.5 1.5-1.5 2.5h-4c0-1-.6-1.7-1.5-2.5Z"/>',
    'fa-magnifying-glass':'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    'fa-arrow-left':'<path d="M19 12H5M12 19l-7-7 7-7"/>',
    'fa-chevron-right':'<path d="m9 18 6-6-6-6"/>',
    'fa-check':'<path d="m5 12 4 4L19 6"/>',
    'fa-copy':'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'
  };
  function findIcon(el){for(const c of el.classList){if(icons[c]) return icons[c]}return '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>'}
  function replace(root=document){root.querySelectorAll('i.fa-solid,i.fa-regular').forEach(el=>{if(el.dataset.svgDone)return;const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('ui-icon');svg.innerHTML=findIcon(el);el.textContent='';el.appendChild(svg);el.dataset.svgDone='1';});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>replace());else replace();
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)replace(n)}))).observe(document.documentElement,{childList:true,subtree:true});
})();
