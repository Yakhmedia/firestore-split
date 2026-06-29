/* ============================================================
   FIRE STORE — MAIN JAVASCRIPT
   main.js
   ============================================================ */

/* ============================================================
   DATA — HUB: MOVIES & TV SHOWS
   ============================================================ */
// poster: TMDB CDN (no API key needed). bg gradient shows if image fails.
const TMDB = 'https://image.tmdb.org/t/p/w500';
const mediaItems = [
  { type: 'series', title: 'House of the Dragon', meta: 'Season 3 · Fantasy Drama', network: 'HBO', rating: '★★★★★', bg: 'linear-gradient(135deg,#1a0a2e,#4a1060)', poster: `${TMDB}/z2yahl2uefxDCl0nogcRBstwruJ.jpg` },
  { type: 'series', title: 'The Bear', meta: 'Final Season · Comedy Drama', network: 'Hulu', rating: '★★★★★', bg: 'linear-gradient(135deg,#1a0a00,#3a1800)', poster: `${TMDB}/4fVddnbhcmzRZE14NJY03GKS6Fn.jpg` },
  { type: 'series', title: 'Shōgun', meta: 'Season 2 · Historical Epic', network: 'Hulu', rating: '★★★★★', bg: 'linear-gradient(135deg,#1a1005,#3a2510)', poster: `${TMDB}/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg` },
  { type: 'movie', title: 'Deadpool & Wolverine', meta: '2024 · Marvel Action', network: 'Disney+', rating: '★★★★★', bg: 'linear-gradient(135deg,#2e0a0a,#601010)', poster: `${TMDB}/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg` },
  { type: 'movie', title: 'Inside Out 2', meta: '2024 · Pixar Animation', network: 'Disney+', rating: '★★★★★', bg: 'linear-gradient(135deg,#0d1a2e,#1a3a60)', poster: `${TMDB}/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg` },
  { type: 'series', title: 'The Boys', meta: 'Season 4 · Superhero Satire', network: 'Amazon Prime', rating: '★★★★☆', bg: 'linear-gradient(135deg,#2e0a0a,#3a0008)', poster: `${TMDB}/in1R2dDc421JxsoRWaIIAqVI2KE.jpg` },
];

/* ============================================================
   DATA — HUB: US SPORTS
   ============================================================ */
// image: Unsplash sport-specific action photos
const IMG = {
  nfl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
  nba: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80',
  ufc: 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=600&q=80',
  mlb: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80',
  boxing: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&q=80',
  soccer: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80',
  golf: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=80',
  cinema: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
  drama: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
  tennis: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80',
  nascar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
};

const usSportsEvents = [
  { league: 'mlb', team1: 'Dodgers', team2: 'Padres', date: 'Sun, Jun 28 · 8:10 PM ET', network: 'NBC / Peacock', stadium: 'Petco Park, San Diego', status: 'live', image: IMG.mlb },
  { league: 'mlb', team1: 'Yankees', team2: 'Red Sox', date: 'Sun, Jun 28 · 7:20 PM ET', network: 'NBC / Peacock', stadium: 'Fenway Park, Boston', status: 'live', image: IMG.mlb },
  { league: 'mlb', team1: 'Braves', team2: 'Giants', date: 'Sun, Jun 28 · 8:05 PM ET', network: 'ESPN', stadium: 'Oracle Park, San Francisco', status: 'live', image: IMG.mlb },
  { league: 'tennis', team1: 'Wimbledon', team2: 'Round of 16', date: 'Sun, Jun 28 · All day', network: 'ESPN / ESPN2', stadium: 'All England Club, London', status: 'live', image: IMG.tennis },
  { league: 'golf', team1: "Women's PGA", team2: 'Final Round', date: 'Sun, Jun 28 · Live', network: 'NBC', stadium: 'Hazeltine National, MN', status: 'live', image: IMG.golf },
];

/* ============================================================
   DATA — HUB: TRENDING TODAY
   ============================================================ */
const trendingItems = [
  { rank: 1, category: 'World Cup 2026', title: 'South Africa vs Canada', desc: 'Round of 32 · Live now · SoFi Stadium, LA', image: IMG.soccer, isLive: true },
  { rank: 2, category: 'Live Sport', title: 'Wimbledon · Round of 16', desc: "Men's & Women's · Live today on ESPN", image: IMG.tennis, isLive: true },
  { rank: 3, category: 'Live Sport', title: 'Dodgers vs Padres', desc: 'MLB · 8:10 PM ET · NBC / Peacock', image: IMG.mlb, isLive: true },
  { rank: 4, category: 'World Cup 2026', title: 'Brazil vs Japan', desc: 'Round of 32 · Mon Jun 29 · Houston Stadium', image: IMG.soccer, isLive: false },
  { rank: 5, category: 'Live Sport', title: 'Yankees vs Red Sox', desc: 'MLB · 7:20 PM ET · NBC / Peacock', image: IMG.mlb, isLive: true },
  { rank: 6, category: 'Trending Series', title: 'House of the Dragon', desc: 'Season 3 · New episode now on HBO', image: IMG.drama, isLive: false },
  { rank: 7, category: 'Live Sport', title: "Women's PGA Championship", desc: 'Final Round · Live on NBC', image: IMG.golf, isLive: true },
  { rank: 8, category: 'New Release', title: 'Deadpool & Wolverine', desc: 'Now streaming on Disney+ — watch now', image: IMG.cinema, isLive: false },
];

/* ============================================================
   DATA — PRICING PLANS (device-based)
   ============================================================ */
const pricingPlans = {
  1: {
    1: { price: 29, monthly: 29, checkoutLink: 'https://firepay.shop/step/1-month-premium-plan/' },
    6: { price: 49, monthly: 8.1, checkoutLink: 'https://firepay.shop/step/6-month-premium-plan/' },
    12: { price: 79, monthly: 6.58, checkoutLink: 'https://firepay.shop/step/12-month-premium-plan/' },
  },
  2: {
    1: { price: 59, monthly: 59, checkoutLink: 'https://firepay.shop/step/2-devices-1-month/' },
    6: { price: 99, monthly: 16, checkoutLink: 'https://firepay.shop/step/2-devices-6-month/' },
    12: { price: 159, monthly: 13.25, checkoutLink: 'https://firepay.shop/step/2-devices-12-month/' },
  },
  3: {
    1: { price: 89, monthly: 89, checkoutLink: 'https://firepay.shop/step/3-devices-1-month/' },
    6: { price: 149, monthly: 24, checkoutLink: 'https://firepay.shop/step/3-devices-6-month/' },
    12: { price: 209, monthly: 17.42, checkoutLink: 'https://firepay.shop/step/3-devices-12-month/' },
  },
  4: {
    1: { price: 119, monthly: 119, checkoutLink: 'https://firepay.shop/step/4-devices-1-month/' },
    6: { price: 159, monthly: 26.5, checkoutLink: 'https://firepay.shop/step/4-devices-6-month/' },
    12: { price: 239, monthly: 19.91, checkoutLink: 'https://firepay.shop/step/4-devices-12-month/' },
  },
  5: {
    1: { price: 129, monthly: 129, checkoutLink: 'https://firepay.shop/step/5-devices-1-month/' },
    6: { price: 179, monthly: 29.83, checkoutLink: 'https://firepay.shop/step/5-devices-6-month/' },
    12: { price: 289, monthly: 24.08, checkoutLink: 'https://firepay.shop/step/5-devices-12-month/' },
  },
};

/* ============================================================
   DATA
   ============================================================ */
const games = [
  { team1: 'South Africa', team2: 'Canada', flag1: 'za', flag2: 'ca', color1: '#007A4D', color2: '#FF0000', date: 'Jun 28, 2026', time: '3:00 PM ET', stadium: 'SoFi Stadium, LA', status: 'live', group: 'ROUND OF 32' },
  { team1: 'Brazil', team2: 'Japan', flag1: 'br', flag2: 'jp', color1: '#009C3B', color2: '#BC002D', date: 'Jun 29, 2026', time: '1:00 PM ET', stadium: 'NRG Stadium, Houston', status: 'upcoming', group: 'ROUND OF 32' },
  { team1: 'Germany', team2: 'Paraguay', flag1: 'de', flag2: 'py', color1: '#000000', color2: '#D52B1E', date: 'Jun 29, 2026', time: '4:30 PM ET', stadium: 'Gillette Stadium, Boston', status: 'upcoming', group: 'ROUND OF 32' },
  { team1: 'Mexico', team2: 'Ecuador', flag1: 'mx', flag2: 'ec', color1: '#006847', color2: '#FFD100', date: 'Jun 30, 2026', time: '9:00 PM ET', stadium: 'Estadio Azteca, Mexico City', status: 'upcoming', group: 'ROUND OF 32' },
];

const testimonials = [
  {
    name: 'Tyler B.', location: '🇺🇸 Dallas, TX', initials: 'TB', tag: '🏈 NFL Fan',
    quote: 'Watched the Cowboys game Sunday in 4K — zero hiccups the entire game. I was paying $180/month on cable for the same channels. Cancelled it the same week I found Fire Store.'
  },
  {
    name: 'Jessica M.', location: '🇺🇸 Los Angeles, CA', initials: 'JM', tag: '🎬 Movie & TV',
    quote: 'House of the Dragon, White Lotus, The Last of Us — all in 4K on one subscription. HBO Max plus every live sports channel I want. My friends still can\'t believe what I\'m paying for this.'
  },
  {
    name: 'Marcus W.', location: '🇺🇸 Chicago, IL', initials: 'MW', tag: '🏀 NBA Fan',
    quote: 'Bulls games, ESPN, TNT — everything I need. Setup took 4 minutes on my Fire TV Stick. Picture is sharper than cable ever was and I\'m saving over $100 a month.'
  },
  {
    name: 'Rodriguez Family', location: '🇺🇸 Miami, FL', initials: 'RF', tag: '🏠 Family Plan',
    quote: '3 TVs running at the same time — kids on Disney, my wife on her shows, me on the NFL. Not one dropped stream. This is how TV should have always worked.'
  },
  {
    name: 'Derek H.', location: '🇺🇸 Las Vegas, NV', initials: 'DH', tag: '🥊 UFC Fan',
    quote: 'UFC pay-per-views without the $80 PPV charge every time. I\'ve saved over $400 this year alone just on PPV. Fire Store is the best sports decision I\'ve ever made.'
  },
  {
    name: 'Ashley T.', location: '🇺🇸 New York, NY', initials: 'AT', tag: '📺 Entertainment',
    quote: '4K HDR with Dolby Audio on my 75-inch for movie nights. My boyfriend catches the NBA Finals on the same subscription at the same time. For what we pay, this thing is a steal.'
  },
  {
    name: 'Kevin P.', location: '🇺🇸 Houston, TX', initials: 'KP', tag: '✂️ Cord-Cutter',
    quote: 'Cut cable 6 months ago. Between Fire Store and my internet bill I\'m saving $120 every month. NFL, MLB, NBA, UFC — every sport I care about with zero blackouts.'
  },
  {
    name: 'Sandra L.', location: '🇺🇸 Phoenix, AZ', initials: 'SL', tag: '💬 Support',
    quote: 'Had a setup question during Monday Night Football. Messaged on WhatsApp and got a reply in under 2 minutes. I\'ve never had that from any streaming service, ever.'
  },
];

const faqs = [
  {
    q: 'Is Fire Store legal and safe to use?',
    a: 'Fire Store operates as a premium reseller of licensed streaming content. All connections are encrypted and your data is never sold or shared with third parties. <strong>Thousands of users across 60+ countries rely on Fire Store daily.</strong>'
  },
  {
    q: 'How fast do I get my login details after payment?',
    a: '<strong>Instant to 5 minutes maximum.</strong> Once payment is confirmed, our automated system sends your credentials directly via WhatsApp or Email. During peak hours our support team personally ensures every activation is handled within minutes — never hours.'
  },
  {
    q: 'Will it really not buffer during the World Cup final?',
    a: '<strong>Yes — this is our strongest guarantee.</strong> Our Anti-Freeze Technology uses dedicated servers and adaptive bitrate streaming specifically scaled for peak events like World Cup matches.'
  },
  {
    q: 'Which devices work perfectly with Fire Store?',
    a: 'Fire Store works flawlessly on <strong>Amazon Firestick (all generations), Smart TVs (Samsung, LG, Sony), Android & iOS devices, Windows and Mac computers, Chromecast, Roku, and MAG boxes.</strong>'
  },
  {
    q: 'Can I watch on multiple devices at the same time?',
    a: '<strong>Yes — unlimited simultaneous streams are included in all plans.</strong> No extra charges, no device limits.'
  },
  {
    q: 'What is your cancellation and money-back policy?',
    a: 'You can cancel anytime with no questions asked. <strong>The 12-month plan comes with a 7-day money-back guarantee</strong> — if you are not satisfied, we will refund you fully, no hassle.'
  },
  {
    q: 'How good are the channel & sports offerings?',
    a: 'Over <strong>100,000 live channels</strong> covering every sport, every league, in every country — Premier League, La Liga, NFL, NBA, UFC and of course the full 2026 FIFA World Cup in 4K.'
  },
  {
    q: 'Do you offer real 24/7 support during big matches?',
    a: '<strong>Absolutely.</strong> During every major match including the World Cup, our support team operates at full capacity on WhatsApp. We monitor streams in real-time and proactively fix any issues before you even notice.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept <strong>Visa, Mastercard, PayPal, cryptocurrency (Bitcoin, USDT, Ethereum), and direct bank transfer.</strong> All payments are processed through secure, encrypted gateways.'
  },
  {
    q: 'Can I test the service before buying a full plan?',
    a: '<strong>Yes! Message us on WhatsApp and request a free 24-hour trial.</strong> Genuine test access — no credit card required.'
  },
];

/* ============================================================
   RENDER — WORLD CUP TAB (original games slider)
   ============================================================ */
function renderWorldCup(slider) {
  games.forEach(g => {
    const isLive = g.status === 'live';
    slider.innerHTML += `
      <div class="game-card">
        <div class="game-matchup" style="background:linear-gradient(135deg,${g.color1}22,#0d0d0d 40%,#0d0d0d 60%,${g.color2}22)">
          <div class="game-group-badge">${g.group}</div>
          ${isLive ? '<div class="live-pulse-badge"><span class="live-dot"></span> LIVE NOW</div>' : ''}
          <div class="game-teams-row">
            <div class="team-block">
              <div class="team-crest" style="background:${g.color1}33;border:2px solid ${g.color1}55;overflow:hidden;display:flex;align-items:center;justify-content:center">
                <img src="https://flagcdn.com/w80/${g.flag1}.png" style="width:100%;height:100%;object-fit:cover" alt="${g.team1} Flag">
              </div>
              <span class="team-name">${g.team1}</span>
            </div>
            <div class="vs-block">
              <span class="vs-text">VS</span>
              <span class="vs-ball">⚽</span>
            </div>
            <div class="team-block">
              <div class="team-crest" style="background:${g.color2}33;border:2px solid ${g.color2}55;overflow:hidden;display:flex;align-items:center;justify-content:center">
                <img src="https://flagcdn.com/w80/${g.flag2}.png" style="width:100%;height:100%;object-fit:cover" alt="${g.team2} Flag">
              </div>
              <span class="team-name">${g.team2}</span>
            </div>
          </div>
        </div>
        <div class="game-body">
          <div class="game-meta">
            <span>📅 ${g.date} · ${g.time}</span>
            <span>🏟️ ${g.stadium}</span>
          </div>
          <button class="game-watch" onclick="document.getElementById('plans').scrollIntoView({behavior:'smooth'})">${isLive ? '🔴 Watch Live →' : '▶ Watch →'}</button>
        </div>
      </div>`;
  });
}

/* ============================================================
   RENDER — MOVIES & TV TAB
   ============================================================ */
function renderMedia(slider) {
  mediaItems.forEach(m => {
    slider.innerHTML += `
      <div class="media-card" onclick="document.getElementById('plans').scrollIntoView({behavior:'smooth'})">
        <div class="media-poster" style="background:${m.bg}">
          <img src="${m.poster}" alt="${m.title}" loading="lazy" onerror="this.style.display='none'">
          <div class="media-poster-overlay"></div>
          <span class="media-type-badge ${m.type}">${m.type === 'movie' ? '🎬 Movie' : '📺 Series'}</span>
          <span class="media-network-badge">${m.network}</span>
        </div>
        <div class="media-body">
          <div class="media-title">${m.title}</div>
          <div class="media-meta">${m.meta}</div>
          <div class="media-rating">${m.rating}</div>
          <button class="media-watch-btn">▶ Stream Now</button>
        </div>
      </div>`;
  });
}

/* ============================================================
   RENDER — US SPORTS TAB
   ============================================================ */
function renderUSSports(slider) {
  usSportsEvents.forEach(e => {
    const isLive = e.status === 'live';
    slider.innerHTML += `
      <div class="sport-card">
        <div class="sport-banner">
          <img src="${e.image}" alt="${e.league} action" loading="lazy" onerror="this.style.display='none'">
          <div class="sport-banner-overlay"></div>
          <span class="sport-league-badge ${e.league}">${e.league.toUpperCase()}</span>
          ${isLive ? '<div class="live-pulse-badge"><span class="live-dot"></span> LIVE</div>' : ''}
        </div>
        <div class="sport-teams-row">
          <div class="sport-team">
            <span class="sport-team-name">${e.team1}</span>
          </div>
          <span class="sport-vs">VS</span>
          <div class="sport-team">
            <span class="sport-team-name">${e.team2}</span>
          </div>
        </div>
        <div class="sport-card-body">
          <div class="sport-meta">
            <span>📅 ${e.date}</span>
            <span>🏟️ ${e.stadium}</span>
          </div>
          <span class="sport-network">📡 ${e.network}</span>
          <button class="game-watch" onclick="document.getElementById('plans').scrollIntoView({behavior:'smooth'})">${isLive ? '🔴 Watch Live →' : '▶ Watch →'}</button>
        </div>
      </div>`;
  });
}

/* ============================================================
   RENDER — TRENDING TODAY TAB
   ============================================================ */
function renderTrending(slider) {
  trendingItems.forEach(t => {
    slider.innerHTML += `
      <div class="trending-card" onclick="document.getElementById('plans').scrollIntoView({behavior:'smooth'})">
        <div class="trending-hero">
          <img src="${t.image}" alt="${t.title}" loading="lazy" onerror="this.style.display='none'">
          <div class="trending-hero-overlay"></div>
          <span class="trending-rank">#${t.rank}</span>
          ${t.isLive ? '<div class="trending-live-badge"><span class="live-dot"></span> LIVE</div>' : ''}
        </div>
        <div class="trending-body">
          <div class="trending-category">${t.category}</div>
          <div class="trending-title">${t.title}</div>
          <div class="trending-desc">${t.desc}</div>
          <button class="game-watch">${t.isLive ? '🔴 Watch Live →' : '▶ Watch Now →'}</button>
        </div>
      </div>`;
  });
}

/* ============================================================
   HUB TAB CONTROLLER
   ============================================================ */
function renderHub(tab) {
  const slider = document.getElementById('gamesSlider');
  if (!slider) return;
  slider.innerHTML = '';
  slider.scrollLeft = 0;

  if (tab === 'trending') renderTrending(slider);
  else if (tab === 'movies') renderMedia(slider);
  else if (tab === 'sports') renderUSSports(slider);
  else if (tab === 'worldcup') renderWorldCup(slider);
}

function initHubTabs() {
  const tabs = document.getElementById('hubTabs');
  if (!tabs) return;
  let cleanupSlider = () => { };

  const startSlider = () => {
    cleanupSlider();
    cleanupSlider = initSlider(document.getElementById('gamesSlider'), { autoSlide: true, interval: 3500 });
  };

  tabs.querySelectorAll('.hub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.hub-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderHub(btn.dataset.tab);
      startSlider();
    });
  });

  // Start auto-slide for the default tab
  startSlider();
  return startSlider;
}

/* ============================================================
   RENDER — TESTIMONIALS SLIDER
   ============================================================ */
function renderTestimonials() {
  const slider = document.getElementById('testiSlider');
  if (!slider) return;
  testimonials.forEach(t => {
    slider.innerHTML += `
      <div class="testi-card">
        <div class="testi-card-top">
          <span class="testi-tag">${t.tag}</span>
          <div class="testi-stars">★★★★★</div>
        </div>
        <div class="testi-quote">"${t.quote}"</div>
        <div class="testi-user">
          <div class="testi-avatar">${t.initials}</div>
          <div>
            <div class="testi-name">${t.name}</div>
            <div class="testi-location">${t.location}</div>
            <div class="testi-verified">✓ Verified US Subscriber</div>
          </div>
        </div>
      </div>`;
  });
}

/* ============================================================
   RENDER — FAQ ACCORDION
   ============================================================ */
function renderFaq() {
  const list = document.getElementById('faqList');
  if (!list) return;
  faqs.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'faq-item';
    div.innerHTML = `
      <button class="faq-q">
        <span>${item.q}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-a" id="faq-a-${i}">
        <div class="faq-a-inner">${item.a}</div>
      </div>`;
    const btn = div.querySelector('.faq-q');
    const ans = div.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = ans.classList.contains('open');
      document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('active'));
      if (!isOpen) { ans.classList.add('open'); btn.classList.add('active'); }
    });
    list.appendChild(div);
  });
}

/* ============================================================
   HERO BADGE TICKER
   ============================================================ */
function initHeroTicker() {
  const tickerEl = document.getElementById('tickerText');
  if (!tickerEl) return;
  const items = [
    '⚽ World Cup 2026 · South Africa vs Canada · Live Now',
    '🎾 Wimbledon · Round of 16 · Live Today on ESPN',
    '⚾ MLB · Dodgers vs Padres · Tonight in 4K',
    '⚽ World Cup 2026 · Brazil vs Japan · Mon Jun 29',
    '⛳ Women\'s PGA Championship · Final Round Live',
    '📺 House of the Dragon S3 · New Episode on HBO',
  ];
  let idx = 0;
  setInterval(() => {
    tickerEl.style.opacity = '0';
    setTimeout(() => {
      idx = (idx + 1) % items.length;
      tickerEl.textContent = items[idx];
      tickerEl.style.opacity = '1';
    }, 400);
  }, 4000);
  tickerEl.style.transition = 'opacity 0.4s ease';
}

/* ============================================================
   URGENCY SEATS COUNTER
   ============================================================ */
function initUrgencyCounter() {
  let seats = 47;
  setInterval(() => {
    if (seats > 12 && Math.random() > 0.7) {
      seats--;
      const el = document.getElementById('seats');
      if (el) { el.textContent = seats; el.style.color = seats < 20 ? '#ff2d00' : 'inherit'; }
    }
  }, 8000);
}

/* ============================================================
   NAVBAR SCROLL STATE
   ============================================================ */
function initNavbar() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  const toggleBtn = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isActive = toggleBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   UNIFIED SLIDER — mouse drag + touch drag + auto-slide
   ============================================================ */
function initSlider(el, { autoSlide = false, interval = 3500 } = {}) {
  if (!el) return () => { };

  let interacting = false;
  let timer = null;

  // ── Mouse drag ──────────────────────────────────────────────
  let mouseDown = false, mouseStartX = 0, mouseScrollLeft = 0;

  el.addEventListener('mousedown', e => {
    mouseDown = true;
    interacting = true;
    mouseStartX = e.pageX - el.offsetLeft;
    mouseScrollLeft = el.scrollLeft;
    el.style.scrollBehavior = 'auto';
  });

  window.addEventListener('mouseup', () => {
    if (!mouseDown) return;
    mouseDown = false;
    interacting = false;
    el.style.scrollBehavior = 'smooth';
  });

  el.addEventListener('mousemove', e => {
    if (!mouseDown) return;
    e.preventDefault();
    el.scrollLeft = mouseScrollLeft - (e.pageX - el.offsetLeft - mouseStartX);
  });

  // ── Touch drag ──────────────────────────────────────────────
  let touchStartX = 0, touchScrollLeft = 0;

  el.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchScrollLeft = el.scrollLeft;
    interacting = true;
    el.style.scrollBehavior = 'auto';
  }, { passive: true });

  el.addEventListener('touchmove', e => {
    const dx = touchStartX - e.touches[0].clientX;
    el.scrollLeft = touchScrollLeft + dx;
  }, { passive: true });

  el.addEventListener('touchend', () => {
    interacting = false;
    el.style.scrollBehavior = 'smooth';
  }, { passive: true });

  // ── Auto-slide (card-by-card) ────────────────────────────────
  if (autoSlide) {
    const advance = () => {
      if (interacting) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const card = el.firstElementChild;
        const cardW = card ? card.offsetWidth + parseInt(getComputedStyle(el).gap || 20) : 300;
        el.scrollBy({ left: cardW, behavior: 'smooth' });
      }
    };
    timer = setInterval(advance, interval);
  }

  // Return cleanup so tab switches can cancel the old timer
  return () => { if (timer) clearInterval(timer); };
}

/* ============================================================
   FLAME CANVAS
   ============================================================ */
function initFlameCanvas() {
  const canvas = document.getElementById('flame-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.4;
  }
  resize();
  window.addEventListener('resize', resize);

  class FlameParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = -(Math.random() * 3 + 1);
      this.life = 1;
      this.decay = Math.random() * 0.015 + 0.008;
      this.hue = Math.random() * 30 + 5; // red-orange range
    }
    update() {
      this.x += this.speedX + Math.sin(this.y * 0.05) * 0.5;
      this.y += this.speedY;
      this.life -= this.decay;
      if (this.life <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = `hsl(${this.hue}, 100%, ${50 + (1 - this.life) * 30}%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) {
    const p = new FlameParticle();
    p.y = Math.random() * canvas.height;
    p.life = Math.random();
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   DEVICE SELECTOR + PRICING UPDATE
   ============================================================ */
const deviceLabels = {
  1: { count: '1 Screen', label: 'Solo Viewer' },
  2: { count: '2 Screens', label: 'Couple / Roommates' },
  3: { count: '3 Screens', label: 'Small Family' },
  4: { count: '4 Screens', label: 'Full Family' },
  5: { count: '5 Screens', label: 'Whole Household' },
};

function updatePriceCards(deviceCount) {
  const plans = pricingPlans[deviceCount];
  if (!plans) return;

  const p1 = plans[1], p6 = plans[6], p12 = plans[12];
  const { count, label } = deviceLabels[deviceCount];
  const deviceWord = deviceCount === 1 ? 'device' : 'devices';

  // Prices & periods
  const set = (id, html, isHTML) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (isHTML) el.innerHTML = html; else el.textContent = html;
  };

  set('price-1m', `<span>$</span>${p1.price}`, true);
  set('period-1m', 'per month, billed monthly');
  set('price-6m', `<span>$</span>${p6.price}`, true);
  set('period-6m', `$${p6.monthly.toFixed(2)}/month — billed once`);
  set('price-12m', `<span>$</span>${p12.price}`, true);
  set('period-12m', `$${p12.monthly.toFixed(2)}/month — billed once`);

  // Checkout links
  document.getElementById('btn-1m').onclick = () => window.location.href = p1.checkoutLink;
  document.getElementById('btn-6m').onclick = () => window.location.href = p6.checkoutLink;
  document.getElementById('btn-12m').onclick = () => window.location.href = p12.checkoutLink;

  // Screens badge — count + label on all three cards
  ['1m', '6m', '12m'].forEach(suffix => {
    set(`screens-count-${suffix}`, count);
    set(`screens-label-${suffix}`, label);
    set(`devices-line-${suffix}`,
      `Stream on <strong>${deviceCount} ${deviceWord}</strong> at the same time`,
      true);
  });

  // Keep the savings calculator in sync with the selected package's
  // best-value (12-month) monthly rate.
  fireStoreMonthly = p12.monthly;
  recalcSavings();
}

/* ============================================================
   CORD-CUTTER SAVINGS CALCULATOR
   ============================================================ */
const subscriptions = [
  { id: 'cable', name: 'Cable / Satellite TV', cost: 83.00, icon: '📡', checked: true },
  { id: 'netflix', name: 'Netflix', cost: 15.49, icon: '🎬', checked: true },
  { id: 'disney', name: 'Disney+', cost: 13.99, icon: '🏰', checked: true },
  { id: 'hbo', name: 'HBO Max', cost: 16.99, icon: '🐉' },
  { id: 'espn', name: 'ESPN+ / Sports', cost: 10.99, icon: '🏈' },
  { id: 'prime', name: 'Prime Video', cost: 8.99, icon: '📦' },
  { id: 'hulu', name: 'Hulu (No Ads)', cost: 17.99, icon: '📺' },
  { id: 'paramount', name: 'Paramount+', cost: 11.99, icon: '⛰️' },
  { id: 'peacock', name: 'Peacock Premium', cost: 13.99, icon: '🦚' },
  { id: 'youtubetv', name: 'YouTube TV', cost: 72.99, icon: '▶️' },
];

// Default Fire Store monthly cost = 1-device, 12-month best value.
let fireStoreMonthly = pricingPlans[1][12].monthly;

// Smoothly counts a number element from its current value to `target`.
function animateCount(el, target, prefix = '$', decimals = 0) {
  if (!el) return;
  const start = parseFloat(el.dataset.value || '0');
  const duration = 600;
  const startTime = performance.now();

  function frame(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const value = start + (target - start) * eased;
    el.textContent = `${prefix}${value.toFixed(decimals)}`;
    if (t < 1) requestAnimationFrame(frame);
    else el.dataset.value = String(target);
  }
  el.dataset.value = String(start);
  requestAnimationFrame(frame);
}

function recalcSavings() {
  const checklist = document.getElementById('calcChecklist');
  if (!checklist) return;

  let monthlyExpense = 0;
  checklist.querySelectorAll('input:checked').forEach(input => {
    monthlyExpense += Number(input.dataset.cost);
  });

  const annualSavings = Math.max(0, (monthlyExpense - fireStoreMonthly) * 12);

  // Counters
  animateCount(document.getElementById('calcMonthly'), monthlyExpense, '$', 0);
  animateCount(document.getElementById('calcFirestore'), fireStoreMonthly, '$', 2);
  animateCount(document.getElementById('calcSavings'), annualSavings, '$', 0);

  // Comparison bars (expense is the reference width when anything is selected)
  const expenseBar = document.getElementById('calcExpenseBar');
  const firestoreBar = document.getElementById('calcFirestoreBar');
  if (expenseBar && firestoreBar) {
    if (monthlyExpense > 0) {
      expenseBar.style.width = '100%';
      firestoreBar.style.width = `${Math.min(100, (fireStoreMonthly / monthlyExpense) * 100)}%`;
    } else {
      expenseBar.style.width = '0';
      firestoreBar.style.width = '0';
    }
  }

  // Contextual note
  const note = document.getElementById('calcSavingsNote');
  if (note) {
    if (monthlyExpense <= 0) {
      note.textContent = 'Select your current services above';
    } else if (annualSavings <= 0) {
      note.textContent = "You're already lean — Fire Store still adds 100,000+ channels";
    } else {
      note.textContent = `That's like getting ${Math.floor(annualSavings / fireStoreMonthly / 12)}+ years of Fire Store free`;
    }
  }
}

function initCalculator() {
  const checklist = document.getElementById('calcChecklist');
  if (!checklist) return;

  checklist.innerHTML = subscriptions.map(s => `
    <label class="calc-item">
      <input type="checkbox" data-cost="${s.cost}" ${s.checked ? 'checked' : ''}>
      <span class="calc-checkbox"></span>
      <span class="calc-item-icon">${s.icon}</span>
      <span class="calc-item-text">
        <span class="calc-item-name">${s.name}</span>
        <span class="calc-item-cost">$${s.cost.toFixed(2)}/mo</span>
      </span>
    </label>
  `).join('');

  checklist.addEventListener('change', recalcSavings);
  recalcSavings();
}

function initDeviceSelector() {
  const selector = document.getElementById('deviceSelector');
  if (!selector) return;

  selector.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selector.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updatePriceCards(Number(btn.dataset.devices));
    });
  });

  updatePriceCards(1);
}

/* ============================================================
   INIT — runs after DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Render dynamic sections
  renderHub('trending'); // default tab
  initHubTabs();
  renderTestimonials();
  renderFaq();

  // UI behaviours
  initNavbar();
  initCalculator();
  initDeviceSelector();
  initScrollReveal();
  initUrgencyCounter();

  // Testimonials slider
  initSlider(document.getElementById('testiSlider'), { autoSlide: true, interval: 4000 });

  // Flame effect
  initFlameCanvas();

  // Hero ticker
  initHeroTicker();
});
