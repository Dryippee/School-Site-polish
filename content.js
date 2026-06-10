(() => {
  const TC = 'sv-glass-ui-active';
  document.documentElement.classList.add(TC);

  const $ = (tag, o) => Object.assign(document.createElement(tag), o);
  const head = () => document.head || document.documentElement;
  const url = p => { try { return chrome.runtime.getURL(p); } catch { return p; } };

  head().append($('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap' }));

  const bg = url('backgrounds/abstract-fantasy-landscape-with-color-year-purple-tones.jpg');
  head().append($('style', { textContent: `html.${TC} body{background:url("${bg}")center/cover fixed!important}` }));

  const pfp = url('profiles/pfp.png');
  head().append($('style', {
    textContent:
      `.${TC} *{background:transparent!important}` +
      `.${TC} [class*="student"] img,.${TC} [class*="avatar"] img,` +
      `.${TC} img[alt*="student"],.${TC} img[alt*="avatar"],.${TC} img[alt*="profile"],.${TC} img[alt*="photo"]{` +
      `content:url("${pfp}")!important;width:40px!important;height:40px!important;border-radius:50%!important;object-fit:cover!important}` +
      `.${TC} .student-photo,.${TC} .student-avatar,.${TC} [class*="studentPhoto"],.${TC} [class*="student-photo"],` +
      `.${TC} [class*="profilePhoto"],.${TC} [class*="profile-photo"],.${TC} [class*="userPhoto"],` +
      `.${TC} [class*="user-photo"],.${TC} [class*="headshot"],.${TC} [class*="portrait"],` +
      `.${TC} img[alt*="user"],.${TC} img[alt*="portrait"],.${TC} img[src*="student"],.${TC} img[src*="avatar"],` +
      `.${TC} img[src*="profile"],.${TC} img[src*="photo"]{` +
      `content:url("${url('profiles/default.png')}")!important;width:40px!important;height:40px!important;border-radius:50%!important;object-fit:cover!important}`
  }));

  const fixPfp = () => {
    if (!document.body) return;
    document.body.querySelectorAll('img:not([data-svp])').forEach(el => {
      if (/student|avatar|profile|photo|user|portrait|headshot/.test((el.alt || '') + (el.src || ''))) {
        el.dataset.svp = '1';
        el.src = pfp;
      }
    });
  };

  if (document.body) { fixPfp(); new MutationObserver(fixPfp).observe(document.body, { childList: true, subtree: true }); }
  else document.addEventListener('DOMContentLoaded', () => { fixPfp(); new MutationObserver(fixPfp).observe(document.body, { childList: true, subtree: true }); });
})();
