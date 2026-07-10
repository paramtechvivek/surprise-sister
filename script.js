/* =========================================================
   PREMIUM BIRTHDAY SURPRISE — SCRIPT
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   0. CONFIG — edit this block to personalize the site
   --------------------------------------------------------- */
const CONFIG = {
  name: 'Amu Dii',
  letter: `Happy Birthday to the most wonderful sister anyone could ever ask for!

On your special day, I just want to thank you for being such an important part of my life. You have always been there for me—through my happiest moments and my toughest days. Your love, kindness, and support mean more to me than words can ever express.

You are not only my sister but also my best friend, my guide, and someone I can always count on. Your smile has the power to brighten even the darkest days, and your strength inspires everyone around you.

Your Loving Brother ❤️`,
  photos: [
    { src: 'images/photo1.jpg', caption: 'Little us, endless love. 💖' },
    { src: 'images/photo2.jpg', caption: 'Smiles, love, and beautiful memories. ❤️' },
    { src: 'images/photo3.jpg', caption: 'Brother & Sister — the strongest team. 💙❤️' },
    { src: 'images/photo4.jpg', caption: 'One picture, countless memories. 📸❤️' },
    { src: 'images/photo5.jpg', caption: 'Beauty in every glance. 💚✨' },
    { src: 'images/photo6.jpg', caption: 'Some moments deserve to be framed forever. 🖼️✨' }
  ],
  candleCount: 5,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/* ---------------------------------------------------------
   1. UTILITIES
   --------------------------------------------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function debounce(fn, wait = 150) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* =========================================================
   2. GALAXY BACKGROUND ENGINE (Canvas)
   ========================================================= */
const GalaxyEngine = (() => {
  const canvas = $('#galaxy-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  let W, H, DPR;
  let stars = [];
  let dust = [];
  let meteors = [];
  let nebulaBlobs = [];
  let mouse = { x: 0, y: 0, active: false };
  let rafId = null;
  let lastMeteor = 0;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = window.innerWidth * DPR;
    H = canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    buildField();
  }

  function buildField() {
    const area = window.innerWidth * window.innerHeight;
    const starCount = CONFIG.reducedMotion ? Math.round(area / 4500) : Math.round(area / 1800);
    stars = Array.from({ length: starCount }, () => ({
      x: rand(0, W), y: rand(0, H),
      r: rand(0.3, 1.6) * DPR,
      baseAlpha: rand(0.25, 1),
      tw: rand(0, Math.PI * 2),
      twSpeed: rand(0.015, 0.045),
      parallax: rand(0.1, 0.6)
    }));

    dust = Array.from({ length: Math.round(area / 9000) }, () => ({
      x: rand(0, W), y: rand(0, H),
      r: rand(20, 70) * DPR,
      hue: Math.random() > 0.5 ? '176,107,255' : '78,205,196',
      alpha: rand(0.02, 0.06),
      dx: rand(-0.02, 0.02), dy: rand(-0.01, 0.01)
    }));

    nebulaBlobs = [
      { x: 0.2, y: 0.25, r: 0.5, color: '255,110,199' },
      { x: 0.8, y: 0.15, r: 0.45, color: '176,107,255' },
      { x: 0.5, y: 0.85, r: 0.55, color: '78,205,196' }
    ];
  }

  function spawnMeteor() {
    const fromLeft = Math.random() > 0.5;
    meteors.push({
      x: fromLeft ? rand(0, W * 0.4) : rand(W * 0.6, W),
      y: rand(-40, H * 0.2),
      vx: fromLeft ? rand(4, 8) * DPR : rand(-8, -4) * DPR,
      vy: rand(3, 6) * DPR,
      life: 1,
      len: rand(80, 160) * DPR
    });
  }

  function draw(time) {
    // base gradient wash (cheap, avoids clearRect banding)
    ctx.fillStyle = '#060714';
    ctx.fillRect(0, 0, W, H);

    // nebula blobs
    nebulaBlobs.forEach(b => {
      const cx = b.x * W, cy = b.y * H, r = b.r * Math.max(W, H);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${b.color},0.14)`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    // space dust / aurora particles
    dust.forEach(d => {
      d.x += d.dx; d.y += d.dy;
      if (d.x < -d.r) d.x = W + d.r; if (d.x > W + d.r) d.x = -d.r;
      if (d.y < -d.r) d.y = H + d.r; if (d.y > H + d.r) d.y = -d.r;
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
      g.addColorStop(0, `rgba(${d.hue},${d.alpha})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    });

    // stars with twinkle + mouse parallax
    const px = mouse.active ? (mouse.x / W - 0.5) : 0;
    const py = mouse.active ? (mouse.y / H - 0.5) : 0;

    stars.forEach(s => {
      s.tw += s.twSpeed;
      const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.tw));
      const ox = s.x - px * 40 * s.parallax * DPR;
      const oy = s.y - py * 40 * s.parallax * DPR;
      ctx.beginPath();
      ctx.fillStyle = `rgba(244,240,255,${alpha})`;
      ctx.arc(ox, oy, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // meteors / shooting stars
    if (!CONFIG.reducedMotion && time - lastMeteor > rand(2200, 5200)) {
      spawnMeteor();
      lastMeteor = time;
    }
    meteors.forEach(m => {
      m.x += m.vx; m.y += m.vy; m.life -= 0.012;
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * (m.len / 6), m.y - m.vy * (m.len / 6));
      grad.addColorStop(0, `rgba(255,255,255,${m.life})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2 * DPR;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * (m.len / 6), m.y - m.vy * (m.len / 6));
      ctx.stroke();
    });
    meteors = meteors.filter(m => m.life > 0 && m.y < H + 100);

    rafId = requestAnimationFrame(draw);
  }

  function bindMouse() {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; mouse.active = true;
    }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.active = false; }, { passive: true });
  }

  function start() {
    resize();
    bindMouse();
    window.addEventListener('resize', debounce(resize, 200));
    rafId = requestAnimationFrame(draw);
  }

  return { start };
})();

/* =========================================================
   3. LOADER
   ========================================================= */
function runLoader(onDone) {
  const loader = $('#loader');
  const fill = $('#loader-bar-fill');
  const pct = $('#loader-percent');
  let p = 0;
  const tick = () => {
    p = clamp(p + rand(4, 12), 0, 100);
    fill.style.width = p + '%';
    pct.textContent = Math.round(p) + '%';
    if (p < 100) {
      setTimeout(tick, rand(90, 200));
    } else {
      setTimeout(() => {
        loader.classList.add('is-hidden');
        setTimeout(onDone, 900);
      }, 250);
    }
  };
  tick();
}

/* =========================================================
   4. FLOATING HEARTS (Scene 1 ambience)
   ========================================================= */
function spawnFloatingHearts() {
  const wrap = $('#floating-hearts');
  if (!wrap || CONFIG.reducedMotion) return;
  const glyphs = ['♥', '✦', '♡'];
  setInterval(() => {
    const el = document.createElement('span');
    el.className = 'heart';
    el.textContent = glyphs[Math.floor(rand(0, glyphs.length))];
    el.style.left = rand(4, 96) + '%';
    el.style.setProperty('--drift', rand(-60, 60) + 'px');
    el.style.animationDuration = rand(7, 13) + 's';
    el.style.fontSize = rand(12, 24) + 'px';
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 14000);
  }, 900);
}

/* =========================================================
   5. SCENE MANAGER
   ========================================================= */
const SceneManager = (() => {
  const scenes = $$('.scene');
  let current = 'scene-welcome';

  function show(id) {
    const next = document.getElementById(id);
    const prev = document.getElementById(current);
    if (!next || next === prev) return;

    if (window.gsap) {
      if (prev) {
        gsap.to(prev, {
          opacity: 0, y: -24, duration: 0.5, ease: 'power2.in',
          onComplete: () => { prev.classList.remove('is-active'); activate(next); }
        });
      } else {
        activate(next);
      }
    } else {
      if (prev) prev.classList.remove('is-active');
      activate(next);
    }
    current = id;
    window.dispatchEvent(new CustomEvent('scene:enter', { detail: { id } }));
  }

  function activate(next) {
    next.classList.add('is-active');
    if (window.gsap) {
      gsap.fromTo(next, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      const card = next.querySelector('.glass-card, .scene-inner > *');
    }
  }

  function bindNextButtons() {
    $$('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => show(btn.getAttribute('data-next')));
    });
  }

  function init() {
    document.getElementById('scene-welcome').classList.add('is-active');
    bindNextButtons();
    if (window.gsap) {
      gsap.from('.welcome-card', { opacity: 0, y: 40, scale: 0.96, duration: 1.1, ease: 'power3.out', delay: 0.2 });
    }
  }

  return { init, show, get current() { return current; } };
})();

/* =========================================================
   6. MUSIC PLAYER
   ========================================================= */
const MusicPlayer = (() => {
  const audio = $('#bg-audio');
  const toggleBtn = $('#music-toggle');
  const iconPlay = $('.icon-play', toggleBtn);
  const iconPause = $('.icon-pause', toggleBtn);
  const seekTrack = $('#music-seek');
  const seekFill = $('#music-progress-fill');
  const volume = $('#music-volume');
  let startedOnce = false;

  function setPlayingUI(isPlaying) {
    toggleBtn.classList.toggle('is-playing', isPlaying);
    toggleBtn.setAttribute('aria-pressed', String(isPlaying));
    iconPlay.hidden = isPlaying;
    iconPause.hidden = !isPlaying;
    toggleBtn.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
  }

  function play() {
    audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
  }
  function pause() { audio.pause(); setPlayingUI(false); }

  function bind() {
    audio.volume = parseFloat(volume.value);

    toggleBtn.addEventListener('click', () => {
      startedOnce = true;
      audio.paused ? play() : pause();
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      seekFill.style.width = pct + '%';
      seekTrack.setAttribute('aria-valuenow', Math.round(pct));
    });

    function seekTo(clientX) {
      const rect = seekTrack.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      if (audio.duration) audio.currentTime = ratio * audio.duration;
    }
    seekTrack.addEventListener('click', (e) => seekTo(e.clientX));
    seekTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
    });

    volume.addEventListener('input', () => { audio.volume = parseFloat(volume.value); });

    // Autostart on first user gesture anywhere on the page (mobile-safe)
    const autostart = () => {
      if (startedOnce) return;
      startedOnce = true;
      play();
      window.removeEventListener('pointerdown', autostart);
    };
    window.addEventListener('pointerdown', autostart, { once: true });

    audio.addEventListener('error', () => {
      // Graceful degrade if music/birthday.mp3 hasn't been added yet.
      $('.music-title').textContent = 'Add music/birthday.mp3';
      toggleBtn.style.opacity = '0.5';
      toggleBtn.style.pointerEvents = 'none';
    });
  }

  return { bind, play, pause };
})();

/* =========================================================
   7. GIFT BOX
   ========================================================= */
function initGiftBox() {
  const box = $('#gift-box');
  const particlesWrap = $('#gift-particles');
  const continueBtn = $('#gift-continue');
  let opened = false;

  // pre-build spark particles
  const sparkCount = 18;
  for (let i = 0; i < sparkCount; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    const angle = (i / sparkCount) * Math.PI * 2;
    const dist = rand(60, 140);
    s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    s.style.background = i % 2 === 0 ? 'var(--c-gold)' : 'var(--c-nebula-pink)';
    s.style.animationDelay = rand(0, 0.15) + 's';
    particlesWrap.appendChild(s);
  }

  function open() {
    if (opened) return;
    opened = true;
    box.classList.add('is-open');
    if (window.gsap) {
      gsap.timeline()
        .to(box, { scale: 1.05, duration: 0.15, ease: 'power1.out' })
        .to(box, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' });
    }
    setTimeout(() => {
      continueBtn.hidden = false;
      if (window.gsap) gsap.from(continueBtn, { opacity: 0, y: 16, duration: 0.6 });
    }, 500);
  }

  box.addEventListener('click', open);
  box.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(); });
}

/* =========================================================
   8. LETTER — typewriter
   ========================================================= */
function initLetter() {
  let typed = false;
  window.addEventListener('scene:enter', (e) => {
    if (e.detail.id !== 'scene-letter' || typed) return;
    typed = true;
    const el = $('#letter-text');
    const cursor = $('#letter-cursor');
    const continueBtn = $('#letter-continue');
    const text = CONFIG.letter;
    let i = 0;

    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i += 2;
        setTimeout(type, 14);
      } else {
        cursor.style.display = 'none';
        continueBtn.hidden = false;
        if (window.gsap) gsap.from(continueBtn, { opacity: 0, y: 12, duration: 0.6 });
      }
    }
    setTimeout(type, 400);
  });
}

/* =========================================================
   9. GALLERY + LIGHTBOX
   ========================================================= */
function initGallery() {
  const grid = $('#gallery-grid');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  let index = 0;
  let slideTimer = null;

  CONFIG.photos.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Open photo: ' + photo.caption);

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = 'lazy';
    img.onerror = () => { img.remove(); fallback.style.display = 'flex'; };

    const fallback = document.createElement('div');
    fallback.className = 'ph-fallback';
    fallback.style.display = 'none';
    fallback.textContent = photo.caption;

    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = photo.caption;

    item.append(img, fallback, caption);
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLightbox(i); });
    grid.appendChild(item);
  });

  function render() {
    const p = CONFIG.photos[index];
    lightboxImg.src = p.src;
    lightboxImg.alt = p.caption;
  }

  function openLightbox(i) {
    index = i;
    render();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    startSlideshow();
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    clearInterval(slideTimer);
  }
  function nextImg() { index = (index + 1) % CONFIG.photos.length; render(); }
  function prevImg() { index = (index - 1 + CONFIG.photos.length) % CONFIG.photos.length; render(); }

  function startSlideshow() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextImg, 4000);
  }
  function pauseSlideshowBriefly() {
    clearInterval(slideTimer);
    startSlideshow();
  }

  $('#lightbox-close').addEventListener('click', closeLightbox);
  $('#lightbox-next').addEventListener('click', () => { nextImg(); pauseSlideshowBriefly(); });
  $('#lightbox-prev').addEventListener('click', () => { prevImg(); pauseSlideshowBriefly(); });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') { nextImg(); pauseSlideshowBriefly(); }
    if (e.key === 'ArrowLeft') { prevImg(); pauseSlideshowBriefly(); }
  });

  // touch swipe
  let touchX = null;
  lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { dx > 0 ? prevImg() : nextImg(); pauseSlideshowBriefly(); }
    touchX = null;
  }, { passive: true });

  if (window.gsap) {
    window.addEventListener('scene:enter', (e) => {
      if (e.detail.id !== 'scene-gallery') return;
      gsap.from('.gallery-item', { opacity: 0, y: 30, stagger: 0.08, duration: 0.6, ease: 'power2.out' });
    });
  }
}

/* =========================================================
   10. CAKE + CANDLES
   ========================================================= */
function initCake() {
  const wrap = $('#candles');
  const continueBtn = $('#cake-continue');
  const sub = $('#cake-sub');
  let remaining = CONFIG.candleCount;

  for (let i = 0; i < CONFIG.candleCount; i++) {
    const c = document.createElement('button');
    c.className = 'candle';
    c.setAttribute('aria-label', 'Blow out candle ' + (i + 1));
    const flame = document.createElement('div');
    flame.className = 'flame';
    flame.style.animationDelay = rand(0, 0.4) + 's';
    c.appendChild(flame);
    c.addEventListener('click', () => blow(c));
    wrap.appendChild(c);
  }

  function blow(candle) {
    if (candle.classList.contains('is-blown')) return;
    candle.classList.add('is-blown');
    remaining--;
    if (remaining === 0) {
      sub.textContent = 'Your wish is already coming true.';
      continueBtn.hidden = false;
      if (window.gsap) gsap.from(continueBtn, { opacity: 0, y: 12, duration: 0.6 });
    } else {
      sub.textContent = remaining + ' candle' + (remaining === 1 ? '' : 's') + ' left to go.';
    }
  }
}

/* =========================================================
   11. CELEBRATION — fireworks, confetti, balloons
   ========================================================= */
const Celebration = (() => {
  const canvas = $('#celebration-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], rafId = null, running = false;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawnFirework() {
    const x = rand(W * 0.15, W * 0.85);
    const y = rand(H * 0.15, H * 0.5);
    const hue = [ '#ff6ec7', '#ffd66b', '#4ecdc4', '#b06bff' ][Math.floor(rand(0, 4))];
    const count = CONFIG.reducedMotion ? 16 : 34;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = rand(1.5, 5);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, decay: rand(0.008, 0.018),
        color: hue, size: rand(1.5, 3), type: 'firework'
      });
    }
  }

  function spawnConfettiBurst() {
    const colors = ['#ff6ec7', '#ffd66b', '#4ecdc4', '#b06bff', '#ffffff'];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: rand(0, W), y: -10,
        vx: rand(-1, 1), vy: rand(1.5, 3.5),
        rot: rand(0, Math.PI * 2), rotSpeed: rand(-0.1, 0.1),
        life: 1, decay: rand(0.003, 0.006),
        color: colors[Math.floor(rand(0, colors.length))],
        size: rand(4, 8), type: 'confetti'
      });
    }
  }

  function draw() {
    ctx.fillStyle = 'rgba(6,7,20,0.18)';
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.type === 'firework') { p.vy += 0.02; p.life -= p.decay; }
      if (p.type === 'confetti') { p.vy += 0.01; p.rot += p.rotSpeed; p.life -= p.decay; }

      ctx.save();
      ctx.globalAlpha = clamp(p.life, 0, 1);
      if (p.type === 'firework') {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    });

    particles = particles.filter(p => p.life > 0 && p.y < H + 20);
    rafId = requestAnimationFrame(draw);
  }

  function spawnBalloons() {
    const wrap = $('#balloons');
    const colors = ['#ff6ec7', '#ffd66b', '#4ecdc4', '#b06bff'];
    for (let i = 0; i < 10; i++) {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.left = rand(2, 92) + '%';
      b.style.background = `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5), ${colors[i % colors.length]})`;
      b.style.setProperty('--sway', rand(-60, 60) + 'px');
      b.style.animationDuration = rand(9, 16) + 's';
      b.style.animationDelay = rand(0, 6) + 's';
      wrap.appendChild(b);
    }
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    spawnBalloons();
    spawnConfettiBurst();
    let fireworkTimer = setInterval(spawnFirework, 900);
    rafId = requestAnimationFrame(draw);
    // stop spawning after a while to keep perf sane, particles fade naturally
    setTimeout(() => clearInterval(fireworkTimer), 9000);
  }

  window.addEventListener('resize', debounce(() => { if (running) resize(); }, 200));

  return { start };
})();

/* =========================================================
   12. FINAL SCENE — constellation signature
   ========================================================= */
function drawConstellation() {
  const svg = $('#constellation-svg');
  if (svg.dataset.drawn) return;
  svg.dataset.drawn = 'true';

  // Heart-shaped point path plotted on a 800x400 viewBox
  const points = [];
  const steps = 22;
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({ x: 400 + x * 9, y: 190 + y * 9 });
  }

  const ns = 'http://www.w3.org/2000/svg';
  points.forEach((p, i) => {
    const next = points[(i + 1) % points.length];
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', p.x); line.setAttribute('y1', p.y);
    line.setAttribute('x2', next.x); line.setAttribute('y2', next.y);
    line.style.opacity = '0';
    svg.appendChild(line);

    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
    dot.setAttribute('r', 2.6);
    dot.style.opacity = '0';
    svg.appendChild(dot);

    if (window.gsap) {
      gsap.to([line, dot], { opacity: 1, duration: 0.4, delay: i * 0.06 + 0.3, ease: 'power1.out' });
    } else {
      line.style.opacity = '0.5'; dot.style.opacity = '1';
    }
  });
}

/* =========================================================
   13. REPLAY
   --------------------------------------------------------- */
function initReplay() {
  $('#btn-replay').addEventListener('click', () => {
    // reset gift box
    const box = $('#gift-box');
    box.classList.remove('is-open');
    $('#gift-continue').hidden = true;

    // reset letter
    $('#letter-text').textContent = '';
    $('#letter-cursor').style.display = 'inline-block';
    $('#letter-continue').hidden = true;
    initLetter.typed = false;

    // reset candles
    $$('.candle').forEach(c => c.classList.remove('is-blown'));
    $('#cake-continue').hidden = true;
    $('#cake-sub').textContent = 'Tap each candle to blow it out.';

    SceneManager.show('scene-welcome');
  });
}

/* =========================================================
   14. RIPPLE EFFECT ON BUTTONS
   ========================================================= */
function initRipples() {
  $$('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', (e.clientX - rect.left) + 'px');
      btn.style.setProperty('--ry', (e.clientY - rect.top) + 'px');
      btn.classList.remove('is-rippling');
      // force reflow so the animation can restart
      void btn.offsetWidth;
      btn.classList.add('is-rippling');
    });
  });
}

/* =========================================================
   15. WIRE UP SCENE-SPECIFIC TRIGGERS
   ========================================================= */
function wireSceneTriggers() {
  window.addEventListener('scene:enter', (e) => {
    if (e.detail.id === 'scene-celebration') Celebration.start();
    if (e.detail.id === 'scene-final') drawConstellation();
  });
}

/* =========================================================
   16. PERSONALIZATION — inject name
   ========================================================= */
function applyPersonalization() {
  $$('#title-name, #final-name').forEach(el => { el.textContent = CONFIG.name; });
  document.title = `Happy Birthday, ${CONFIG.name}!`;
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  applyPersonalization();
  GalaxyEngine.start();
  runLoader(() => {
    SceneManager.init();
    spawnFloatingHearts();
  });
  MusicPlayer.bind();
  initGiftBox();
  initLetter();
  initGallery();
  initCake();
  initReplay();
  initRipples();
  wireSceneTriggers();
});