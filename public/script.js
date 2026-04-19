/* ═══════════════════════════════════════════════════
   BIRTHDAY SURPRISE WEBSITE — MAIN SCRIPT
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── HEARTS BACKGROUND ─────────────────────────── */
(function initHeartsBackground() {
  const container = document.getElementById('hearts-bg');
  const symbols = ['💕', '❤️', '🌸', '💖', '💗', '✨', '🌷', '💝'];
  const count = window.innerWidth < 600 ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (Math.random() * 18 + 10) + 'px';
    const duration = Math.random() * 14 + 10;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = -(Math.random() * duration) + 's';
    container.appendChild(el);
  }
})();

/* ─── SPARKLES BACKGROUND ───────────────────────── */
(function initSparkles() {
  const container = document.getElementById('sparkles-bg');
  const colors = ['#ec4899', '#f9a8d4', '#fbcfe8', '#f472b6', '#ff80b3'];
  const count = 25;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.top = Math.random() * 100 + '%';
    dot.style.background = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 5 + 3;
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    const duration = Math.random() * 3 + 2;
    dot.style.animationDuration = duration + 's';
    dot.style.animationDelay = -(Math.random() * duration) + 's';
    container.appendChild(dot);
  }
})();

/* ─── PAGE NAVIGATION ───────────────────────────── */
let currentPage = 'page-welcome';

function goToPage(targetId) {
  const current = document.getElementById(currentPage);
  const target = document.getElementById(targetId);
  if (!current || !target || currentPage === targetId) return;

  current.classList.add('exit-left');
  setTimeout(() => {
    current.classList.remove('active', 'exit-left');
  }, 700);

  target.style.transform = 'translateX(100%)';
  target.style.opacity = '0';
  target.classList.add('active');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.style.transform = '';
      target.style.opacity = '';
    });
  });

  currentPage = targetId;
  onPageEnter(targetId);
}

function onPageEnter(pageId) {
  if (pageId === 'page-message') {
    startTypingAnimation();
  }
  if (pageId === 'page-final') {
    startConfetti();
    startFireworks();
  }
  if (pageId === 'page-game') {
    resetGame();
  }
  if (pageId === 'page-letter') {
    resetLetter();
  }
}

/* ─── MUSIC CONTROL ─────────────────────────────── */
const music = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
let musicPlaying = false;

document.getElementById('page-welcome').addEventListener('click', function tryMusic() {
  if (!musicPlaying) {
    music.volume = 0.35;
    music.play().then(() => {
      musicPlaying = true;
      musicIcon.textContent = '🎵';
    }).catch(() => {});
  }
}, { once: true });

function toggleMusic() {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    musicIcon.textContent = '🔇';
  } else {
    music.play().then(() => {
      musicPlaying = true;
      musicIcon.textContent = '🎵';
    }).catch(() => {});
  }
}

/* ─── TYPING ANIMATION (PAGE 2) ─────────────────── */
const loveMessage = `From the moment I met you, my world became brighter,
warmer, and full of colors I had never seen before.

Today, the most special person in my entire life
turns another year older — and I couldn't be more
grateful that the universe brought us together.

You are my calm in every storm, my laughter
in every ordinary day, and my reason to believe
that love is real and beautiful.

Happy Birthday, my love. 🌸

May every wish you make today come true,
because you deserve the whole universe
and every star in it. 💕`;

let typingTimer = null;

function startTypingAnimation() {
  const el = document.getElementById('typing-text');
  const btn = document.getElementById('message-btn');
  if (!el) return;

  el.textContent = '';
  btn.classList.add('hidden');
  clearTimeout(typingTimer);

  let i = 0;
  const chars = loveMessage.split('');

  function typeChar() {
    if (i < chars.length) {
      el.textContent += chars[i];
      i++;
      const delay = chars[i - 1] === '\n' ? 120 : 28;
      typingTimer = setTimeout(typeChar, delay);
    } else {
      btn.classList.remove('hidden');
    }
  }

  typingTimer = setTimeout(typeChar, 400);
}

/* ─── PHOTO LIGHTBOX (PAGE 3) ───────────────────── */
function openLightbox(polaroidEl) {
  const img = polaroidEl.querySelector('.polaroid-img');
  const bg = img.style.backgroundImage;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.style.backgroundImage = bg;
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ─── MINI GAME (PAGE 4) ────────────────────────── */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const GAME_CONFIG = {
  goalScore:    20,
  heartSymbols: ['❤️', '💕', '💖', '💗', '💝'],
  basketWidth:  70,
  basketHeight: 44,
  basketSpeed:  6,
  heartSize:    28,
  startInterval: 900,
  minInterval:   400,
};

let gameState = {
  running:   false,
  score:     0,
  lives:     3,
  hearts:    [],
  basket:    { x: 0, y: 0 },
  keys:      { left: false, right: false },
  animId:    null,
  interval:  null,
  spawnDelay: GAME_CONFIG.startInterval,
  touchX:    null,
};

function setCanvasSize() {
  const wrapper = document.querySelector('.game-wrapper');
  const w = wrapper ? Math.min(wrapper.clientWidth, 500) : 360;
  canvas.width  = w;
  canvas.height = Math.round(w * 0.72);
  gameState.basket.x = canvas.width / 2;
  gameState.basket.y = canvas.height - GAME_CONFIG.basketHeight / 2 - 10;
}

function resetGame() {
  cancelAnimationFrame(gameState.animId);
  clearInterval(gameState.interval);
  gameState = {
    running:   false,
    score:     0,
    lives:     3,
    hearts:    [],
    basket:    { x: 0, y: 0 },
    keys:      { left: false, right: false },
    animId:    null,
    interval:  null,
    spawnDelay: GAME_CONFIG.startInterval,
    touchX:    null,
  };
  setCanvasSize();
  document.getElementById('game-score').textContent = '0';
  document.getElementById('game-lives').textContent = '❤️❤️❤️';
  document.getElementById('game-next-btn').classList.add('hidden');

  const overlay = document.getElementById('game-overlay');
  overlay.style.display = 'flex';
  overlay.style.opacity = '1';
  document.getElementById('overlay-title').textContent = 'Ready to Catch My Love?';
  document.getElementById('overlay-msg').textContent = 'Move with arrow keys or drag on mobile';
  document.getElementById('start-btn').style.display = '';

  drawIdleCanvas();
}

function drawIdleCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '3rem serif';
  ctx.textAlign = 'center';
  ctx.fillText('💝', canvas.width / 2, canvas.height / 2 - 10);
}

function startGame() {
  if (gameState.running) return;
  gameState.running = true;
  gameState.basket.x = canvas.width / 2;
  gameState.basket.y = canvas.height - GAME_CONFIG.basketHeight / 2 - 10;

  const overlay = document.getElementById('game-overlay');
  overlay.style.opacity = '0';
  setTimeout(() => { overlay.style.display = 'none'; }, 400);

  spawnHeart();
  gameState.interval = setInterval(() => {
    if (gameState.running) spawnHeart();
  }, gameState.spawnDelay);

  gameState.animId = requestAnimationFrame(gameLoop);
}

function spawnHeart() {
  const sym = GAME_CONFIG.heartSymbols[Math.floor(Math.random() * GAME_CONFIG.heartSymbols.length)];
  gameState.hearts.push({
    x:     Math.random() * (canvas.width - 40) + 20,
    y:     -20,
    speed: Math.random() * 1.8 + 1.5,
    sym:   sym,
    size:  GAME_CONFIG.heartSize,
  });
}

function gameLoop() {
  if (!gameState.running) return;

  handleBasketMovement();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawHearts();
  drawBasket();
  checkCollisions();

  gameState.animId = requestAnimationFrame(gameLoop);
}

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#fce7f3');
  grad.addColorStop(1, '#fff0f6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleBasketMovement() {
  const bw = GAME_CONFIG.basketWidth;
  const speed = GAME_CONFIG.basketSpeed;
  if (gameState.keys.left)  gameState.basket.x = Math.max(bw / 2, gameState.basket.x - speed);
  if (gameState.keys.right) gameState.basket.x = Math.min(canvas.width - bw / 2, gameState.basket.x + speed);

  if (gameState.touchX !== null) {
    const diff = gameState.touchX - gameState.basket.x;
    gameState.basket.x += diff * 0.12;
    gameState.basket.x = Math.max(bw / 2, Math.min(canvas.width - bw / 2, gameState.basket.x));
  }
}

function drawBasket() {
  const { x, y } = gameState.basket;
  const bw = GAME_CONFIG.basketWidth;
  const bh = GAME_CONFIG.basketHeight;

  ctx.save();
  ctx.shadowColor = 'rgba(236,72,153,0.4)';
  ctx.shadowBlur = 14;

  const grad = ctx.createLinearGradient(x - bw / 2, y - bh / 2, x + bw / 2, y + bh / 2);
  grad.addColorStop(0, '#f9a8d4');
  grad.addColorStop(1, '#ec4899');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(x - bw / 2 + 6, y - bh / 2);
  ctx.lineTo(x + bw / 2 - 6, y - bh / 2);
  ctx.quadraticCurveTo(x + bw / 2, y - bh / 2, x + bw / 2, y - bh / 2 + 6);
  ctx.lineTo(x + bw / 2 - 6, y + bh / 2);
  ctx.lineTo(x - bw / 2 + 6, y + bh / 2);
  ctx.quadraticCurveTo(x - bw / 2, y + bh / 2, x - bw / 2, y + bh / 2 - 6);
  ctx.lineTo(x - bw / 2, y - bh / 2 + 6);
  ctx.quadraticCurveTo(x - bw / 2, y - bh / 2, x - bw / 2 + 6, y - bh / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `${bh * 0.7}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🧺', x, y);

  ctx.restore();
}

function drawHearts() {
  gameState.hearts.forEach(h => {
    h.y += h.speed;
    ctx.font = h.size + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(h.sym, h.x, h.y);
  });
}

function checkCollisions() {
  const { x: bx, y: by } = gameState.basket;
  const bw = GAME_CONFIG.basketWidth;
  const bh = GAME_CONFIG.basketHeight;
  const hs = GAME_CONFIG.heartSize;

  gameState.hearts = gameState.hearts.filter(h => {
    const caught =
      h.x > bx - bw / 2 - hs / 2 &&
      h.x < bx + bw / 2 + hs / 2 &&
      h.y > by - bh / 2 - hs / 2 &&
      h.y < by + bh / 2 + hs / 2;

    if (caught) {
      gameState.score++;
      document.getElementById('game-score').textContent = gameState.score;
      showCatchEffect(h.x, h.y);
      if (gameState.score >= GAME_CONFIG.goalScore) {
        endGame(true);
        return false;
      }
      return false;
    }

    if (h.y > canvas.height + hs) {
      gameState.lives--;
      updateLives();
      if (gameState.lives <= 0) {
        endGame(false);
        return false;
      }
      return false;
    }
    return true;
  });
}

function showCatchEffect(x, y) {
  const el = document.createElement('div');
  el.style.cssText = `
    position:absolute;
    left:${x}px;
    top:${y}px;
    transform:translate(-50%,-50%);
    font-size:1.5rem;
    pointer-events:none;
    animation:zoomIn 0.4s ease-out forwards;
    z-index:10;
  `;
  el.textContent = '✨';
  canvas.parentElement.style.position = 'relative';
  canvas.parentElement.appendChild(el);
  setTimeout(() => el.remove(), 420);
}

function updateLives() {
  const hearts = '❤️'.repeat(Math.max(0, gameState.lives));
  document.getElementById('game-lives').textContent = hearts || '💔';
}

function endGame(won) {
  gameState.running = false;
  cancelAnimationFrame(gameState.animId);
  clearInterval(gameState.interval);

  const overlay = document.getElementById('game-overlay');
  overlay.style.display = 'flex';
  overlay.style.opacity = '1';
  document.getElementById('start-btn').style.display = 'none';

  if (won) {
    document.getElementById('overlay-title').textContent = 'You caught all my love! ❤️';
    document.getElementById('overlay-msg').textContent = 'Just like you caught my heart forever 💕';
  } else {
    document.getElementById('overlay-title').textContent = 'Try Again, My Love!';
    document.getElementById('overlay-msg').textContent = 'Every attempt makes my heart grow fonder 💖';
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn-main';
    retryBtn.innerHTML = '<span class="btn-icon">🔄</span><span>Try Again</span><div class="btn-glow"></div>';
    retryBtn.onclick = () => {
      retryBtn.remove();
      resetGame();
      setTimeout(() => startGame(), 100);
    };
    overlay.querySelector('.game-overlay-content').appendChild(retryBtn);
  }

  document.getElementById('game-next-btn').classList.remove('hidden');
}

/* ─── KEYBOARD & TOUCH CONTROLS ─────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  gameState.keys.left  = true;
  if (e.key === 'ArrowRight') gameState.keys.right = true;
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft')  gameState.keys.left  = false;
  if (e.key === 'ArrowRight') gameState.keys.right = false;
});

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  gameState.touchX = (e.touches[0].clientX - rect.left) * scaleX;
}, { passive: false });

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  gameState.touchX = (e.touches[0].clientX - rect.left) * scaleX;
}, { passive: false });

canvas.addEventListener('touchend', () => {
  gameState.touchX = null;
});

canvas.addEventListener('mousemove', e => {
  if (!gameState.running) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const mx = (e.clientX - rect.left) * scaleX;
  gameState.touchX = mx;
});

canvas.addEventListener('mouseleave', () => {
  gameState.touchX = null;
});

window.addEventListener('resize', () => {
  if (currentPage === 'page-game') {
    setCanvasSize();
    gameState.basket.y = canvas.height - GAME_CONFIG.basketHeight / 2 - 10;
  }
});

/* ─── LOVE LETTER (PAGE 5) ──────────────────────── */
const letterContent = `My dearest love,

I sat down to write you a letter because some
feelings are too big for just words — and yet
I had to try.

Do you remember the first time we laughed until
our sides hurt? That moment, I knew you were
someone extraordinary. The kind of person who
turns the most ordinary Tuesday into something
worth remembering.

Every morning I wake up grateful — not for
grand gestures, but for the quiet, beautiful
fact that you exist in this world, and that
somehow, wonderfully, you chose me too.

You have a way of making everyone around you
feel seen, heard, and loved. That is your gift.
And it is one of the million things I adore
about you.

On this birthday, I want you to know that you
are cherished beyond what I can express. You
deserve every flower, every sunset, every
moment of peace and joy this world can offer.

I love you. Today, tomorrow, and every day
after that.`;

let letterOpen = false;

function resetLetter() {
  letterOpen = false;
  const envelope = document.getElementById('envelope');
  envelope.classList.remove('opened');
  envelope.style.display = '';
  document.getElementById('letter-paper').classList.add('hidden');
  document.getElementById('letter-text').textContent = '';
  document.getElementById('letter-next-btn').classList.add('hidden');
}

function openEnvelope() {
  if (letterOpen) return;
  letterOpen = true;

  const envelope = document.getElementById('envelope');
  envelope.classList.add('opened');

  setTimeout(() => {
    envelope.style.display = 'none';
    const paper = document.getElementById('letter-paper');
    paper.classList.remove('hidden');
    typeLetterText();
  }, 700);
}

function typeLetterText() {
  const el = document.getElementById('letter-text');
  const nextBtn = document.getElementById('letter-next-btn');
  el.textContent = '';

  let i = 0;
  const chars = letterContent.split('');

  function typeChar() {
    if (i < chars.length) {
      el.textContent += chars[i];
      i++;
      const delay = chars[i - 1] === '\n' ? 80 : 18;
      setTimeout(typeChar, delay);
    } else {
      setTimeout(() => nextBtn.classList.remove('hidden'), 500);
    }
  }

  setTimeout(typeChar, 300);
}

/* ─── CONFETTI (PAGE 6) ─────────────────────────── */
const CONFETTI_COLORS = [
  '#ec4899', '#f9a8d4', '#fbcfe8', '#ff80b3',
  '#ff4da6', '#fce7f3', '#fff0f6', '#db2777',
  '#a855f7', '#f43f5e', '#fbbf24'
];

let confettiActive = false;

function startConfetti() {
  if (confettiActive) return;
  confettiActive = true;

  const container = document.getElementById('confetti-container');
  container.innerHTML = '';

  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      if (!confettiActive) return;
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const size = Math.random() * 10 + 5;
      piece.style.width  = size + 'px';
      piece.style.height = size + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      const duration = Math.random() * 2.5 + 2;
      piece.style.animationDuration = duration + 's';
      piece.style.animationDelay = '0s';
      container.appendChild(piece);
      setTimeout(() => piece.remove(), duration * 1000 + 200);
    }, i * 40);
  }

  setTimeout(() => {
    confettiActive = false;
    setTimeout(startConfetti, 500);
  }, 80 * 40 + 3000);
}

/* ─── FIREWORKS (PAGE 6) ────────────────────────── */
let fireworksTimer = null;

function startFireworks() {
  clearInterval(fireworksTimer);
  fireworksTimer = setInterval(launchFirework, 800);
  launchFirework();
  launchFirework();
}

function launchFirework() {
  const container = document.getElementById('fireworks-container');
  if (!container) return;

  const cx = Math.random() * 80 + 10;
  const cy = Math.random() * 60 + 5;
  const symbols = ['💖', '✨', '💕', '🌸', '💗', '⭐'];
  const count = 10;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const dist  = Math.random() * 80 + 50;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    const el = document.createElement('span');
    el.className = 'firework-heart';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = cx + 'vw';
    el.style.top  = cy + 'vh';
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
    el.style.animationDuration = (Math.random() * 0.6 + 0.7) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
}

/* ─── GIFT BOX (PAGE 6) ─────────────────────────── */
function openGift() {
  const box = document.getElementById('gift-box');
  const msg = document.getElementById('gift-message');
  if (box.classList.contains('opened')) return;
  box.classList.add('opened');

  setTimeout(() => {
    box.style.display = 'none';
    msg.classList.remove('hidden');
    launchFirework();
    launchFirework();
    launchFirework();
  }, 600);
}

/* ─── INIT ───────────────────────────────────────── */
window.addEventListener('load', () => {
  setCanvasSize();
  drawIdleCanvas();

  music.volume = 0.35;
  const autoPlay = music.play();
  if (autoPlay) {
    autoPlay.then(() => {
      musicPlaying = true;
    }).catch(() => {
      musicPlaying = false;
    });
  }
});
