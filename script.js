(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  const overlay = document.querySelector('.nav-overlay');

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  function openMenu() {
    if (!toggle || !nav) return;
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    if (overlay) overlay.addEventListener('click', closeMenu);
  }

  // Hero slideshow
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 5000);
  }

  const revealEls = document.querySelectorAll('.reveal');

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  if (!revealEls.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  revealEls.forEach((el) => io.observe(el));
})();
