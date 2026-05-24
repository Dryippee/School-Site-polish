(() => {
  const themeClass = 'sv-glass-ui-active';
  document.documentElement.classList.add(themeClass);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap';
  (document.head || document.documentElement).appendChild(fontLink);

  function url(p) { try { return chrome.runtime.getURL(p); } catch { return p; } }

  async function loadOnce(name, customPath, defaultPath, cssFn) {
    try {
      let u = url(defaultPath);
      try { const r = await fetch(url(customPath), { method: 'HEAD' }); if (r.ok) u = url(customPath); } catch {}
      const s = document.createElement('style');
      s.textContent = cssFn(u);
      (document.head || document.documentElement).appendChild(s);
      return u;
    } catch { return url(defaultPath); }
  }

  const bgUrlPromise = loadOnce('bg', 'backgrounds/bg.png', 'backgrounds/default.png',
    u => `.${themeClass} body { background: url("${u}") center / cover fixed !important; }`);

  const pfpUrlPromise = loadOnce('pfp', 'profiles/pfp.png', 'profiles/default.png',
    u => `.${themeClass} .student-photo, .${themeClass} .student-avatar, ` +
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
         `content: url("${u}") !important; width: 40px !important; height: 40px !important; ` +
         `border-radius: 50% !important; object-fit: cover !important; }`);

  pfpUrlPromise.then(pfpUrl => {
    window.__svPfp = pfpUrl;
    setTimeout(() => {
      if (!document.body) return;
      document.body.querySelectorAll('img').forEach(el => {
        if (el.dataset.svPfp) return;
        const a = (el.alt || '').toLowerCase();
        const s = (el.src || '').toLowerCase();
        if (/student|avatar|profile|photo|user|portrait|headshot/.test(a + s)) {
          el.dataset.svPfp = '1';
          el.src = pfpUrl;
        }
      });
    }, 1000);
  });

  const glassReset = document.createElement('style');
  glassReset.textContent =
    `.${themeClass} .panel, .${themeClass} .panel-default, .${themeClass} .card, ` +
    `.${themeClass} .modal-content, .${themeClass} .dropdown-menu, ` +
    `.${themeClass} .list-group-item, .${themeClass} .well, ` +
    `.${themeClass} .portal-card, .${themeClass} .dashboard-card, ` +
    `.${themeClass} .summary-box, .${themeClass} .grade-box, ` +
    `.${themeClass} .PXP2-card, .${themeClass} .student-info, ` +
    `.${themeClass} .student-header, .${themeClass} .attendance-item, ` +
    `.${themeClass} .course-item, .${themeClass} .class-item, ` +
    `.${themeClass} .grade-table, .${themeClass} .assignment-table, ` +
    `.${themeClass} .alert, .${themeClass} .btn, ` +
    `.${themeClass} .panel-heading, .${themeClass} .panel-footer, ` +
    `.${themeClass} .card-header, .${themeClass} .card-footer, ` +
    `.${themeClass} .modal-header, .${themeClass} .modal-footer, ` +
    `.${themeClass} .PXP2-student-header, ` +
    `.${themeClass} [class*="recent"], .${themeClass} [class*="history"], ` +
    `.${themeClass} [class*="project"], .${themeClass} [class*="assignment"], ` +
    `.${themeClass} [class*="task"], .${themeClass} [class*="activity"] { ` +
    `background: rgba(255,255,255,0.04) !important; ` +
    `backdrop-filter: blur(40px) !important; ` +
    `-webkit-backdrop-filter: blur(40px) !important; }`;
  (document.head || document.documentElement).appendChild(glassReset);
})();
