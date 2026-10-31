'use strict';
/* ===== Gmail (inbox) ===== */
(() => {
  const G = 'assets/gmail/';
  const MAILS = [
    { av: 'info', from: 'info', date: 'Feb 28', subj: 'Your order 52603 is on its way', snip: '📦 Your order is on its way Hi Yeoju, Your order is on its way and will arrive soon.', read: true },
    { av: 'dnr', from: 'do-not-reply', date: 'Feb 28', subj: 'Hill tool center Checkout Return Reminder', snip: 'Dear Yeoju Eun: As a reminder, the following items are due back soon.', read: true },
    { av: 'handshake', from: 'Handshake', date: 'Feb 28', subj: '"Your first job alert": Arts of Life - Chicago', snip: 'Handshake YE New matches for your saved search' },
    { promo: true },
    { av: 'handshake', from: 'Handshake', date: 'Feb 27', subj: '"Search on 9/14/2024": Teaching Assistant', snip: 'Handshake YE New matches for your saved search' },
    { av: 'amazon', from: 'Amazon Marketplace', date: 'Feb 27', subj: 'Yeoju Eun, will you rate your transaction with us?', snip: 'Hi Yeoju Eun, Rate your experience with the seller' },
    { av: 'person', from: 'Donghyun Kim', date: 'Feb 26', subj: '누나 안녕', snip: 'ㅎㅎ', read: true, starred: true, open: true },
    { av: 'linkedin', from: 'LinkedIn', date: 'Feb 25', subj: 'Learning Spotlight: Cybersecurity Starter Kit', snip: 'Practical Skills for Staying Secure' },
    { av: 'linkedin', from: 'LinkedIn', date: 'Feb 24', subj: 'Yeoju, you appeared in 4 searches this week', snip: 'See who\'s looking at your profile' },
  ];
  const s = (d, w = 24) => `<svg viewBox="0 0 ${w} 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    menu: s('<path d="M4 6.5h16M4 12h16M4 17.5h16"/>'),
    star: s('<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" stroke-width="1.6"/>'),
    pen: s('<path d="M4 20h3.5L19 8.5 15.5 5 4 16.5z"/><path d="m13.5 7 3.5 3.5"/>'),
    mail: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 5h17a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.5v-11A1.5 1.5 0 0 1 3.5 5zM12 12.6 4 7.6V9l8 5 8-5V7.6z"/></svg>',
    video: s('<rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10.5 6-4v11l-6-4z"/>'),
    starOn: '<svg class="on" viewBox="0 0 24 24"><path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="#0b57d0"/></svg>',
    back: s('<path d="M15 4 7 12l8 8"/>'),
    archive: s('<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M3.5 9h17M12 11.5v5M9.5 14l2.5 2.5 2.5-2.5"/>'),
    trash: s('<path d="M4 6.5h16M9 6.5V4h6v2.5M6.5 6.5l1 13.5h9l1-13.5M10.5 10v7M13.5 10v7"/>'),
    unread: s('<path d="M14 5H4.5A1.5 1.5 0 0 0 3 6.5v11A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5V11"/><path d="m3.5 7 8.5 6 4-2.8"/><circle cx="19.5" cy="5.5" r="2" fill="currentColor" stroke="none"/>'),
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
    smile: s('<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".8" fill="currentColor"/><circle cx="15" cy="10" r=".8" fill="currentColor"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/>'),
    reply: s('<path d="M9 6 4 11l5 5"/><path d="M4 11h9a6 6 0 0 1 6 6v1"/>'),
    fwd: s('<path d="m15 6 5 5-5 5"/><path d="M20 11h-9a6 6 0 0 0-6 6v1"/>'),
    chat: s('<path d="M4 5h16v12H8l-4 3.5z"/>'),
    caret: s('<path d="m6 9 6 6 6-6"/>'),
    person: '<svg class="psn" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="var(--a)"/><circle cx="20" cy="15" r="6.5" fill="var(--b)"/><path d="M7.5 33.5c1.5-6 6.5-9 12.5-9s11 3 12.5 9a20 20 0 0 1-25 0z" fill="var(--b)"/></svg>',
    pdf: '<svg class="pdf" viewBox="0 0 18 18"><rect width="18" height="18" rx="2.5" fill="#db4437"/><text x="9" y="12.2" font-size="6.6" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif">PDF</text></svg>',
  };
  const row = m => m.promo
    ? `<div class="gm-row gm-promo"><img src="${G}tag.webp" alt="" class="tg"><div><b>All promotions</b><p class="sb">Ticketmaster - ONEUS, KATSEYE and more</p></div><span class="gm-new">99+ new</span></div>`
    : `<div class="gm-row${m.read ? '' : ' un'}"${m.open ? ` data-mail="${MAILS.indexOf(m)}"` : ''}>${m.av === 'person' ? I.person : `<img src="${G}${m.av}.webp" alt=""${m.av === 'amazon' ? ' class="sq"' : ''}>`}<div>
        <p class="fr"><span>${m.from}</span><time>${m.date}</time></p>
        <p class="sb">${m.subj}</p>
        <p class="sn"><span>${m.snip}</span>${m.starred ? I.starOn : I.star}</p>
        ${m.pdf ? `<span class="gm-att">${I.pdf}${m.pdf}</span>` : ''}
      </div></div>`;

  const el = document.createElement('section');
  el.id = 'gmail'; el.className = 'appview';
  el.innerHTML = `<div class="gm-sc"><!-- fixed list: more mail fades out below -->
      <div class="gm-search">${I.menu}<span>Search in mail</span><img src="${G}profile.webp" alt=""></div>
      <p class="gm-lbl">All inboxes</p>
      ${MAILS.map(row).join('')}
    </div>
    <div class="gm-fade"></div>
    <button class="gm-compose">${I.pen}Compose</button>
    <nav class="gm-nav"><span class="on">${I.mail}<b>99+</b></span><span>${I.video}</span></nav>`;
  const detail = m => `<div class="gm-mail">
      <div class="gm-bar"><button class="gm-back">${I.back}</button><span></span>${I.archive + I.trash + I.unread + I.dots}</div>
      <div class="gm-msc">
        <div class="gm-subj"><h1>${m.subj}<i class="ext">External</i><i>Inbox</i></h1>${I.starOn}</div>
        <div class="gm-from">${I.person}<div><p><b>${m.from}</b><time>${m.date}</time></p><p class="to">to me${I.caret}</p></div>${I.smile + I.reply + I.dots}</div>
        <p class="gm-body">${m.snip}</p>
      </div>
      <div class="gm-acts"><span>${I.reply}Reply</span><span>${I.fwd}Forward</span><span class="ic1">${I.chat}</span></div>
      <nav class="gm-nav"><span class="on">${I.mail}<b>99+</b></span><span>${I.chat}</span><span>${I.video}</span></nav>
    </div>`;
  el.addEventListener('click', e => {
    if (e.target.closest('.gm-back')) { const v = el.querySelector('.gm-mail'); v.classList.remove('on'); return setTimeout(() => v.remove(), 350); }
    const r = e.target.closest('[data-mail]');
    if (!r) return;
    el.insertAdjacentHTML('beforeend', detail(MAILS[r.dataset.mail]));
    const v = el.lastElementChild;
    requestAnimationFrame(() => requestAnimationFrame(() => v.classList.add('on')));
  });
  $('#apps').append(el);
  APPVIEWS.gmail = { el, light: true, close: () => setTimeout(() => { el.querySelector('.gm-sc').scrollTop = 0; el.querySelector('.gm-mail')?.remove(); }, 400) };
})();
