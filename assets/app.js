/* ============================================================
   HOUSE OF ELÉVARA — CINEMATIC LUXURY APP.JS v3.2
   Full production build — all features restored & upgraded
   ============================================================ */

(function () {
  'use strict';

  const qs  = (id) => document.getElementById(id);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_COARSE = window.matchMedia('(pointer: coarse)').matches;

  /* ===== MOBILE MENU ===== */

  function closeDropdown() {
    const dm = qs('dropMenu'), opener = qs('dropOpener'), chev = qs('dropChev');
    if (dm)     { dm.classList.remove('is-open'); dm.setAttribute('aria-hidden','true'); }
    if (opener)   opener.setAttribute('aria-expanded','false');
    if (chev)     chev.textContent = '\u25be';
  }

  function openMenu() {
    const menu = qs('mobileMenu');
    if (!menu) return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
    const closeBtn = qs('closeMenu');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 60);
  }

  function closeMenu() {
    const menu = qs('mobileMenu');
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
    closeDropdown();
    const opener = qs('openMenu');
    if (opener) opener.focus();
  }

  function toggleDrop() {
    const dm = qs('dropMenu'), opener = qs('dropOpener'), chev = qs('dropChev');
    if (!dm || !opener) return;
    const isOpen = dm.classList.toggle('is-open');
    dm.setAttribute('aria-hidden', String(!isOpen));
    opener.setAttribute('aria-expanded', String(isOpen));
    if (chev) chev.textContent = isOpen ? '\u25b4' : '\u25be';
  }

  function bindMenuLinks() {
    const menu = qs('mobileMenu');
    if (!menu) return;
    qsa('a', menu).forEach(function(a) {
      on(a, 'click', function() { closeMenu(); });
    });
  }

  window.GS_openMenu   = openMenu;
  window.GS_closeMenu  = closeMenu;
  window.GS_toggleDrop = toggleDrop;
  window.EV_openMenu   = openMenu;
  window.EV_closeMenu  = closeMenu;
  window.EV_toggleDrop = toggleDrop;

  /* ===== PAGE ENTRANCE VEIL ===== */

  function initPageEntrance() {
    if (PREFERS_REDUCED) return;
    var veil = document.createElement('div');
    veil.style.position   = 'fixed';
    veil.style.inset      = '0';
    veil.style.background = '#060605';
    veil.style.zIndex     = '999998';
    veil.style.pointerEvents = 'none';
    veil.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1)';
    document.body.appendChild(veil);
    requestAnimationFrame(function() {
      setTimeout(function() {
        veil.style.opacity = '0';
        setTimeout(function() { veil.remove(); }, 800);
      }, 90);
    });
  }

  /* ===== SCROLL REVEAL ===== */

  function initScrollReveal() {
    var els = qsa('.reveal');
    if (!els.length) return;
    if (PREFERS_REDUCED) {
      els.forEach(function(el) { el.classList.add('is-visible'); });
      return;
    }
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function(el) { obs.observe(el); });
  }

  /* ===== AUTO ANIMATE ON SCROLL ===== */

  function initAutoAnimate() {
    if (PREFERS_REDUCED) return;
    var targets = qsa('.infoCard, .card, .cardGlow, .readyBlock, .brandCard, .sectionDivider');
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, i) {
        if (!entry.isIntersecting || entry.target.dataset.animated) return;
        var el = entry.target;
        el.dataset.animated = 'true';
        el.style.opacity   = '0';
        el.style.transform = 'translateY(22px)';
        var delay = i * 0.055;
        el.style.transition = [
          'opacity 0.65s cubic-bezier(0.16,1,0.3,1) ' + delay + 's',
          'transform 0.65s cubic-bezier(0.16,1,0.3,1) ' + delay + 's'
        ].join(', ');
        requestAnimationFrame(function() {
          setTimeout(function() {
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
          }, 50);
        });
        obs.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    targets.forEach(function(el) { obs.observe(el); });
  }

  /* ===== MAGNETIC BUTTONS ===== */

  function initMagneticButtons() {
    if (PREFERS_REDUCED || IS_COARSE) return;
    qsa('.btn--gold, .btn--ghost').forEach(function(btn) {
      on(btn, 'mousemove', function(e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width  / 2) * 0.18;
        var y = (e.clientY - r.top  - r.height / 2) * 0.18;
        btn.style.transform = 'translate(' + x + 'px,' + (y - 2) + 'px)';
      });
      on(btn, 'mouseleave', function() {
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
        btn.style.transform  = '';
        setTimeout(function() { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* ===== GOLD CURSOR TRAIL ===== */

  function initCursorTrail() {
    if (PREFERS_REDUCED || IS_COARSE) return;

    var trail = [];
    var COUNT = 7;

    for (var i = 0; i < COUNT; i++) {
      var dot  = document.createElement('div');
      var size = Math.max(2, 7 - i);
      var alpha = (0.55 - i * 0.07).toFixed(2);
      dot.style.position      = 'fixed';
      dot.style.width         = size + 'px';
      dot.style.height        = size + 'px';
      dot.style.borderRadius  = '50%';
      dot.style.background    = 'rgba(200,169,90,' + alpha + ')';
      dot.style.pointerEvents = 'none';
      dot.style.zIndex        = '999999';
      dot.style.transform     = 'translate(-50%,-50%)';
      dot.style.mixBlendMode  = 'screen';
      dot.style.transition    = 'opacity 0.3s';
      dot.style.willChange    = 'left,top';
      dot.style.left          = '-100px';
      dot.style.top           = '-100px';
      document.body.appendChild(dot);
      trail.push({ el: dot, x: -100, y: -100 });
    }

    var mx = -100, my = -100;

    on(document, 'mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
    });

    function animateTrail() {
      var x = mx, y = my;
      trail.forEach(function(d, i) {
        var lag = 0.25 - i * 0.025;
        d.x += (x - d.x) * lag;
        d.y += (y - d.y) * lag;
        d.el.style.left = d.x + 'px';
        d.el.style.top  = d.y + 'px';
        x = d.x;
        y = d.y;
      });
      requestAnimationFrame(animateTrail);
    }

    animateTrail();

    on(document, 'mouseleave', function() {
      trail.forEach(function(d) { d.el.style.opacity = '0'; });
    });
    on(document, 'mouseenter', function() {
      trail.forEach(function(d) { d.el.style.opacity = '1'; });
    });
  }

  /* ===== PARALLAX TILT ON CARDS ===== */

  function initTilt() {
    if (PREFERS_REDUCED || IS_COARSE) return;
    qsa('.brandCard, .cardGlow').forEach(function(card) {
      on(card, 'mousemove', function(e) {
        var r   = card.getBoundingClientRect();
        var cx  = r.left + r.width  / 2;
        var cy  = r.top  + r.height / 2;
        var dx  = (e.clientX - cx) / (r.width  / 2);
        var dy  = (e.clientY - cy) / (r.height / 2);
        var tx  =  dy * 4;
        var ty  = -dx * 4;
        card.style.transition = 'transform 0.1s ease';
        card.style.transform  = 'perspective(800px) rotateX(' + tx + 'deg) rotateY(' + ty + 'deg) scale(1.02)';
      });
      on(card, 'mouseleave', function() {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  /* ===== AMBIENT GOLD PARTICLE FIELD ===== */

  function initParticles() {
    if (PREFERS_REDUCED || IS_COARSE) return;

    var canvas = document.createElement('canvas');
    canvas.style.position      = 'fixed';
    canvas.style.inset         = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex        = '0';
    canvas.style.opacity       = '0.35';
    canvas.style.mixBlendMode  = 'screen';
    document.body.prepend(canvas);

    var ctx2 = canvas.getContext('2d');
    var COUNT = 30;
    var pts   = [];

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    on(window, 'resize', resize, { passive: true });

    for (var i = 0; i < COUNT; i++) {
      pts.push({
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        r:  Math.random() * 1.4 + 0.3,
        dx: (Math.random() - 0.5) * 0.22,
        dy: (Math.random() - 0.5) * 0.22,
        a:  Math.random() * Math.PI * 2
      });
    }

    function draw() {
      ctx2.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(function(p) {
        p.x += p.dx;
        p.y += p.dy;
        p.a += 0.004;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        var alpha = (Math.sin(p.a) * 0.5 + 0.5) * 0.55;
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx2.fillStyle = 'rgba(200,169,90,' + alpha + ')';
        ctx2.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ===== TOPBAR SCROLL BEHAVIOUR ===== */

  function initTopbarScroll() {
    var topbar = document.querySelector('.topbar');
    if (!topbar) return;
    var last = 0, ticking = false;

    function update() {
      var y = window.scrollY;
      topbar.style.background = y > 60 ? 'rgba(6,6,5,0.98)' : '';
      topbar.style.boxShadow  = y > 60 ? '0 4px 40px rgba(0,0,0,0.7)' : '';
      var menuOpen = qs('mobileMenu') && qs('mobileMenu').classList.contains('is-open');
      if (!menuOpen && y > last && y > 200) {
        topbar.style.transform  = 'translateY(-100%)';
        topbar.style.transition = 'transform 0.35s cubic-bezier(0.16,1,0.3,1)';
      } else {
        topbar.style.transform = 'translateY(0)';
      }
      last    = y;
      ticking = false;
    }

    on(window, 'scroll', function() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ===== CARD SHIMMER ===== */

  function initCardShimmer() {
    if (PREFERS_REDUCED || IS_COARSE) return;
    qsa('.card, .cardGlow, .infoCard, .readyBlock, .brandCard').forEach(function(card) {
      if (card.tagName === 'A') return;
      var sh = document.createElement('div');
      sh.style.position     = 'absolute';
      sh.style.top          = '0';
      sh.style.left         = '-100%';
      sh.style.width        = '60%';
      sh.style.height       = '100%';
      sh.style.background   = 'linear-gradient(90deg,transparent,rgba(200,169,90,0.05),rgba(200,169,90,0.09),rgba(200,169,90,0.05),transparent)';
      sh.style.pointerEvents = 'none';
      sh.style.zIndex       = '0';
      sh.style.borderRadius = 'inherit';
      if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
      card.appendChild(sh);
      on(card, 'mouseenter', function() {
        sh.style.transition = 'left 0.7s ease';
        sh.style.left       = '160%';
      });
      on(card, 'mouseleave', function() {
        sh.style.transition = 'none';
        sh.style.left       = '-100%';
      });
    });
  }

  /* ===== BUTTON RIPPLE ===== */

  function initRipple() {
    if (PREFERS_REDUCED) return;
    if (!document.querySelector('#rippleStyle')) {
      var s = document.createElement('style');
      s.id = 'rippleStyle';
      s.textContent = '@keyframes rippleOut{to{transform:translate(-50%,-50%) scale(60);opacity:0;}}';
      document.head.appendChild(s);
    }
    qsa('.btn').forEach(function(btn) {
      on(btn, 'click', function(e) {
        var r   = btn.getBoundingClientRect();
        var rpl = document.createElement('span');
        rpl.style.position      = 'absolute';
        rpl.style.width         = '4px';
        rpl.style.height        = '4px';
        rpl.style.background    = 'rgba(200,169,90,0.4)';
        rpl.style.borderRadius  = '50%';
        rpl.style.left          = (e.clientX - r.left)  + 'px';
        rpl.style.top           = (e.clientY - r.top)   + 'px';
        rpl.style.transform     = 'translate(-50%,-50%) scale(0)';
        rpl.style.animation     = 'rippleOut 0.55s ease forwards';
        rpl.style.pointerEvents = 'none';
        rpl.style.zIndex        = '10';
        if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
        btn.appendChild(rpl);
        setTimeout(function() { rpl.remove(); }, 600);
      });
    });
  }

  /* ===== HEADING GOLD REVEAL LINE ===== */

  function initHeadingReveal() {
    if (PREFERS_REDUCED) return;
    var style = document.createElement('style');
    style.textContent = '.h-reveal{position:relative;}.h-reveal::after{content:"";position:absolute;bottom:0;left:0;width:0;height:1px;background:linear-gradient(90deg,var(--gold2),var(--gold));transition:width 0.8s cubic-bezier(0.16,1,0.3,1);}.h-reveal.is-vis::after{width:100%;}';
    document.head.appendChild(style);
    var headings = qsa('h1, h2, h3');
    headings.forEach(function(h) { h.classList.add('h-reveal'); });
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-vis');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    headings.forEach(function(h) { obs.observe(h); });
  }

  /* ===== STAGGERED GRID REVEAL ===== */

  function initGridReveal() {
    if (PREFERS_REDUCED) return;
    qsa('.grid2, .tiers, .infoGrid').forEach(function(grid) {
      var children = Array.from(grid.children);
      children.forEach(function(child, i) {
        child.style.opacity   = '0';
        child.style.transform = 'translateY(28px)';
        child.style.transition = [
          'opacity 0.6s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.08) + 's',
          'transform 0.6s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.08) + 's'
        ].join(', ');
      });
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (!e.isIntersecting) return;
          Array.from(e.target.children).forEach(function(child) {
            child.style.opacity   = '1';
            child.style.transform = 'translateY(0)';
          });
          obs.unobserve(e.target);
        });
      }, { threshold: 0.1 });
      obs.observe(grid);
    });
  }

  /* ===== FAQ SMOOTH ===== */

  function initFaqSmooth() {
    if (PREFERS_REDUCED) return;
    qsa('details').forEach(function(d) {
      on(d, 'toggle', function() {
        if (d.open) {
          var p = d.querySelector('p');
          if (p) p.style.animation = 'fadeUp 0.3s ease both';
        }
      });
    });
  }

  /* ===== SMOOTH SCROLL ===== */

  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(function(a) {
      on(a, 'click', function(e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        var t = document.querySelector(href);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: PREFERS_REDUCED ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  /* ===== AUTO ACTIVE NAV ===== */

  function initActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    qsa('.nav__link').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }

  /* ===== EXTERNAL LINKS ===== */

  function initExternalLinks() {
    var host = window.location.hostname;
    qsa('a[href^="http"]').forEach(function(a) {
      try {
        var url = new URL(a.href);
        if (url.hostname && url.hostname !== host) {
          if (!a.getAttribute('target')) a.setAttribute('target', '_blank');
          var rel = (a.getAttribute('rel') || '').split(' ').filter(Boolean);
          if (rel.indexOf('noopener')   === -1) rel.push('noopener');
          if (rel.indexOf('noreferrer') === -1) rel.push('noreferrer');
          a.setAttribute('rel', rel.join(' '));
        }
      } catch (err) { /* ignore malformed URLs */ }
    });
  }

  /* ===== LAZY IMAGES ===== */

  function initLazyImages() {
    qsa('img').forEach(function(img) {
      if (!img.hasAttribute('loading'))  img.setAttribute('loading',  'lazy');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    });
  }

  /* ===== NAV LINK GOLD UNDERLINE ===== */

  function initLinkGlow() {
    if (PREFERS_REDUCED || IS_COARSE) return;
    var style = document.createElement('style');
    style.textContent = '.nav__link{position:relative;}.nav__link::after{content:"";position:absolute;bottom:-2px;left:50%;right:50%;height:1px;background:linear-gradient(90deg,transparent,var(--gold2),transparent);transition:left 0.3s ease,right 0.3s ease;}.nav__link:hover::after,.nav__link.is-active::after{left:0;right:0;}';
    document.head.appendChild(style);
  }

  /* ===== INIT ===== */

  document.addEventListener('DOMContentLoaded', function() {
    on(qs('openMenu'),    'click', openMenu);
    on(qs('closeMenu'),   'click', closeMenu);
    on(qs('menuBackdrop'),'click', closeMenu);
    on(qs('dropOpener'),  'click', toggleDrop);

    bindMenuLinks();
    initPageEntrance();
    initScrollReveal();
    initAutoAnimate();
    initMagneticButtons();
    initCursorTrail();
    initTilt();
    initParticles();
    initTopbarScroll();
    initCardShimmer();
    initRipple();
    initHeadingReveal();
    initGridReveal();
    initFaqSmooth();
    initSmoothScroll();
    initActiveNav();
    initExternalLinks();
    initLazyImages();
    initLinkGlow();
  });

  on(document, 'keydown', function(e) { if (e.key === 'Escape') closeMenu(); });

})();
