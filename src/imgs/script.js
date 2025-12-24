/* =================================================================
   SETUP GSAP E FERRAMENTAS
   ================================================================= */
gsap.registerPlugin(ScrollTrigger);

// 1. REVEAL ANIMATIONS
const revealElements = gsap.utils.toArray('.gs-reveal');
revealElements.forEach((el) => {
  gsap.fromTo(
    el,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// Stagger para Cards
const cards = gsap.utils.toArray('.gs-card');
if (cards.length > 0) {
  ScrollTrigger.batch(cards, {
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }
      ),
    start: 'top 85%',
  });
}

// 2. MAGNETIC BUTTONS
const magneticBtns = document.querySelectorAll('.magnetic');
magneticBtns.forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { duration: 0.3, x: x * 0.3, y: y * 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { duration: 0.3, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
  });
});

// 3. CURSOR CUSTOMIZADO
const cursorDot = document.querySelector('.cursor-dot');
const cursorTrail = document.querySelector('.cursor-trail');
window.addEventListener('mousemove', (e) => {
  gsap.to(cursorDot, { duration: 0.1, x: e.clientX, y: e.clientY });
  gsap.to(cursorTrail, { duration: 0.4, x: e.clientX, y: e.clientY });
});

// 4. COUNTER UP
const counters = document.querySelectorAll('.counter');
counters.forEach((counter) => {
  const target = parseFloat(counter.getAttribute('data-target'));
  gsap.to(counter, {
    innerHTML: target,
    duration: 2,
    snap: { innerHTML: 0.01 },
    scrollTrigger: { trigger: counter, start: 'top 80%', once: true },
  });
});

/* =================================================================
   5. LINE DRAWING (STEPS)
   ================================================================= */
const linePath = document.querySelector('.line-path');
if (linePath) {
  const length = linePath.getTotalLength();
  gsap.set(linePath, { strokeDasharray: length, strokeDashoffset: length });
  gsap.to(linePath, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.steps-section',
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 1,
    },
  });
}
gsap.utils.toArray('.gs-step').forEach((step, i) => {
  gsap.from(step, {
    y: 50,
    opacity: 0,
    scrollTrigger: { trigger: step, start: 'top 80%' },
    delay: i * 0.2,
  });
});

/* =================================================================
   6. HORIZONTAL PARALLAX (REVIEWS)
   ================================================================= */
const reviewsTrack = document.querySelector('.reviews-track');
if (reviewsTrack) {
  gsap.to(reviewsTrack, {
    xPercent: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.reviews-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
}

/* =================================================================
   7. REDE NEURAL (HERO CANVAS) - CIANO NEON
   ================================================================= */
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let width,
    height,
    particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function initHero() {
    width = heroCanvas.width = window.innerWidth;
    height = heroCanvas.height = window.innerHeight;
    particles = [];
    const count = (width * height) / 10000;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 1,
      });
    }
  }
  initHero();
  window.addEventListener('resize', initHero);

  function animateHero() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (mouse.x) {
        let dx = mouse.x - p.x,
          dy = mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 5;
          p.y -= (dy / dist) * force * 5;
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = '#00F0FF';
      ctx.fill();
    });

    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let d =
          (particles[a].x - particles[b].x) ** 2 +
          (particles[a].y - particles[b].y) ** 2;
        if (d < (width / 9) * (height / 9)) {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateHero);
  }
  animateHero();

  window.addEventListener('mousemove', (e) => {
    const r = heroCanvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
}

/* =================================================================
   8. SPOTLIGHT BORDER EFFECT
   ================================================================= */
const spotlights = document.querySelectorAll('.spotlight-card');
document.addEventListener('mousemove', (e) => {
  spotlights.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  });
});

/* =================================================================
   9. MATRIX RAIN EFFECT (FIXED & GLOWING)
   ================================================================= */
const matrixCanvas = document.getElementById('matrix-canvas');
if (matrixCanvas) {
  const mCtx = matrixCanvas.getContext('2d');
  let mW,
    mH,
    drops = [];
  const fontSize = 16;

  function initMatrix() {
    const parent = matrixCanvas.parentElement;
    mW = matrixCanvas.width = parent.offsetWidth;
    mH = matrixCanvas.height = parent.offsetHeight;

    const cols = Math.floor(mW / fontSize);
    drops = [];
    for (let i = 0; i < cols; i++) {
      drops[i] = Math.random() * -100; // Posição aleatória inicial
    }
  }

  initMatrix();
  window.addEventListener('resize', initMatrix);

  function drawMatrix() {
    mCtx.fillStyle = 'rgba(2, 2, 4, 0.1)'; // Preto com alpha para rastro
    mCtx.fillRect(0, 0, mW, mH);

    mCtx.font = 'bold ' + fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = Math.random() > 0.5 ? '1' : '0';
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Efeito de brilho branco aleatório na "cabeça"
      if (Math.random() > 0.98) {
        mCtx.fillStyle = '#FFF';
      } else {
        mCtx.fillStyle = '#00F0FF';
      }

      mCtx.fillText(char, x, y);

      if (y > mH && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }
  drawMatrix();
}
