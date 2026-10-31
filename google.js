'use strict';
/* ===== Safari on google.com (opens from the Safari icon in the dock) ===== */
(() => {
  const A = 'assets/google/';
  // Reconstructed from US news of Fri, March 7, 2025 (daily Google Trends archives for that day aren't public)
  const TRENDS = [
    ['lady gaga mayhem', 'Mayhem — 2025 album by Lady Gaga'],
    ['spacex starship explosion'], ['jobs report'], ['severance episode 8'],
    ['florida flights delayed debris'], ['daylight saving time 2025'],
  ];
  let history = [['스탠바이미', '이미지'], ['눈'], ['눈 오는 날 탈모']];
  const s = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    search: s('<circle cx="10" cy="10" r="6.5"/><path d="m15 15 5.5 5.5"/>'),
    trend: s('<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>'),
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
    back: s('<path d="M15 4 7 12l8 8"/>'),
    menu: s('<path d="M4 7h16M4 12h16M4 17h11"/>'),
    reload: s('<path d="M19 12a7 7 0 1 1-2.1-5"/><path d="M17.5 3v4.5H13"/>'),
    tabs: s('<rect x="7.5" y="7.5" width="13" height="13" rx="2.5"/><path d="M16.5 4.5V4a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 4v10A1.5 1.5 0 0 0 5 15.5h.5"/>'),
    plus: s('<path d="M12 4v16M4 12h16"/>'),
    clock: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
    x: s('<path d="M6 6l12 12M18 6 6 18"/>'),
  };
  const banner = `<div class="go-ban"><img src="${A}gtile.webp" alt=""><div><b>Google</b><p>Open in the Google app</p></div><span>OPEN</span></div>`;
  const hist = () => history.map(([t, sub], i) => `<div class="go-h" data-i="${i}">${I.clock}<div><b>${t}</b>${sub ? `<p>${sub}</p>` : ''}</div><button class="go-x" aria-label="Remove">${I.x}</button></div>`).join('');

  const el = document.createElement('section');
  el.id = 'google'; el.className = 'appview';
  el.innerHTML = `
    <div class="go-home">
      <div class="go-sc">
        ${banner}
        <div class="go-tabs"><span class="on">전체</span><span>이미지</span><img src="${A}hdricons.webp" alt="" class="hi"><img src="assets/gmail/profile.webp" alt="" class="me"></div>
        <img class="go-logo" src="${A}logo.webp" alt="Google">
        <button class="go-box">${I.search}<img src="${A}boxicons.webp" alt=""></button>
        <p class="go-lang">Google 지원 언어: <a>English</a></p>
        <div class="go-trend"><h2>Trending searches${I.dots}</h2>
          ${TRENDS.map(([t, sub]) => `<div class="go-t">${I.trend}<div><p>${t}</p>${sub ? `<small>${sub}</small>` : ''}</div></div>`).join('')}
        </div>
      </div>
      <div class="go-bar"><span class="c dim">${I.back}</span><span class="url">${I.menu}<b>google.com</b>${I.reload}</span><span class="c">${I.tabs}</span></div>
    </div>
    <div class="go-q">
      ${banner}
      <form class="go-in">${I.plus}<input type="search" enterkeyhint="search" autocomplete="off" placeholder="Google에 물어보세요"><img src="${A}qicons.webp" alt=""></form>
      <div class="go-hist">${hist()}</div>
      <button class="go-pill">google.com</button>
    </div>`;
  $('#apps').append(el);

  const q = el.querySelector('.go-q'), input = q.querySelector('input'), list = q.querySelector('.go-hist');
  const show = on => { el.classList.toggle('typing', on); if (on) input.focus(); else { input.blur(); input.value = ''; } };
  el.querySelector('.go-box').addEventListener('click', () => show(true));
  q.querySelector('.go-pill').addEventListener('click', () => show(false));
  q.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value.trim();
    if (v) { history = [[v], ...history.filter(h => h[0] !== v)]; list.innerHTML = hist(); }
    input.value = ''; input.blur();
  });
  list.addEventListener('click', e => {
    const row = e.target.closest('.go-h');
    if (!row) return;
    if (e.target.closest('.go-x')) { history.splice(row.dataset.i, 1); list.innerHTML = hist(); return; }
    input.value = history[row.dataset.i][0]; input.focus();
  });
  APPVIEWS.safari = { el, light: true, close: () => setTimeout(() => { show(false); el.querySelector('.go-sc').scrollTop = 0; }, 400) };
})();
