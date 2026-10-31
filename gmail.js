'use strict';
/* ===== Gmail (inbox) ===== */
(() => {
  const G = 'assets/gmail/';
  const MAILS = [
    { av: 'info', from: 'info', date: 'Oct 20', subj: 'Your order 52603 is on its way', snip: '📦 Your order is on its way Hi Hyeonju, Your order is on its way and will arrive soon.', read: true },
    { av: 'dnr', from: 'do-not-reply', date: 'Oct 20', subj: 'Sharp Instructional Shops Checkout Return Reminder', snip: 'Dear Yeoju Eun: As a reminder, the following items are due back soon.', read: true },
    { av: 'handshake', from: 'Handshake', date: 'Oct 20', subj: '"Your first job alert": Arts of Life - Chicago', snip: 'Handshake JL New matches for your saved search' },
    { promo: true },
    { av: 'handshake', from: 'Handshake', date: 'Oct 20', subj: '"Search on 2/23/2026": SAIC Teaching Assistant', snip: 'Handshake JL New matches for your saved search' },
    { av: 'amazon', from: 'Amazon Marketplace', date: 'Oct 20', subj: 'Yeoju Eun, will you rate your transaction with us?', snip: 'Hi Yeoju Eun, Rate your experience with the seller' },
    { av: 'p', from: 'Presidential Towers', date: 'Oct 20', subj: 'Presidential Towers | Give Blood, Give Life', snip: 'presidential-towers Dear Hyeonju, We\'re excited to host a blood drive', pdf: 'Blood drive.pdf' },
    { av: 'linkedin', from: 'LinkedIn', date: 'Oct 19', subj: 'Learning Spotlight: Cybersecurity Starter Kit', snip: 'Practical Skills for Staying Secure' },
    { av: 'linkedin', from: 'LinkedIn', date: 'Oct 19', subj: 'Yeoju, you appeared in 4 searches this week', snip: 'See who\'s looking at your profile' },
  ];
  const s = (d, w = 24) => `<svg viewBox="0 0 ${w} 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    menu: s('<path d="M4 6.5h16M4 12h16M4 17.5h16"/>'),
    star: s('<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" stroke-width="1.6"/>'),
    pen: s('<path d="M4 20h3.5L19 8.5 15.5 5 4 16.5z"/><path d="m13.5 7 3.5 3.5"/>'),
    mail: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 5h17a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.5v-11A1.5 1.5 0 0 1 3.5 5zM12 12.6 4 7.6V9l8 5 8-5V7.6z"/></svg>',
    video: s('<rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10.5 6-4v11l-6-4z"/>'),
    pdf: '<svg class="pdf" viewBox="0 0 18 18"><rect width="18" height="18" rx="2.5" fill="#db4437"/><text x="9" y="12.2" font-size="6.6" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif">PDF</text></svg>',
  };
  const row = m => m.promo
    ? `<div class="gm-row gm-promo"><img src="${G}tag.webp" alt="" class="tg"><div><b>All promotions</b><p class="sb">Ticketmaster - ONEUS, KATSEYE and more</p></div><span class="gm-new">99+ new</span></div>`
    : `<div class="gm-row${m.read ? '' : ' un'}"><img src="${G}${m.av}.webp" alt=""${m.av === 'amazon' ? ' class="sq"' : ''}><div>
        <p class="fr"><span>${m.from}</span><time>${m.date}</time></p>
        <p class="sb">${m.subj}</p>
        <p class="sn"><span>${m.snip}</span>${I.star}</p>
        ${m.pdf ? `<span class="gm-att">${I.pdf}${m.pdf}</span>` : ''}
      </div></div>`;

  const el = document.createElement('section');
  el.id = 'gmail'; el.className = 'appview';
  el.innerHTML = `<div class="gm-sc">
      <div class="gm-search">${I.menu}<span>Search in mail</span><img src="${G}me.webp" alt=""></div>
      <p class="gm-lbl">All inboxes</p>
      ${MAILS.map(row).join('')}
    </div>
    <button class="gm-compose">${I.pen}Compose</button>
    <nav class="gm-nav"><span class="on">${I.mail}<b>99+</b></span><span>${I.video}</span></nav>`;
  $('#apps').append(el);
  APPVIEWS.gmail = { el, light: true, close: () => setTimeout(() => (el.querySelector('.gm-sc').scrollTop = 0), 400) };
})();
