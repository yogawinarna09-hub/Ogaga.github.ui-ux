/* =========================================================
   PORTFOLIO — INTERACTIONS & FRUTIGER AERO ANIMATIONS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     1. AUTO YEAR IN FOOTER
  --------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------
     2. MOBILE MENU (HAMBURGER ☰ / ✕)
  --------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primary-nav');

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    primaryNav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });
  }

  /* ---------------------------------------------------
     3. ACTIVE NAVIGATION LINK ON SCROLL
  --------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------------------------------------------------
     4. HERO STAT NUMBER COUNTER
  --------------------------------------------------- */
  const counters = document.querySelectorAll('.hero__meta-num');

  function animateValue(el, target, suffix = '', duration = 1200) {
    if (prefersReducedMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.floor(eased * target)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = `${target}${suffix}`;
    }
    requestAnimationFrame(step);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-count'), 10) || 0;
          animateValue(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------------------------------------------------
     5. SKILL BARS FILL + PERCENTAGE COUNT-UP
  --------------------------------------------------- */
  const skillBars = document.querySelectorAll('.bar span');

  function revealSkillBar(bar) {
    bar.classList.add('is-visible');
    const skillItem = bar.closest('li');
    const percentEl = skillItem?.querySelector('.skill-list__top span:last-child');
    if (percentEl && !percentEl.dataset.counted) {
      percentEl.dataset.counted = 'true';
      const target = parseInt(percentEl.textContent, 10) || 0;
      animateValue(percentEl, target, '%', 1100);
    }
  }

  if (skillBars.length && 'IntersectionObserver' in window) {
    const barObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealSkillBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    skillBars.forEach((bar) => barObserver.observe(bar));
  } else {
    skillBars.forEach(revealSkillBar);
  }

  /* ---------------------------------------------------
     6. PROJECT FILTER (Null-safe)
  --------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter__btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectsEmpty = document.getElementById('projectsEmpty');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      filterButtons.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      let visibleCount = 0;
      projectCards.forEach((card) => {
        const matches = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
        card.classList.toggle('is-hidden', !matches);
        if (matches) visibleCount++;
      });
      if (projectsEmpty) projectsEmpty.hidden = visibleCount !== 0;
    });
  });

  /* ---------------------------------------------------
     7. CONTACT FORM VALIDATION (Null-safe)
  --------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    const fields = {
      name:    { el: document.getElementById('name'),    message: 'Name is required (at least 3 characters).' },
      email:   { el: document.getElementById('email'),   message: 'Please enter a valid email address.' },
      subject: { el: document.getElementById('subject'), message: 'Subject is required.' },
      message: { el: document.getElementById('message'), message: 'Message is required (at least 10 characters).' }
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(key, message) {
      const field = fields[key];
      const errorEl = contactForm.querySelector(`[data-error-for="${key}"]`);
      if (message) { field.el.classList.add('is-invalid');    if (errorEl) errorEl.textContent = message; }
      else         { field.el.classList.remove('is-invalid'); if (errorEl) errorEl.textContent = ''; }
    }

    function validateField(key) {
      const value = fields[key].el.value.trim();
      switch (key) {
        case 'name':    if (value.length < 3)          return setError(key, fields[key].message), false; break;
        case 'email':   if (!emailPattern.test(value)) return setError(key, fields[key].message), false; break;
        case 'subject': if (value.length === 0)        return setError(key, fields[key].message), false; break;
        case 'message': if (value.length < 10)         return setError(key, fields[key].message), false; break;
      }
      setError(key, '');
      return true;
    }

    Object.keys(fields).forEach((key) => {
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('is-invalid')) validateField(key);
      });
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;
      Object.keys(fields).forEach((key) => { if (!validateField(key)) isValid = false; });
      if (!isValid) { if (formSuccess) formSuccess.hidden = true; return; }
      if (formSuccess) formSuccess.hidden = false;
      contactForm.reset();
      Object.keys(fields).forEach((key) => setError(key, ''));
    });
  }

  /* ---------------------------------------------------
     8. STAGGERED SCROLL REVEAL
  --------------------------------------------------- */
  const revealSelector = [
    '.about-block__title',
    '.biodata-card',
    '.about__panel',
    '.edu-item',
    '.hobby-card',
    '.aboutme-grid',
    '.career-card',
    '.skill-card',
    '.tool-grid'
  ].join(', ');

  const revealTargets = document.querySelectorAll(revealSelector);
  revealTargets.forEach((el) => {
    el.setAttribute('data-reveal', '');
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter((child) => child.matches(revealSelector));
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = `${Math.min(idx * 90, 360)}ms`;
    }
  });

  if (revealTargets.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------
     9. BACK TO TOP BUTTON
  --------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------------------------------------------
     10. FRUTIGER AERO INTERACTIVE ANIMATION SUITE
  --------------------------------------------------- */
  if (!prefersReducedMotion) {
    injectAeroFxStyles();
    initHeroEntrance();
    initAeroCursorEffects();
    initAeroGlassTilt();
    initAeroParallax();
    initMagneticChips();
  }
});

/* =========================================================
   CERTIFICATE MODAL (Null-safe)
   ========================================================= */
function openCertificate(src) {
  const modal = document.getElementById('certificateModal');
  const img = document.getElementById('certificateImage');
  if (modal && img) {
    modal.style.display = 'flex';
    img.src = src;
  }
}

function closeCertificate() {
  const modal = document.getElementById('certificateModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

window.addEventListener('click', (event) => {
  const modal = document.getElementById('certificateModal');
  if (modal && event.target === modal) {
    modal.style.display = 'none';
  }
});

/* =========================================================
   FRUTIGER AERO — DARK MODE CONTROLLER + SKY WAVE
   ========================================================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const themeLabel = themeToggle?.querySelector('.theme-label');

function spawnThemeWave(originEl, isDark) {
  if (!originEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = originEl.getBoundingClientRect();
  const wave = document.createElement('span');
  wave.className = 'aero-theme-wave';
  wave.style.left = `${rect.left + rect.width / 2}px`;
  wave.style.top = `${rect.top + rect.height / 2}px`;
  wave.style.setProperty(
    '--wave-color',
    isDark ? 'rgba(20, 110, 200, 0.35)' : 'rgba(130, 225, 255, 0.42)'
  );
  document.body.appendChild(wave);
  wave.addEventListener('animationend', () => wave.remove(), { once: true });
}

function setTheme(isDark, animate = false) {
  document.body.classList.toggle('dark-mode', isDark);

  if (animate) spawnThemeWave(themeToggle, isDark);
  if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
  if (themeLabel) themeLabel.textContent = isDark ? 'Day Mode' : 'Night Mode';

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to day mode' : 'Switch to night mode'
    );
  }

  localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  setTheme(savedTheme === 'dark');
} else {
  setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setTheme(!isDark, true);
});

/* =========================================================
   AERO FX HELPERS (Styles, Hero Intro, Cursor, Tilt, Parallax)
   ========================================================= */
function injectAeroFxStyles() {
  if (document.getElementById('aero-fx-styles')) return;
  const style = document.createElement('style');
  style.id = 'aero-fx-styles';
  style.textContent = `
    [data-reveal] {
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                  translate 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .aero-hero-item {
      opacity: 0;
      transform: translateY(22px) scale(0.98);
      transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .aero-hero-item.is-entered {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .aero-float-photo {
      animation: aeroPhotoBob 5.5s ease-in-out infinite alternate;
    }
    @keyframes aeroPhotoBob {
      from { translate: 0 0; }
      to   { translate: 0 -10px; }
    }

    .aero-tilt-card {
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
      will-change: transform;
    }

    .aero-glare {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      border-radius: inherit;
      background: radial-gradient(
        circle 220px at var(--mx, 50%) var(--my, 50%),
        rgba(255, 255, 255, 0.42),
        rgba(140, 230, 255, 0.14) 45%,
        transparent 75%
      );
      transition: opacity 0.3s ease;
      z-index: 2;
    }
    body.dark-mode .aero-glare {
      background: radial-gradient(
        circle 220px at var(--mx, 50%) var(--my, 50%),
        rgba(140, 225, 255, 0.28),
        rgba(30, 150, 255, 0.1) 45%,
        transparent 75%
      );
    }
    .aero-tilt-card:hover .aero-glare {
      opacity: 1;
    }

    .aero-bubble-particle {
      position: fixed;
      pointer-events: none;
      border-radius: 50%;
      z-index: 9998;
      background:
        radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.95) 0 18%, rgba(255, 255, 255, 0.08) 60%),
        radial-gradient(circle at 50% 50%, rgba(120, 220, 255, 0.12) 55%, rgba(255, 255, 255, 0.65) 100%);
      border: 1px solid rgba(255, 255, 255, 0.78);
      box-shadow: inset 0 -3px 6px rgba(120, 220, 255, 0.35), 0 0 10px rgba(130, 225, 255, 0.45);
      animation: aeroParticleRise var(--dur, 1.15s) cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
    }
    body.dark-mode .aero-bubble-particle {
      box-shadow: inset 0 -3px 6px rgba(70, 195, 255, 0.45), 0 0 12px rgba(94, 200, 242, 0.65);
    }
    @keyframes aeroParticleRise {
      0% {
        opacity: 0.95;
        transform: translate(-50%, -50%) scale(0.45);
      }
      55% {
        opacity: 0.85;
      }
      100% {
        opacity: 0;
        transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, -55px))) scale(1.25);
      }
    }

    .aero-click-ripple {
      position: fixed;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9997;
      border: 2px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 14px rgba(100, 220, 255, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.5);
      animation: aeroRippleExpand 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes aeroRippleExpand {
      0%   { opacity: 0.9; transform: translate(-50%, -50%) scale(0.4); }
      100% { opacity: 0;   transform: translate(-50%, -50%) scale(4.8); }
    }

    .aero-theme-wave {
      position: fixed;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9996;
      background: radial-gradient(circle, var(--wave-color, rgba(130, 225, 255, 0.4)) 0%, transparent 70%);
      animation: aeroThemeWave 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes aeroThemeWave {
      0%   { opacity: 0.9; transform: translate(-50%, -50%) scale(0.5); }
      100% { opacity: 0;   transform: translate(-50%, -50%) scale(55); }
    }
  `;
  document.head.appendChild(style);
}

function initHeroEntrance() {
  const heroItems = document.querySelectorAll(
    '.hero__content .eyebrow, .hero__title, .hero__role, .hero__desc, .hero__cta, .title-block__photo'
  );
  heroItems.forEach((el, idx) => {
    el.classList.add('aero-hero-item');
    setTimeout(() => {
      el.classList.add('is-entered');
      if (el.classList.contains('title-block__photo')) {
        setTimeout(() => el.classList.add('aero-float-photo'), 750);
      }
    }, 80 + idx * 100);
  });
}

function spawnBubble(x, y, size, dx, dy, durationSec, onDone) {
  const bubble = document.createElement('span');
  bubble.className = 'aero-bubble-particle';
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.setProperty('--dx', `${dx}px`);
  bubble.style.setProperty('--dy', `${dy}px`);
  bubble.style.setProperty('--dur', `${durationSec}s`);
  document.body.appendChild(bubble);
  bubble.addEventListener('animationend', () => {
    bubble.remove();
    if (onDone) onDone();
  }, { once: true });
}

function initAeroCursorEffects() {
  let lastSpawn = 0;
  let activeCount = 0;
  const maxTrailBubbles = 24;

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const now = performance.now();
    if (now - lastSpawn < 55 || activeCount >= maxTrailBubbles) return;
    lastSpawn = now;
    activeCount++;

    spawnBubble(
      event.clientX,
      event.clientY,
      7 + Math.random() * 11,
      (Math.random() - 0.5) * 34,
      -(28 + Math.random() * 44),
      0.85 + Math.random() * 0.45,
      () => { activeCount = Math.max(0, activeCount - 1); }
    );
  }, { passive: true });

  window.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    ripple.className = 'aero-click-ripple';
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.4;
      const dist = 24 + Math.random() * 34;
      spawnBubble(
        event.clientX,
        event.clientY,
        6 + Math.random() * 8,
        Math.cos(angle) * dist,
        Math.sin(angle) * dist - 18,
        0.7 + Math.random() * 0.4
      );
    }
  });
}

function initAeroGlassTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const tiltSelectors = [
    '.biodata-card',
    '.about__panel',
    '.edu-item',
    '.hobby-card',
    '.aboutme-grid',
    '.career-card',
    '.skill-card',
    '.title-block__photo'
  ].join(', ');

  document.querySelectorAll(tiltSelectors).forEach((card) => {
    card.classList.add('aero-tilt-card');
    const glare = document.createElement('span');
    glare.className = 'aero-glare';
    glare.setAttribute('aria-hidden', 'true');
    card.appendChild(glare);

    const isPhoto = card.classList.contains('title-block__photo');
    const maxTilt = isPhoto ? 9 : 5.5;

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.08s ease-out, box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease';
    });

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * (maxTilt * 2);
      const rotateX = (0.5 - py) * (maxTilt * 2);

      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      card.style.transform = isPhoto
        ? `perspective(900px) scale(1.03) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
        : `perspective(950px) translateY(-6px) scale(1.015) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = '';
      card.style.transform = '';
    });
  });
}

function initAeroParallax() {
  const layers = [
    { el: document.querySelector('.nature-sun'), depth: 22 },
    { el: document.querySelector('.aero-city'), depth: 10 },
    ...Array.from(document.querySelectorAll('.nature-sparkle')).map((el, i) => ({
      el,
      depth: 18 + i * 6
    })),
    ...Array.from(document.querySelectorAll('.nature-leaf')).map((el, i) => ({
      el,
      depth: 14 + (i % 3) * 8
    }))
  ].filter((item) => item.el);

  if (!layers.length) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    targetX = event.clientX / window.innerWidth - 0.5;
    targetY = event.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  function updateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    layers.forEach(({ el, depth }) => {
      el.style.translate = `${(-currentX * depth).toFixed(2)}px ${(-currentY * depth).toFixed(2)}px`;
    });

    requestAnimationFrame(updateParallax);
  }
  requestAnimationFrame(updateParallax);
}

function initMagneticChips() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.btn, .tool-chip').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease-out, background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, color 0.35s ease';
    });

    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) * 0.18;
      const dy = (event.clientY - (rect.top + rect.height / 2)) * 0.18;
      el.style.transform = `translate(${dx.toFixed(1)}px, ${(dy - 3).toFixed(1)}px) scale(1.06)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = '';
      el.style.transform = '';
    });
  });
}
