/**
 * VIRAT KOHLI // THE KING — Definitive Showcase Interactive Engine
 * Canvas Stadium Visuals, Web Audio Synthesis, Stats Engine, Century Vault & Trivia
 */

document.addEventListener('DOMContentLoaded', () => {
  initStadiumCanvas();
  initSoundEngine();
  initStatsDashboard();
  initTimelineFilter();
  initCenturyVault();
  initLightboxModal();
  initQuotesCarousel();
  initTriviaGame();
  initMobileNav();
  initNumberCounters();
});

/* ==========================================================================
   1. STADIUM LIGHTS & GOLDEN EMBER CANVAS
   ========================================================================== */
function initStadiumCanvas() {
  const canvas = document.getElementById('stadium-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Ember {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -Math.random() * 0.5 - 0.1;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.color = Math.random() > 0.35 ? '#f5c862' : '#38bdf8';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse attraction / gentle dispersal
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= (dx / dist) * 0.6;
          this.y -= (dy / dist) * 0.6;
        }
      }

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.y = height + 10;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  // Initialize embers
  const count = Math.min(Math.floor(window.innerWidth / 18), 75);
  for (let i = 0; i < count; i++) {
    particles.push(new Ember());
  }

  // Render Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.shadowBlur = 0;
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. SYNTHESIZED WEB AUDIO ENGINE (BAT CRACK & STADIUM ROAR)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEngine() {
  const soundBtn = document.getElementById('sound-btn');
  const cheerBtn = document.getElementById('btn-cheer-sound');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.classList.toggle('active', soundEnabled);
      const label = soundBtn.querySelector('.btn-label');
      if (label) label.textContent = soundEnabled ? 'SFX: ON' : 'SFX: OFF';
      if (soundEnabled) {
        playBatCrackSound();
      }
    });
  }

  if (cheerBtn) {
    cheerBtn.addEventListener('click', () => {
      getAudioContext();
      playStadiumCheerSound();
    });
  }

  // Attach subtle bat crack sound on all interactive buttons
  document.querySelectorAll('.btn, .tab-btn, .filter-btn, .vault-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (soundEnabled) playBatCrackSound();
    });
  });
}

function playBatCrackSound() {
  if (!soundEnabled) return;
  try {
    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    audioCtx = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    // Frequency sweeps down rapidly mimicking willow meeting leather
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.09);
  } catch (err) {
    console.debug('Audio not allowed yet:', err);
  }
}

function playStadiumCheerSound() {
  if (!soundEnabled) return;
  try {
    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    audioCtx = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    // Noise buffer for crowd roar
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to give deep rumble and resonant crowd shout
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, ctx.currentTime);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 1.5);
  } catch (err) {
    console.debug('Stadium cheer error:', err);
  }
}

/* ==========================================================================
   3. CAREER STATISTICS DASHBOARD
   ========================================================================== */
const statsData = {
  all: [
    { label: 'International Runs', value: '27,150+', context: 'Across Test, ODI & T20I' },
    { label: 'International Tons', value: '86', context: '30 Test • 55 ODI • 1 T20I' },
    { label: 'International 50s', value: '141', context: 'Master of conversion' },
    { label: 'Combined Average', value: '52.8', context: 'All international formats' },
    { label: 'ICC Awards Won', value: '10', context: 'Most in cricket history' },
    { label: 'Player of Match Awards', value: '67+', context: '2nd highest in history' }
  ],
  odi: [
    { label: 'ODI Matches', value: '298', context: '16+ years of mastery' },
    { label: 'ODI Runs', value: '14,150+', context: 'Fastest to 8k - 14k runs' },
    { label: 'ODI Centuries', value: '55', context: 'World Record (Surpassed Sachin 49)' },
    { label: 'ODI Average', value: '58.2', context: 'Highest among 10k+ scorers' },
    { label: 'Chase Average', value: '65.5', context: '28 centuries in run chases' },
    { label: 'Highest Score', value: '183', context: 'vs Pakistan at Dhaka (148b)' }
  ],
  test: [
    { label: 'Test Matches', value: '118', context: '68 as Captain (40 Wins)' },
    { label: 'Test Runs', value: '9,040', context: 'Innings of pure grit' },
    { label: 'Test Centuries', value: '30', context: '7 Double Centuries' },
    { label: 'Highest Test Score', value: '254*', context: 'vs South Africa at Pune' },
    { label: 'Win % as Captain', value: '58.8%', context: 'Most successful Indian captain' },
    { label: 'Consecutive 200s', value: '4 Series', context: 'World Record in Tests' }
  ],
  t20i: [
    { label: 'T20I Matches', value: '125', context: 'World Cup Winner (2024)' },
    { label: 'T20I Runs', value: '4,188', context: 'Second highest run-getter' },
    { label: 'T20I Average', value: '48.7', context: 'Strike Rate: 137.0' },
    { label: 'T20I Centuries', value: '1', context: '122* (61) vs Afghanistan' },
    { label: 'T20 WC Player of Tourn.', value: '2', context: '2014 & 2016 editions' },
    { label: 'T20 WC 2024 Final', value: '76', context: 'Player of the Match in Final' }
  ],
  ipl: [
    { label: 'IPL Matches', value: '252+', context: 'Royal Challengers Bengaluru' },
    { label: 'IPL Runs', value: '8,004+', context: 'All-time leading IPL run scorer' },
    { label: 'IPL Centuries', value: '8', context: 'All-time IPL tournament record' },
    { label: 'Orange Caps Won', value: '2', context: '2016 (973 runs) & 2024 (741 runs)' },
    { label: 'Single Season Record', value: '973', context: 'Most runs in an IPL season (2016)' },
    { label: 'IPL Championships', value: '2', context: 'Champion in 2025 & 2026' }
  ]
};

function initStatsDashboard() {
  const tabs = document.querySelectorAll('.tab-btn');
  const grid = document.getElementById('stat-grid');
  if (!tabs.length || !grid) return;

  function renderStats(format) {
    const list = statsData[format] || statsData.all;
    grid.innerHTML = list.map(item => `
      <div class="stat-metric-card">
        <div class="metric-val">${item.value}</div>
        <div class="metric-title">${item.label}</div>
        <div class="metric-context">${item.context}</div>
      </div>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderStats(tab.dataset.tab);
    });
  });

  // Initial render
  renderStats('all');
}

/* ==========================================================================
   4. MILESTONE TIMELINE FILTER
   ========================================================================== */
function initTimelineFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const nodes = document.querySelectorAll('.timeline-node');
  if (!filterBtns.length || !nodes.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      nodes.forEach(node => {
        if (filter === 'all' || node.dataset.era === filter) {
          node.classList.remove('hidden');
        } else {
          node.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. CENTURY VAULT (SEARCH & FILTER ENGINE)
   ========================================================================== */
const landmarkCenturies = [
  { no: '1', score: '107', format: 'ODI', opp: 'Sri Lanka', innings: 'Chasing (Target 316)', venue: 'Eden Gardens, Kolkata', year: '2009', result: 'Won', chase: true },
  { no: '4', score: '105', format: 'ODI', opp: 'New Zealand', innings: 'Batting 1st', venue: 'Guwahati', year: '2010', result: 'Won', chase: false },
  { no: '5', score: '100*', format: 'ODI', opp: 'Bangladesh', innings: 'Batting 1st (World Cup Debut)', venue: 'Mirpur, Dhaka', year: '2011', result: 'Won', chase: false },
  { no: '8', score: '116', format: 'Test', opp: 'Australia', innings: '1st Innings (Maiden Test Ton)', venue: 'Adelaide Oval', year: '2012', result: 'Lost', chase: false },
  { no: '9', score: '133*', format: 'ODI', opp: 'Sri Lanka', innings: 'Chasing 321 in 36.4 overs (86b)', venue: 'Bellerive Oval, Hobart', year: '2012', result: 'Won', chase: true },
  { no: '11', score: '183', format: 'ODI', opp: 'Pakistan', innings: 'Chasing 330 (148b)', venue: 'Mirpur, Dhaka', year: '2012', result: 'Won', chase: true },
  { no: '16', score: '100*', format: 'ODI', opp: 'Australia', innings: 'Chasing 360 in 52 balls', venue: 'Jaipur', year: '2013', result: 'Won', chase: true },
  { no: '17', score: '115*', format: 'ODI', opp: 'Australia', innings: 'Chasing 351 (66b)', venue: 'Nagpur', year: '2013', result: 'Won', chase: true },
  { no: '21', score: '115 & 141', format: 'Test', opp: 'Australia', innings: 'Twin Tons as Test Captain', venue: 'Adelaide Oval', year: '2014', result: 'Lost', chase: true },
  { no: '22', score: '107', format: 'ODI', opp: 'Pakistan', innings: 'World Cup Group Stage', venue: 'Adelaide Oval', year: '2015', result: 'Won', chase: false },
  { no: '25', score: '200', format: 'Test', opp: 'West Indies', innings: 'Maiden Double Ton', venue: 'North Sound, Antigua', year: '2016', result: 'Won', chase: false },
  { no: '28', score: '235', format: 'Test', opp: 'England', innings: '1st Innings (Double Ton)', venue: 'Wankhede Stadium, Mumbai', year: '2016', result: 'Won', chase: false },
  { no: '30', score: '204', format: 'Test', opp: 'Bangladesh', innings: '4th Consecutive Series Double', venue: 'Hyderabad', year: '2017', result: 'Won', chase: false },
  { no: '32', score: '122', format: 'ODI', opp: 'England', innings: 'Chasing 351 (105b)', venue: 'Pune', year: '2017', result: 'Won', chase: true },
  { no: '42', score: '153', format: 'Test', opp: 'South Africa', innings: '1st Innings Masterclass', venue: 'Centurion', year: '2018', result: 'Lost', chase: false },
  { no: '44', score: '149', format: 'Test', opp: 'England', innings: '1st Innings Redemption', venue: 'Edgbaston, Birmingham', year: '2018', result: 'Lost', chase: false },
  { no: '47', score: '157*', format: 'ODI', opp: 'West Indies', innings: 'Fastest to 10k ODI Runs (129b)', venue: 'Visakhapatnam', year: '2018', result: 'Tied', chase: false },
  { no: '52', score: '254*', format: 'Test', opp: 'South Africa', innings: 'Career-best Test Score', venue: 'MCA Stadium, Pune', year: '2019', result: 'Won', chase: false },
  { no: '53', score: '136', format: 'Test', opp: 'Bangladesh', innings: 'Historic Pink-Ball Test', venue: 'Eden Gardens, Kolkata', year: '2019', result: 'Won', chase: false },
  { no: '71', score: '122*', format: 'T20I', opp: 'Afghanistan', innings: 'Maiden T20I Ton (1,020-day drought)', venue: 'Dubai', year: '2022', result: 'Won', chase: false },
  { no: '74', score: '166*', format: 'ODI', opp: 'Sri Lanka', innings: 'Demolition (110b, 8 sixes)', venue: 'Thiruvananthapuram', year: '2023', result: 'Won', chase: false },
  { no: '79', score: '103*', format: 'ODI', opp: 'Bangladesh', innings: 'World Cup 2023 Chase', venue: 'Pune', year: '2023', result: 'Won', chase: true },
  { no: '80', score: '117', format: 'ODI', opp: 'New Zealand', innings: '50th ODI Ton (Surpassed Sachin)', venue: 'Wankhede, Mumbai (Semi-Final)', year: '2023', result: 'Won', chase: false },
  { no: '85', score: '100*', format: 'ODI', opp: 'Champions Trophy', innings: 'Fastest to 14k ODI Runs', venue: 'Champions Trophy 2025', year: '2025', result: 'Won', chase: true },
  { no: '86', score: '104', format: 'ODI', opp: 'New Zealand', innings: '54th ODI Ton (91b, Indore)', venue: 'Indore', year: '2026', result: 'Lost', chase: true }
];

function initCenturyVault() {
  const tbody = document.getElementById('vault-tbody');
  const searchInput = document.getElementById('century-search');
  const filterBtns = document.querySelectorAll('.vault-filter-btn');
  const counterText = document.getElementById('vault-showing-text');
  if (!tbody || !searchInput) return;

  let currentFilter = 'all';
  let searchQuery = '';

  function renderTable() {
    const filtered = landmarkCenturies.filter(c => {
      // Format match
      let matchFormat = true;
      if (currentFilter === 'ODI') matchFormat = c.format === 'ODI';
      else if (currentFilter === 'Test') matchFormat = c.format === 'Test';
      else if (currentFilter === 'T20I') matchFormat = c.format === 'T20I';
      else if (currentFilter === 'chase') matchFormat = c.chase === true;

      // Text query match
      const q = searchQuery.toLowerCase();
      const matchText = !q ||
        c.opp.toLowerCase().includes(q) ||
        c.venue.toLowerCase().includes(q) ||
        c.year.includes(q) ||
        c.score.includes(q) ||
        c.innings.toLowerCase().includes(q);

      return matchFormat && matchText;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: #94a3b8;">No milestone centuries match your search criteria.</td></tr>`;
      if (counterText) counterText.textContent = `Showing 0 centuries`;
      return;
    }

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><strong>#${c.no}</strong></td>
        <td><span class="score-badge">${c.score}</span></td>
        <td><span class="format-pill ${c.format.toLowerCase()}">${c.format}</span></td>
        <td><strong>${c.opp}</strong></td>
        <td>${c.innings}</td>
        <td>${c.venue} (${c.year})</td>
        <td><span class="result-tag ${c.result.toLowerCase()}">${c.result}</span></td>
      </tr>
    `).join('');

    if (counterText) {
      counterText.textContent = `Displaying ${filtered.length} of ${landmarkCenturies.length} landmark centuries`;
    }
  }

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderTable();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.vfilter;
      renderTable();
    });
  });

  renderTable();
}

/* ==========================================================================
   6. LIGHTBOX MODAL FOR IMAGE INSPECTION
   ========================================================================== */
function initLightboxModal() {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalTag = document.getElementById('modal-tag');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close-btn');
  const modalDownload = document.getElementById('modal-download-link');
  const modalSoundBtn = document.getElementById('modal-sound-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!modal || !modalImg) return;

  function openModal(data) {
    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalTag.textContent = data.tag;
    modalDesc.textContent = data.desc;
    if (modalDownload) {
      modalDownload.href = data.img;
      modalDownload.download = data.img.split('/').pop();
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Play atmosphere on opening
    playStadiumCheerSound();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      openModal({
        img: item.dataset.img,
        title: item.dataset.title,
        tag: item.dataset.tag,
        desc: item.dataset.desc
      });
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (modalSoundBtn) {
    modalSoundBtn.addEventListener('click', () => {
      playStadiumCheerSound();
      playBatCrackSound();
    });
  }
}

/* ==========================================================================
   7. QUOTES CAROUSEL
   ========================================================================== */
const quotesData = [
  {
    quote: "I love watching Virat Kohli bat. He reminds me of myself. His aggression, his drive, and the way he attacks the bowling — he is a master.",
    speaker: "Sir Vivian Richards",
    role: "West Indies Batting Legend"
  },
  {
    quote: "Virat Kohli possesses the potential to surpass my record of 100 international centuries. His unwavering consistency and dedication are extraordinary.",
    speaker: "Sachin Tendulkar",
    role: "Cricket Icon & Master Blaster"
  },
  {
    quote: "Virat Kohli is the best chaser the game has ever seen. When the pressure is on, he doesn't just survive; he dominates the opposition completely.",
    speaker: "Kevin Pietersen",
    role: "Former England Captain"
  },
  {
    quote: "Virat Kohli is pure class. It's an honour to bat with him and share a dressing room. His intensity never drops, not for a single delivery.",
    speaker: "AB de Villiers",
    role: "South African Great & RCB Teammate"
  },
  {
    quote: "He is the head of the snake. His self-belief and ferocious competitiveness transformed Indian cricket into world-beaters in every condition.",
    speaker: "Dean Jones",
    role: "Australian Cricket Legend"
  }
];

function initQuotesCarousel() {
  const quoteText = document.getElementById('quote-text');
  const quoteSpeaker = document.getElementById('quote-speaker');
  const quoteRole = document.getElementById('quote-role');
  const prevBtn = document.getElementById('prev-quote-btn');
  const nextBtn = document.getElementById('next-quote-btn');
  const dotsContainer = document.getElementById('quote-dots');
  const card = document.getElementById('quote-card-display');

  if (!quoteText || !dotsContainer) return;

  let currentIndex = 0;
  let interval = null;

  // Build dots
  dotsContainer.innerHTML = quotesData.map((_, i) => `
    <span class="dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>
  `).join('');

  const dots = dotsContainer.querySelectorAll('.dot');

  function showQuote(idx) {
    currentIndex = (idx + quotesData.length) % quotesData.length;
    card.style.opacity = 0;
    card.style.transform = 'translateY(10px)';

    setTimeout(() => {
      const q = quotesData[currentIndex];
      quoteText.textContent = `"${q.quote}"`;
      quoteSpeaker.textContent = q.speaker;
      quoteRole.textContent = q.role;

      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));

      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';
    }, 200);
  }

  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(() => {
      showQuote(currentIndex + 1);
    }, 6000);
  }

  function stopAutoplay() {
    if (interval) clearInterval(interval);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      showQuote(currentIndex - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      showQuote(currentIndex + 1);
      startAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      showQuote(parseInt(dot.dataset.idx, 10));
      startAutoplay();
    });
  });

  startAutoplay();
}

/* ==========================================================================
   8. VK18 TRIVIA CHALLENGE GAME
   ========================================================================== */
const triviaQuestions = [
  {
    q: "How did Virat Kohli earn his famous nickname 'Cheeku' during his early cricket years?",
    options: [
      "From his fondness for the fruit chikoo",
      "His coach thought a salon makeover made him look like 'Chikoo' from Champak comics",
      "A television commentator gave it to him during his Under-19 tour",
      "Given by MS Dhoni behind the stumps during an IPL match"
    ],
    ans: 1,
    fact: "After a new haircut at a local salon, assistant coach Ajit Chowdhary noted he resembled 'Chikoo', the popular comic character from Champak!"
  },
  {
    q: "Where did Virat Kohli encounter his future wife Anushka Sharma for the very first time in 2013?",
    options: [
      "At an IPL gala after-party in Mumbai",
      "During a promotional commercial shoot for Clear shampoo",
      "At a charity dinner organized in New Delhi",
      "During an awards show red carpet interview"
    ],
    ans: 1,
    fact: "In an interview with Graham Bensinger, Kohli revealed they first met while shooting a commercial for Clear shampoo in 2013!"
  },
  {
    q: "What target did India need to chase down in under 40 overs during Kohli's blistering 133* (86b) at Hobart in 2012?",
    options: [
      "275 runs",
      "321 runs",
      "350 runs",
      "299 runs"
    ],
    ans: 1,
    fact: "India needed 321 runs to get the bonus point to stay in the finals hunt, and chased it in an astonishing 36.4 overs thanks to Kohli's blitz!"
  },
  {
    q: "How many runs did Virat Kohli plunder in the record-breaking 2016 IPL season?",
    options: [
      "848 runs with 3 centuries",
      "973 runs with 4 centuries",
      "912 runs with 5 centuries",
      "741 runs with 2 centuries"
    ],
    ans: 1,
    fact: "Kohli scored a legendary 973 runs at an average of 81.08 with 4 centuries in 2016, an all-time record that remains untouched!"
  },
  {
    q: "In what year did Virat Kohli become the only Indian cricketer to achieve the #1 ICC ranking in all three formats (Test, ODI, T20I)?",
    options: [
      "2015",
      "2018",
      "2016",
      "2020"
    ],
    ans: 1,
    fact: "Having reached #1 in ODIs (2013) and T20Is (2015), he scaled the #1 Test ranking in 2018, becoming the sole Indian to conquer all three summits!"
  }
];

function initTriviaGame() {
  const qNum = document.getElementById('trivia-q-num');
  const scoreElem = document.getElementById('trivia-score');
  const qText = document.getElementById('trivia-question-text');
  const optionsContainer = document.getElementById('trivia-options');
  const feedback = document.getElementById('trivia-feedback');
  const nextBtn = document.getElementById('btn-next-trivia');
  const restartBtn = document.getElementById('btn-restart-trivia');

  if (!qText || !optionsContainer) return;

  let currentQ = 0;
  let score = 0;
  let answered = false;

  function loadQuestion() {
    answered = false;
    const item = triviaQuestions[currentQ];
    qNum.textContent = `Question ${currentQ + 1} of ${triviaQuestions.length}`;
    scoreElem.textContent = `Score: ${score}`;
    qText.textContent = item.q;
    feedback.textContent = '';
    feedback.className = 'trivia-feedback';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'none';

    optionsContainer.innerHTML = item.options.map((opt, i) => `
      <button class="trivia-opt-btn" data-idx="${i}">${opt}</button>
    `).join('');

    const optButtons = optionsContainer.querySelectorAll('.trivia-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const selectedIdx = parseInt(btn.dataset.idx, 10);

        if (selectedIdx === item.ans) {
          score += 10;
          scoreElem.textContent = `Score: ${score}`;
          btn.classList.add('correct');
          feedback.textContent = `✓ Brilliant! ${item.fact}`;
          feedback.classList.add('correct-text');
          playCheerSound();
        } else {
          btn.classList.add('incorrect');
          optButtons[item.ans].classList.add('correct');
          feedback.textContent = `✗ Not quite! ${item.fact}`;
          feedback.classList.add('incorrect-text');
        }

        optButtons.forEach(b => b.disabled = true);

        if (currentQ < triviaQuestions.length - 1) {
          nextBtn.style.display = 'inline-flex';
        } else {
          showFinalScore();
        }
      });
    });
  }

  function showFinalScore() {
    qText.textContent = `Trivia Complete! You scored ${score} / ${triviaQuestions.length * 10} points.`;
    optionsContainer.innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 1.5rem; background: rgba(245,200,98,0.1); border-radius: 12px; border: 1px solid rgba(245,200,98,0.3);">
        <h4 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--gold-primary); margin-bottom: 0.5rem;">
          ${score === 50 ? '🏆 Master Chasemaster! Pure King Kohli Royalty!' : score >= 30 ? '🔥 True VK18 Aficionado! Great Cricket Knowledge!' : '🏏 Good Effort! Explore the career timeline to level up!'}
        </h4>
        <p style="color: #cbd5e1; font-size: 0.95rem;">You celebrated the records, grit, and legacy of Jersey #18.</p>
      </div>
    `;
    feedback.textContent = '';
    restartBtn.style.display = 'inline-flex';
    nextBtn.style.display = 'none';
  }

  nextBtn.addEventListener('click', () => {
    currentQ++;
    loadQuestion();
  });

  restartBtn.addEventListener('click', () => {
    currentQ = 0;
    score = 0;
    loadQuestion();
  });

  loadQuestion();
}

/* ==========================================================================
   9. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-item');

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', () => {
    drawer.classList.add('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   10. INTERACTIVE NUMBER COUNTERS
   ========================================================================== */
function initNumberCounters() {
  const counters = document.querySelectorAll('.strip-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          const suffix = counter.dataset.suffix || '';
          if (isNaN(target)) return;

          let start = 0;
          const duration = 1500;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              counter.textContent = target.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(start).toLocaleString() + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero-stats-strip');
  if (heroStats) observer.observe(heroStats);
}
