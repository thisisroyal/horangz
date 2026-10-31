'use strict';
/* ===== Config ===== */
const START = Date.UTC(2025, 2, 8, 4, 38); // 2025-03-07 22:38 CST (Chicago)
const TZ = 'America/Chicago';
// Chicago (O'Hare), night of 2025-03-07
const WEATHER = { temp: 0, cond: 'Cloudy', hi: 2, lo: 0 };

const I = 'assets/icons/';
const APPS = [
  ['weather', 'Weather'], ['calendar', 'Calendar', { type: 'cal' }], ['photos', 'Photos'], ['camera', 'Camera'],
  ['appstore', 'App Store'], ['notes', 'Notes'], ['clock', 'Clock', { type: 'clk' }], ['productivity', 'Productivity', { folder: ['prod0', 'prod1'] }],
  ['settings', 'Settings'], ['utilities', 'Utilities', { folder: [...Array(9)].map((_, i) => 'util' + i) }], ['watcha', 'WATCHA'], ['duolingo', 'Duolingo'],
  ['kakaotalk', 'KakaoTalk', { badge: 530 }], ['instagram', 'Instagram'], ['gmail', 'Gmail'], ['googlemaps', 'Google Maps'],
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
$('#dock').innerHTML = DOCK.map(icon).join('');
$('.wx-temp').textContent = WEATHER.temp + '°';
$('.wx-cond').textContent = WEATHER.cond;
$('.wx-hl').textContent = `H:${WEATHER.hi}° L:${WEATHER.lo}°`;

/* ===== Clock (starts at START on every visit, runs in real time) ===== */
const t0 = performance.now();
const fmt = o => new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...o });
const fTime = fmt({ hour: 'numeric', minute: '2-digit', hour12: true });
const fParts = fmt({ weekday: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' });
const sbTime = $('.sb-time'), calB = $('.cal b'), calN = $('.cal span');
const [hH, hM, hS] = ['.h', '.m', '.s'].map(c => $('.clk ' + c));
const rot = (el, deg) => el.setAttribute('transform', `rotate(${deg} 50 50)`);

function tick() {
  const d = new Date(START + performance.now() - t0);
  const p = Object.fromEntries(fParts.formatToParts(d).map(x => [x.type, x.value]));
  sbTime.textContent = fTime.format(d).replace(/\s?[AP]M$/, '');
  calB.textContent = p.weekday; calN.textContent = p.day;
  const s = +p.second, m = +p.minute + s / 60;
  rot(hS, s * 6); rot(hM, m * 6); rot(hH, (+p.hour % 12 + m / 60) * 30);
  setTimeout(tick, 1000 - ((performance.now() - t0) % 1000));
}
tick();

/* ===== Fit to viewport ===== */
const root = document.documentElement, body = document.body, dev = $('#device'), home = $('#home');
const FULL = () => matchMedia('(pointer:coarse)').matches || Math.min(innerWidth, innerHeight) <= 520;
const set = (k, v) => dev.style.setProperty(k, v);
const deskK = (w, h) => Math.min(1, (innerHeight - 32) / (h + 24), (innerWidth - 32) / (w + 24));

function fit() {
  const land = body.dataset.state === 'land', full = FULL();
  const vw = innerWidth, vh = innerHeight;
  let W, H, k, r = 0;
  root.classList.toggle('full', full);
  if (full) {
    k = Math.min(vw, vh) / 402;                // short side = 402 units
    const long = Math.max(vw, vh) / k;
    [W, H] = land ? [long, 402] : [402, long];
    if (land !== vw > vh) r = 90;                // rotate when orientation differs
  } else {
    [W, H] = land ? [874, 402] : [402, 874];
    k = deskK(W, H);
  }
  set('--w', W + 'px'); set('--h', H + 'px'); set('--k', k); set('--r', r + 'deg');
  if (!land) { // shrink icon area on short screens so it never overlaps the dock
    const short = H < 820;
    home.classList.toggle('short', short);
    home.style.setProperty('--c', Math.min(1, (H - (short ? 193 : 249)) / 619));
  }
}
addEventListener('resize', fit);
fit();

/* ===== Switch between player (landscape) and home (portrait) ===== */
function go(state) {
  if (body.dataset.state === state) return;
  const show = () => {
    body.dataset.state = state; root.classList.remove('turn'); fit();
    root.classList.toggle('enter', state === 'port');
  };
  if (FULL()) return show();
  const land = state === 'land';                 // desktop: turn the phone
  root.classList.add('turn');
  set('--r', land ? '90deg' : '-90deg'); set('--k', land ? deskK(874, 402) : deskK(402, 874));
  setTimeout(show, 560);
}
$('#homebtn').addEventListener('click', () => go('port'));
$('[data-app=watcha]').addEventListener('click', () => go('land'));
