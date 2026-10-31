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
  ['settings', 'Settings', { badge: 1 }], ['utilities', 'Utilities', { folder: [...Array(9)].map((_, i) => 'util' + i) }], ['epop', 'Epop'], ['duolingo', 'Duolingo'],
  ['kakaotalk', 'KakaoTalk', { badge: 957 }], ['instagram', 'Instagram'], ['gmail', 'Gmail'], ['googlemaps', 'Google Maps'],
];
const DOCK = [['phone'], ['safari'], ['messages', '', { badge: 163 }], ['ytmusic']];

/* ===== Render ===== */
const $ = s => document.querySelector(s);
const MINI = [9.8, 25.9, 42]; // folder mini-icon offsets (px)

function icon([id, name, o = {}]) {
  let inner;
  if (o.type === 'cal') inner = '<div class="ico cal"><b></b><span></span></div>';
  else if (o.type === 'clk') inner = `<div class="ico clk"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff"/>${
    [...Array(60)].map((_, i) => `<line x1="50" y1="${i % 5 ? 7 : 6}" x2="50" y2="${i % 5 ? 10 : 14}" stroke="#000" stroke-width="${i % 5 ? .7 : 2}" transform="rotate(${i * 6} 50 50)"/>`).join('')
  }<g font-size="13" text-anchor="middle" fill="#000"><text x="50" y="27">12</text><text x="77" y="54.5">3</text><text x="50" y="82">6</text><text x="23" y="54.5">9</text></g>
  <line class="h" x1="50" y1="53" x2="50" y2="29" stroke="#000" stroke-width="3.6" stroke-linecap="round"/>
  <line class="m" x1="50" y1="54" x2="50" y2="15" stroke="#000" stroke-width="2.4" stroke-linecap="round"/>
  <line class="s" x1="50" y1="60" x2="50" y2="12" stroke="#f19a38" stroke-width="1.2"/><circle cx="50" cy="50" r="2.2" fill="#f19a38"/></svg></div>`;
  else if (o.folder) inner = `<div class="ico folder">${o.folder.map((m, i) =>
    `<img src="${I}mini/${m}.webp" style="left:${MINI[i % 3]}px;top:${MINI[i / 3 | 0]}px" alt="" draggable="false">`).join('')}</div>`;
  else inner = `<div class="ico"><img src="${I + id}.webp" alt="" draggable="false"></div>`;
  return `<div class="app" data-app="${id}">${inner.replace(/<\/div>$/, o.badge ? `<span class="badge">${o.badge}</span></div>` : '</div>')}${name ? `<span class="label">${name}</span>` : ''}</div>`;
}
$('#grid').innerHTML = APPS.map(icon).join('');
$('#dock').innerHTML = DOCK.map(icon).join('');
$('#wx .wx-temp').textContent = WEATHER.temp + '°';
$('#wx .wx-cond').textContent = WEATHER.cond;
$('#wx .wx-hl').textContent = `H:${WEATHER.hi}° L:${WEATHER.lo}°`;

/* ===== Clock (starts at START on every visit, runs in real time) ===== */
const t0 = performance.now();
const now = () => new Date(START + performance.now() - t0);
const fmt = o => new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...o });
const fTime = fmt({ hour: 'numeric', minute: '2-digit', hour12: true });
const fDate = fmt({ weekday: 'long', month: 'long', day: 'numeric' });
const fParts = fmt({ weekday: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' });
const sbTime = $('.sb-time'), lockTime = $('#lock-time'), lockDate = $('#lock-date');
const calB = $('.cal b'), calN = $('.cal span');
const [hH, hM, hS] = ['.h', '.m', '.s'].map(c => $('.clk ' + c));

function tick() {
  const d = now(), t = fTime.format(d).replace(/\s?[AP]M$/, '');
  const p = Object.fromEntries(fParts.formatToParts(d).map(x => [x.type, x.value]));
  sbTime.textContent = lockTime.textContent = t;
  lockDate.textContent = fDate.format(d);
  calB.textContent = p.weekday; calN.textContent = p.day;
  const s = +p.second, m = +p.minute + s / 60, h = (+p.hour % 12) + m / 60;
  hS.setAttribute('transform', `rotate(${s * 6} 50 50)`);
  hM.setAttribute('transform', `rotate(${m * 6} 50 50)`);
  hH.setAttribute('transform', `rotate(${h * 30} 50 50)`);
  setTimeout(tick, 1000 - ((performance.now() - t0) % 1000));
}
tick();

/* ===== Fit to viewport ===== */
const root = document.documentElement, dev = $('#device');
function fit() {
  const w = innerWidth, h = innerHeight, full = w <= 520;
  root.classList.toggle('full', full);
  if (full) {
    const k = w / 402;
    dev.style.setProperty('--k', k);
    dev.style.setProperty('--h', h / k + 'px');
  } else {
    dev.style.setProperty('--h', '874px');
    dev.style.setProperty('--k', Math.min(1, (h - 32) / 898, (w - 32) / 426));
  }
}
addEventListener('resize', fit);
fit();

/* ===== Lock screen: swipe up to unlock ===== */
const lock = $('#lock');
root.classList.add('locked');
let y0 = null, dy = 0, tStart = 0;
const setY = y => lock.style.transform = `translateY(${y}px)`;
const k = () => parseFloat(dev.style.getPropertyValue('--k')) || 1;

lock.addEventListener('pointerdown', e => {
  y0 = e.clientY; dy = 0; tStart = e.timeStamp;
  lock.classList.remove('anim'); lock.setPointerCapture(e.pointerId);
});
lock.addEventListener('pointermove', e => {
  if (y0 === null) return;
  dy = Math.min(0, (e.clientY - y0) / k());
  setY(dy);
});
const release = e => {
  if (y0 === null) return;
  y0 = null; lock.classList.add('anim');
  const v = dy / Math.max(1, e.timeStamp - tStart); // px per ms
  if (dy < -120 || (dy < -30 && v < -0.5)) unlock();
  else if (dy > -4) { setY(-28); setTimeout(() => setY(0), 180); } // tap: hint bounce
  else setY(0);
};
lock.addEventListener('pointerup', release);
lock.addEventListener('pointercancel', release);
$('#homebar').addEventListener('click', () => root.classList.contains('locked') && (lock.classList.add('anim'), unlock()));

function unlock() {
  setY(-lock.offsetHeight);
  root.classList.remove('locked');
  setTimeout(() => lock.hidden = true, 450);
}
