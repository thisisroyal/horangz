'use strict';
/* ===== YouTube Music (library screen) ===== */
(() => {
  const A = 'assets/ytm/';
  const CHECK = '<svg class="ck" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#aaa"/><path d="m6 10.2 2.7 2.6L14 7.6" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const PIN = '<svg class="ck" viewBox="0 0 20 20"><path d="M12.5 2.5 17.5 7.5l-2.2.6-3 3 .3 3.6-1.4 1.4-3.4-3.4L4 16.5l-.5-.5 3.8-3.8L4 8.8l1.4-1.4 3.6.3 3-3z" fill="#aaa"/></svg>';
  const LIST = [
    { img: 'liked', title: '좋아요 표시한 음악', sub: `${PIN}자동 재생목록` },
    { img: 'labor', title: '노동요', sub: `${CHECK}재생목록 • royalchristmassy • 트랙 16개` },
    { img: 'pl2', title: '작업용', sub: `${CHECK}재생목록 • royalchristmassy • 트랙 26개` },
    { img: 'bnd', title: 'BOYNEXTDOOR', sub: '아티스트 • 구독자 254만명', round: true },
    { img: 'lazy', title: '늘어지기', sub: `${CHECK}재생목록 • royalchristmassy • 트랙 21개` },
  ];
  const CHIPS = ['오프라인 저장', '재생목록', '노래', '앨범', '아티스트'];
  const s = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    hist: s('<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6l-2.5 2.5"/><path d="M3.5 4v4.5H8M12 7.5V12l3 2"/>'),
    search: s('<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>'),
    down: s('<path d="m5 9 7 7 7-7"/>'),
    grid: s('<rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.2"/>'),
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
    plus: s('<path d="M12 4v16M4 12h16"/>'),
    cast: s('<path d="M3 8V6a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 6v12a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="M3 11.5a8 8 0 0 1 8 8M3 15a4.5 4.5 0 0 1 4.5 4.5"/><circle cx="3.6" cy="19" r=".6" fill="currentColor"/>'),
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 4.3v15.4a.8.8 0 0 0 1.2.7l12.4-7.7a.8.8 0 0 0 0-1.4L7.7 3.6a.8.8 0 0 0-1.2.7z"/></svg>',
    home: s('<path d="M4 10.5 12 4l8 6.5V20h-5.5v-6h-5v6H4z"/>'),
    sample: s('<path d="M4 5v14l8-7zM12 5v14l8-7z"/>'),
    lib: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.5 3h13a1 1 0 0 1 1 1v17l-7.5-4.5L4.5 21V4a1 1 0 0 1 1-1z"/></svg>',
  };

  const el = document.createElement('section');
  el.id = 'ytm'; el.className = 'appview';
  el.innerHTML = `<div class="ym-sc">
      <header class="ym-head"><h1>보관함</h1>${I.hist}${I.search}<img src="${A}profile.webp" alt=""></header>
      <div class="ym-chips">${CHIPS.map(c => `<span>${c}</span>`).join('')}</div>
      <div class="ym-sort"><span>최근 활동${I.down}</span>${I.grid}</div>
      ${LIST.map(r => `<div class="ym-row"><img src="${A}${r.img}.webp" alt=""${r.round ? ' class="rd"' : ''}><div><b>${r.title}</b><p>${r.sub}</p></div>${I.more}</div>`).join('')}
    </div>
    <button class="ym-new">${I.plus}새로 만들기</button>
    <div class="ym-mini"><img src="${A}hellyeah.webp" alt=""><div><b>Hell Yeah</b><p><i>E</i>Old Man Saxon</p></div>${I.cast}${I.play}<span class="ym-prog"></span></div>
    <nav class="ym-nav"><span>${I.home}홈</span><span>${I.sample}샘플</span><span>${I.search}검색</span><span class="on">${I.lib}보관함</span></nav>`;
  $('#apps').append(el);
  APPVIEWS.ytmusic = { el, close: () => setTimeout(() => (el.querySelector('.ym-sc').scrollTop = 0), 400) };
})();
