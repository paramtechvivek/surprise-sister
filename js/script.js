/* ============================================================
   AMU DIIII'S BIRTHDAY SURPRISE — SINGLE PAGE SCRIPT
   All 7 scenes live in one document; this file switches between
   them and runs every animation/interaction.
   ============================================================ */

/* ---------- 0. Scene navigation ---------- */
const SCENE_ORDER = ['loading', 'welcome', 'cake', 'gift', 'gallery', 'message', 'final'];

function goToScene(name) {
  const target = document.getElementById('section-' + name);
  if (!target) return;
  const current = document.querySelector('.journey-section.active');
  if (current === target) return;
  if (current) current.classList.remove('active');
  target.classList.add('active');
  updateJourneyDots(name);
  if (name === 'final') startFinaleEffects();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function updateJourneyDots(name) {
  document.querySelectorAll('.journey-dot').forEach((dot) => {
    dot.classList.toggle('active', dot.dataset.target === name);
  });
}

function initNavigation() {

  document.querySelectorAll('.journey-next').forEach((btn)=>{

    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      e.stopPropagation();

      const target = btn.dataset.target;

      if(target){
        goToScene(target);
      }

    });

  });

}

/* ---------- 1. Ambient background (stars / moon / clouds / fireflies / floating decor) ---------- */
function initAmbient() {
  const root = document.getElementById('ambient');
  if (!root) return;

  const stars = document.createElement('div');
  stars.className = 'stars-bg';
  root.appendChild(stars);

  const moon = document.createElement('div');
  moon.className = 'moon';
  root.appendChild(moon);

  for (let i = 0; i < 3; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.top = (10 + i * 14) + '%';
    cloud.style.animationDuration = (50 + i * 15) + 's';
    cloud.style.animationDelay = (-i * 12) + 's';
    root.appendChild(cloud);
  }

  function spawnFirefly() {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.left = Math.random() * 100 + '%';
    f.style.top = 60 + Math.random() * 35 + '%';
    const d = 6 + Math.random() * 5;
    f.style.animationDuration = d + 's';
    root.appendChild(f);
    setTimeout(() => f.remove(), d * 1000);
  }
  setInterval(spawnFirefly, 1200);
  for (let i = 0; i < 6; i++) setTimeout(spawnFirefly, i * 300);

  const balloonColors = ['#ff6fae', '#ffd166', '#b98cff', '#6fe8d0', '#ff9d3d'];
  function spawnBalloon() {
    const b = document.createElement('div');
    b.className = 'balloon-svg';
    b.innerHTML = balloonSVG(balloonColors[Math.floor(Math.random() * balloonColors.length)]);
    b.style.left = Math.random() * 94 + '%';
    b.style.width = 34 + Math.random() * 22 + 'px';
    const d = 13 + Math.random() * 8;
    b.style.animationDuration = d + 's';
    root.appendChild(b);
    setTimeout(() => b.remove(), d * 1000);
  }
  setInterval(spawnBalloon, 2400);
  for (let i = 0; i < 3; i++) setTimeout(spawnBalloon, i * 600);

  function spawnHeart() {
    const h = document.createElement('div');
    h.className = 'heart-emoji';
    h.textContent = ['💖', '💕', '💗'][Math.floor(Math.random() * 3)];
    h.style.left = Math.random() * 94 + '%';
    h.style.fontSize = (1 + Math.random() * 0.8) + 'rem';
    const d = 9 + Math.random() * 6;
    h.style.animationDuration = d + 's';
    root.appendChild(h);
    setTimeout(() => h.remove(), d * 1000);
  }
  setInterval(spawnHeart, 1900);

  function spawnButterfly() {
    const b = document.createElement('div');
    b.className = 'butterfly-svg';
    b.innerHTML = butterflySVG();
    b.style.left = Math.random() * 90 + '%';
    b.style.width = '26px';
    const d = 14 + Math.random() * 6;
    b.style.animationDuration = d + 's';
    root.appendChild(b);
    setTimeout(() => b.remove(), d * 1000);
  }
  setInterval(spawnButterfly, 3400);

  function spawnFlower() {
    const f = document.createElement('div');
    f.className = 'flower-svg';
    f.innerHTML = flowerSVG();
    f.style.left = Math.random() * 94 + '%';
    f.style.width = '22px';
    const d = 15 + Math.random() * 6;
    f.style.animationDuration = d + 's';
    root.appendChild(f);
    setTimeout(() => f.remove(), d * 1000);
  }
  setInterval(spawnFlower, 4200);
}

/* ---------- Small inline SVG helpers ---------- */
function balloonSVG(color) {
  return `<svg viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="20" rx="18" ry="20" fill="${color}" opacity="0.9"/>
    <ellipse cx="14" cy="12" rx="5" ry="7" fill="#ffffff" opacity="0.25"/>
    <path d="M20 40 L20 52" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
    <path d="M17 40 Q20 44 23 40 Z" fill="${color}"/>
  </svg>`;
}
function butterflySVG() {
  return `<svg viewBox="0 0 40 32" xmlns="http://www.w3.org/2000/svg">
    <g>
      <ellipse cx="12" cy="12" rx="10" ry="8" fill="#ff8fc4" opacity="0.85"/>
      <ellipse cx="28" cy="12" rx="10" ry="8" fill="#b98cff" opacity="0.85"/>
      <ellipse cx="12" cy="22" rx="7" ry="6" fill="#ffd166" opacity="0.8"/>
      <ellipse cx="28" cy="22" rx="7" ry="6" fill="#6fe8d0" opacity="0.8"/>
      <rect x="19" y="8" width="2" height="18" rx="1" fill="#4a3a5a"/>
    </g>
  </svg>`;
}
function flowerSVG() {
  return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <g fill="#ff8fc4" opacity="0.85">
      <circle cx="20" cy="10" r="7"/><circle cx="20" cy="30" r="7"/>
      <circle cx="10" cy="20" r="7"/><circle cx="30" cy="20" r="7"/>
    </g>
    <circle cx="20" cy="20" r="6" fill="#ffd166"/>
  </svg>`;
}

/* ---------- 2. Cursor magic (hearts, sparkles, stars) ---------- */
function initCursorMagic() {
  const symbols = ['✨', '💖', '⭐'];
  let last = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 70) return;
    last = now;
    const el = document.createElement('div');
    el.className = 'cursor-emoji';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  });
}

/* ---------- 3. Confetti ---------- */
const confettiColors = ['#ff6fae', '#ffd166', '#6fe8d0', '#b98cff', '#ff9d3d', '#ffffff'];
function burstConfetti(count = 60) {
  const root = document.getElementById('confettiRoot');
  if (!root) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    root.appendChild(piece);
    setTimeout(() => piece.remove(), 5200);
  }
}

/* ---------- 4. Fireworks canvas engine ---------- */
let fwParticles = [];
let fwCtx, fwCanvas;
function initFireworks() {
  fwCanvas = document.getElementById('fireworksCanvas');
  if (!fwCanvas) return;
  fwCtx = fwCanvas.getContext('2d');
  const resize = () => { fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  function loop() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    fwParticles.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.alpha -= 0.012;
      fwCtx.globalAlpha = Math.max(p.alpha, 0);
      fwCtx.fillStyle = p.color;
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fwCtx.fill();
    });
    fwParticles = fwParticles.filter((p) => p.alpha > 0);
    fwCtx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
}
const fireworkColors = ['#ffd166', '#6fe8d0', '#b98cff', '#ff6fae', '#ff9d3d', '#ff5b5b'];
function createFirework(x, y) {
  if (!fwCtx) return;
  const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
  for (let i = 0; i < 40; i++) {
    const angle = (Math.PI * 2 * i) / 40;
    const speed = 2 + Math.random() * 3;
    fwParticles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, alpha: 1, color, size: 2 + Math.random() * 2 });
  }
}
function randomFirework() {
  if (!fwCanvas) return;
  createFirework(Math.random() * fwCanvas.width, Math.random() * fwCanvas.height * 0.5 + 40);
}
function fireworksBurst(times = 8, gap = 180) {
  for (let i = 0; i < times; i++) setTimeout(randomFirework, i * gap);
}

/* A soft "whoosh" using the Web Audio API — no external file needed */
function playWhoosh() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.6);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
  } catch (e) { /* audio not available — fail silently */ }
}

/* ---------- 5. Music player ---------- */
function initMusicPlayer() {
  const audio = document.getElementById('bgAudio');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const progressTrack = document.getElementById('progressTrack');
  const progressFill = document.getElementById('progressFill');
  const volumeSlider = document.getElementById('volumeSlider');
  if (!audio || !playPauseBtn) return;

  audio.volume = 0.6;
  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play().catch(() => {}); playPauseBtn.textContent = '⏸'; }
    else { audio.pause(); playPauseBtn.textContent = '▶'; }
  });
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
  });
  progressTrack.addEventListener('click', (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (audio.duration) audio.currentTime = ratio * audio.duration;
  });
  volumeSlider.addEventListener('input', () => { audio.volume = volumeSlider.value; });
}

/* ---------- 6. Loading scene: auto-advance after 3 seconds ---------- */
/* ---------- Loading Countdown ---------- */
function initLoadingCountdown() {

  const countdown = document.getElementById("loadingCountdown");
  const loadingSection = document.getElementById("section-loading");
  const welcomeSection = document.getElementById("section-welcome");

  if (!countdown || !loadingSection || !welcomeSection) return;

  let number = 3;

  countdown.textContent = number;

  const timer = setInterval(() => {

    number--;

    if (number > 0) {

      // Restart animation smoothly
      countdown.style.animation = "none";
      void countdown.offsetWidth;
      countdown.style.animation = "countPulse 1s ease";

      countdown.textContent = number;

    } else {

      clearInterval(timer);

      countdown.textContent = "🎉";

      setTimeout(() => {

        // Switch scenes properly
        loadingSection.classList.remove("active");
        welcomeSection.classList.add("active");

        // Update navigation dots
        if (typeof updateJourneyDots === "function") {
          updateJourneyDots("welcome");
        }

      }, 800);

    }

  }, 1000);

}

/* ---------- 7. Cake scene: countdown + blow out candles ---------- */
function initCakeScene() {
  const blowBtn = document.getElementById('blowBtn');
  if (!blowBtn) return;
  const overlay = document.getElementById('countdownOverlay');
  const flames = document.querySelectorAll('#section-cake .flame');
  const smokeContainer = document.getElementById('smokeContainer');
  const wishText = document.getElementById('wishText');
  const nextBtn = document.getElementById('cakeNextBtn');
  let running = false;

  function spawnSmoke() {
    for (let i = 0; i < 4; i++) {
      const puff = document.createElement('div');
      puff.className = 'smoke-puff';
      puff.style.left = 40 + Math.random() * 20 + 'px';
      puff.style.top = 20 + Math.random() * 10 + 'px';
      puff.style.animationDelay = (i * 0.15) + 's';
      smokeContainer.appendChild(puff);
      setTimeout(() => puff.remove(), 1800);
    }
  }

  blowBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    blowBtn.disabled = true;
    overlay.classList.remove('hidden');
    const numberEl = document.getElementById('countdownNumber');
    let count = 3;
    numberEl.textContent = count;
    flames.forEach((f) => f.classList.add('shrinking'));

    const tick = setInterval(() => {
      count--;
      if (count > 0) {
        numberEl.textContent = count;
        numberEl.style.animation = 'none';
        void numberEl.offsetWidth;
        numberEl.style.animation = 'countZoom 1s cubic-bezier(0.22,1,0.36,1) both';
      } else {
        clearInterval(tick);
        flames.forEach((f) => f.classList.add('out'));
        playWhoosh();
        spawnSmoke();
        document.body.style.filter = 'brightness(0.7)';
        setTimeout(() => { document.body.style.filter = ''; overlay.classList.add('hidden'); }, 500);
        setTimeout(() => {
          fireworksBurst(8);
          burstConfetti(90);
          wishText.classList.remove('hidden');
          nextBtn.classList.remove('hidden');
        }, 650);
      }
    }, 850);
  });
}

/* ---------- 8. Gift scene: shake, open, reveal ---------- */
function initGiftScene() {
  const openBtn = document.getElementById('openGiftBtn');
  if (!openBtn) return;
  const giftBox = document.getElementById('giftBox');
  const reveal = document.getElementById('giftReveal');
  const nextBtn = document.getElementById('giftNextBtn');
  let opened = false;

  function burstButterflies() {
    for (let i = 0; i < 6; i++) {
      const b = document.createElement('div');
      b.className = 'butterfly-fly';
      b.textContent = '🦋';
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 100;
      b.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      b.style.setProperty('--by', (Math.sin(angle) * dist - 60) + 'px');
      giftBox.parentElement.appendChild(b);
      setTimeout(() => b.remove(), 1700);
    }
  }

  openBtn.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    giftBox.classList.add('shake');
    setTimeout(() => {
      giftBox.classList.add('open');
      burstConfetti(60);
      burstButterflies();
      reveal.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
    }, 500);
  });
}

/* ---------- 9. Gallery scene: masonry + lightbox ---------- */
function initGalleryScene() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  const memories = [
    { src: 'img2.jpg', caption: 'Always laughing together' },
    { src: 'img7.jpeg', caption: 'That perfect day' },
    { src: 'img1.jpg', caption: 'Silly faces, best memories' },
    { src: 'img6.jpeg', caption: 'Just us two' },
    { src: 'img8.jpeg', caption: 'A moment to treasure' },
    { src: 'img4.jpg', caption: 'Forever grateful for you' }
  ];

  memories.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'polaroid';
    card.style.setProperty('--tilt', (i % 2 === 0 ? -1 : 1) * (2 + Math.random() * 3) + 'deg');
    const img = document.createElement('img');
    img.src = m.src;
    img.alt = m.caption;
    img.loading = 'lazy';
    const cap = document.createElement('div');
    cap.className = 'polaroid-caption';
    cap.textContent = m.caption;
    card.appendChild(img);
    card.appendChild(cap);
    card.addEventListener('click', () => {
      lightboxImg.src = m.src;
      lightbox.classList.remove('hidden');
    });
    grid.appendChild(card);
  });

  lightboxClose.addEventListener('click', () => lightbox.classList.add('hidden'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.add('hidden'); });
}

/* ---------- 10. Message scene: envelope + letter ---------- */
function initMessageScene() {
  const envelope = document.getElementById('envelope');
  if (!envelope) return;
  const letterFull = document.getElementById('letterFull');
  const nextBtn = document.getElementById('messageNextBtn');

  envelope.addEventListener('click', () => {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    setTimeout(() => {
      letterFull.classList.remove('hidden');
      requestAnimationFrame(() => letterFull.classList.add('visible'));
      nextBtn.classList.remove('hidden');
    }, 900);
  });
}

/* ---------- 11. Final scene: grand celebration (starts only when reached) ---------- */
let finaleStarted = false;
function startFinaleEffects() {
  if (finaleStarted) return;
  finaleStarted = true;
  fireworksBurst(10, 250);
  setInterval(randomFirework, 1000);
  burstConfetti(120);
  setInterval(() => burstConfetti(20), 900);

  function spawnShootingStar() {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.top = Math.random() * 40 + '%';
    s.style.left = 60 + Math.random() * 35 + '%';
    document.getElementById('ambient').appendChild(s);
    setTimeout(() => s.remove(), 1500);
  }
  setInterval(spawnShootingStar, 2200);
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAmbient();
  initCursorMagic();
  initFireworks();
  initMusicPlayer();
  initLoadingCountdown();
  initCakeScene();
  initGiftScene();
  initGalleryScene();
  initMessageScene();
});

