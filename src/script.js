gsap.registerPlugin(ScrollTrigger);

// DETECÇÃO DE MOBILE
const isMobile = window.innerWidth < 768;
const isTablet = window.innerWidth < 1024;

// FUNÇÃO PARA GERAR VARIAÇÕES ALEATÓRIAS (HUMANIZE)
function getRandomTilt(max = 1.5) {
  return (Math.random() - 0.5) * max;
}

function getRandomSkew(max = 0.5) {
  return (Math.random() - 0.5) * max;
}

// EFEITO DO CURSOR MELHORADO COM RASTRO
const cursorDot = document.querySelector('.cursor-dot');
const cursorTrail = document.querySelector('.cursor-trail');

if (!isMobile && cursorDot && cursorTrail) {
  let mouseX = 0,
    mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Ponto principal (segue instantaneamente)
    gsap.to(cursorDot, {
      x: mouseX - 3,
      y: mouseY - 3,
      duration: 0,
    });

    // Rastro com delay elegante (easing suave)
    gsap.to(cursorTrail, {
      x: mouseX - 15,
      y: mouseY - 15,
      duration: 0.5,
      ease: 'power2.out',
    });
  });

  // Aumentar tamanho ao hover em botões
  const allButtons = document.querySelectorAll('a[class*="btn"], button');
  allButtons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(cursorTrail, { scale: 1.8, duration: 0.3, ease: 'back.out' });
      cursorTrail.style.borderColor = 'rgba(0, 240, 255, 0.8)';
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(cursorTrail, { scale: 1, duration: 0.3, ease: 'back.out' });
      cursorTrail.style.borderColor = 'rgba(0, 240, 255, 0.5)';
    });
  });
} else {
  // Esconder cursor em mobile
  if (cursorDot) cursorDot.style.display = 'none';
  if (cursorTrail) cursorTrail.style.display = 'none';
}

// 1. WAVE CANVAS - ANIMATED BACKGROUND (Flow Cards) - ONDAS LIMPAS E SUAVES
const waveCanvas = document.getElementById('wave-canvas');
if (waveCanvas) {
  console.log('Wave canvas encontrado, iniciando animação de ondas...');
  const waveCtx = waveCanvas.getContext('2d');

  // Garantir dimensões do canvas
  let waveWidth = window.innerWidth;
  let waveHeight = 400;

  waveCanvas.width = waveWidth;
  waveCanvas.height = waveHeight;
  waveCanvas.style.display = 'block';

  let time = 0;

  function drawWaves() {
    // Gradiente de fundo sólido e opaco
    const gradient = waveCtx.createLinearGradient(0, 0, 0, waveHeight);
    gradient.addColorStop(0, 'rgba(10, 20, 35, 0.3)');
    gradient.addColorStop(0.5, 'rgba(0, 80, 120, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 50, 80, 0.7)');

    waveCtx.fillStyle = gradient;
    waveCtx.fillRect(0, 0, waveWidth, waveHeight);

    // Desenhar 3 camadas com mais movimento (velocidade e amplitude aumentadas)
    const waveCount = 3;

    for (let wave = 0; wave < waveCount; wave++) {
      // Aumentar base de velocidade e variação por camada
      const waveSpeed = 0.6 + wave * 0.25;
      // Amplitude maior para movimento mais visível
      const waveAmplitude = 90 - wave * 25;
      // Frequência levemente menor para ondulações mais amplas
      const waveFreq = 50 + wave * 15;
      const yOffset = waveHeight * 0.55 + wave * 40;

      // Opacidade gradual (mantendo contraste)
      const opacity = 0.65 - wave * 0.15;
      waveCtx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
      waveCtx.lineWidth = 4 - wave * 0.6;
      waveCtx.lineCap = 'round';
      waveCtx.lineJoin = 'round';

      waveCtx.beginPath();

      // Passo menor para linhas mais suaves
      for (let x = 0; x < waveWidth; x += 2) {
        // Onda simples por camada, porém com mais intensidade
        const y =
          yOffset + Math.sin((x + time * waveSpeed) / waveFreq) * waveAmplitude;

        if (x === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
      }
      waveCtx.stroke();
    }

    // Aumentar o incremento de tempo para movimento mais rápido
    time += 0.5;
    requestAnimationFrame(drawWaves);
  }

  drawWaves();

  window.addEventListener('resize', () => {
    waveWidth = window.innerWidth;
    waveCanvas.width = waveWidth;
    waveCanvas.height = waveHeight;
  });
} else {
  console.warn('Wave canvas não encontrado!');
}

// 2. FALLING NUMBERS - DASHBOARD BACKGROUND
const fallingNumbersBg = document.getElementById('falling-numbers-bg');
if (fallingNumbersBg) {
  console.log('Falling numbers container encontrado, iniciando animação...');
  fallingNumbersBg.style.overflow = 'hidden';
  fallingNumbersBg.style.position = 'absolute';

  const numberInterval = isMobile ? 1000 : 500; // Mais espaçado em mobile

  function createFallingNumber() {
    const number = Math.floor(Math.random() * 10);
    const left = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const duration = isMobile ? 12 + Math.random() * 4 : 8 + Math.random() * 3;

    const numberEl = document.createElement('div');
    numberEl.textContent = number;
    numberEl.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: -50px;
      font-family: 'Space Grotesk', monospace;
      font-size: ${
        isMobile ? 1 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5
      }rem;
      color: rgba(0, 240, 255, ${0.3 + Math.random() * 0.5});
      font-weight: bold;
      opacity: 0.8;
      pointer-events: none;
      text-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
      letter-spacing: 2px;
      z-index: 1;
    `;

    fallingNumbersBg.appendChild(numberEl);

    gsap.to(numberEl, {
      y: window.innerHeight + 200,
      opacity: 0,
      rotation: Math.random() * 360,
      duration: duration,
      delay: delay,
      ease: 'power1.in',
      onComplete: () => {
        if (numberEl.parentNode) {
          numberEl.parentNode.removeChild(numberEl);
        }
      },
    });
  }

  // Criar números continuamente
  const numberIntervalId = setInterval(() => {
    createFallingNumber();
  }, numberInterval);

  console.log('Animação de números iniciada com intervalo:', numberInterval);
} else {
  console.warn('Falling numbers container não encontrado!');
}

// 3. NEURAL NETWORK HERO
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width,
    height,
    particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function initHero() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = isMobile
      ? window.innerHeight * 0.9
      : window.innerHeight;
    particles = [];

    // MAIOR DENSIDADE E TAMANHO NO MOBILE PARA MELHOR VISIBILIDADE
    const density = isMobile ? 8000 : 9000;
    const count = (width * height) / density;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.8 : 1.5),
        vy: (Math.random() - 0.5) * (isMobile ? 0.8 : 1.5),
        size: Math.random() * (isMobile ? 2.5 : 2) + (isMobile ? 0.8 : 0.5),
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

      if (!isMobile && mouse.x) {
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
      ctx.fillStyle = isMobile ? 'rgba(0, 240, 255, 0.8)' : '#00F0FF';
      ctx.fill();
    });

    const step = isMobile ? 3 : 1;
    const distThreshold = isMobile
      ? (width / 4) * (height / 4)
      : (width / 9) * (height / 9);

    for (let a = 0; a < particles.length; a += step) {
      for (let b = a; b < particles.length; b += step) {
        let d =
          (particles[a].x - particles[b].x) ** 2 +
          (particles[a].y - particles[b].y) ** 2;
        if (d < distThreshold) {
          ctx.strokeStyle = isMobile
            ? 'rgba(0, 240, 255, 0.25)'
            : 'rgba(0, 240, 255, 0.1)';
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

  if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
  }
}

// 4. SCROLL REVEAL - FEATURE ITEMS
const featureItems = gsap.utils.toArray('.gs-feature-item');
featureItems.forEach((item, i) => {
  const randomX = getRandomTilt(40);
  const randomDuration = 0.6 + Math.random() * 0.5;

  gsap.fromTo(
    item,
    { opacity: 0, x: randomX - 50 },
    {
      opacity: 1,
      x: 0,
      duration: randomDuration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    },
  );
});

// 5. REVEAL GERAL COM STAGGER
const revealElements = gsap.utils.toArray('.gs-reveal');
revealElements.forEach((el) => {
  const randomY = 30 + Math.random() * 20;
  const randomDuration = 0.8 + Math.random() * 0.4;
  const randomDelay = Math.random() * 0.1;

  gsap.fromTo(
    el,
    { y: randomY, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: randomDuration,
      delay: randomDelay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        markers: false,
      },
    },
  );
});

// 6. CARDS COM ANIMAÇÃO AO SCROLL
const cards = gsap.utils.toArray('.flow-card, .price-card');
cards.forEach((card) => {
  // Aplicar tilts aleatórios para variedade visual
  const tilt = getRandomTilt(1.2);
  const skew = getRandomSkew(0.3);

  if (!isMobile) {
    card.style.setProperty('--card-tilt', `${tilt}deg`);
    card.style.setProperty('--card-skew', `${skew}deg`);
    card.style.setProperty('--price-tilt', `${tilt * 0.7}deg`);
  }

  // Animação com variação de timing
  const delay = Math.random() * 0.3;
  gsap.fromTo(
    card,
    { opacity: 0, y: 50 + getRandomTilt(20) },
    {
      opacity: 1,
      y: 0,
      duration: 0.8 + Math.random() * 0.4,
      ease: 'power3.out',
      delay: delay,
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
      },
    },
  );
});

// 7. MAGNETIC BUTTONS
const magnets = document.querySelectorAll('.magnetic');
magnets.forEach((btn) => {
  if (!isMobile) {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
      gsap.to(btn, { x, y, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out' });
    });
  }
});

// 8. SPOTLIGHT BORDER EFFECT
if (!isMobile) {
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.spotlight-card').forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  });
}

// 9. SVG LINE ANIMATION
const linePath = document.querySelector('.line-path');
if (linePath) {
  const len = linePath.getTotalLength();
  gsap.set(linePath, { strokeDasharray: len, strokeDashoffset: len });
  gsap.to(linePath, {
    strokeDashoffset: 0,
    scrollTrigger: {
      trigger: '.flow-cards-section',
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 1,
    },
  });
}

// 10. APP ALERT MODAL - POPUP COM TIMING
const appAlertModal = document.getElementById('appAlertModal');
if (appAlertModal) {
  // Mostrar modal após scroll ou após tempo
  let hasShown = false;

  // Opção 1: Mostrar após scroll para seção específica
  ScrollTrigger.create({
    trigger: '.cta-section',
    onEnter: () => {
      if (!hasShown) {
        setTimeout(() => {
          appAlertModal.classList.add('active');
          hasShown = true;
        }, 500);
      }
    },
  });

  // Fechar ao clicar fora
  appAlertModal.addEventListener('click', (e) => {
    if (e.target === appAlertModal) {
      appAlertModal.classList.remove('active');
    }
  });

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appAlertModal.classList.contains('active')) {
      appAlertModal.classList.remove('active');
    }
  });
}

// 11. TICKER ANIMATION - DUPLICAR PARA LOOP INFINITO
const tickerContent = document.querySelector('.ticker-content');
if (tickerContent) {
  const tickerItems = tickerContent.innerHTML;
  tickerContent.innerHTML += tickerItems;
}

// 12. ANIMAÇÃO DE NÚMEROS NAS ESTATÍSTICAS
const statBigs = document.querySelectorAll('.stat-big');
statBigs.forEach((stat) => {
  gsap.fromTo(
    stat,
    { textContent: '0' },
    {
      textContent: stat.textContent,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: stat,
        start: 'top 80%',
      },
    },
  );
});

// 13. PARALLAX EFFECT NO SCROLL
gsap.utils.toArray('section').forEach((section) => {
  gsap.to(section, {
    backgroundPosition: '50% 100%',
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      scrub: 1,
      start: 'top center',
      end: 'bottom center',
    },
  });
});

// 14. SMOOTH SCROLL BEHAVIOR
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const element = document.querySelector(href);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});
// --- TIMELINE SVG DRAWING & ANIMATION ---

function initTimeline() {
  const svg = document.querySelector('.timeline-svg');
  const pathBg = document.querySelector('.timeline-path-bg');
  const pathActive = document.querySelector('.timeline-path-active');
  const items = document.querySelectorAll('.t-item');
  const dots = document.querySelectorAll('.t-dot');

  if (!svg || !items.length) return;

  // Função para desenhar a linha baseada nas posições
  function drawLine() {
    const containerRect = document
      .querySelector('.timeline-items')
      .getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    // Iniciar o Path
    let pathString = '';

    // Pega a posição do primeiro dot
    const firstDot = dots[0].getBoundingClientRect();
    const startX = firstDot.left + firstDot.width / 2 - svgRect.left;
    const startY = firstDot.top + firstDot.height / 2 - svgRect.top;

    // Começa linha um pouco acima do primeiro ponto
    pathString += `M ${startX} ${0} L ${startX} ${startY}`;

    // Loop através dos pontos para criar as curvas
    for (let i = 0; i < dots.length - 1; i++) {
      const currentDot = dots[i].getBoundingClientRect();
      const nextDot = dots[i + 1].getBoundingClientRect();

      const x1 = currentDot.left + currentDot.width / 2 - svgRect.left;
      const y1 = currentDot.top + currentDot.height / 2 - svgRect.top;

      const x2 = nextDot.left + nextDot.width / 2 - svgRect.left;
      const y2 = nextDot.top + nextDot.height / 2 - svgRect.top;

      // Desenha curva Bezier cúbica entre os pontos
      // Control points (cp) criam a suavidade da curva
      const distY = y2 - y1;
      const cp1x = x1;
      const cp1y = y1 + distY * 0.5;
      const cp2x = x2;
      const cp2y = y2 - distY * 0.5;

      pathString += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
    }

    // Linha final descendo do último ponto
    const lastDot = dots[dots.length - 1].getBoundingClientRect();
    const lastX = lastDot.left + lastDot.width / 2 - svgRect.left;
    const lastY = lastDot.top + lastDot.height / 2 - svgRect.top;

    pathString += ` L ${lastX} ${svgRect.height}`;

    // Aplica o path
    pathBg.setAttribute('d', pathString);
    pathActive.setAttribute('d', pathString);

    // Configura o comprimento da linha para animação
    const length = pathActive.getTotalLength();

    // Define stroke-dash para animação de desenho
    gsap.set(pathActive, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    return length;
  }

  // Desenha inicial
  // Timeout pequeno para garantir que layout carregou
  setTimeout(() => {
    const totalLength = drawLine();

    // Animação ScrollTrigger
    gsap.to(pathActive, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline-wrapper-v2',
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: 1,
        // markers: true // Descomente para debugar
      },
    });

    // Animação de entrada dos cards
    items.forEach((item, i) => {
      const card = item.querySelector('.t-card');
      const dot = item.querySelector('.t-dot');
      const isLeft = item.classList.contains('left');

      gsap.from(card, {
        opacity: 0,
        x: isLeft ? -50 : 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        },
      });

      gsap.from(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        },
      });
    });
  }, 100);

  // Redesenhar no resize para manter responsividade
  window.addEventListener('resize', () => {
    drawLine();
    // Recalcula ScrollTrigger
    ScrollTrigger.refresh();
  });
}

// Inicializa
document.addEventListener('DOMContentLoaded', initTimeline);
// Caso já tenha carregado (ex: hot reload)
if (
  document.readyState === 'complete' ||
  document.readyState === 'interactive'
) {
  initTimeline();
}
// --- LÓGICA DO MENU MOBILE (HEADER) ---
const hamburger = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu-overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    // Bloqueia o scroll da página quando o menu está aberto
    document.body.style.overflow = mobileMenu.classList.contains('active')
      ? 'hidden'
      : 'auto';
  });

  // Fechar menu ao clicar em um link
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });
}
