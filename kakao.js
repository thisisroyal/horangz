'use strict';
/* ===== KakaoTalk app ===== */
(() => {
  const ME = '은여주';
  const OPEN_CHAT = 686;                         // open-chat tab badge
  let unread = 530;                              // total unread shown on icon and tabs
  const roomUnread = {};
  const LIVE_FROM = Date.UTC(2025, 2, 7) / 6e4 + 22 * 60 + 38; // messages from 3/7 10:38 PM arrive live
  const FIRST = '성호오빠';                       // within a minute, this room's messages arrive first
  const VER = document.currentScript.src.split('?')[1] || '';
  // data sender name -> [display name, profile image]
  const PEOPLE = {
    '김동': ['김동', 'kimdong'], '비니비니언니': ['비니비니 언니', 'bini'], '상히기니': ['상히기니', 'gini'],
    '성호오빠': ['성호 오빠', 'sungho'], '운학이': ['운학이', 'woonhak'], '제로언니': ['제로 언니', 'zero'],
    '한동': ['한동', 'handong'], 'Myeong': ['Myeong', 'myeong'], '엄마': ['엄마', 'mom'], '아빠': ['아빠', 'dad'],
  };
  // rows in the Chats list that only show (not clickable): family room and official accounts
  const O = 'assets/kakao/official/';
  const STATIC = [
    { title: '가족', n: 3, av: ['mom', 'dad'], when: [2025, 3, 5, '오후 7:12'], text: 'Photo' },
    { title: '카카오톡 선물하기', icon: 'gift', when: [2025, 3, 4, '오후 3:27'], text: '주문이 완료되었습니다.\n자세한 사항은 주문내역을 통해 확인할 수 있습니다.' },
    { ad: true, title: '[메디힐] 수분흔적세럼 1+1 리필기획 특가', icon: 'mediheal', text: '메디힐' },
    { title: '카카오이모티콘', icon: 'emoticon', when: [2025, 3, 3, '오전 11:02'], text: '(광고)1년권의 기회, 곧 끝나요⏰' },
    { title: '다이소멤버십', icon: 'daiso', when: [2025, 3, 2, '오후 1:45'], text: '[다이소몰] 보유 중이신 쿠폰의 유효기간을 안내드립니다. ...', badge: 10 },
    { title: '내바보모임', n: 4, icon: 'babo', when: [2025, 3, 4, '오전 1:38'], text: '전시용 정신병아니고' },
    { title: '멜론', icon: 'melon', when: [2025, 3, 1, '오후 6:30'], text: '(광고)❤️4,600으로 6개월 음악 무제한' },
  ];
  const PLUS = [['photo', 'Photo'], ['camera', 'Camera'], ['call', 'Call'], ['gift', 'Gift Shop'], ['money', 'Money'], ['location', 'Location'],
    ['friendsloc', 'Friends<br>Location'], ['music', 'Music'], ['minigames', 'Mini Games'], ['file', 'File'], ['contacts', 'Contacts'], ['voicememo', 'Voice Memo']];
  const ROOMS = ['호랑이들', '11층', 'My girls', '김동', '한동', '성호오빠', '제로언니', 'Myeong', '상히기니'];
  const MEDIA = {                                // mediaKey -> [file in assets/media, width, height]
    MEDIA_1: ['drama', 900, 437], MEDIA_2: ['woonhak-selfie', 675, 900], MEDIA_3: ['handong-elevator', 675, 900],
    MEDIA_4: ['gini-blanket', 900, 676], MEDIA_NEMO: ['nemo', 416, 900], MEDIA_DORY: ['dory', 416, 900],
    MEDIA_SOCKS: ['socks', 665, 900], MEDIA_MORNING_MEME: ['morning-meme', 394, 507],
    MEDIA_CORPSE_BRIDE: ['corpse-bride', 528, 900], MEDIA_SUNGHO_PHOTO: ['sungho-photo', 675, 900],
    MEDIA_PULDDEUNDAEJI: ['pulddeundaeji', 620, 900],
  };
  const K = 'assets/kakao/', P = n => `assets/profile/${PEOPLE[n]?.[1] || 'bini'}.jpg?2`;
  const WD = ['일', '월', '화', '수', '목', '금', '토'];

  const ic = d => `<svg class="ic" viewBox="0 0 24 24">${d}</svg>`;
  const I = {
    search: ic('<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5.5 5.5"/>'),
    add: ic('<circle cx="9.5" cy="7.5" r="4"/><path d="M2 21c.5-4.3 3.5-7 7.5-7 2 0 3.7.6 5 1.7M19 13v7M15.5 16.5h7"/>'),
    gear: ic('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5l2 .3.6 2.4 1.7 1 2.4-.7 1.4 1.5-.7 2.4 1 1.7 2.4.6.3 2-.3 2-2.4.6-1 1.7.7 2.4-1.4 1.5-2.4-.7-1.7 1-.6 2.4-2 .3-2-.3-.6-2.4-1.7-1-2.4.7-1.4-1.5.7-2.4-1-1.7-2.4-.6L2.5 12l.3-2 2.4-.6 1-1.7-.7-2.4 1.4-1.5 2.4.7 1.7-1 .6-2.4z"/>'),
    newchat: ic('<path d="M12 3.5c-5 0-9 3.2-9 7.2 0 2.5 1.6 4.7 4 6l-.8 3.6 4-2.5c.6.1 1.2.1 1.8.1 5 0 9-3.2 9-7.2s-4-7.2-9-7.2z"/><path d="M12 7.5v6.5M8.8 10.7h6.4"/>'),
    back: '<svg class="ic" viewBox="0 0 14 24" style="stroke-width:2.2"><path d="M12 2 2 12l10 10"/></svg>',
    phone: ic('<path d="M21 16.5v3a1.8 1.8 0 0 1-2 1.8A17.8 17.8 0 0 1 2.7 5 1.8 1.8 0 0 1 4.5 3h3a1.8 1.8 0 0 1 1.8 1.5c.1.9.4 1.8.7 2.6a1.8 1.8 0 0 1-.4 1.9L8.4 10.2a14.4 14.4 0 0 0 5.4 5.4l1.2-1.2a1.8 1.8 0 0 1 1.9-.4c.8.3 1.7.6 2.6.7a1.8 1.8 0 0 1 1.5 1.8z"/>'),
    menu: ic('<path d="M3.5 5.5h17M3.5 12h17M3.5 18.5h17"/>'),
    plus: ic('<path d="M12 4v16M4 12h16" style="stroke-width:2.4"/>'),
    smile: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#d9d9d9"/><circle cx="12" cy="12" r="7.6" fill="none" stroke="#191919" stroke-width="1.8"/><circle cx="9.4" cy="10.6" r="1.2" fill="#191919"/><circle cx="14.6" cy="10.6" r="1.2" fill="#191919"/><path d="M8.9 13.6c1.6 1.9 4.6 1.9 6.2 0" fill="none" stroke="#191919" stroke-width="1.8" stroke-linecap="round"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M12 19V6M6.5 11.5 12 6l5.5 5.5" fill="none" stroke="#191919" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chev: ic('<path d="m9 5 7 7-7 7"/>'),
    down: ic('<path d="m5 9 7 7 7-7"/>'),
    pic: ic('<rect x="3" y="4.5" width="18" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 8.5"/>'),
    call: '<svg viewBox="0 0 24 24"><path d="M21 16.5v3a1.8 1.8 0 0 1-2 1.8A17.8 17.8 0 0 1 2.7 5 1.8 1.8 0 0 1 4.5 3h3a1.8 1.8 0 0 1 1.8 1.5c.1.9.4 1.8.7 2.6a1.8 1.8 0 0 1-.4 1.9L8.4 10.2a14.4 14.4 0 0 0 5.4 5.4l1.2-1.2a1.8 1.8 0 0 1 1.9-.4c.8.3 1.7.6 2.6.7a1.8 1.8 0 0 1 1.5 1.8z" fill="#1fb245"/></svg>',
    callx: '<svg viewBox="0 0 24 24"><path transform="translate(-1.5 2.5) scale(.95)" d="M21 16.5v3a1.8 1.8 0 0 1-2 1.8A17.8 17.8 0 0 1 2.7 5 1.8 1.8 0 0 1 4.5 3h3a1.8 1.8 0 0 1 1.8 1.5c.1.9.4 1.8.7 2.6a1.8 1.8 0 0 1-.4 1.9L8.4 10.2a14.4 14.4 0 0 0 5.4 5.4l1.2-1.2a1.8 1.8 0 0 1 1.9-.4c.8.3 1.7.6 2.6.7a1.8 1.8 0 0 1 1.5 1.8z" fill="#8e8e93"/><path d="m17.4 1.2 4.4 4.4m0-4.4-4.4 4.4" stroke="#8e8e93" stroke-width="1.7" stroke-linecap="round"/></svg>',
  };
  const NAV = [
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="7.3" r="4.6"/><path d="M3.2 21.5c0-5 3.9-8 8.8-8s8.8 3 8.8 8z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 2.8C6.3 2.8 1.8 6.5 1.8 11c0 2.8 1.7 5.2 4.3 6.7l-.9 3.8 4.3-2.7c.8.1 1.6.2 2.5.2 5.7 0 10.2-3.7 10.2-8.2S17.7 2.8 12 2.8z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 2.8C6.3 2.8 1.8 6.5 1.8 11c0 2.8 1.7 5.2 4.3 6.7l-.9 3.8 4.3-2.7c.8.1 1.6.2 2.5.2 5.7 0 10.2-3.7 10.2-8.2S17.7 2.8 12 2.8z"/><path d="M10 7.6v6.8l5.4-3.4z" fill="#f9f9fa"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M7.5 8V6.8a4.5 4.5 0 0 1 9 0V8h2.6l1.2 13.5H3.7L4.9 8zm2 0h5V6.8a2.5 2.5 0 0 0-5 0z"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="4" cy="12" r="2.3"/><circle cx="12" cy="12" r="2.3"/><circle cx="20" cy="12" r="2.3"/></svg>',
  ];

  // "@name" mentions of friends turn blue (longest names first so "성호 오빠" wins over "성호")
  let MENTION;
  const mention = t => {
    MENTION ??= new RegExp('@(' + [...new Set([ME, ...Object.keys(PEOPLE), ...Object.values(PEOPLE).map(p => p[0])])]
      .sort((a, b) => b.length - a.length).map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
    return t.replace(MENTION, '<span class="at">@$1</span>');
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const t12 = t => { const [ap, hm] = t.split(' '); return `${hm} ${ap === '오전' ? 'AM' : 'PM'}`; };
  const ymd = s => s.match(/(\d+)년 (\d+)월 (\d+)일/).slice(1).map(Number);
  const enDate = s => { const [y, m, d] = ymd(s); return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); };
  const mins = t => { const [ap, hm] = t.split(' '); let [h, m] = hm.split(':').map(Number); h %= 12; return (ap === '오후' ? h + 12 : h) * 60 + m; };
  const chiParts = d => Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', weekday: 'short', hourCycle: 'h23' }).formatToParts(d).map(x => [x.type, x.value]));

  let data, view, roomEl, roomKey;
  const el = document.createElement('section');
  el.id = 'kakao'; el.className = 'appview';
  $('#apps').append(el);
  let resetT;
  APPVIEWS.kakaotalk = { el, light: true, open: () => clearTimeout(resetT), close: () => (resetT = setTimeout(() => tab('friends'), 400)) };

  function load() {
    const s = document.createElement('script');
    s.src = 'data/chatData.js' + (VER && '?' + VER);
    s.onload = () => { data = window.chatData; readState(); queue = pending(); build(); setInterval(arrive, 400); };
    document.head.append(s);
  }
  load();

  /* ----- read counts (the yellow numbers) -----
     Before 3/7 everything is read, except 호랑이들 after 3/5 3:34 PM where 여주 never looked (a 1 stays).
     호랑이들 on 3/7 (history and live): the first message shows 8; each time someone speaks for the first time
     that day, every earlier count above 1 drops by one and their message shows the previous count minus one;
     a returning speaker changes nothing and repeats the previous count. Counts stay within 1-8 and never rise. */
  const GROUP = '호랑이들', D7 = Date.UTC(2025, 2, 7) / 6e4, KEEP1 = Date.UTC(2025, 2, 5) / 6e4 + 15 * 60 + 34;
  const spoke = new Set(), today = [];
  function speak(m) {
    const prev = today.length ? today.at(-1).unread : 9, fresh = !spoke.has(m.sender);
    if (fresh) { spoke.add(m.sender); today.forEach(t => t.unread > 1 && t.unread--); }
    m.unread = Math.min(8, Math.max(1, prev - (fresh ? 1 : 0)));
    today.push(m);
  }
  function readState() {
    for (const [k, msgs] of Object.entries(data)) {
      let date = '';
      for (const m of msgs) {
        if (m.type === 'date') { date = m.date; continue; }
        const [y, mo, d] = ymd(date), st = Date.UTC(y, mo - 1, d) / 6e4 + mins(m.time);
        if (st >= D7) { if (k === GROUP && st < LIVE_FROM) speak(m); continue; }
        if (k === GROUP && st > KEEP1) m.unread = 1; else delete m.unread;
      }
    }
  }


  /* ----- live messages: pulled out of the data, delivered when the phone clock reaches them ----- */
  let queue = [];
  function pending() {
    const list = [];
    for (const k of ROOMS) {
      const msgs = data[k]; let date = '', cut = -1;
      msgs.forEach((m, i) => {
        if (m.type === 'date') { date = m.date; return; }
        const [y, mo, d] = ymd(date), st = Date.UTC(y, mo - 1, d) / 6e4 + mins(m.time);
        if (st >= LIVE_FROM) { if (cut < 0) cut = i; list.push({ k, m, st, i }); }
      });
      if (cut < 0) continue;
      msgs.splice(cut);
      if (msgs.at(-1)?.type === 'date') list.find(x => x.k === k).date = msgs.pop();
    }
    list.sort((a, b) => a.st - b.st || (b.k === FIRST) - (a.k === FIRST) || a.i - b.i);
    const out = [];
    let last = null;                                // previous bubble in 호랑이들
    list.forEach(x => {
      const same = list.filter(y => y.st === x.st), n = same.indexOf(x);
      let at = START + (x.st - LIVE_FROM) * 6e4 + (0.6 + n * 50 / same.length) * 1e3;
      const { m } = x, parts = m.mediaKey ? [{ ...m, lines: undefined, extraLines: undefined }] : [];
      (m.lines || []).forEach(t => parts.push({ ...m, mediaKey: undefined, lines: [t], extraLines: undefined }));
      parts.forEach((obj, i) => {
        if (x.k === GROUP) {
          // same sender twice in a row: 5-8 real seconds apart; a new sender never lands before the previous bubble
          if (last) at = last.sender === m.sender ? last.at + (5e3 + Math.random() * 3e3) * SPEED : Math.max(at, last.at + 1500 * SPEED);
          last = { sender: m.sender, at };
        } else if (i) at += 1400;
        if (i) obj.part = true;
        out.push({ k: x.k, obj, date: i ? null : x.date, at });
      });
    });
    return out.sort((a, b) => a.at - b.at);
  }
  function arrive() {
    while (queue.length && queue[0].at <= simNow()) {
      const { k, obj, date } = queue.shift(), msgs = data[k];
      if (date) msgs.push(date);
      if (k === GROUP) speak(obj);
      msgs.push(obj);
      if (inRoom(k)) {
        const seen = atBottom();
        syncRoom(true);                            // only the new bubble is added; the dots (if any) stay below it
        if (!seen) newMsg(obj);
      } else { roomUnread[k] = (roomUnread[k] || 0) + 1; unread++; notify(k, obj); }
      badges(); refreshList();
    }
    // typing indicator: the next sender in the open room is "typing" for ~2.5s before the message lands
    const nx = queue[0], real = nx && inRoom(nx.k) && nearBottom() && nx.at - simNow() < 2600 * SPEED ? nx.obj.sender : null;
    // 성호 keeps starting and stopping typing in his room from 10:38 until 10:45
    const who = real || (tease && inRoom(FIRST) && simNow() < START + 7 * 6e4 ? FIRST : null);
    setTyping(who);
  }
  // typing dots live in one element that is reused, moved and faded; never re-rendered
  let tyTimer;
  function setTyping(who) {
    if (!roomEl) return;
    const box = msgBox();
    let row = box.querySelector('.ty-row');
    typing = who;
    if (!who) {
      if (row && !row.classList.contains('out')) { row.classList.add('out'); clearTimeout(tyTimer); tyTimer = setTimeout(() => row.remove(), 260); }
      return;
    }
    if (row && row.dataset.who !== who) { row.remove(); row = null; }
    if (row) {
      clearTimeout(tyTimer); row.classList.remove('out');
      if (row !== box.lastElementChild) box.append(row);   // keep the dots under the newest bubble
      return;
    }
    const end = atBottom();
    box.insertAdjacentHTML('beforeend', `<div class="m g t n ty-row pop" data-who="${esc(who)}"><img class="av" src="${P(who)}" alt=""><span class="who">${esc(PEOPLE[who]?.[0] || who)}</span><div class="b ty"><i></i><i></i><i></i></div></div>`);
    if (end) box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
  }
  let typing = null, tease = false;
  (function teaseLoop() {                         // irregular on/off rhythm: typing 1.5-6s, quiet 3-14s
    tease = !tease;
    setTimeout(teaseLoop, (tease ? 1500 + Math.random() * 4500 : 3000 + Math.random() * 11000));
  })();
  const inRoom = k => roomKey === k && roomEl?.classList.contains('on') && current === APPVIEWS.kakaotalk;
  const msgBox = () => roomEl.querySelector('.kt-msgs');
  const atBottom = () => { const b = msgBox(); return b.scrollHeight - b.scrollTop - b.clientHeight < 40; };
  const nearBottom = () => { const b = msgBox(); return b.scrollHeight - b.scrollTop - b.clientHeight < 260; };   // tolerant while a smooth scroll is still running
  function newMsg(m) {
    const b = roomEl.querySelector('.kt-new');
    b.querySelector('img').src = P(m.sender);
    b.querySelector('b').textContent = PEOPLE[m.sender]?.[0] || m.sender;
    b.querySelector('span').textContent = m.mediaKey ? 'Photo' : m.lines[0];
    b.hidden = false;
  }
  function badges() {
    setBadge('kakaotalk', unread);
    el.querySelectorAll('.kt-unread').forEach(b => b.textContent = unread);
  }
  const refreshList = () => {
    const l = el.querySelector('.kt-list'); if (!l) return;
    const y = l.scrollTop; l.outerHTML = list(); el.querySelector('.kt-list').scrollTop = y;
  };

  /* ----- banner notification ----- */
  const nt = document.createElement('div');
  nt.className = 'nt';
  nt.innerHTML = `<div class="nt-av"><img alt=""><img class="nt-app" src="assets/icons/kakaotalk.webp" alt=""></div><div class="nt-tx"><b></b><b class="rm"></b><p></p></div><time>now</time>`;
  let ntTimer, ntRoom;
  function notify(k, m) {
    ntRoom = k;
    const who = PEOPLE[m.sender]?.[0] || m.sender, text = m.mediaKey ? 'Photo' : m.lines[0];
    nt.querySelector('.nt-av img').src = P(m.sender);
    const rm = nt.querySelector('.rm');           // group chats: sender / room name / message
    nt.querySelector('b').textContent = who;
    rm.textContent = PEOPLE[k] ? '' : k; rm.hidden = !!PEOPLE[k];
    nt.querySelector('p').textContent = text;
    nt.classList.toggle('grp', !PEOPLE[k]);
    (body.dataset.state === 'land' ? $('#player') : $('#screen')).append(nt);
    nt.classList.remove('pop'); void nt.offsetWidth;
    nt.classList.add('on', 'pop');
    clearTimeout(ntTimer); ntTimer = setTimeout(() => nt.classList.remove('on'), 5000);
  }
  // swipe the banner up to dismiss it
  let sw = null;
  const up = e => { const k = parseFloat(dev.style.getPropertyValue('--k')) || 1; return (nt.parentElement.id === 'player' ? e.clientX - sw.x : sw.y - e.clientY) / k; };
  nt.addEventListener('pointerdown', e => { sw = { x: e.clientX, y: e.clientY }; nt.setPointerCapture(e.pointerId); nt.style.transition = 'none'; clearTimeout(ntTimer); });
  nt.addEventListener('pointermove', e => { if (sw) { const d = up(e); nt.style.transform = `translateY(${d > 0 ? -d : -d / 4}px)`; } });
  const end = e => {
    if (!sw) return;
    const d = up(e), tap = e.type === 'pointerup' && Math.hypot(e.clientX - sw.x, e.clientY - sw.y) < 8;
    sw = null; nt.style.transition = nt.style.transform = '';
    wasTap = tap;
    if (tap) return;                               // the click that follows opens the chat
    if (d > 30) nt.classList.remove('on'); else ntTimer = setTimeout(() => nt.classList.remove('on'), 3000);
  };
  // Open from the banner's own click (not pointerup): on phones the click arrives after pointerup and,
  // if the screen has already changed, lands on whatever chat row is now under the finger.
  let guard = 0, wasTap = false;
  nt.addEventListener('click', e => { e.stopPropagation(); if (wasTap) { wasTap = false; openFromBanner(); } });
  el.addEventListener('click', e => { if (performance.now() < guard && e.target.closest('.kt-room')) e.stopPropagation(); }, true);
  function openFromBanner() {                      // tap: jump straight into that chat
    guard = performance.now() + 600;
    nt.classList.remove('on');
    go('port');
    if (current !== APPVIEWS.kakaotalk) { closeApp(true); openApp('kakaotalk'); }
    tab('chats'); openRoom(ntRoom);
  }
  nt.addEventListener('pointerup', end); nt.addEventListener('pointercancel', end);

  /* ----- room helpers ----- */
  const members = k => [...new Set(data[k].filter(m => m.sender && m.sender !== ME).map(m => m.sender))];
  const title = k => PEOPLE[k]?.[0] || k;
  const lastInfo = k => {
    const msgs = data[k]; let date = '';
    for (const m of msgs) if (m.type === 'date') date = m.date;
    const m = msgs.at(-1), [y, mo, d] = ymd(date);
    const text = m.type === 'call' ? 'Missed voice call' : (m.extraLines || m.lines || ['Photo']).at(-1);
    return { stamp: Date.UTC(y, mo - 1, d) / 6e4 + mins(m.time), y, mo, d, time: m.time, text };
  };
  function when({ y, mo, d, time }) {
    const p = chiParts(simNow()), today = Date.UTC(+p.year, p.month - 1, +p.day), day = Date.UTC(y, mo - 1, d);
    if (day === today) return t12(time);
    if (today - day === 864e5) return 'Yesterday';
    const o = { month: 'short', day: 'numeric', timeZone: 'UTC' };
    if (y !== +p.year) o.year = 'numeric';
    return new Date(day).toLocaleDateString('en-US', o);
  }
  const groupAv = k => {
    if (PEOPLE[k]) return `<div class="av av1"><img src="${P(k)}" alt=""></div>`;
    const ms = members(k), n = ms.length > 2 ? 4 : 2;
    return `<div class="av av${n}">${ms.slice(0, n).map(s => `<img src="${P(s)}" alt="">`).join('')}</div>`;
  };

  /* ----- screens ----- */
  const head = (h1, icons, me) => `<div class="kt-head">${me ? `<img class="me" src="${K}me.webp" alt="">` : ''}<h1>${h1}</h1><div class="kt-icons">${icons}</div></div>`;
  const banner = `<img class="kt-banner" src="${K}banner.webp" alt="">`;

  function friends() {
    const names = Object.keys(PEOPLE).sort((a, b) => (/^[가-힣]/.test(b) - /^[가-힣]/.test(a)) || PEOPLE[a][0].localeCompare(PEOPLE[b][0], 'ko'));
    return `<div class="sc kt-friends">
      ${head(ME, I.search + I.add + `<img src="${K}gift.webp" alt="">` + I.gear, true)}
      <div class="kt-pills"><span class="on">Friends</span><span>Feed</span></div>
      ${banner}
      <p class="kt-label">AI 1</p>
      <div class="kt-row"><img src="${K}kanana.webp" alt=""><div><p>Kanana</p><small>Kakao AI, one step ahead in your chats</small></div></div>
      <div class="kt-hr"></div>
      <p class="kt-label">Friends 132<span><b>Alphabetical</b><em>·</em>Updates</span></p>
      <div class="kt-row"><img src="${K}recommend.webp" alt=""><div><p>Recommended Friends</p></div><span class="cnt">91${I.chev}</span></div>
      ${names.map(n => `<div class="kt-row"><img src="${P(n)}" alt=""><div><p>${esc(PEOPLE[n][0])}</p></div></div>`).join('')}${MORE}
    </div>`;
  }
  function chats() {
    return `<div class="sc kt-chats" hidden>
      ${head('Chats', I.search + I.newchat + I.gear)}
      <div class="kt-pills"><span class="on">All</span><span><img src="${K}pill-chat.webp" alt=""><i class="n kt-unread">${unread}</i></span><span>ChatGPT <i class="n">N</i></span><span class="i"><img src="${K}pill-call.webp" alt=""></span><span class="i"><img src="${K}pill-plus.webp" alt=""></span></div>
      ${banner}
      ${list()}
    </div>`;
  }
  // last row is cut and fades out: there seems to be more, but the list stops here
  const MORE = '<div class="kt-fade"></div>';     // thin fade over the bottom edge of the last row
  const staticRow = r => r.ad
    ? `<div class="kt-room kt-ad"><img class="oi" src="${O + r.icon}.webp" alt=""><div class="tx"><div class="nm"><b>${esc(r.title)}</b></div><p class="pv"><i class="adt">AD</i>${esc(r.text)}</p></div><span class="buy">구매하기</span></div>`
    : `<div class="kt-room kt-static">${r.icon ? `<img class="oi" src="${O + r.icon}.webp" alt="">` : `<div class="av av2">${r.av.map(a => `<img src="assets/profile/${a}.jpg?2" alt="">`).join('')}</div>`}<div class="tx"><div class="nm"><span style="display:flex;min-width:0"><b>${esc(r.title)}</b>${r.n ? `<i>${r.n}</i>` : ''}</span><time>${when(r)}</time></div><p class="pv">${esc(r.text)}</p></div>${r.badge ? `<b class="ur">${r.badge}</b>` : ''}</div>`;
  function list() {
    const st = STATIC.filter(r => !r.ad).map(r => { const [y, mo, d, time] = r.when; return { ...r, y, mo, d, time, stamp: Date.UTC(y, mo - 1, d) / 6e4 + mins(time) }; });
    const rows = [...ROOMS.map(k => ({ k, ...lastInfo(k) })), ...st].sort((a, b) => b.stamp - a.stamp);
    const ad = STATIC.find(r => r.ad), gi = rows.findIndex(r => r.icon === 'gift');
    return `<div class="kt-list">${rows.map((r, i) => {
        if (!r.k) return staticRow(r) + (i === gi ? staticRow(ad) : '');
        const n = PEOPLE[r.k] ? 0 : members(r.k).length + 1;
        return `<div class="kt-room" data-room="${esc(r.k)}">${groupAv(r.k)}<div class="tx"><div class="nm"><span style="display:flex;min-width:0"><b>${esc(title(r.k))}</b>${n ? `<i>${n}</i>` : ''}</span><time>${when(r)}</time></div><p class="pv">${esc(r.text)}</p></div>${roomUnread[r.k] ? `<b class="ur">${roomUnread[r.k]}</b>` : ''}</div>`;
      }).join('')}${MORE}</div>`;
  }

  function build() {
    el.innerHTML = '<div class="kt-sb"></div>' + friends() + chats() +
      `<nav class="kt-nav">${NAV.map((s, i) => `<span data-tab="${['friends', 'chats'][i] || ''}"${i ? '' : ' class="on"'}>${s}${i === 1 ? `<b class="kt-unread">${unread}</b>` : i === 2 ? `<b>${OPEN_CHAT}</b>` : i === 4 ? '<i class="dot"></i>' : ''}</span>`).join('')}</nav>
      <div class="kt-roomv">
        <div class="kt-rh"><button class="back">${I.back}<span class="kt-unread">${unread}</span></button><h2></h2><div class="kt-icons">${I.search + I.phone + I.menu}</div></div>
        <div class="kt-msgs"></div>
        <div class="kt-plus">${PLUS.map(([f, t], i) => `<span style="--i:${i}"><img src="assets/kakao/plus/${f}.webp" alt="">${t}</span>`).join('')}</div>
        <button class="kt-new" hidden><img alt=""><b></b><span></span>${I.down}</button>
        <form class="kt-in"><button type="button" class="plus" aria-label="More">${I.plus}</button><label class="kt-field"><input enterkeyhint="send" autocomplete="off" placeholder="Enter a message">${I.smile}</label><button type="button" class="hash">#</button><button class="send" aria-label="Send">${I.send}</button></form>
      </div>`;
    roomEl = el.querySelector('.kt-roomv');
    const nb = roomEl.querySelector('.kt-new'), box = msgBox();
    box.addEventListener('animationend', e => e.target.parentElement === box && e.target.classList.remove('pop'));
    nb.addEventListener('click', () => { nb.hidden = true; box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' }); });
    box.addEventListener('scroll', () => { if (atBottom()) nb.hidden = true; }, { passive: true });
    el.querySelector('.kt-nav').addEventListener('click', e => { const t = e.target.closest('[data-tab]')?.dataset.tab; t && tab(t); });
    el.addEventListener('click', e => { const r = e.target.closest('.kt-room[data-room]'); r && openRoom(r.dataset.room); });
    roomEl.querySelector('.back').addEventListener('click', closeRoom);
    const form = roomEl.querySelector('form'), input = form.querySelector('input');
    input.addEventListener('input', () => roomEl.classList.toggle('typing', !!input.value.trim()));
    // "+" opens the attachment panel (turns into ×); typing closes it
    const plus = (on = !roomEl.classList.contains('plus-on')) => {
      roomEl.classList.toggle('plus-on', on);
      const b = msgBox(), end = atBottom();
      if (on) input.blur();                        // the panel replaces the keyboard; never focus the input here
      if (end) { const keep = () => (b.scrollTop = b.scrollHeight); keep(); b.addEventListener('transitionend', keep, { once: true }); }
    };
    form.querySelector('.plus').addEventListener('pointerdown', e => e.preventDefault());   // keep the on-screen keyboard down
    form.querySelector('.plus').addEventListener('click', () => plus());
    input.addEventListener('focus', () => plus(false));
    form.addEventListener('submit', e => { e.preventDefault(); send(input.value); input.value = ''; roomEl.classList.remove('typing'); input.focus(); });
    keyboardLift(input);
  }

  function tab(t) {
    if (!data) return;
    view = t;
    el.querySelector('.kt-friends').hidden = t !== 'friends';
    el.querySelector('.kt-chats').hidden = t !== 'chats';
    el.querySelectorAll('.kt-nav [data-tab]').forEach(s => s.classList.toggle('on', s.dataset.tab === t));
    closeRoom(true);
  }

  /* ----- chat room ----- */
  const render = k => items(k).join('');
  function items(k) {
    const out = [], flat = [];
    let prevKey = '';
    for (const m of data[k]) {
      if (m.type === 'date') { out.push(flat.length); flat.push({ date: m.date }); prevKey = ''; continue; }
      const parts = [];
      if (m.type === 'call') parts.push({ call: 'voice' }, { call: 'missed' });
      else {
        if (m.mediaKey) parts.push({ media: m });
        (m.lines || []).forEach(t => parts.push({ text: t }));
        (m.extraLines || []).forEach(t => parts.push({ text: t }));
      }
      const key = m.sender + m.time;
      parts.forEach((p, i) => flat.push({ ...p, m, start: i === 0 && key !== prevKey, lastOfMsg: i === parts.length - 1 }));
      prevKey = key;
    }
    return flat.map((f, i) => {
      if (f.date) return `<div class="kt-date"><span>${enDate(f.date)}</span></div>`;
      const nx = flat[i + 1], endGroup = !nx || nx.date || nx.start;
      return bubble(f, endGroup, PEOPLE[k] ? 2 : members(k).length + 1);
    });
  }
  function bubble(f, endGroup, n) {
    const { m } = f, mine = m.isMe, named = f.start && !mine && n > 0;
    const body = f.call ? `<div class="b call">${f.call === 'voice' ? I.call + '보이스톡' : I.callx + '부재중'}</div>`
      : f.media ? (MEDIA[m.mediaKey] ? `<img class="b pic" src="assets/media/${MEDIA[m.mediaKey][0]}.webp" width="${MEDIA[m.mediaKey][1]}" height="${MEDIA[m.mediaKey][2]}" loading="lazy" alt="">` : `<div class="b ph">${I.pic}${esc(m.mediaCaption || '')}</div>`)
      : `<div class="b">${mention(esc(f.text))}</div>`;
    const meta = (f.lastOfMsg && m.unread ? `<i>${m.unread}</i>` : '') + (endGroup ? `<span>${t12(m.time)}</span>` : '');
    const cls = ['m', mine && 'me', f.start && 'g t', named && 'n'].filter(Boolean).join(' ');
    return `<div class="${cls}">${named ? `<img class="av" src="${P(m.sender)}" alt=""><span class="who">${esc(PEOPLE[m.sender]?.[0] || m.sender)}</span>` : ''}${body}<div class="meta">${meta}</div></div>`;
  }
  function openRoom(k) {
    roomKey = k;
    typing = null; shown = []; roomEl.querySelector('.kt-new').hidden = true;
    unread -= roomUnread[k] || 0; roomUnread[k] = 0; badges(); refreshList();
    const n = PEOPLE[k] ? 0 : members(k).length + 1;
    roomEl.querySelector('h2').innerHTML = esc(title(k)) + (n ? ` <i>${n}</i>` : '');
    roomEl.classList.add('on');
    syncRoom(false);
  }
  // Update the room in place: unchanged bubbles stay untouched, changed ones are swapped, new ones rise in.
  let shown = [];
  function syncRoom(anim) {
    const box = msgBox(), end = !anim || atBottom(), next = items(roomKey), ty = box.querySelector('.ty-row');
    if (!anim) { box.innerHTML = next.join(''); shown = next; typing = null; box.scrollTop = box.scrollHeight; return; }
    const kids = [...box.children].filter(n => n !== ty);
    next.forEach((h, i) => {
      if (h === shown[i]) return;
      const t = document.createElement('template'); t.innerHTML = h;
      const n = t.content.firstElementChild;
      if (kids[i]) kids[i].replaceWith(n);          // e.g. the time label moving to the newest bubble
      else { n.classList.add('pop'); box.insertBefore(n, ty); }
    });
    shown = next;
    if (end) box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
  }

  function closeRoom(instant) {
    if (!roomEl) return;
    roomEl.querySelector('input').blur(); roomEl.classList.remove('plus-on');
    roomEl.style.transition = instant === true ? 'none' : '';
    roomEl.classList.remove('on');
    if (instant === true) { roomEl.offsetWidth; roomEl.style.transition = ''; }
    if (instant !== true) refreshList();
  }
  function send(text) {
    text = text.trim();
    if (!text || !roomKey) return;
    const p = chiParts(simNow()), msgs = data[roomKey], h = +p.hour;
    const date = `${p.year}년 ${p.month}월 ${p.day}일 ${WD[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()]}요일`;
    if (![...msgs].reverse().find(m => m.type === 'date')?.date.startsWith(date.split(' ').slice(0, 3).join(' '))) msgs.push({ type: 'date', date });
    const n = PEOPLE[roomKey] ? 1 : members(roomKey).length;
    const mine = { sender: ME, isMe: true, time: `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${p.minute}`, unread: n, lines: [text] };
    if (roomKey === GROUP) speak(mine);
    msgs.push(mine);
    syncRoom(true);
  }

  /* ----- keep the input above the on-screen keyboard (lifts the whole phone) ----- */
  function keyboardLift(input) {
    const vv = window.visualViewport;
    if (!vv) return;
    let base = 0;
    const field = input.closest('.kt-field');
    const update = () => {
      const lift = document.activeElement === input ? Math.min(0, vv.offsetTop + vv.height - 10 - base) : 0;
      dev.style.setProperty('--ky', lift + 'px');
    };
    input.addEventListener('focus', () => {
      base = field.getBoundingClientRect().bottom - (parseFloat(dev.style.getPropertyValue('--ky')) || 0);
      setTimeout(update, 250);
    });
    input.addEventListener('blur', () => setTimeout(update, 50));
    vv.addEventListener('resize', update);
  }
})();
