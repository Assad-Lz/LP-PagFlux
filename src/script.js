/* =================================================================
   SETUP GSAP E FERRAMENTAS
   ================================================================= */

console.log('📍 Script.js iniciado');
console.log('GSAP disponível?', typeof gsap !== 'undefined');

// Registrar plugins com segurança
if (typeof gsap !== 'undefined') {
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ ScrollTrigger registrado');
  }
  if (typeof DrawSVGPlugin !== 'undefined') {
    gsap.registerPlugin(DrawSVGPlugin);
    console.log('✅ DrawSVGPlugin registrado');
  }
} else {
  console.error('❌ GSAP não disponível!');
}

// PAGE REVEAL - Efeito fade-in progressivo
window.addEventListener('load', () => {
  gsap
    .timeline()
    .fromTo(
      'body',
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.inOut' },
      0
    );
});

// 1. REVEAL ANIMATIONS - Com stagger melhorado
const revealElements = gsap.utils.toArray('.gs-reveal');
revealElements.forEach((el, i) => {
  gsap.fromTo(
    el,
    { y: 50, opacity: 0, filter: 'blur(10px)' },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.8,
      delay: i * 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// 2. STAGGER CARDS - Melhor efeito
const cards = gsap.utils.toArray('.gs-card');
if (cards.length > 0) {
  ScrollTrigger.batch(cards, {
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }
      ),
    start: 'top 85%',
  });
}

// 3. MAGNETIC BUTTONS - Efeito magnético suavizado
const magneticBtns = document.querySelectorAll('.magnetic');
magneticBtns.forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      duration: 0.3,
      x: x * 0.3,
      y: y * 0.3,
      overwrite: 'auto',
      ease: 'power2.out',
    });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      duration: 0.4,
      x: 0,
      y: 0,
      overwrite: 'auto',
      ease: 'elastic.out(1, 0.3)',
    });
  });
});

// 4. CURSOR CUSTOMIZADO - Rastreamento suave
const cursorDot = document.querySelector('.cursor-dot');
const cursorTrail = document.querySelector('.cursor-trail');
let mouseX = 0,
  mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursorDot, {
    duration: 0.05,
    x: mouseX,
    y: mouseY,
    overwrite: 'auto',
  });
  gsap.to(cursorTrail, {
    duration: 0.3,
    x: mouseX,
    y: mouseY,
    overwrite: 'auto',
  });
});

// 5. ADVANCED COUNTER UP - Com efeito de brilho
const counters = document.querySelectorAll('.counter');
counters.forEach((counter) => {
  const target = parseFloat(counter.getAttribute('data-target'));
  const isPercentage = counter.textContent.includes('%');

  ScrollTrigger.create({
    trigger: counter,
    onEnter: () => {
      gsap.fromTo(
        counter,
        { innerHTML: 0 },
        {
          innerHTML: target,
          duration: 2.5,
          snap: { innerHTML: 0.01 },
          ease: 'power2.out',
          onUpdate: function () {
            const val = parseFloat(this.targets()[0].innerHTML);
            counter.style.color = val > target * 0.8 ? '#00f0ff' : '#ffffff';
          },
        }
      );
    },
    once: true,
  });
});

/* =================================================================
   6. ANIMATED CHART - Gráfico com barras animadas
   ================================================================= */
const chartCanvas = document.getElementById('animated-chart');
if (chartCanvas) {
  const ctx = chartCanvas.getContext('2d');
  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const barData = [40, 70, 50, 90, 65];

  ScrollTrigger.create({
    trigger: chartCanvas,
    onEnter: () => {
      animateChart();
    },
    once: true,
  });

  function animateChart() {
    gsap.timeline().fromTo(
      barData,
      { each: 0 },
      {
        each: (i) => {
          return {
            onUpdate: () => drawChart(),
            duration: 1.5,
            ease: 'power2.out',
          };
        },
        duration: 1.5,
        ease: 'power2.out',
      },
      0
    );

    // Animar valores para representar crescimento
    gsap.to(barData, {
      0: 40,
      1: 70,
      2: 50,
      3: 90,
      4: 65,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => drawChart(),
    });
  }

  function drawChart() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / barData.length;
    const maxHeight = height - 20;

    barData.forEach((value, i) => {
      const barHeight = (value / 100) * maxHeight;
      const x = i * barWidth + barWidth * 0.1;
      const y = height - barHeight;

      // Gradiente para as barras
      const gradient = ctx.createLinearGradient(0, y, 0, height);
      gradient.addColorStop(0, '#00f0ff');
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0.2)');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);

      // Sombra brilhante
      ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth * 0.8, barHeight);
      ctx.shadowBlur = 0;
    });
  }

  drawChart();
}

/* =================================================================
   7. COIN SPIN ANIMATION - Moeda 3D girando
   ================================================================= */
const coinContainers = document.querySelectorAll('.coin-container');
coinContainers.forEach((container) => {
  const coin = container.querySelector('.floating-coin');
  if (coin) {
    // Animação contínua de rotação
    gsap.to(coin, {
      rotationY: 360,
      rotationX: '+=10',
      duration: 4,
      repeat: -1,
      ease: 'none',
    });

    // Flutuação suave
    gsap.to(coin, {
      y: -15,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // Efeito de brilho no hover
    container.addEventListener('mouseenter', () => {
      gsap.to(coin, {
        boxShadow:
          '0 20px 50px rgba(255, 215, 0, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.3)',
        duration: 0.3,
      });
    });

    container.addEventListener('mouseleave', () => {
      gsap.to(coin, {
        boxShadow:
          '0 10px 30px rgba(255, 215, 0, 0.4), inset -2px -2px 5px rgba(0, 0, 0, 0.3)',
        duration: 0.3,
      });
    });
  }
});

/* =================================================================
   8. LINE DRAWING (STEPS) - Linha animada
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

// Animação dos steps
gsap.utils.toArray('.gs-step').forEach((step, i) => {
  gsap.from(step, {
    y: 50,
    opacity: 0,
    scrollTrigger: { trigger: step, start: 'top 80%' },
    delay: i * 0.2,
    duration: 0.8,
  });
});

/* =================================================================
   9. SPOTLIGHT BORDER EFFECT - Efeito de luz seguindo cursor
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
   10. MATRIX RAIN EFFECT - Chuva de matriz glitchada
   ================================================================= */
const matrixCanvas = document.getElementById('matrix-canvas');
if (matrixCanvas) {
  const mCtx = matrixCanvas.getContext('2d');
  let mW,
    mH,
    drops = [];
  const fontSize = 16;
  let animationId = null;

  function initMatrix() {
    const parent = matrixCanvas.parentElement;
    mW = matrixCanvas.width = parent.offsetWidth;
    mH = matrixCanvas.height = parent.offsetHeight;

    const cols = Math.floor(mW / fontSize);
    drops = [];
    for (let i = 0; i < cols; i++) {
      drops[i] = Math.random() * -100;
    }
  }

  initMatrix();
  window.addEventListener('resize', initMatrix);

  function drawMatrix() {
    // Fade mais suave
    mCtx.fillStyle = 'rgba(2, 2, 4, 0.08)';
    mCtx.fillRect(0, 0, mW, mH);

    mCtx.font = 'bold ' + fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = Math.random() > 0.5 ? '1' : '0';
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Cores com glitch
      if (Math.random() > 0.98) {
        mCtx.fillStyle = '#FFF';
        mCtx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        mCtx.shadowBlur = 10;
      } else if (Math.random() > 0.95) {
        mCtx.fillStyle = '#ff00ff';
        mCtx.shadowColor = 'rgba(255, 0, 255, 0.6)';
        mCtx.shadowBlur = 5;
      } else {
        mCtx.fillStyle = '#00F0FF';
        mCtx.shadowColor = 'rgba(0, 240, 255, 0.4)';
        mCtx.shadowBlur = 5;
      }

      mCtx.fillText(char, x, y);

      if (y > mH && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    mCtx.shadowBlur = 0;
    requestAnimationFrame(drawMatrix);
  }
  drawMatrix();
}

/* =================================================================
   11. REVIEW CARDS ANIMATIONS - Entrada dos cards
   ================================================================= */
// Animação dos cards de review
const reviewCardsInit = document.querySelectorAll('.review-card');
reviewCardsInit.forEach((card, i) => {
  gsap.from(card, {
    y: 50,
    opacity: 0,
    rotationX: 20,
    duration: 0.8,
    delay: i * 0.1,
    scrollTrigger: {
      trigger: '.reviews-section',
      start: 'top 80%',
    },
  });
});

/* =================================================================
   12. HERO CANVAS - REDE NEURAL (MANTÉM ORIGINAL)
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
   13. LINK HOVER EFFECTS - Efeito hover para links
   ================================================================= */
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach((link) => {
  link.addEventListener('mouseenter', () => {
    gsap.to(link, {
      color: '#00f0ff',
      duration: 0.3,
      ease: 'power2.out',
      textShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
    });
  });

  link.addEventListener('mouseleave', () => {
    gsap.to(link, {
      color: 'var(--text-muted)',
      duration: 0.3,
      textShadow: 'none',
    });
  });
});

/* =================================================================
   14. SECTION BACKGROUNDS - Efeitos de entrada em seções
   ================================================================= */
ScrollTrigger.create({
  trigger: '.features-section',
  onEnter: () => {
    gsap.to('.features-section', {
      '--bg-alpha': 0.02,
      duration: 0.5,
    });
  },
});

/* =================================================================
   15. NAVBAR HIDE/SHOW - Navbar aparece/desaparece no scroll
   ================================================================= */
let lastScrollY = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > lastScrollY && scrollY > 100) {
    // Scroll down - hide navbar
    gsap.to(navbar, {
      y: -80,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  } else {
    // Scroll up - show navbar
    gsap.to(navbar, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  lastScrollY = scrollY;
});

/* =================================================================
   16. CTA BUTTON GLOW EFFECT - Botão com efeito de brilho pulsante
   ================================================================= */
const ctaButtons = document.querySelectorAll('.btn-primary');
ctaButtons.forEach((btn) => {
  btn.addEventListener('mouseenter', () => {
    gsap.to(btn, {
      boxShadow: '0 0 30px rgba(0, 240, 255, 0.8)',
      duration: 0.3,
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      boxShadow: '0 0 20px var(--primary-dim)',
      duration: 0.3,
    });
  });
});

/* =================================================================
   17. FOOTER YEAR ANIMATION - Ano animado no footer
   ================================================================= */
const yearElement = document.querySelector('.year');
if (yearElement) {
  const currentYear = new Date().getFullYear();
  yearElement.textContent = currentYear;

  gsap.from(yearElement, {
    innerHTML: currentYear - 1,
    duration: 1.5,
    snap: { innerHTML: 1 },
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 80%',
      once: true,
    },
  });
}

/* =================================================================
   18. SMOOTH SCROLL ANCHOR LINKS
   ================================================================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#signup') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 80 },
        duration: 1.2,
        ease: 'power2.inOut',
      });
    }
  });
});

/* =================================================================
   19. DRAW SVG ANIMATIONS - Linhas que se desenham sozinhas
   ================================================================= */
const trendLines = document.querySelectorAll('.trend-line');
trendLines.forEach((line) => {
  ScrollTrigger.create({
    trigger: line.closest('.bento-card'),
    onEnter: () => {
      gsap.fromTo(
        line,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          duration: 2,
          ease: 'power1.inOut',
        }
      );
    },
    once: true,
  });
});

/* =================================================================
   20. DASHBOARD CHART ANIMATIONS - Gráficos crescendo
   ================================================================= */
const barAnimates = document.querySelectorAll('.bar-animate');
const growthLine = document.querySelector('.growth-line');

ScrollTrigger.create({
  trigger: '.dashboard-preview-section',
  onEnter: () => {
    // Animar barras
    gsap.fromTo(
      barAnimates,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1.5,
        stagger: 0.15,
        ease: 'elastic.out(1, 0.5)',
        transformOrigin: 'bottom',
      }
    );

    // Animar linha de crescimento
    if (growthLine) {
      gsap.fromTo(
        growthLine,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          duration: 2,
          ease: 'power1.inOut',
          delay: 0.5,
        }
      );
    }
  },
  once: true,
});

/* =================================================================
   21. SECURITY CARDS - Elementos flutuantes
   ================================================================= */
const securityCards = document.querySelectorAll('.security-card');
securityCards.forEach((card, i) => {
  const floatingEl = card.querySelector('.floating-element');
  if (floatingEl) {
    gsap.to(floatingEl, {
      y: -10,
      rotation: 10,
      duration: 3 + i * 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }
});

/* =================================================================
   22. GLOBAL REACH - Pontos pulsantes
   ================================================================= */
const dotPulses = document.querySelectorAll('.dot-pulse');
dotPulses.forEach((dot, i) => {
  gsap.to(dot, {
    r: 8,
    opacity: 0.2,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    delay: i * 0.3,
  });
});

/* =================================================================
   23. REVIEW CARDS ENHANCED - Entrada com avatar animado
   ================================================================= */
const reviewAvatars = document.querySelectorAll('.review-avatar');
reviewAvatars.forEach((avatar) => {
  const card = avatar.closest('.review-card');

  ScrollTrigger.create({
    trigger: card,
    onEnter: () => {
      gsap.fromTo(
        avatar,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }
      );

      const reviewText = card.querySelector('.review-text');
      if (reviewText) {
        gsap.fromTo(
          reviewText,
          { opacity: 0, filter: 'blur(5px)' },
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out',
          }
        );
      }
    },
    once: true,
  });
});

/* =================================================================
   24. STAT BOXES DASHBOARD - Animação de números
   ================================================================= */
const statValues = document.querySelectorAll('.stat-value');
statValues.forEach((stat) => {
  const text = stat.textContent;
  const isValue = /^\d+/.test(text);

  if (isValue) {
    ScrollTrigger.create({
      trigger: stat,
      onEnter: () => {
        // Criar efeito de contagem para números
        let currentNum = 0;
        const targetNum = parseInt(text.replace(/\D/g, ''));

        gsap.to(
          { value: 0 },
          {
            value: targetNum,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              stat.textContent =
                Math.floor(this.targets()[0].value).toLocaleString() +
                (text.includes('R$')
                  ? ' M'
                  : text.includes('%')
                  ? '%'
                  : text.includes('ms')
                  ? 'ms'
                  : '');
            },
          }
        );
      },
      once: true,
    });
  }
});

/* =================================================================
   25. PARALLAX FLOATING - Elementos flutuantes na seção
   ================================================================= */
document.addEventListener('scroll', () => {
  const securitySection = document.querySelector('.security-section');
  if (securitySection) {
    const scrollPercent = window.scrollY / (window.innerHeight * 0.5);
    const floatingEls = securitySection.querySelectorAll('.floating-element');

    floatingEls.forEach((el) => {
      gsap.to(el, {
        y: Math.sin(scrollPercent) * 20,
        duration: 0,
      });
    });
  }
});

/* =================================================================
   26. PARALLAX MOUSE - Elementos seguem movimento do mouse
   ================================================================= */
document.addEventListener('mousemove', (e) => {
  const parallaxElements = document.querySelectorAll('.parallax-element');
  const x = (e.clientX / window.innerWidth) * 20 - 10;
  const y = (e.clientY / window.innerHeight) * 20 - 10;

  parallaxElements.forEach((el) => {
    const layer = el.classList.contains('layer-1')
      ? 3
      : el.classList.contains('layer-2')
      ? 2
      : 1;
    gsap.to(el, {
      x: x * layer,
      y: y * layer,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });
});

/* =================================================================
   27. TEXT REVEAL - Texto aparece com reveal fluido
   ================================================================= */
const revealTexts = document.querySelectorAll('.text-reveal');
revealTexts.forEach((text, i) => {
  ScrollTrigger.create({
    trigger: text,
    onEnter: () => {
      gsap.fromTo(
        text,
        { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 0.8,
          ease: 'power2.out',
          delay: i * 0.1,
        }
      );
    },
    once: true,
  });
});

/* =================================================================
   28. SCROLL SNAP ZOOM - Zoom suave ao entrar na viewport
   ================================================================= */
const scrollSnapElements = document.querySelectorAll('.scroll-snap-zoom');
scrollSnapElements.forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    onEnter: () => {
      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.5)',
        }
      );
    },
    once: true,
  });
});

/* =================================================================
   29. GLITCH EFFECT - Efeito glitch ao hover
   ================================================================= */
const glitchTexts = document.querySelectorAll('.glitch-text');
glitchTexts.forEach((text) => {
  text.addEventListener('mouseenter', () => {
    gsap.to(text, {
      duration: 0.4,
      onStart: () => {
        text.style.animation = 'glitch 0.5s ease-in-out';
      },
    });
  });

  text.addEventListener('mouseleave', () => {
    text.style.animation = 'none';
  });
});

/* =================================================================
   30. SHIMMER GRADIENT - Brilho deslizando continuamente
   ================================================================= */
const shimmerElements = document.querySelectorAll('.shimmer-gradient');
shimmerElements.forEach((el) => {
  // Já tem animação CSS, mas podemos melhorar com GSAP
  gsap.fromTo(
    el,
    { backgroundPosition: '-1000px 0' },
    {
      backgroundPosition: '1000px 0',
      duration: 4,
      repeat: -1,
      ease: 'none',
    }
  );
});

/* =================================================================
   31. MORPHING SHAPES - Formas mudando de padrão
   ================================================================= */
const morphShapes = document.querySelectorAll('.morph-shape');
morphShapes.forEach((shape) => {
  let borderRadius = 0;
  gsap.fromTo(
    shape,
    { borderRadius: '0%' },
    {
      borderRadius: '50%',
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    }
  );
});

/* =================================================================
   32. CAROUSEL FLAGS - Bandeiras passando infinitamente
   ================================================================= */
const flagsCarouselTrack = document.querySelector('.flags-carousel-track');
if (flagsCarouselTrack) {
  const trackWidth = flagsCarouselTrack.scrollWidth / 2;

  gsap.fromTo(
    flagsCarouselTrack,
    { x: 0 },
    {
      x: -trackWidth,
      duration: 30,
      repeat: -1,
      ease: 'none',
      force3D: true,
      modifiers: {
        x: gsap.unitize((x) => parseFloat(x) % trackWidth),
      },
    }
  );

  // Adicionar efeito de hover (pause)
  flagsCarouselTrack.addEventListener('mouseenter', () => {
    gsap.to(flagsCarouselTrack, { duration: 0.3, paused: true });
  });

  flagsCarouselTrack.addEventListener('mouseleave', () => {
    gsap.to(flagsCarouselTrack, { duration: 0.3, paused: false });
  });
}

/* =================================================================
   33. LIQUID DISTORTION - Efeito de líquido em texto
   ================================================================= */
const liquidTexts = document.querySelectorAll('.liquid-text');
liquidTexts.forEach((text) => {
  // Animação já está no CSS, mas adicionar efeito ao scroll
  ScrollTrigger.create({
    trigger: text,
    onEnter: () => {
      gsap.to(text, {
        duration: 0.5,
        opacity: 1,
        scale: 1,
        ease: 'back.out',
      });
    },
  });
});

/* =================================================================
   34. PARTICLE BURST - Explosão de partículas ao entrar viewport
   ================================================================= */
const burstContainers = document.querySelectorAll('.burst-container');
burstContainers.forEach((container) => {
  ScrollTrigger.create({
    trigger: container,
    onEnter: () => {
      // Criar partículas que explodem
      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';

        // Cores variadas (cyan, magenta, green)
        const colors = ['#00f0ff', '#ff00ff', '#00ff88'];
        particle.style.background =
          colors[Math.floor(Math.random() * colors.length)];

        // Posição inicial aleatória
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        container.appendChild(particle);

        // Calcular vetor de explosão
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 200;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        gsap.to(particle, {
          x: tx,
          y: ty,
          opacity: 0,
          scale: 0,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: () => {
            particle.remove();
          },
        });
      }

      // Glow do container
      gsap.to(container, {
        boxShadow: '0 0 40px rgba(0, 240, 255, 0.5)',
        duration: 0.6,
        ease: 'power2.out',
      });
    },
    once: true,
  });
});

/* =================================================================
   35. QUANTUM RIPPLE - Ondas quânticas expandindo
   ================================================================= */
const quantumRipples = document.querySelectorAll('.quantum-ripple');
quantumRipples.forEach((element) => {
  element.addEventListener('mouseenter', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Criar ondas
    for (let i = 0; i < 3; i++) {
      const circle = document.createElement('div');
      circle.className = 'ripple-circle';
      circle.style.left = x + 'px';
      circle.style.top = y + 'px';
      circle.style.width = '0px';
      circle.style.height = '0px';

      element.appendChild(circle);

      gsap.to(circle, {
        width: '150px',
        height: '150px',
        marginLeft: '-75px',
        marginTop: '-75px',
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power2.out',
        onComplete: () => {
          circle.remove();
        },
      });
    }
  });
});

/* =================================================================
   36. NEON PULSE WAVE - Onda de luz neon passando
   ================================================================= */
const neonElements = document.querySelectorAll('.neon-pulse');
neonElements.forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    onEnter: () => {
      gsap.to(el, {
        backgroundPosition: '200% center',
        duration: 2.5,
        repeat: -1,
        ease: 'none',
      });
    },
    once: true,
  });
});

/* =================================================================
   37. MORPHING GRADIENT - Gradiente orgânico que muda forma
   ================================================================= */
const morphingBoxes = document.querySelectorAll('.morphing-box');
morphingBoxes.forEach((box) => {
  ScrollTrigger.create({
    trigger: box,
    onEnter: () => {
      // Já tem animação CSS, mas adicionar efeito de hover
      box.addEventListener('mouseenter', () => {
        gsap.to(box, {
          duration: 0.3,
          boxShadow: '0 20px 60px rgba(0, 240, 255, 0.4)',
          scale: 1.02,
        });
      });

      box.addEventListener('mouseleave', () => {
        gsap.to(box, {
          duration: 0.3,
          boxShadow: '0 10px 30px rgba(0, 240, 255, 0.2)',
          scale: 1,
        });
      });
    },
    once: true,
  });
});

/* =================================================================
   38. CAROUSEL REVIEWS - Melhorias de interatividade
   ================================================================= */
const reviewsTrackElement = document.querySelector('.reviews-track');
if (reviewsTrackElement) {
  // Pausa ao fazer hover usando animation-play-state
  const reviewsWrapper = document.querySelector('.reviews-track-wrapper');

  if (reviewsWrapper) {
    reviewsWrapper.addEventListener('mouseenter', () => {
      reviewsTrackElement.style.animationPlayState = 'paused';
    });

    reviewsWrapper.addEventListener('mouseleave', () => {
      reviewsTrackElement.style.animationPlayState = 'running';
    });
  }

  // Efeito de brilho nas cards ao scroll
  const reviewCards = document.querySelectorAll('.review-card');
  reviewCards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      onEnter: () => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
          }
        );
      },
      once: true,
    });
  });
}

console.log('✅ Todas as animações foram inicializadas!');
console.log(
  '🎬 11 Novas animações épicas: Liquid, Burst, Ripple, Neon, Morphing, e mais!'
);
console.log('🚩 Carousel reviews melhorado com interatividade');
console.log('🎨 5 animações criativas tipo Lando Norris adicionadas');
