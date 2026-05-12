/* ============================================================
HOUSE OF ELÉVARA — CINEMATIC LUXURY APP.JS v3.0
============================================================ */

(function () {
  'use strict';

  const qs = (id) => document.getElementById(id);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ===== MOBILE MENU ===== */
  function closeDropdown() {
    const dm = qs('dropMenu');
    const opener = qs('dropOpener');
    const chev = qs('dropChev');

    if (dm) {
      dm.classList.remove('is-open');
      dm.setAttribute('aria-hidden', 'true');
    }

    if (opener) opener.setAttribute('aria-expanded', 'false');
    if (chev) chev.textContent = '▾';
  }

  function openMenu() {
    const menu = qs('mobileMenu');
    if (!menu) return;

    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    const menu = qs('mobileMenu');
    if (!menu) return;

    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    closeDropdown();
  }

  function toggleDrop() {
    const dm = qs('dropMenu');
    const opener = qs('dropOpener');
    const chev = qs('dropChev');

    if (!dm || !opener) return;

    const isOpen = dm.classList.toggle('is-open');

    dm.setAttribute('aria-hidden', String(!isOpen));
    opener.setAttribute('aria-expanded', String(isOpen));

    if (chev) chev.textContent = isOpen ? '▴' : '▾';
  }

  window.GS_openMenu = openMenu;
  window.GS_closeMenu = closeMenu;
  window.GS_toggleDrop = toggleDrop;

  window.EV_openMenu = openMenu;
  window.EV_closeMenu = closeMenu;
  window.EV_toggleDrop = toggleDrop;

  /* ===== PAGE ENTRANCE ===== */
  function initPageEntrance() {
    const veil = document.createElement('div');

    veil.style.cssText =
      'position:fixed;inset:0;background:#060605;z-index:999998;pointer-events:none;transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1);';

    document.body.appendChild(veil);

    requestAnimationFrame(() => {
      setTimeout(() => {
        veil.style.opacity = '0';

        setTimeout(() => {
          veil.remove();
        }, 750);
      }, 80);
    });
  }

  /* ===== SCROLL REVEAL ===== */
  function initScrollReveal() {
    const els = qsa('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            obs.unobserve(e.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    els.forEach((el) => obs.observe(el));
  }

  /* ===== AUTO ANIMATE ON SCROLL ===== */
  function initAutoAnimate() {
    const targets = qsa(
      '.infoCard, .card, .cardGlow, .readyBlock, .brandCard, .sectionDivider'
    );

    if (!targets.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting || entry.target.dataset.animated) return;

          const el = entry.target;

          el.dataset.animated = 'true';
          el.style.opacity = '0';
          el.style.transform = 'translateY(22px)';
          el.style.transition = `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${
            i * 0.055
          }s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.055}s`;

          requestAnimationFrame(() => {
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, 50);
          });

          obs.unobserve(el);
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    targets.forEach((el) => obs.observe(el));
  }

  /* ===== MAGNETIC BUTTONS ===== */
  function initMagneticButtons() {
    qsa('.btn--gold, .btn--ghost').forEach((btn) => {
      on(btn, 'mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.18;

        btn.style.transform = `translate(${x}px, ${y - 2}px)`;
      });

      on(btn, 'mouseleave', () => {
        btn.style.transition =
          'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
        btn.style.transform = '';

        setTimeout(() => {
          btn.style.transition = '';
        }, 400);
      });
    });
  }

  /* ===== GOLD CURSOR TRAIL ===== */
  function initCursorTrail() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const trail = [];
    const COUNT = 6;

    for (let i = 0; i < COUNT; i++) {
      const dot = document.createElement('div');
      const size = 6 - i;

      dot.style.cssText = `position:fixed;width:${size}px;height:${size}px;border-radius:50%;background:rgba(200,169,90,${
        0.5 - i * 0.07
      });pointer-events:none;z-index:999999;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:opacity 0.3s;`;

      document.body.appendChild(dot);
      trail.push({ el: dot, x: 0, y: 0 });
    }

    let mx = 0;
    let my = 0;

    on(document, 'mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    (function animate() {
      let x = mx;
      let y = my;

      trail.forEach((d, i) => {
        d.x += (x - d.x) * (0.25 - i * 0.03);
        d.y += (y - d.y) * (0.25 - i * 0.03);

        d.el.style.left = d.x + 'px';
        d.el.style.top = d.y + 'px';

        x = d.x;
        y = d.y;
      });

      requestAnimationFrame(animate);
    })();

    on(document, 'mouseleave', () => {
      trail.forEach((d) => {
        d.el.style.opacity = '0';
      });
    });

    on(document, 'mouseenter', () => {
      trail.forEach((d) => {
        d.el.style.opacity = '1';
      });
    });
  }

  /* ===== TOPBAR SCROLL BEHAVIOUR ===== */
  function initTopbarScroll() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    let last = 0;

    on(
      window,
      'scroll',
      () => {
        const y = window.scrollY;

        topbar.style.background = y > 60 ? 'rgba(6,6,5,0.98)' : '';
        topbar.style.boxShadow =
          y > 60 ? '0 4px 40px rgba(0,0,0,0.7)' : '';

        if (y > last && y > 200) {
          topbar.style.transform = 'translateY(-100%)';
          topbar.style.transition =
            'transform 0.35s cubic-bezier(0.16,1,0.3,1)';
        } else {
          topbar.style.transform = 'translateY(0)';
        }

        last = y;
      },
      { passive: true }
    );
  }

  /* ===== CARD SHIMMER ===== */
  function initCardShimmer() {
    qsa('.card, .cardGlow, .infoCard, .readyBlock, .brandCard').forEach(
      (card) => {
        const sh = document.createElement('div');

        sh.style.cssText =
          'position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(200,169,90,0.05),rgba(200,169,90,0.09),rgba(200,169,90,0.05),transparent);pointer-events:none;z-index:0;border-radius:inherit;';

        if (getComputedStyle(card).position === 'static') {
          card.style.position = 'relative';
        }

        card.appendChild(sh);

        on(card, 'mouseenter', () => {
          sh.style.transition = 'left 0.7s ease';
          sh.style.left = '160%';
        });

        on(card, 'mouseleave', () => {
          sh.style.transition = 'none';
          sh.style.left = '-100%';
        });
      }
    );
  }

  /* ===== BUTTON RIPPLE ===== */
  function initRipple() {
    if (!document.querySelector('#rippleStyle')) {
      const s = document.createElement('style');

      s.id = 'rippleStyle';
      s.textContent =
        '@keyframes rippleOut{to{transform:translate(-50%,-50%) scale(60);opacity:0;}}';

      document.head.appendChild(s);
    }

    qsa('.btn').forEach((btn) => {
      on(btn, 'click', (e) => {
        const r = btn.getBoundingClientRect();
        const rpl = document.createElement('span');

        rpl.style.cssText = `position:absolute;width:4px;height:4px;background:rgba(200,169,90,0.4);border-radius:50%;left:${
          e.clientX - r.left
        }px;top:${
          e.clientY - r.top
        }px;transform:translate(-50%,-50%) scale(0);animation:rippleOut 0.55s ease forwards;pointer-events:none;z-index:10;`;

        if (getComputedStyle(btn).position === 'static') {
          btn.style.position = 'relative';
        }

        btn.appendChild(rpl);

        setTimeout(() => {
          rpl.remove();
        }, 600);
      });
    });
  }

  /* ===== FAQ SMOOTH ===== */
  function initFaqSmooth() {
    qsa('details').forEach((d) => {
      on(d, 'toggle', () => {
        if (d.open) {
          const p = d.querySelector('p');

          if (p) {
            p.style.animation = 'fadeUp 0.3s ease both';
          }
        }
      });
    });
  }

  /* ===== SMOOTH SCROLL ===== */
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach((a) => {
      on(a, 'click', (e) => {
        const targetSelector = a.getAttribute('href');
        if (!targetSelector || targetSelector === '#') return;

        const t = document.querySelector(targetSelector);
        if (!t) return;

        e.preventDefault();

        t.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  }

  /* ===== AUTO ACTIVE NAV ===== */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';

    qsa('.nav__link').forEach((link) => {
      const href = link.getAttribute('href');

      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }

  /* ===== INIT ===== */
  document.addEventListener('DOMContentLoaded', () => {
    on(qs('openMenu'), 'click', openMenu);
    on(qs('closeMenu'), 'click', closeMenu);
    on(qs('menuBackdrop'), 'click', closeMenu);
    on(qs('dropOpener'), 'click', toggleDrop);

    initPageEntrance();
    initScrollReveal();
    initAutoAnimate();
    initMagneticButtons();
    initCursorTrail();
    initTopbarScroll();
    initCardShimmer();
    initRipple();
    initFaqSmooth();
    initSmoothScroll();
    initActiveNav();
  });

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();
