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
  { type: 'movie',  title: 'Mission: Impossible 8', meta: '2025 · Action Thriller', network: 'Paramount+', rating: '★★★★☆', bg: 'linear-gradient(135deg,#0d1a2e,#0d3060)', poster: `${TMDB}/NNxYkU71-w7sb7mY5yvD4yd8B4.jpg` },
  { type: 'series', title: 'The Last of Us', meta: 'Season 3 · Sci-Fi Drama', network: 'HBO', rating: '★★★★★', bg: 'linear-gradient(135deg,#0a1a0a,#1a4020)', poster: `${TMDB}/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg` },
  { type: 'movie',  title: 'Thunderbolts*', meta: '2025 · Marvel Action', network: 'Disney+', rating: '★★★★☆', bg: 'linear-gradient(135deg,#0a0a2e,#1a1a60)', poster: `${TMDB}/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg` },
  { type: 'series', title: 'Stranger Things', meta: 'Season 5 · Sci-Fi', network: 'Netflix', rating: '★★★★★', bg: 'linear-gradient(135deg,#0d0028,#280d40)', poster: `${TMDB}/49WJfeN0moxb9IPfGn8AIqMGskD.jpg` },
  { type: 'movie',  title: 'Avatar 3', meta: '2025 · Sci-Fi Epic', network: 'Disney+', rating: '★★★★☆', bg: 'linear-gradient(135deg,#001a2e,#003a5e)', poster: `${TMDB}/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg` },
  { type: 'series', title: 'Peaky Blinders', meta: 'Movie Special · Crime', network: 'Netflix', rating: '★★★★★', bg: 'linear-gradient(135deg,#1a0a00,#3a1800)', poster: `${TMDB}/vUUqzWa2LnHIVqkaKVn3nyfVnBL.jpg` },
  { type: 'movie',  title: 'Sinners', meta: '2025 · Horror Drama', network: 'Peacock', rating: '★★★★☆', bg: 'linear-gradient(135deg,#1a0000,#3a0008)', poster: `${TMDB}/aosm8NMQ3UyoBVpSxyimorCQykC.jpg` },
  { type: 'series', title: 'The White Lotus', meta: 'Season 3 · Drama', network: 'HBO', rating: '★★★★★', bg: 'linear-gradient(135deg,#1a150a,#3a2a10)', poster: `${TMDB}/kgwjIb2JDHRhNk13lmSxiClFjVk.jpg` },
  { type: 'movie',  title: 'Jurassic World 4', meta: '2025 · Adventure', network: 'Peacock', rating: '★★★☆☆', bg: 'linear-gradient(135deg,#0a1a0a,#1a3010)', poster: `${TMDB}/7xkEkEfheCJR0Dm8YdQUNMqcxIW.jpg` },
];

/* ============================================================
   DATA — HUB: US SPORTS
   ============================================================ */
// image: Unsplash sport-specific action photos
const IMG = {
  nfl:     'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
  nba:     'https://images.unsplash.com/photo-1546519638405-a1a3ff2cba13?w=600&q=80',
  ufc:     'https://images.unsplash.com/photo-1552677426-5f09c6c2ef5c?w=600&q=80',
  mlb:     'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80',
  boxing:  'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&q=80',
  soccer:  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80',
  cinema:  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
  drama:   'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
};

const usSportsEvents = [
  { league: 'nfl', team1: 'Chiefs', team2: 'Cowboys', date: 'Sun, Jun 22 · 4:25 PM ET', network: 'CBS', stadium: 'Arrowhead Stadium, KC', status: 'upcoming', image: IMG.nfl },
  { league: 'nba', team1: 'Lakers', team2: 'Celtics', date: 'Mon, Jun 23 · 8:30 PM ET', network: 'ESPN', stadium: 'Crypto.com Arena, LA', status: 'live', image: IMG.nba },
  { league: 'ufc', team1: 'Jon Jones', team2: 'Stipe Miocic', date: 'Sat, Jun 28 · 10:00 PM ET', network: 'ESPN+ PPV', stadium: 'T-Mobile Arena, Las Vegas', status: 'upcoming', image: IMG.ufc },
  { league: 'mlb', team1: 'Yankees', team2: 'Red Sox', date: 'Fri, Jun 20 · 7:05 PM ET', network: 'FOX', stadium: 'Yankee Stadium, NY', status: 'upcoming', image: IMG.mlb },
  { league: 'nfl', team1: 'Eagles', team2: 'Giants', date: 'Sun, Jun 22 · 1:00 PM ET', network: 'FOX', stadium: 'Lincoln Financial Field, PA', status: 'upcoming', image: IMG.nfl },
  { league: 'nba', team1: 'Warriors', team2: 'Heat', date: 'Wed, Jun 25 · 9:00 PM ET', network: 'TNT', stadium: 'Chase Center, SF', status: 'upcoming', image: IMG.nba },
  { league: 'boxing', team1: 'Canelo', team2: 'Benavidez', date: 'Sat, Jul 5 · 8:00 PM ET', network: 'DAZN', stadium: 'T-Mobile Arena, Las Vegas', status: 'upcoming', image: IMG.boxing },
  { league: 'mlb', team1: 'Dodgers', team2: 'Giants', date: 'Tue, Jun 24 · 10:10 PM ET', network: 'FS1', stadium: 'Oracle Park, SF', status: 'live', image: IMG.mlb },
];

/* ============================================================
   DATA — HUB: TRENDING TODAY
   ============================================================ */
const trendingItems = [
  { rank: 1, category: 'Live Sport', title: 'NBA Lakers vs Celtics', desc: 'Game 5 · Playoffs — Live Now', image: IMG.nba, isLive: true },
  { rank: 2, category: 'New Release', title: 'Mission: Impossible 8', desc: 'Just dropped on Paramount+ — watch now', image: IMG.cinema, isLive: false },
  { rank: 3, category: 'Live Sport', title: 'UFC Fight Night', desc: 'Jones vs Miocic — Main Card Live', image: IMG.ufc, isLive: true },
  { rank: 4, category: 'Trending Series', title: 'The White Lotus S3', desc: "Season finale — everyone's watching", image: IMG.drama, isLive: false },
  { rank: 5, category: 'Live Sport', title: 'NFL Thursday Night', desc: 'Chiefs vs Cowboys · 4K HDR', image: IMG.nfl, isLive: true },
  { rank: 6, category: 'New Episode', title: 'House of the Dragon', desc: 'S3 E4 · Available now on HBO', image: IMG.drama, isLive: false },
  { rank: 7, category: 'World Cup 2026', title: 'Brazil vs Argentina', desc: 'Group Stage · Jun 18 · MetLife Stadium', image: IMG.soccer, isLive: true },
  { rank: 8, category: 'Trending Movie', title: 'Sinners', desc: '#1 movie in the US this week', image: IMG.cinema, isLive: false },
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
    1: { price: 59, monthly: 59, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+1-Month+plan+for+2+devices+%28%2459%29.' },
    6: { price: 99, monthly: 16, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+6-Month+plan+for+2+devices+%28%2499%29.' },
    12: { price: 159, monthly: 13.25, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+12-Month+plan+for+2+devices+%28%24159%29.' },
  },
  3: {
    1: { price: 89, monthly: 89, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+1-Month+plan+for+3+devices+%28%2489%29.' },
    6: { price: 149, monthly: 24, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+6-Month+plan+for+3+devices+%28%24149%29.' },
    12: { price: 209, monthly: 17.42, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+12-Month+plan+for+3+devices+%28%24209%29.' },
  },
  4: {
    1: { price: 119, monthly: 119, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+1-Month+plan+for+4+devices+%28%24119%29.' },
    6: { price: 159, monthly: 26.5, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+6-Month+plan+for+4+devices+%28%24159%29.' },
    12: { price: 319, monthly: 26.58, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+12-Month+plan+for+4+devices+%28%24319%29.' },
  },
  5: {
    1: { price: 149, monthly: 149, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+1-Month+plan+for+5+devices+%28%24149%29.' },
    6: { price: 199, monthly: 33.17, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+6-Month+plan+for+5+devices+%28%24199%29.' },
    12: { price: 399, monthly: 33.25, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+12-Month+plan+for+5+devices+%28%24399%29.' },
  },
};

/* ============================================================
   DATA
   ============================================================ */
const games = [
  { team1: 'Brazil', team2: 'Argentina', flag1: 'br', flag2: 'ar', color1: '#009C3B', color2: '#74ACDF', date: 'Jun 18, 2026', time: '20:00 UTC', stadium: 'MetLife Stadium, NJ', status: 'live', group: 'GROUP A' },
  { team1: 'France', team2: 'England', flag1: 'fr', flag2: 'gb', color1: '#003189', color2: '#CF091D', date: 'Jun 19, 2026', time: '18:00 UTC', stadium: 'AT&T Stadium, TX', status: 'upcoming', group: 'GROUP B' },
  { team1: 'Spain', team2: 'Germany', flag1: 'es', flag2: 'de', color1: '#AA151B', color2: '#000000', date: 'Jun 20, 2026', time: '20:00 UTC', stadium: 'SoFi Stadium, LA', status: 'upcoming', group: 'GROUP C' },
  { team1: 'Portugal', team2: 'Morocco', flag1: 'pt', flag2: 'ma', color1: '#006600', color2: '#C1272D', date: 'Jun 21, 2026', time: '17:00 UTC', stadium: 'Estadio Azteca, MX', status: 'upcoming', group: 'GROUP D' },
  { team1: 'Netherlands', team2: 'USA', flag1: 'nl', flag2: 'us', color1: '#FF6600', color2: '#002868', date: 'Jun 22, 2026', time: '21:00 UTC', stadium: "Levi's Stadium, SF", status: 'live', group: 'GROUP E' },
  { team1: 'Italy', team2: 'Japan', flag1: 'it', flag2: 'jp', color1: '#003399', color2: '#BC002D', date: 'Jun 23, 2026', time: '15:00 UTC', stadium: 'Arrowhead Stadium, KC', status: 'upcoming', group: 'GROUP F' },
  { team1: 'Mexico', team2: 'Canada', flag1: 'mx', flag2: 'ca', color1: '#006847', color2: '#D80621', date: 'Jun 24, 2026', time: '19:00 UTC', stadium: 'BC Place, Vancouver', status: 'upcoming', group: 'GROUP G' },
  { team1: 'Senegal', team2: 'Belgium', flag1: 'sn', flag2: 'be', color1: '#00853F', color2: '#EF3340', date: 'Jun 25, 2026', time: '16:00 UTC', stadium: 'Gillette Stadium, MA', status: 'upcoming', group: 'GROUP H' },
  { team1: 'Australia', team2: 'South Korea', flag1: 'au', flag2: 'kr', color1: '#00008B', color2: '#003478', date: 'Jun 26, 2026', time: '14:00 UTC', stadium: 'Rose Bowl, CA', status: 'upcoming', group: 'GROUP C' },
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
  let cleanupSlider = () => {};

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
    '🏈 NFL Sunday Ticket · Live Now',
    '🏀 NBA Playoffs · Watch in 4K',
    '🥊 UFC Fight Night · Stream Live',
    '🎬 New Movies & HBO Originals · On Demand',
    '⚽ World Cup 2026 · USA · Canada · Mexico',
    '📺 Trending TV Shows · Streaming Now',
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
   COUNTDOWN TIMER
   ============================================================ */
const WORLD_CUP_DATE = new Date('2026-06-11T16:00:00Z');

function updateCountdown() {
  const diff = WORLD_CUP_DATE - new Date();
  const el = document.getElementById('countdown');
  if (!el) return;
  if (diff <= 0) {
    el.innerHTML = '<div style="color:var(--live-green);font-family:Bebas Neue;font-size:2rem;letter-spacing:3px">🔥 THE WORLD CUP IS LIVE NOW!</div>';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = String(d).padStart(3, '0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
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
  if (!el) return () => {};

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
  1: { count: '1 Screen',   label: 'Solo Viewer' },
  2: { count: '2 Screens',  label: 'Couple / Roommates' },
  3: { count: '3 Screens',  label: 'Small Family' },
  4: { count: '4 Screens',  label: 'Full Family' },
  5: { count: '5 Screens',  label: 'Whole Household' },
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

  set('price-1m',  `<span>$</span>${p1.price}`, true);
  set('period-1m', 'per month, billed monthly');
  set('price-6m',  `<span>$</span>${p6.price}`, true);
  set('period-6m', `$${p6.monthly.toFixed(2)}/month — billed once`);
  set('price-12m', `<span>$</span>${p12.price}`, true);
  set('period-12m',`$${p12.monthly.toFixed(2)}/month — billed once`);

  // Checkout links
  document.getElementById('btn-1m').onclick  = () => window.location.href = p1.checkoutLink;
  document.getElementById('btn-6m').onclick  = () => window.location.href = p6.checkoutLink;
  document.getElementById('btn-12m').onclick = () => window.location.href = p12.checkoutLink;

  // Screens badge — count + label on all three cards
  ['1m', '6m', '12m'].forEach(suffix => {
    set(`screens-count-${suffix}`, count);
    set(`screens-label-${suffix}`, label);
    set(`devices-line-${suffix}`,
      `Stream on <strong>${deviceCount} ${deviceWord}</strong> at the same time`,
      true);
  });
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
  initDeviceSelector();
  initScrollReveal();
  initUrgencyCounter();

  // Countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Testimonials slider
  initSlider(document.getElementById('testiSlider'), { autoSlide: true, interval: 4000 });

  // Flame effect
  initFlameCanvas();

  // Hero ticker
  initHeroTicker();
});
