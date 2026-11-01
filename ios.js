'use strict';
/* ===== Phone (Calls) and Messages (iMessage) ===== */
(() => {
  const pic = () => 'assets/profile/ios-anon.svg';   // no contact photos saved: iOS default for everyone
  const sv = (d, vb = '0 0 24 24') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    phone: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.6 16.1v3a1.9 1.9 0 0 1-2.1 1.9A18.4 18.4 0 0 1 3 5.5 1.9 1.9 0 0 1 4.9 3.4h3a1.9 1.9 0 0 1 1.9 1.6c.1.9.4 1.8.7 2.6a1.9 1.9 0 0 1-.4 2L8.8 10.9a15 15 0 0 0 4.3 4.3l1.3-1.3a1.9 1.9 0 0 1 2-.4c.8.3 1.7.6 2.6.7a1.9 1.9 0 0 1 1.6 1.9z"/></svg>',
    inc: sv('<path d="M17 7 7 17M7 9v8h8"/>'), out: sv('<path d="M7 17 17 7M9 7h8v8"/>'),
    filter: sv('<path d="M4 7h16M6.5 12h11M9 17h6"/>'),
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 6.5V12H8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
    person: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="9.3" r="3.6" fill="#fff"/><path d="M5.5 18.2c1.4-2.6 3.8-3.8 6.5-3.8s5.1 1.2 6.5 3.8a9.9 9.9 0 0 1-13 0z" fill="#fff"/></svg>',
    keypad: '<svg viewBox="0 0 24 24" fill="currentColor">' + [5, 12, 19].flatMap(y => [5, 12, 19].map(x => `<circle cx="${x}" cy="${y}" r="2.6"/>`)).join('') + '<circle cx="12" cy="24.5" r="2.6"/></svg>',
    search: sv('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>'),
    mic: sv('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
    compose: sv('<path d="M11 4.5H6a2 2 0 0 0-2 2v11.5a2 2 0 0 0 2 2h11.5a2 2 0 0 0 2-2V13"/><path d="M18.3 3.2a1.8 1.8 0 0 1 2.5 2.5L12 14.5l-3.3.8.8-3.3z"/>'),
    chev: sv('<path d="m9 5 7 7-7 7"/>'), back: sv('<path d="M15 4 7 12l8 8"/>'),
    video: sv('<rect x="2.5" y="6" width="13.5" height="12" rx="2.5"/><path d="m16 10.3 5.5-3.3v10l-5.5-3.3z"/>'),
    plus: sv('<path d="M12 4.5v15M4.5 12h15"/>'),
    wave: sv('<path d="M5 10v4M8.5 7v10M12 9v6M15.5 6v12M19 10v4"/>'),
  };
  const anon = '<svg class="anon" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="url(#ios-av)"/><circle cx="20" cy="15.2" r="6.6" fill="#fff"/><path d="M8.3 31.3c2.4-4.6 6.8-7.2 11.7-7.2s9.3 2.6 11.7 7.2a17 17 0 0 1-23.4 0z" fill="#fff"/></svg>';
  const tag = '<i class="ios-tag">미국</i>';
  const chk = '<i class="ios-chk"><svg viewBox="0 0 12 12"><path d="m3 6.2 2 2L9 4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></i>';
  const app = (id, html) => {
    const el = document.createElement('section');
    el.id = id; el.className = 'appview ios';
    el.innerHTML = html;
    $('#apps').append(el);
    return el;
  };
  const scrollTop = el => setTimeout(() => el.querySelectorAll('.ios-sc').forEach(s => s.scrollTop = 0), 400);

  /* ---------- Calls ---------- */
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const KINDS = ['in', 'missed', 'out'], LABELS = ['phone', 'mobile'];
  const pick = a => a[Math.random() * a.length | 0];
  const call = (who, kind = pick(KINDS), label = pick(LABELS)) => ({ who, kind, label: label + (kind !== 'out' && Math.random() < .35 ? ' (2)' : '') });
  const DATES = ['3/5/25', '3/4/25', '3/4/25', '3/2/25', '2/28/25', '2/26/25', '2/23/25'];
  const day = d => { const [m, dd, y] = d.split('/'); return y * 1e4 + m * 100 + +dd; };
  const calls = [
    ...[call('한동', 'missed', 'phone'), call('한동', 'in', 'phone'), call('한동', 'out', 'phone')].map(c => ({ ...c, date: '3/6/25' })),
    ...shuffle([call('엄마'), call('김동'), call('비니비니언니'), call('비니비니언니'), call('운학이'), call('운학이'), call('상히기니')]).map((c, i) => ({ ...c, date: DATES[i] })),
    { ...call('비니비니언니', 'out', 'mobile'), date: '3/5/25' },      // 16 s
    { ...call('성호오빠', 'in', 'mobile'), date: '2/20/25' },
    { ...call('김동', 'in'), date: '2/12/25' },
    { ...call('성호오빠', 'in', 'mobile'), date: '2/11/25' },
    { ...call('상히기니', 'out'), date: '2/11/25' },
    { ...call('비니비니언니', 'in', 'mobile'), date: '2/18/25' },      // 6:25 PM
    { ...call('비니비니언니', 'missed', 'mobile'), date: '2/17/25' },  // 4:06 PM, then "콜백해줘"
    { ...call('제로언니', 'out'), date: `${(z => `${z.getUTCMonth() + 1}/${z.getUTCDate()}`)(new Date(Date.UTC(2025, 1, 17 + Math.random() * 18 | 0)))}/25` },  // random day 2/17-3/6
  ].sort((a, b) => day(b.date) - day(a.date));
  const callRow = c => `<div class="ios-row cl">
      <img class="av" src="${pic(c.who)}" alt="">
      <div class="tx"><b${c.kind === 'missed' ? ' class="red"' : ''}>${c.who}</b><p>${c.kind === 'out' ? I.out : I.inc}${tag}${c.kind === 'out' ? '' : chk}${c.label}</p></div>
      <time>${c.date}</time><span class="ios-cbtn">${I.phone}</span></div>`;
  const ph = app('phone-app', `
    <div class="ios-sc">${calls.map(callRow).join('')}<div class="ios-fade"></div></div>
    <header class="ios-hd"><span class="pill">Edit</span><h1>Calls</h1><span class="circ">${I.filter}</span></header>
    <nav class="ios-tabs"><div class="glass3"><span class="on">${I.clock}Calls</span><span>${I.person}Contacts</span><span>${I.keypad}Keypad</span></div><span class="circ">${I.search}</span></nav>`);
  APPVIEWS.phone = { el: ph, light: true, close: () => scrollTop(ph) };

  /* ---------- Messages ---------- */
  const THREADS = [
    { n: '+1 (415) 997-2702', t: '11:30 AM', p: '사랑하는 고객님, 주문하신 상품 배송이 완료되었습니다. 주문 확인 및 배송 만족도 평가는 여기에서 해주세요.', us: 1 },
    { n: '비니비니언니 및 제로언니 young', t: '9:49 AM', p: '비니비니언니님이 ‘귀엽다’에 하트 표시함', group: 1, dot: 1 },
    { n: '85938', t: '8:20 AM', p: 'You may reply STOP to opt-out of text messages at any time.', us: 1, dot: 1 },
    { n: '+1 (949) 558-2436', t: 'Yesterday', p: 'Going', us: 1 },
    { n: '78727', t: 'Wednesday', p: 'Wildflower Cases: more solid colorways, coming right up! shop the new drop now', us: 1 },
    { n: '+1 (833) 819-2217', t: 'Tuesday', p: '[Minitable]Haidilao - Chicago: Yeoju Eun for 5 on 2025/03/08 18:30. Your table will be held for 15 minutes.', us: 1, dot: 1 },
    { n: '729725', t: 'Sunday', p: 'PayPal: 076786 is your security code. Don\'t share it.', us: 1, dot: 1 },
    { n: '24273', t: 'Sunday', p: 'Chase | Zelle(R): DONGMIN HAN sent you $7.00 & it\'s ready now. Reply STOP to cancel.', us: 1, dot: 1 },
    { n: '비니비니언니', t: '2/18/25', p: '네!!!!!', who: '비니비니언니', open: 'bini' },
    { n: '상히기니', t: '2/17/25', p: '잠만...', who: '상히기니', open: 'gini' },
  ];
  const thAv = t => t.group ? `<span class="av grp"><img src="${pic('비니비니언니')}" alt=""><img class="bd" src="${pic('제로언니')}" alt=""></span>`
    : t.who ? `<img class="av" src="${pic(t.who)}" alt="">` : `<span class="av">${anon}</span>`;
  const thRow = t => `<div class="ios-row th${t.open ? ' go' : ''}"${t.open ? ` data-chat="${t.open}"` : ''}>${t.dot ? '<i class="dot"></i>' : ''}${thAv(t)}
      <div class="tx"><div class="nm"><b>${t.n}</b><time>${t.t}</time>${I.chev}</div><p>${t.us ? tag : ''}${t.p}</p></div></div>`;

  // iMessage conversations that open
  const CHATS = {
    bini: ['비니비니언니', [
      ['stamp', 'Mon, Feb 17', '4:06 PM'],
      ['in', '여주'], ['in', '시간되면 콜백해줘!'],
      ['stamp', 'Tue, Feb 18', '5:32 PM'],
      ['in', '여주야 바빠?'], ['in', '밥 먹자!!'],
      ['out', 'ㅋㅋㅋㅋ ㅠㅠ'], ['out', '잘먹었습니다~~~'],
      ['in', '그래 밥 챙기면서 해'],
      ['out', '네!!!!!'], ['read', '2/18/25'],
    ]],
    gini: ['상히기니', [
      ['stamp', 'Mon, Feb 17', '5:03 PM'],
      ['in', '어이'], ['in', '미스 시들시들'],
      ['out', 'why'],
      ['in', '미스터 해롱해롱과'], ['in', '밥한끼?'],
      ['out', '?'], ['out', '그게 누구지??'],
      ['in', '나.'],
      ['out', 'ㅋㅋㅋㅋㅋ'], ['out', '잠만...'], ['read', '2/17/25'],
    ]],
  };
  const chatHtml = CHAT => CHAT.map(([k, a, b], i) => {
    if (k === 'stamp') return `<p class="im-st"><b>${a}</b> at ${b}</p>`;
    if (k === 'read') return `<p class="im-rd"><b>읽음:</b> ${a}</p>`;
    const nx = CHAT[i + 1], tail = !nx || nx[0] !== k;
    return `<div class="im ${k}${tail ? ' tail' : ''}"><span>${a}</span></div>`;
  }).join('');

  const ms = app('msg-app', `
    <svg width="0" height="0" style="position:absolute"><defs><linearGradient id="ios-av" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9b4d6"/><stop offset="1" stop-color="#7f8ab8"/></linearGradient></defs></svg>
    <div class="ios-list">
      <div class="ios-sc">${THREADS.map(thRow).join('')}<div class="ios-fade"></div></div>
      <header class="ios-hd"><span class="pill">편집</span><h1>메시지</h1><span class="circ">${I.filter}</span></header>
      <nav class="ios-msbar"><span class="srch">${I.search}<em>검색</em>${I.mic}</span><span class="circ">${I.compose}</span></nav>
    </div>
    <div class="im-room">
      <div class="ios-sc im-sc"></div>
      <header class="im-hd"><button class="pill im-back">${I.back}<i>176</i></button><div class="im-who"><img src="${pic()}" alt=""><span><b></b>${I.chev}</span></div><span class="circ">${I.video}</span></header>
      <div class="im-in"><span class="circ">${I.plus}</span><span class="im-field">iMessage${I.wave}</span></div>
    </div>`);
  const room = ms.querySelector('.im-room'), imsc = ms.querySelector('.im-sc');
  ms.querySelector('.ios-list').addEventListener('click', e => {
    const c = CHATS[e.target.closest('[data-chat]')?.dataset.chat];
    if (!c) return;
    room.querySelector('.im-who b').textContent = c[0];
    imsc.innerHTML = chatHtml(c[1]);
    ms.classList.add('in-room');
    imsc.scrollTop = imsc.scrollHeight;
  });
  ms.querySelector('.im-back').addEventListener('click', () => ms.classList.remove('in-room'));
  APPVIEWS.messages = { el: ms, light: true, close: () => setTimeout(() => { ms.classList.add('instant'); ms.classList.remove('in-room'); scrollTop(ms); requestAnimationFrame(() => ms.classList.remove('instant')); }, 400) };
})();
