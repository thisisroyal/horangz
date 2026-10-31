'use strict';
/* ===== Notes app ===== */
(() => {
  const NOTES = [
    { title: 'H마트', date: [2025, 3, 5], items: ['미역', '불닭', '어묵꼬치', '유부초밥', '투컵두부'] },
    { title: '작업 메모', date: [2025, 2, 27], text: ['자투리 실크들은 내가 고를수 없다.'] },
    { title: '코스트코', date: [2025, 2, 25], items: ['계란', '스테이크 소고기', '모짜렐라 치즈', '붕어빵', '냉동소고기 한팩', '새우 한팩', '오렌지나 망고'] },
  ];
  const DELETED = [{ title: 'I feel my right ear is bleeding', date: [2025, 3, 4] }];
  const COUNT = { all: 10, notes: 10, quick: 0, deleted: 1, pinnedQuick: 1 };
  const TAGS = ['All Tags', '#drawing', '#공부플레이리스트', '#kpop', '#짝사랑'];
  const A = 'assets/notes/';

  const sv = (d, w = 24) => `<svg class="ic" viewBox="0 0 ${w} 24">${d}</svg>`;
  const I = {
    chev: sv('<path d="m9 5 7 7-7 7"/>'),
    down: sv('<path d="m5 9 7 7 7-7"/>'),
    back: sv('<path d="M15 4 7 12l8 8"/>'),
    more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
    folder: sv('<path d="M2.5 6.5a2 2 0 0 1 2-2h4.6l2 2.2h8.4a2 2 0 0 1 2 2v9.8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z"/><path d="M2.5 9.5h19"/><circle cx="19.5" cy="5.5" r="4" fill="#000" stroke="none"/><path d="M19.5 3.6v3.8M17.6 5.5h3.8" stroke="#fff"/>'),
    search: sv('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>'),
    mic: sv('<rect x="8.5" y="2.5" width="7" height="12" rx="3.5"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/>'),
    compose: sv('<path d="M11 4.5H6a2 2 0 0 0-2 2v11.5a2 2 0 0 0 2 2h11.5a2 2 0 0 0 2-2V13"/><path d="M18.3 3.2a1.8 1.8 0 0 1 2.5 2.5L12 14.5l-3.3.8.8-3.3z"/>'),
    undo: sv('<path d="M9 5 4.5 9.5 9 14"/><path d="M4.5 9.5H15a5 5 0 0 1 0 10h-3"/>'),
    share: sv('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M8 10.5H6.5a1.5 1.5 0 0 0-1.5 1.5v8a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5H16"/>'),
    list: sv('<circle cx="5" cy="6.5" r="2.6" fill="currentColor"/><path d="m3.8 6.6.9.9 1.6-1.8" stroke="#fff" stroke-width="1.3"/><circle cx="5" cy="17" r="2.4"/><path d="M10 6.5h11M10 17h11"/>'),
    clip: sv('<path d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/>'),
    pen: sv('<circle cx="12" cy="12" r="9.5"/><path d="M8.5 17.5 12 6l3.5 11.5M9.6 14h4.8"/>'),
  };
  const gb = (icon, cls = '') => `<button class="gb ${cls}">${icon}</button>`;

  /* iOS-style dates relative to the phone clock */
  const dayNum = d => Date.UTC(d[0], d[1] - 1, d[2]) / 864e5;
  function today() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(simNow()).map(x => [x.type, +x.value]));
    return dayNum([p.year, p.month, p.day]);
  }
  function label(d) {
    const diff = today() - dayNum(d), dt = new Date(dayNum(d) * 864e5);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return dt.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    return `${d[1]}/${d[2]}/${String(d[0]).slice(2)}`;
  }
  const section = d => { const n = today() - dayNum(d); return n === 0 ? 'Today' : n === 1 ? 'Yesterday' : n < 7 ? 'Previous 7 Days' : n < 30 ? 'Previous 30 Days' : 'Earlier'; };
  const preview = n => (n.items || n.text || [])[0] || 'No additional text';
  const rows = (list, open) => {
    const groups = {};
    list.forEach((n, i) => (groups[section(n.date)] ??= []).push(`<div class="nrow"${open ? ` data-note="${i}"` : ''}><b>${n.title}</b><p><span>${label(n.date)}</span>${preview(n)}</p></div>`));
    return Object.entries(groups).map(([h, r]) => `<h3>${h}</h3><div class="ncard">${r.join('')}</div>`).join('');
  };
  const bottom = `<div class="nbar"><div class="gb npill nsearch">${I.search}<span>Search</span>${I.mic}</div>${gb(I.compose, 'big')}</div>`;

  /* views */
  const folders = () => `<div class="nv on" data-v="folders"><div class="ntop">${gb(I.folder)}${gb('Edit', 'txt')}</div><div class="nsc">
    <h1>Folders</h1>
    <div class="ncard"><div class="frow"><img src="${A}quick.webp" alt="" class="qi"><span>Quick Notes</span><em>${COUNT.pinnedQuick}</em>${I.chev}</div></div>
    <h2>iCloud${I.down}</h2>
    <div class="ncard">
      <div class="frow"><img src="${A}folder.webp" alt=""><span>All iCloud</span><em>${COUNT.all}</em>${I.chev}</div>
      <div class="frow go" data-go="list"><img src="${A}folder.webp" alt=""><span>Notes</span><em>${COUNT.notes}</em>${I.chev}</div>
      <div class="frow"><img src="${A}folder.webp" alt=""><span>Quick Notes</span><em>${COUNT.quick}</em>${I.chev}</div>
      <div class="frow go" data-go="deleted"><img src="${A}trash.webp" alt="" class="tr"><span>Recently Deleted</span><em>${COUNT.deleted}</em>${I.chev}</div>
    </div>
    <h2>Tags${I.down}</h2>
    <div class="ncard tags">${TAGS.map(t => `<span>${t}</span>`).join('')}</div>
  </div>${bottom}</div>`;
  const list = () => `<div class="nv" data-v="list"><div class="ntop">${gb(I.back, 'back')}${gb(I.more)}</div><div class="nsc">
    <h1>Notes</h1><p class="nsub">${COUNT.notes} Notes</p>${rows(NOTES, true)}</div>${bottom}</div>`;
  const deleted = () => `<div class="nv" data-v="deleted"><div class="ntop">${gb(I.back, 'back')}${gb('Edit', 'txt')}</div><div class="nsc">
    <h1>Recently Deleted</h1><p class="nsub">${COUNT.deleted} Note${COUNT.deleted === 1 ? '' : 's'}</p>
    <p class="ninfo">Deleted notes are removed from your devices after 30 days, which may require Notes to be open. Permanent deletion from iCloud may take up to 40 more days.</p>
    ${rows(DELETED).replace(/<h3>.*?<\/h3>/g, '')}</div>${bottom}</div>`;
  const note = n => `<div class="nv nnote" data-v="note"><div class="ntop">${gb(I.back, 'back')}<span class="sp"></span>${gb(I.undo)}<div class="gb npill">${I.share}${I.more}</div></div><div class="nsc">
    <h1>${n.title}</h1>
    ${n.items ? `<ul class="chk">${n.items.map((t, i) => `<li data-i="${i}"${n.done?.[i] ? ' class="on"' : ''}><i></i>${t}</li>`).join('')}</ul>` : (n.text || []).map(t => `<p class="ntxt">${t}</p>`).join('')}
  </div><div class="nbar"><div class="gb npill tools">${I.list + I.clip + I.pen}</div>${gb(I.compose, 'big')}</div></div>`;

  const el = document.createElement('section');
  el.id = 'notes'; el.className = 'appview';
  $('#apps').append(el);
  const stack = [];
  const reset = () => { el.innerHTML = folders(); stack.length = 0; };
  reset();
  APPVIEWS.notes = { el, light: true, close: () => setTimeout(reset, 400) };

  function push(html) {
    el.insertAdjacentHTML('beforeend', html);
    const v = el.lastElementChild;
    stack.push(v);
    requestAnimationFrame(() => requestAnimationFrame(() => v.classList.add('on')));
  }
  function pop() {
    const v = stack.pop();
    if (!v) return;
    v.classList.remove('on');
    setTimeout(() => v.remove(), 380);
  }
  let openNote;
  el.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('.back')) return pop();
    const go = t.closest('[data-go]')?.dataset.go;
    if (go) return push(go === 'list' ? list() : deleted());
    const row = t.closest('[data-note]');
    if (row) { openNote = NOTES[row.dataset.note]; return push(note(openNote)); }
    const li = t.closest('.chk li');
    if (li) { li.classList.toggle('on'); (openNote.done ??= [])[li.dataset.i] = li.classList.contains('on'); }
  });
})();
