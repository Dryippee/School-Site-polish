(() => {
  const themeClass = 'sv-glass-ui-active';
  const homePxpClass = 'sv-home-pxp2';
  document.documentElement.classList.add(themeClass);

  if (window.location.pathname.endsWith('/Home_PXP2.aspx') ||
      window.location.pathname.endsWith('Home_PXP2.aspx')) {
    document.documentElement.classList.add(homePxpClass);
  }

  const head = document.head || document.documentElement;
  const pfpUrl = chrome.runtime.getURL('personalization/pfp-white.png');

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap';
  if (!document.querySelector('link[href^="https://fonts.googleapis.com/css2?family=Outfit"]')) {
    head.appendChild(fontLink);
  }

  try {
    const bgUrl = chrome.runtime.getURL('personalization/bg.png');
    const bgStyle = document.createElement('style');
    bgStyle.textContent =
      `.${themeClass} body { background: url("${bgUrl}") center / cover fixed !important; }`;
    head.appendChild(bgStyle);
  } catch (e) {}

  try {
    const pfpStyle = document.createElement('style');
    pfpStyle.textContent =
      `.${themeClass} .student-photo, .${themeClass} .student-avatar, ` +
      `.${themeClass} [class*="studentPhoto"], .${themeClass} [class*="student-photo"], ` +
      `.${themeClass} [class*="avatar"], .${themeClass} [class*="profilePhoto"], ` +
      `.${themeClass} [class*="profile-photo"], .${themeClass} [class*="userPhoto"], ` +
      `.${themeClass} [class*="user-photo"], .${themeClass} [class*="headshot"], ` +
      `.${themeClass} [class*="portrait"], .${themeClass} img[alt*="student"], ` +
      `.${themeClass} img[alt*="avatar"], .${themeClass} img[alt*="profile"], ` +
      `.${themeClass} img[alt*="photo"], .${themeClass} img[alt*="user"], ` +
      `.${themeClass} img[alt*="portrait"], .${themeClass} img[src*="student"], ` +
      `.${themeClass} img[src*="avatar"], .${themeClass} img[src*="profile"], ` +
      `.${themeClass} img[src*="photo"] { ` +
      `content: url("${pfpUrl}") !important; ` +
      `width: 96px !important; height: 96px !important; ` +
      `border-radius: 50% !important; object-fit: cover !important; }`;
    head.appendChild(pfpStyle);
  } catch (e) {}

  function fixWhiteElements(root) {
    if (!root) return;
    const nodes = [];
    if (root.nodeType === Node.ELEMENT_NODE) nodes.push(root);
    if (root.querySelectorAll) nodes.push(...root.querySelectorAll('*'));
    nodes.forEach(el => {
      if (el.classList && el.classList.contains('sv-pxp-fixed')) return;
      const style = getComputedStyle(el);
      const bg = style.backgroundColor;
      if (bg === 'rgb(255, 255, 255)' || bg === 'white' || bg === '#ffffff' || bg === '#fff' ||
          bg === 'rgb(255,255,255)' || style.background === 'white' || style.background === '#fff') {
        el.style.setProperty('background', 'rgba(255,255,255,0.04)', 'important');
        el.style.setProperty('backdrop-filter', 'blur(40px)', 'important');
        el.classList.add('sv-pxp-fixed');
      }

      if (el.tagName === 'IMG' && !el.dataset.svPfp) {
        const alt = (el.alt || '').toLowerCase();
        const src = (el.src || '').toLowerCase();
        if (alt.includes('student') || alt.includes('avatar') || alt.includes('profile') ||
            alt.includes('photo') || alt.includes('user') || alt.includes('portrait') ||
            alt.includes('headshot') || src.includes('student') || src.includes('avatar') ||
            src.includes('profile') || src.includes('photo') || src.includes('user')) {
          el.dataset.svPfp = '1';
          el.src = pfpUrl;
        }
      }
    });
  }

  function applyGlobals() {
    const deepStyle = document.createElement('style');
    deepStyle.textContent = `
      .${themeClass} * { background: transparent !important; }
      .${themeClass} .panel, .${themeClass} .panel-default, .${themeClass} .card,
      .${themeClass} .modal-content, .${themeClass} .dropdown-menu,
      .${themeClass} .list-group-item, .${themeClass} .well,
      .${themeClass} .portal-card, .${themeClass} .dashboard-card,
      .${themeClass} .summary-box, .${themeClass} .grade-box,
      .${themeClass} .PXP2-card, .${themeClass} .student-info,
      .${themeClass} .student-header, .${themeClass} .attendance-item,
      .${themeClass} .course-item, .${themeClass} .class-item,
      .${themeClass} .grade-table, .${themeClass} .assignment-table,
      .${themeClass} .alert, .${themeClass} .message,
      .${themeClass} .btn, .${themeClass} .panel-heading,
      .${themeClass} .panel-footer, .${themeClass} .card-header,
      .${themeClass} .card-footer, .${themeClass} .modal-header,
      .${themeClass} .modal-footer,
      .${themeClass} .PXP2-student-header,
      .${themeClass} [class*="recent"], .${themeClass} [class*="history"],
      .${themeClass} [class*="project"], .${themeClass} [class*="assignment"],
      .${themeClass} [class*="task"], .${themeClass} [class*="activity"] {
        background: rgba(255,255,255,0.04) !important;
        backdrop-filter: blur(40px) !important;
        -webkit-backdrop-filter: blur(40px) !important;
      }
    `;
    document.head ? document.head.appendChild(deepStyle) : document.documentElement.appendChild(deepStyle);
  }

  applyGlobals();

  setTimeout(() => fixWhiteElements(document), 500);
  setTimeout(() => fixWhiteElements(document), 1500);

  const queued = new Set();
  let pending = false;

  function queueNode(node) {
    if (node && node.nodeType === Node.ELEMENT_NODE) queued.add(node);
  }

  function scheduleFlush() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      queued.forEach(node => fixWhiteElements(node));
      queued.clear();
    });
  }

  const obs = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(queueNode);
      } else if (mutation.type === 'attributes') {
        queueNode(mutation.target);
      }
    });
    scheduleFlush();
  });

  function startObserver() {
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  if (document.body) startObserver();
  else {
    const waitObs = new MutationObserver(() => {
      if (document.body) {
        waitObs.disconnect();
        startObserver();
      }
    });
    waitObs.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
