/* ============================================================
   House of Elévara — Atmosphere
   3D colonnade background + motion layer. No dependencies.
   Load once per page, just before </body>:
   <script src="assets/atmosphere.js?v=1"></script>
   ============================================================ */
(function () {
  'use strict';

  var GOLD = [200, 169, 90];   // --gold  #c8a95a
  var GOLD_HOT = [240, 221, 160]; // --gold3 #f0dda0

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- canvas setup ---------- */
  var canvas = document.createElement('canvas');
  canvas.className = 'atmosphere';
  canvas.setAttribute('aria-hidden', 'true');
  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  document.body.insertBefore(canvas, document.body.firstChild);

  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W / 2;
    cy = H / 2;
  }
  resize();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }, { passive: true });

  /* ---------- scene constants ---------- */
  var isSmall = W < 700;

  var FOCAL = 620;          // perspective strength
  var NEAR = 40;
  var FAR = isSmall ? 1500 : 2000;
  var SPACING = 190;        // distance between column pairs
  var BAYS = Math.ceil(FAR / SPACING);
  var HALL = 330;           // half-width of the hall
  var COL_W = 26;           // column half-thickness
  var CEIL = -230;          // ceiling y (negative is up)
  var FLOOR = 230;          // floor y
  var SPEED = isSmall ? 0.055 : 0.075;   // forward drift, px per ms
  var LOOP = BAYS * SPACING;

  var DUST = isSmall ? 60 : 130;
  var dust = [];
  for (var i = 0; i < DUST; i++) {
    dust.push({
      x: (Math.random() - 0.5) * HALL * 2.6,
      y: (Math.random() - 0.5) * (FLOOR - CEIL) * 1.15,
      z: Math.random() * FAR,
      r: 0.5 + Math.random() * 1.7,
      ph: Math.random() * Math.PI * 2,
      sp: 0.3 + Math.random() * 0.9
    });
  }

  /* ---------- camera ---------- */
  var camZ = 0;
  var camX = 0, camY = 0;
  var targetX = 0, targetY = 0;
  var pointerX = 0, pointerY = 0;

  if (!reduceMotion) {
    window.addEventListener('pointermove', function (e) {
      pointerX = (e.clientX / W - 0.5) * 2;
      pointerY = (e.clientY / H - 0.5) * 2;
    }, { passive: true });
  }

  /* ---------- projection ---------- */
  function proj(x, y, z) {
    var dz = z;
    if (dz < NEAR) return null;
    var s = FOCAL / dz;
    return {
      x: cx + (x - camX) * s,
      y: cy + (y - camY) * s,
      s: s,
      d: dz
    };
  }

  function fog(z) {
    // near objects fade in, far objects fade out into the vanishing light
    var far = 1 - z / FAR;
    if (far < 0) far = 0;
    far = far * far;
    var near = (z - NEAR) / 320;
    if (near > 1) near = 1;
    if (near < 0) near = 0;
    return far * near;
  }

  function rgba(c, a) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')';
  }

  function seg(ax, ay, az, bx, by, bz, color, alpha, width) {
    var A = proj(ax, ay, az);
    var B = proj(bx, by, bz);
    if (!A || !B) return;
    ctx.strokeStyle = rgba(color, alpha);
    ctx.lineWidth = width || 1;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
  }

  /* ---------- vanishing light ---------- */
  function drawVanishingLight(t) {
    var vx = cx - camX * (FOCAL / FAR);
    var vy = cy - camY * (FOCAL / FAR);
    var pulse = 0.82 + Math.sin(t * 0.00042) * 0.18;
    var R = Math.max(W, H) * (isSmall ? 0.55 : 0.42) * pulse;

    var g = ctx.createRadialGradient(vx, vy, 0, vx, vy, R);
    g.addColorStop(0, 'rgba(255,238,198,0.20)');
    g.addColorStop(0.18, 'rgba(206,168,92,0.11)');
    g.addColorStop(0.5, 'rgba(150,116,54,0.045)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* ---------- architecture ---------- */
  function drawColonnade() {
    for (var b = 0; b < BAYS; b++) {
      var z = b * SPACING - (camZ % SPACING);
      if (z < NEAR) z += LOOP;
      // wrap into range
      z = ((z - NEAR) % LOOP + LOOP) % LOOP + NEAR;
      if (z > FAR) continue;

      var a = fog(z);
      if (a <= 0.004) continue;

      var lw = Math.max(0.6, Math.min(2.4, (FOCAL / z) * 1.15));

      for (var side = -1; side <= 1; side += 2) {
        var xIn = side * (HALL - COL_W);
        var xOut = side * (HALL + COL_W);

        // shaft edges
        seg(xIn, CEIL, z, xIn, FLOOR, z, GOLD, a * 0.62, lw);
        seg(xOut, CEIL, z, xOut, FLOOR, z, GOLD, a * 0.34, lw);
        // capital + base
        seg(xIn, CEIL, z, xOut, CEIL, z, GOLD_HOT, a * 0.5, lw);
        seg(xIn, FLOOR, z, xOut, FLOOR, z, GOLD, a * 0.4, lw);
        // arch spring line across the hall
        seg(side * (HALL - COL_W), CEIL, z, 0, CEIL - 74, z, GOLD_HOT, a * 0.3, lw * 0.85);
      }

      // floor transverse rule
      seg(-HALL, FLOOR, z, HALL, FLOOR, z, GOLD, a * 0.2, lw * 0.8);
    }

    // continuous longitudinal rails: floor, ceiling, cornice
    var railZ0 = NEAR + 8;
    var railZ1 = FAR;
    var railStep = 90;
    for (var side2 = -1; side2 <= 1; side2 += 2) {
      for (var z2 = railZ0; z2 < railZ1 - railStep; z2 += railStep) {
        var af = fog(z2) * 0.5;
        if (af <= 0.004) continue;
        seg(side2 * HALL, FLOOR, z2, side2 * HALL, FLOOR, z2 + railStep, GOLD, af * 0.55, 1);
        seg(side2 * HALL, CEIL, z2, side2 * HALL, CEIL, z2 + railStep, GOLD, af * 0.45, 1);
        seg(side2 * (HALL - COL_W), CEIL - 74, z2, side2 * (HALL - COL_W), CEIL - 74, z2 + railStep, GOLD_HOT, af * 0.22, 1);
      }
    }

    // reflected floor sheen — the "polished stone" read
    var sheenTop = cy + (FLOOR - camY) * (FOCAL / (FAR * 0.55));
    var sh = ctx.createLinearGradient(0, sheenTop, 0, H);
    sh.addColorStop(0, 'rgba(198,160,84,0.055)');
    sh.addColorStop(1, 'rgba(198,160,84,0)');
    ctx.fillStyle = sh;
    ctx.fillRect(0, sheenTop, W, H - sheenTop);
  }

  /* ---------- suspended gold dust ---------- */
  function drawDust(t) {
    for (var i = 0; i < dust.length; i++) {
      var p = dust[i];
      var z = p.z - camZ * 0.55;
      z = ((z - NEAR) % FAR + FAR) % FAR + NEAR;

      var pr = proj(
        p.x + Math.sin(t * 0.00016 * p.sp + p.ph) * 26,
        p.y + Math.cos(t * 0.00012 * p.sp + p.ph) * 18,
        z
      );
      if (!pr) continue;
      if (pr.x < -60 || pr.x > W + 60 || pr.y < -60 || pr.y > H + 60) continue;

      var a = fog(z) * (0.35 + Math.sin(t * 0.0009 * p.sp + p.ph) * 0.3 + 0.35);
      if (a <= 0.01) continue;

      var r = p.r * pr.s * 2.4;
      if (r < 0.35) r = 0.35;

      ctx.fillStyle = rgba(GOLD_HOT, Math.min(a, 0.75));
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, r, 0, Math.PI * 2);
      ctx.fill();

      if (r > 1.6) {
        ctx.fillStyle = rgba(GOLD, Math.min(a * 0.16, 0.16));
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, r * 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /* ---------- vignette ---------- */
  function drawVignette() {
    var g = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.25, cx, cy, Math.max(W, H) * 0.78);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(4,4,3,0.72)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* ---------- loop ---------- */
  var last = 0;
  var running = true;
  var scrollBoost = 0;
  var lastScroll = window.pageYOffset || 0;

  window.addEventListener('scroll', function () {
    var y = window.pageYOffset || 0;
    var dy = y - lastScroll;
    lastScroll = y;
    scrollBoost += dy * 0.35;
    if (scrollBoost > 260) scrollBoost = 260;
    if (scrollBoost < -160) scrollBoost = -160;
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) { last = 0; requestAnimationFrame(frame); }
  });

  function frame(t) {
    if (!running) return;
    if (!last) last = t;
    var dt = Math.min(t - last, 48);
    last = t;

    // camera
    if (!reduceMotion) {
      camZ += (SPEED + scrollBoost * 0.0016) * dt;
      scrollBoost *= 0.94;

      targetX = Math.sin(t * 0.00011) * 26 + pointerX * 46;
      targetY = Math.cos(t * 0.00009) * 15 + pointerY * 30;
    }
    camX += (targetX - camX) * 0.035;
    camY += (targetY - camY) * 0.035;

    ctx.clearRect(0, 0, W, H);
    drawVanishingLight(t);
    drawColonnade();
    drawDust(t);
    drawVignette();

    requestAnimationFrame(frame);
  }

  if (reduceMotion) {
    // draw a single static frame — still atmospheric, no motion
    ctx.clearRect(0, 0, W, H);
    drawVanishingLight(0);
    drawColonnade();
    drawDust(0);
    drawVignette();
    window.addEventListener('resize', function () {
      setTimeout(function () {
        ctx.clearRect(0, 0, W, H);
        drawVanishingLight(0);
        drawColonnade();
        drawDust(0);
        drawVignette();
      }, 180);
    }, { passive: true });
  } else {
    requestAnimationFrame(frame);
  }

  /* ============================================================
     Motion layer — reveals and card tilt
     ============================================================ */

  function initReveals() {
    var targets = document.querySelectorAll(
      '.card, .cardGlow, .readyBlock, .infoCard'
    );
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      return; // v4.0's own fadeUp already handles the entrance
    }

    for (var j = 0; j < targets.length; j++) {
      targets[j].classList.add('atmo-reveal');
      targets[j].style.animation = 'none';  // suspend v4.0 load-time fadeUp
      targets[j].style.transitionDelay = ((j % 4) * 90) + 'ms';
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
          setTimeout(function (el) {
            return function () { el.classList.add('is-done'); };
          }(en.target), 1100);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    for (var k = 0; k < targets.length; k++) io.observe(targets[k]);
  }

  function initTilt() {
    if (reduceMotion) return;
    if (window.matchMedia('(hover: none)').matches) return;

    var cards = document.querySelectorAll('.card, .cardGlow');
    for (var i = 0; i < cards.length; i++) {
      (function (el) {
        el.classList.add('atmo-tilt');
        if (!el.querySelector(':scope > .atmo-sheen')) {
          var sheen = document.createElement('span');
          sheen.className = 'atmo-sheen';
          sheen.setAttribute('aria-hidden', 'true');
          el.insertBefore(sheen, el.firstChild);
        }
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform =
            'perspective(900px) rotateX(' + (-py * 3.2).toFixed(2) + 'deg) rotateY(' +
            (px * 3.8).toFixed(2) + 'deg) translateY(-4px)';
          el.style.setProperty('--mx', ((px + 0.5) * 100).toFixed(1) + '%');
          el.style.setProperty('--my', ((py + 0.5) * 100).toFixed(1) + '%');
        });
        el.addEventListener('pointerleave', function () {
          el.style.transform = '';
        });
      })(cards[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initReveals(); initTilt();
    });
  } else {
    initReveals(); initTilt();
  }
})();
