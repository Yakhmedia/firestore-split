/* ============================================================
   FIRE STORE — MAIN JAVASCRIPT
   main.js
   ============================================================ */

/* ============================================================
   DATA — PRICING PLANS (device-based)
   ============================================================ */
const pricingPlans = {
  1: {
    1: { price: 29, monthly: 29, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+1-Month+plan+for+1+device+%28%2429%29.' },
    6: { price: 49, monthly: 8.1, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+6-Month+plan+for+1+device+%28%2449%29.' },
    12: { price: 79, monthly: 6.58, checkoutLink: 'https://wa.me/12029927413?text=Hi%2C+I%27d+like+to+order+the+12-Month+plan+for+1+device+%28%2479%29.' },
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
  { name: 'Carlos M.', location: '🇧🇷 São Paulo, Brazil', initials: 'CM', quote: 'Fire Store delivered flawless 4K during the Brazil vs Argentina match. Not a single freeze. I\'ve tried 5 IPTV services — this is on another level.' },
  { name: 'Sarah K.', location: '🇬🇧 London, UK', initials: 'SK', quote: 'Setup took literally 3 minutes on my Firestick. The picture quality for the Premier League is better than my cable subscription. Worth every penny.' },
  { name: 'Ahmed R.', location: '🇲🇦 Casablanca, Morocco', initials: 'AR', quote: 'The support team replied on WhatsApp in under 2 minutes when I had an issue. Never seen customer service this fast from an IPTV provider.' },
  { name: 'Maria L.', location: '🇩🇪 Berlin, Germany', initials: 'ML', quote: 'I subscribed for the World Cup but stayed for the sports library. The channel count is unreal and the quality stays rock solid on my Smart TV.' },
  { name: 'James T.', location: '🇺🇸 New York, USA', initials: 'JT', quote: 'Watching the World Cup on my 85-inch in 4K. Multiple streams at once, zero slow-down. Insane value for what you get.' },
  { name: 'Yuki N.', location: '🇯🇵 Tokyo, Japan', initials: 'YN', quote: 'I was skeptical about the "no buffering" claim — I\'ve heard that before. But during the World Cup final, not one interruption. Unreal.' },
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
   RENDER — GAMES SLIDER
   ============================================================ */
function renderGames() {
  const slider = document.getElementById('gamesSlider');
  if (!slider) return;
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
   RENDER — TESTIMONIALS SLIDER
   ============================================================ */
function renderTestimonials() {
  const slider = document.getElementById('testiSlider');
  if (!slider) return;
  testimonials.forEach(t => {
    slider.innerHTML += `
      <div class="testi-card">
        <div class="testi-stars">★★★★★</div>
        <div class="testi-quote">${t.quote}</div>
        <div class="testi-user">
          <div class="testi-avatar">${t.initials}</div>
          <div>
            <div class="testi-name">${t.name}</div>
            <div class="testi-location">${t.location}</div>
            <div class="testi-verified">✓ Verified FireStick User</div>
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
    list.innerHTML += `
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(${i}, this)">
          <span>${item.q}</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-a" id="faq-a-${i}">
          <div class="faq-a-inner">${item.a}</div>
        </div>
      </div>`;
  });
}

function toggleFaq(i, btn) {
  const ans = document.getElementById(`faq-a-${i}`);
  const isOpen = ans.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('active'));
  if (!isOpen) { ans.classList.add('open'); btn.classList.add('active'); }
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
   DRAG SCROLL + AUTO SCROLL
   ============================================================ */
function initDragScroll(el) {
  if (!el) return;
  let isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; });
  el.addEventListener('mouseleave', () => { isDown = false; });
  el.addEventListener('mouseup', () => { isDown = false; });
  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX);
  });
}

function initAutoScroll(el, speed) {
  if (!el) return;
  let paused = false;
  el.addEventListener('mouseenter', () => paused = true);
  el.addEventListener('mouseleave', () => paused = false);
  setInterval(() => {
    if (!paused) {
      el.scrollLeft += speed;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0;
    }
  }, 30);
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
function updatePriceCards(deviceCount) {
  const plans = pricingPlans[deviceCount];
  if (!plans) return;

  const p1 = plans[1], p6 = plans[6], p12 = plans[12];

  const price1m = document.getElementById('price-1m');
  const period1m = document.getElementById('period-1m');
  const btn1m = document.getElementById('btn-1m');

  const price6m = document.getElementById('price-6m');
  const period6m = document.getElementById('period-6m');
  const btn6m = document.getElementById('btn-6m');

  const price12m = document.getElementById('price-12m');
  const period12m = document.getElementById('period-12m');
  const btn12m = document.getElementById('btn-12m');

  if (price1m) price1m.innerHTML = `<span>$</span>${p1.price}`;
  if (period1m) period1m.textContent = `per month, billed monthly`;
  if (btn1m) btn1m.onclick = () => window.location.href = p1.checkoutLink;

  if (price6m) price6m.innerHTML = `<span>$</span>${p6.price}`;
  if (period6m) period6m.textContent = `$${p6.monthly.toFixed(2)}/month — billed once`;
  if (btn6m) btn6m.onclick = () => window.location.href = p6.checkoutLink;

  if (price12m) price12m.innerHTML = `<span>$</span>${p12.price}`;
  if (period12m) period12m.textContent = `$${p12.monthly.toFixed(2)}/month — billed once`;
  if (btn12m) btn12m.onclick = () => window.location.href = p12.checkoutLink;
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
  renderGames();
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

  // Sliders
  initDragScroll(document.getElementById('gamesSlider'));
  initDragScroll(document.getElementById('testiSlider'));
  initAutoScroll(document.getElementById('gamesSlider'), 0.8);
  initAutoScroll(document.getElementById('testiSlider'), 0.6);

  // Flame effect
  initFlameCanvas();
});
