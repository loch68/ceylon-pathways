/* ============================================================
   CEYLON PATHWAYS — interactions
   Vanilla JS, no dependencies. Motion respects reduced-motion.
   ============================================================ */

(() => {
  'use strict';

  const doc = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReduced = () => reduceMotion.matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Header ---------- */
  const header = document.querySelector('[data-header]');
  let lastScroll = window.scrollY;
  let scrollTicking = false;

  const updateHeader = () => {
    const y = window.scrollY;
    if (!header) return;

    header.classList.toggle('is-scrolled', y > 28);

    if (body.classList.contains('menu-open') || header.contains(document.activeElement)) {
      header.classList.remove('is-hidden');
    } else if (y > 480 && y > lastScroll + 6) {
      header.classList.add('is-hidden');
    } else if (y < lastScroll - 6 || y < 120) {
      header.classList.remove('is-hidden');
    }

    const wa = document.querySelector('[data-wa-float]');
    if (wa) wa.classList.toggle('is-visible', y > 620);

    /* Above the story section, no nav item should read as current. */
    if (y < 240) {
      document
        .querySelectorAll('.nav__link[aria-current], .mobile-menu__nav a[aria-current]')
        .forEach((link) => link.removeAttribute('aria-current'));
    }

    lastScroll = y;
    scrollTicking = false;
    updateParallax();
  };

  const onScroll = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(updateHeader);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuLinks = menu ? Array.from(menu.querySelectorAll('a[href]')) : [];
  let menuOpen = false;
  let lastFocused = null;

  const focusablesInMenu = () =>
    Array.from(
      menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);

  const openMenu = () => {
    if (!menu || !menuToggle || menuOpen) return;
    menuOpen = true;
    lastFocused = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    body.classList.add('menu-open');
    if (header) header.classList.remove('is-hidden');
    window.setTimeout(() => {
      const first = menuLinks[0];
      if (first) first.focus({ preventScroll: true });
    }, 120);
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!menu || !menuToggle || !menuOpen) return;
    menuOpen = false;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    body.classList.remove('menu-open');
    if (restoreFocus) {
      const target = lastFocused && lastFocused.focus ? lastFocused : menuToggle;
      target.focus({ preventScroll: true });
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuOpen ? closeMenu() : openMenu();
    });
  }

  if (menu) {
    menu.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (link) closeMenu({ restoreFocus: false });
    });

    document.addEventListener('keydown', (event) => {
      if (!menuOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = focusablesInMenu();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (!menu.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) closeMenu({ restoreFocus: false });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (prefersReduced() || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -7% 0px', threshold: 0.08 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Scrollspy ---------- */
  const spyLinks = Array.from(
    document.querySelectorAll('.nav__link[href^="#"], .mobile-menu__nav a[href^="#"]')
  );
  const spySections = Array.from(
    document.querySelectorAll('#story, #journeys, #destinations, #gallery, #contact')
  );

  if ('IntersectionObserver' in window && spyLinks.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          spyLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${id}`;
            if (matches) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 }
    );
    spySections.forEach((section) => spy.observe(section));
  }

  /* ---------- Guest rail ---------- */
  const rail = document.querySelector('[data-rail]');
  if (rail) {
    const prev = document.querySelector('[data-rail-prev]');
    const next = document.querySelector('[data-rail-next]');
    const cards = Array.from(rail.children);
    const gap = () =>
      parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap || '0') || 0;

    const step = () => {
      if (!cards[0]) return 320;
      return cards[0].getBoundingClientRect().width + gap();
    };

    const updateRailButtons = () => {
      if (!prev || !next) return;
      const max = rail.scrollWidth - rail.clientWidth;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max - 2;
    };

    const scrollRail = (dir) => {
      rail.scrollBy({
        left: dir * step(),
        behavior: prefersReduced() ? 'auto' : 'smooth'
      });
    };

    if (prev) prev.addEventListener('click', () => scrollRail(-1));
    if (next) next.addEventListener('click', () => scrollRail(1));
    rail.addEventListener('scroll', updateRailButtons, { passive: true });
    window.addEventListener('resize', updateRailButtons, { passive: true });
    updateRailButtons();

    /* Mouse drag, while leaving touch scrolling native. */
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    rail.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.style.cursor = 'grabbing';
    });

    rail.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 4) moved = true;
      if (moved) rail.scrollLeft = startScroll - delta;
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      rail.style.cursor = '';
    };
    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);
    rail.addEventListener('pointerleave', endDrag);
    rail.addEventListener('dragstart', (event) => event.preventDefault());
  }

  /* ---------- Lightbox ---------- */
  const gallery = document.querySelector('[data-gallery]');
  const lightbox = document.getElementById('lightbox');

  if (gallery && lightbox) {
    const items = Array.from(gallery.querySelectorAll('.gallery-item'));
    const lbImg = lightbox.querySelector('[data-lb-img]');
    const lbCaption = lightbox.querySelector('[data-lb-caption]');
    const lbCount = lightbox.querySelector('[data-lb-count]');
    const btnClose = lightbox.querySelector('[data-lb-close]');
    const btnPrev = lightbox.querySelector('[data-lb-prev]');
    const btnNext = lightbox.querySelector('[data-lb-next]');
    let current = 0;
    let opener = null;

    const pad = (n) => String(n).padStart(2, '0');

    const show = (index) => {
      if (!items.length) return;
      current = (index + items.length) % items.length;
      const item = items[current];
      const sourceImg = item.querySelector('img');
      if (!lbImg) return;
      lbImg.src = item.dataset.full || sourceImg.src;
      lbImg.alt = sourceImg ? sourceImg.alt : '';
      if (lbCaption) lbCaption.textContent = item.dataset.caption || '';
      if (lbCount) lbCount.textContent = `${pad(current + 1)} / ${pad(items.length)}`;

      /* Warm the next frame. */
      const nextIndex = (current + 1) % items.length;
      const upcoming = items[nextIndex];
      if (upcoming && upcoming.dataset.full) {
        const preload = new Image();
        preload.src = upcoming.dataset.full;
      }
    };

    const openLightbox = (index, trigger) => {
      opener = trigger || null;
      show(index);
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
      else lightbox.setAttribute('open', '');
      body.classList.add('lb-open');
    };

    const closeLightbox = () => {
      if (typeof lightbox.close === 'function') lightbox.close();
      else lightbox.removeAttribute('open');
      body.classList.remove('lb-open');
      if (opener) {
        opener.focus({ preventScroll: true });
        opener = null;
      }
    };

    items.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index, item));
    });

    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    if (btnPrev) btnPrev.addEventListener('click', () => show(current - 1));
    if (btnNext) btnNext.addEventListener('click', () => show(current + 1));

    lightbox.addEventListener('close', () => {
      body.classList.remove('lb-open');
      if (opener) {
        opener.focus({ preventScroll: true });
        opener = null;
      }
    });

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        show(current - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        show(current + 1);
      }
    });

    /* Swipe on touch. */
    let touchStartX = null;
    lightbox.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (event) => {
      if (touchStartX === null) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 48) show(current + (delta < 0 ? 1 : -1));
      touchStartX = null;
    }, { passive: true });
  }

  /* ---------- Subtle parallax on destination imagery ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  const desktopMotion = window.matchMedia('(min-width: 900px)');

  function updateParallax() {
    if (prefersReduced() || !desktopMotion.matches || !parallaxEls.length) return;
    const viewport = window.innerHeight;

    parallaxEls.forEach((el) => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > viewport + 80) return;
      const strength = parseFloat(el.dataset.parallax) || 0.05;
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      const offset = Math.max(-10, Math.min(10, -progress * strength * 180));
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.06)`;
    });
  }

  if ('IntersectionObserver' in window) {
    const parallaxObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onScroll();
        });
      },
      { rootMargin: '120px 0px' }
    );
    parallaxEls.forEach((el) => parallaxObserver.observe(el));
  }

  window.addEventListener('resize', () => {
    if (!desktopMotion.matches) {
      parallaxEls.forEach((el) => { el.style.transform = ''; });
    }
    onScroll();
  }, { passive: true });

  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', () => {
      if (prefersReduced()) parallaxEls.forEach((el) => { el.style.transform = ''; });
    });
  }

  /* Everything above is ready; paint the correct header state. */
  updateHeader();
})();
