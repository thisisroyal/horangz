'use strict';
/* ===== Config ===== */
const START = Date.UTC(2025, 2, 8, 4, 38); // 2025-03-07 22:38 CST (Chicago)
const TZ = 'America/Chicago';
// Chicago (O'Hare), night of 2025-03-07
const WEATHER = { temp: 0, cond: 'Cloudy', hi: 2, lo: 0 };

const I = 'assets/icons/';
// folders: [mini icon file, label, app id it opens (optional)]
const F = {
  ect: [['appstore', 'App Store'], ['settings', 'Settings']],
  productivity: [['prod0', 'Files'], ['prod1', 'Dropbox'], ['zoom', 'Zoom'], ['drive', 'Drive'], ['papago', 'Papago'], ['deepl', 'DeepL'], ['duolingo', 'Duolingo']],
  utilities: ['Compass', 'Measure', 'Calculator', 'Wallet', 'Find My', 'Health', 'FaceTime', 'Voice Memos', 'Watch'].map((t, i) => ['util' + i, t]),
  ott: [['netflix', 'Netflix'], ['watcha', 'WATCHA', 'watcha']],
  sns: [['instagram', 'Instagram'], ['x', 'X'], ['youtube', 'YouTube']],
  ride: [['uber', 'Uber'], ['lyft', 'Lyft']],
  delivery: [['starbucks', 'Starbucks'], ['amazon', 'Amazon']],
};
const fold = (id, name) => [id, name, { folder: F[id].map(f => f[0]) }];
// right half of the widget row holds a 2x2 block of icons
const TOP = [['weather', 'Weather'], ['calendar', 'Calendar', { type: 'cal' }], ['photos', 'Photos'], ['camera', 'Camera']];
const APPS = [
  ['notes', 'Notes'], ['clock', 'Clock', { type: 'clk' }], fold('ect', 'Ect'), fold('productivity', 'Productivity'),
  fold('utilities', 'Utilities'), fold('ott', 'OTT'), ['kakaotalk', 'KakaoTalk', { badge: 530 }], fold('sns', 'SNS'),
  ['gmail', 'Gmail'], ['googlemaps', 'Google Maps'], fold('ride', 'Ride'), fold('delivery', 'Delivery'),
];
const DOCK = [['phone'], ['safari'], ['messages'], ['ytmusic']];

/* ===== Render ===== */
const $ = s => document.querySelector(s);
const MINI = [9.8, 25.9, 42]; // folder mini-icon offsets (px)

function icon([id, name, o = {}]) {
  let inner;
  if (o.type === 'cal') inner = '<b></b><span></span>';
  else if (o.type === 'clk') inner = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff"/>${
    [...Array(60)].map((_, i) => `<line x1="50" y1="${i % 5 ? 7 : 6}" x2="50" y2="${i % 5 ? 10 : 14}" stroke="#000" stroke-width="${i % 5 ? .7 : 2}" transform="rotate(${i * 6} 50 50)"/>`).join('')
  }<g font-size="13" text-anchor="middle" fill="#000"><text x="50" y="27">12</text><text x="77" y="54.5">3</text><text x="50" y="82">6</text><text x="23" y="54.5">9</text></g>
  <line class="h" x1="50" y1="53" x2="50" y2="29" stroke="#000" stroke-width="3.6" stroke-linecap="round"/>
  <line class="m" x1="50" y1="54" x2="50" y2="15" stroke="#000" stroke-width="2.4" stroke-linecap="round"/>
  <line class="s" x1="50" y1="60" x2="50" y2="12" stroke="#f19a38" stroke-width="1.2"/><circle cx="50" cy="50" r="2.2" fill="#f19a38"/></svg>`;
  else if (o.folder) inner = o.folder.map((m, i) =>
    `<img src="${I}mini/${m}.webp" style="left:${MINI[i % 3]}px;top:${MINI[i / 3 | 0]}px" alt="" draggable="false">`).join('');
  else inner = `<img src="${I + id}.webp" alt="" draggable="false">`;
  const cls = o.type || (o.folder ? 'folder' : '');
  return `<div class="app" data-app="${id}"><div class="ico ${cls}">${inner}${o.badge ? `<span class="badge">${o.badge}</span>` : ''}</div>${name ? `<span class="label">${name}</span>` : ''}</div>`;
}
$('#grid').innerHTML = APPS.map(icon).join('');
$('#grid2').innerHTML = TOP.map(icon).join('');
$('#dock').innerHTML = DOCK.map(icon).join('');
$('.wx-temp').textContent = WEATHER.temp + '°';
$('.wx-cond').textContent = WEATHER.cond;
$('.wx-hl').textContent = `H:${WEATHER.hi}° L:${WEATHER.lo}°`;

/* ===== Clock (starts at START on every visit, runs in real time) ===== */
const SPEED = 1.5;                                 // phone clock runs 1.5x faster than real time
const t0 = performance.now();
const simNow = () => new Date(START + (performance.now() - t0) * SPEED);
const fmt = o => new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...o });
const fTime = fmt({ hour: 'numeric', minute: '2-digit', hour12: true });
const fParts = fmt({ weekday: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' });
const sbTime = $('.sb-time'), calB = $('.cal b'), calN = $('.cal span');
const [hH, hM, hS] = ['.h', '.m', '.s'].map(c => $('.clk ' + c));
const rot = (el, deg) => el.setAttribute('transform', `rotate(${deg} 50 50)`);

function tick() {
  const d = simNow();
  const p = Object.fromEntries(fParts.formatToParts(d).map(x => [x.type, x.value]));
  sbTime.textContent = fTime.format(d).replace(/\s?[AP]M$/, '');
  calB.textContent = p.weekday; calN.textContent = p.day;
  const s = +p.second, m = +p.minute + s / 60;
  rot(hS, s * 6); rot(hM, m * 6); rot(hH, (+p.hour % 12 + m / 60) * 30);
  setTimeout(tick, (1000 - ((performance.now() - t0) * SPEED % 1000)) / SPEED);
}
tick();

/* ===== Fit the framed phone (fixed iPhone 17 Pro ratio, never rotates) ===== */
const root = document.documentElement, body = document.body, dev = $('#device');
const DW = 436, DH = 908;                         // 402x874 screen + bezel + frame
function fit() {
  const m = matchMedia('(pointer:coarse)').matches ? 12 : 32;
  dev.style.setProperty('--k', Math.min(1, (innerWidth - m) / DW, (innerHeight - m) / DH));
}
addEventListener('resize', fit);
fit();

/* ===== Navigation: player (landscape) <-> home <-> apps ===== */
const APPVIEWS = {};                               // id -> { el, open(), close() } registered by app modules
let current = null;

function go(state) {
  if (body.dataset.state === state) return;
  closeApp(true);
  body.dataset.state = state;
  root.classList.remove('enter');
  void root.offsetWidth;                           // restart the screen-internal transition
  root.classList.add('enter');
}
function openApp(id) {
  const a = APPVIEWS[id];
  if (!a || current) return;
  current = a; a.open?.();
  a.el.classList.remove('instant'); a.el.classList.add('open'); root.classList.toggle('dark-ui', !!a.light);
}
function closeApp(instant) {
  if (!current) return;
  const a = current; current = null;
  a.el.classList.toggle('instant', !!instant); a.el.classList.remove('open');
  root.classList.remove('dark-ui'); a.close?.();
}
const setBadge = (id, n) => { const b = $(`[data-app=${id}] .badge`); if (b) b.textContent = n; };
$('#homebtn').addEventListener('click', () => go('port'));
$('#hb').addEventListener('click', () => closeApp());
$('#dock').addEventListener('click', e => { const id = e.target.closest('.app')?.dataset.app; id && openApp(id); });
const launch = id => (id === 'watcha' ? go('land') : openApp(id));
for (const g of ['#grid', '#grid2']) $(g).addEventListener('click', e => {
  const id = e.target.closest('.app')?.dataset.app;
  if (F[id]) openFolder(id, e.target.closest('.ico')); else if (id) launch(id);
});

/* ===== Folders: open in place, iOS style ===== */
const fv = document.createElement('div');
fv.className = 'fv';
$('#home').append(fv);
function openFolder(id, from) {
  const name = APPS.find(a => a[0] === id)[1], r = from.getBoundingClientRect(), h = $('#home').getBoundingClientRect(), k = h.width / 402;
  fv.innerHTML = `<h2>${name}</h2><div class="fv-box">${F[id].map(([m, t, app]) =>
    `<div class="app"${app ? ` data-app="${app}"` : ''}><div class="ico"><img src="${I}${m.startsWith('util') || m.startsWith('prod') ? 'mini/' : ''}${m}.webp" alt="" draggable="false"></div><span class="label">${t}</span></div>`).join('')}</div>`;
  const box = fv.querySelector('.fv-box'), b = box.getBoundingClientRect();
  box.style.setProperty('--fx', (r.left + r.width / 2 - (b.left + b.width / 2)) / k + 'px');
  box.style.setProperty('--fy', (r.top + r.height / 2 - (b.top + b.height / 2)) / k + 'px');
  box.style.setProperty('--fs', r.width / b.width);
  requestAnimationFrame(() => requestAnimationFrame(() => fv.classList.add('on')));
}
fv.addEventListener('click', e => {
  const id = e.target.closest('[data-app]')?.dataset.app;
  if (!e.target.closest('.fv-box') || id) { fv.classList.remove('on'); if (id) setTimeout(() => launch(id), 200); }
});

/* ===== Mouse drag scrolls lists like a finger would (desktop) ===== */
(() => {
  let d = null;
  addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button || e.target.closest('input,.nt')) return;
    const sc = e.target.closest('.sc,.kt-list,.kt-msgs,.nsc,.ym-sc,.gm-sc,.go-sc,.ios-sc');
    if (sc) d = { sc, y: e.clientY, top: sc.scrollTop, moved: false };
  });
  addEventListener('pointermove', e => {
    if (!d) return;
    const dy = (e.clientY - d.y) / (parseFloat(dev.style.getPropertyValue('--k')) || 1);
    if (Math.abs(dy) > 4) d.moved = true;
    if (d.moved) d.sc.scrollTop = d.top - dy;
  });
  const stop = e => e.stopPropagation();
  addEventListener('pointerup', () => {
    if (d?.moved) { addEventListener('click', stop, true); setTimeout(() => removeEventListener('click', stop, true)); }
    d = null;
  });
})();
