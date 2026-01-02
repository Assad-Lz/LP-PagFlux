gsap.registerPlugin(ScrollTrigger);

// 1. NEURAL NETWORK HERO (CIANO NEON)
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width,
    height,
    particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function initHero() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    // Densidade de partículas
    const count = (width * height) / 9000;
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

      // Repulsão Mouse
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

    // Conexões
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
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
}

// 2. SCROLL REVEAL (LISTA DE BENEFÍCIOS)
const featureItems = gsap.utils.toArray('.gs-feature-item');
featureItems.forEach((item, i) => {
  gsap.fromTo(
    item,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// 3. REVEAL GERAL
gsap.utils.toArray('.gs-reveal').forEach((el) => {
  gsap.fromTo(
    el,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    }
  );
});

// 4. MAGNETIC BUTTONS & CURSOR
const magnets = document.querySelectorAll('.magnetic');
magnets.forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
    gsap.to(btn, { x, y, duration: 0.3 });
  });
  btn.addEventListener('mouseleave', () =>
    gsap.to(btn, { x: 0, y: 0, duration: 0.5 })
  );
});

const dot = document.querySelector('.cursor-dot');
const trail = document.querySelector('.cursor-trail');
window.addEventListener('mousemove', (e) => {
  gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
  gsap.to(trail, { x: e.clientX, y: e.clientY, duration: 0.3 });
});

// 5. SPOTLIGHT BORDER
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});

// 6. SVG LINE ANIMATION
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
