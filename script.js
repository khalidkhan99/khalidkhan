(function() {
  'use strict';

  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 80;
    const LINK_DIST = 130;

    function createParticle() {
      return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 2 + 0.4, o: Math.random() * 0.4 + 0.1 };
    }

    for (let i = 0; i < COUNT; i++) particles.push(createParticle());

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${p.o})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.06 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = [
      'Crafting scalable software systems.',
      'Exploring the frontiers of AI.',
      'Building the future, one commit at a time.',
      'Turning ideas into intelligent systems.',
    ];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;
    let typeTimer;

    function typeEffect() {
      const current = phrases[phraseIdx];
      if (!isDeleting) {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) { isDeleting = true; typeTimer = setTimeout(typeEffect, 2200); return; }
        typeTimer = setTimeout(typeEffect, 50 + Math.random() * 30);
      } else {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
        typeTimer = setTimeout(typeEffect, 25 + Math.random() * 15);
      }
    }
    typeEffect();
  }

  const skillFills = document.querySelectorAll('.skill-item__fill');
  if (skillFills.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.getAttribute('data-width') + '%';
          fill.classList.add('is-visible');
          skillObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    skillFills.forEach(fill => skillObserver.observe(fill));
  }

  const statEls = document.querySelectorAll('.hero__stat-value');
  if (statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          if (!target || isNaN(target)) return;
          let current = 0;
          const steps = 50;
          const stepVal = target / steps;
          const interval = setInterval(() => {
            current += stepVal;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = Math.round(current) + (target > 10 ? '+' : '');
          }, 28);
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObserver.observe(el));
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  const toggleBtn = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  if (toggleBtn && navList) {
    toggleBtn.addEventListener('click', function() {
      const isOpen = navList.classList.toggle('nav__list--open');
      this.setAttribute('aria-expanded', isOpen);
      const icon = this.querySelector('i');
      if (icon) { icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars'; }
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navList.classList.remove('nav__list--open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navList.classList.contains('nav__list--open')) {
        navList.classList.remove('nav__list--open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
        toggleBtn.focus();
      }
    });
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const htmlEl = document.documentElement;
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);
    if (metaTheme) {
      metaTheme.setAttribute('content', savedTheme === 'dark' ? '#090A0F' : '#F4F6FA');
    }

    function updateThemeUI(theme) {
      const icon = themeToggle.querySelector('i');
      if (theme === 'light') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
      }
    }

    themeToggle.addEventListener('click', function() {
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeUI(next);
      if (metaTheme) {
        metaTheme.setAttribute('content', next === 'dark' ? '#090A0F' : '#F4F6FA');
      }
    });
  }

})();
