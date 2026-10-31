'use strict';
/* ===== Notes app ===== */
(() => {
  const dayNum = d => Date.UTC(d[0], d[1] - 1, d[2]) / 864e5;
  const NOTES = [
    { title: 'H마트', date: [2025, 3, 5], items: ['미역', '불닭', '어묵꼬치', '유부초밥', '투컵두부'] },
    { title: '작업 메모', date: [2025, 2, 27], text: ['자투리 실크들은 내가 고를수 없다.'] },
    { title: '코스트코', date: [2025, 2, 25], items: ['계란', '스테이크 소고기', '모짜렐라 치즈', '붕어빵', '냉동소고기 한팩', '새우 한팩', '오렌지나 망고'] },
    { title: '한국가면', date: [2024, 11, 28], text: ['차돌박이삼겹살스테이크짧풍탕수육짜장면김치찌개된장찌개계란찜계란말 이새우죽새우볶음밥계란햄뷰음밥군만두밥미역국소고기무국콩나물돈까스떡볶이우동오뎅계란후라이너구리신라면진라면잔치국수설렁탕치킨후라이드치킨양념치킨마라탕휘귀연어초밥회회덮밥물회마라상권꿔바로우가정식소시지마주서기불닭볶음면로제떡볶이감자튀김햄버거새우장연어장불고기한우랍스타아제마버블티크림파스타토마토파스타치즈크림라면뿌링클굽네치킨배떡쌀국수곱창 소고기돼지고기오리고기전빵밀크티군만두톨만두잡채사탕젤리초콜릿마시멜로우과자아이스크림족발보쌈찜닭마카롱츄러스솜사탕스테이크바베큐서브웨이초코소라빵초코케이크생크림케이크아이스크림케이크베이글햄치즈샌드위치군고구마호박고구마샤브샤브월남샘갈비찜비빔밥타코야끼킹크랩치즈불파스타사과북숭아귤오렌지바나나'] },
    { title: '작품 크기', date: [2024, 12, 9], text: ['노란파란 30.5 x 40.5 in', '주황 30x30in', '자주색\n29 x 22.5in', '파란색\n26.5 x 27', '콜드왁스 가로작품\n12x9', '콜드왁스 세로작품\n6x12'] },
    { title: '와이파이', date: [2024, 10, 7], plain: true, text: ['xfinity', '<u class="ln">1599-3114</u>'] },
    { title: 'Unsized paper kitikata', date: [2024, 11, 3], plain: true, joined: true, text: ['Light green , ??'] },
    { title: '너무졸리고배고프고 이게 거지아니면뭐임', date: [2024, 10, 22], time: '12:21 PM', preview: 'No additional text',
      text: ['ㅋㅋㅋㅋㅋㅋ 은여주개웃겨ㅜㅜ', '언니 배안고파??', '고파ㅜㅜ', '이거다듣고 머먹을래', '<u class="spl">치펄ㅓ르레</u>??', 'ㄱㄱ'] },
  ].sort((a, b) => dayNum(b.date) - dayNum(a.date));
  const DELETED = [{ title: '성호오빠 공원', date: [2025, 3, 4], text: ['챙겨야할것'], items: ['돗자리 (엉호가가져오기로함', '와인?', '샌드위치보단밥같은거', '몰라기억안남 나중에 추가'] }];
  const COUNT = { all: 8, notes: 8, quick: 0, deleted: 1, pinnedQuick: 1 };
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
  const section = d => {
    const n = today() - dayNum(d), y = new Date(today() * 864e5).getUTCFullYear();
    return n === 0 ? 'Today' : n === 1 ? 'Yesterday' : n < 7 ? 'Previous 7 Days' : n < 30 ? 'Previous 30 Days'
      : d[0] === y ? new Date(dayNum(d) * 864e5).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' }) : String(d[0]);
  };
  const preview = n => n.preview || ((n.text || n.items || [])[0] || 'No additional text').replace(/<[^>]+>/g, '').split('\n')[0];
  const rows = (list, pre = '') => {
    const groups = new Map();                     // Map keeps order ("2024" would jump first in a plain object)
    list.forEach((n, i) => { const h = section(n.date); groups.has(h) || groups.set(h, []); groups.get(h).push(`<div class="nrow" data-note="${pre}${i}"><b>${n.title}</b><p><span>${label(n.date)}</span>${preview(n)}</p></div>`); });
    return [...groups].map(([h, r]) => `<h3>${h}</h3><div class="ncard">${r.join('')}</div>`).join('');
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
  </div>${bottom}</div>`;
  const list = () => `<div class="nv" data-v="list"><div class="ntop">${gb(I.back, 'back')}${gb(I.more)}</div><div class="nsc">
    <h1>Notes</h1><p class="nsub">${COUNT.notes} Notes</p>${rows(NOTES)}</div>${bottom}</div>`;
  const deleted = () => `<div class="nv" data-v="deleted"><div class="ntop">${gb(I.back, 'back')}${gb('Edit', 'txt')}</div><div class="nsc">
    <h1>Recently Deleted</h1><p class="nsub">${COUNT.deleted} Note${COUNT.deleted === 1 ? '' : 's'}</p>
    <p class="ninfo">Deleted notes are removed from your devices after 30 days, which may require Notes to be open. Permanent deletion from iCloud may take up to 40 more days.</p>
    ${rows(DELETED, 'd').replace(/<h3>.*?<\/h3>/g, '')}</div>${bottom}</div>`;
  const note = n => `<div class="nv nnote" data-v="note"><div class="ntop">${gb(I.back, 'back')}<span class="sp"></span>${n.plain ? '' : gb(I.undo)}<div class="gb npill">${I.share}${I.more}</div></div><div class="nsc">
    ${n.time ? `<p class="nstamp">${new Date(dayNum(n.date) * 864e5).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })} at ${n.time}</p>` : ''}
    ${n.plain ? (n.joined ? `<p class="ntxt">${n.title}\n${n.text.join('\n')}</p>` : [n.title, ...n.text].map(t => `<p class="ntxt">${t}</p>`).join('')) : `<h1>${n.title}</h1>${(n.text || []).map(t => `<p class="ntxt">${t}</p>`).join('')}`}
    ${n.items ? `<ul class="chk">${n.items.map((t, i) => `<li data-i="${i}"${n.done?.[i] ? ' class="on"' : ''}><i></i>${t}</li>`).join('')}</ul>` : ''}
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
    if (row) { const id = row.dataset.note; openNote = id[0] === 'd' ? DELETED[id.slice(1)] : NOTES[id]; return push(note(openNote)); }
    const li = t.closest('.chk li');
    if (li) { li.classList.toggle('on'); (openNote.done ??= [])[li.dataset.i] = li.classList.contains('on'); }
  });
})();
