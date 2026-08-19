document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: scroll shadow ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Nav: mobile toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksWrap.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinksWrap.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksWrap.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll (IntersectionObserver) ---------- */
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute('href')));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => s && navObserver.observe(s));

  /* ---------- Reveal-on-scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.section__head, .about__lead, .timeline__item, .skill-card, .project, .training-card, .strengths, .contact__grid'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Skill bar fill on scroll ---------- */
  const skillsGrid = document.getElementById('skillsGrid');
  if (skillsGrid) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.bar__fill').forEach(bar => {
            const level = bar.getAttribute('data-level') || '0';
            requestAnimationFrame(() => { bar.style.width = level + '%'; });
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillsGrid.querySelectorAll('.skill-card').forEach(card => barObserver.observe(card));
  }

  /* ---------- Portrait: subtle upward-tilt parallax on pointer move ---------- */
  const portrait = document.getElementById('portrait');
  const frame = portrait ? portrait.querySelector('.portrait__frame') : null;
  if (portrait && frame && window.matchMedia('(hover: hover)').matches) {
    portrait.addEventListener('mousemove', (e) => {
      const rect = portrait.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltBase = -4; // base upward tilt in degrees
      frame.style.transform =
        `rotate(${tiltBase + x * 4}deg) translateY(${-6 - y * 6}px)`;
    });
    portrait.addEventListener('mouseleave', () => {
      frame.style.transform = '';
    });
  }

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Smooth scroll for in-page anchors (fallback / offset correction) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
