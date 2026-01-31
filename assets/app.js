/* Glamour Society - Bulletproof Mobile Menu */

(function () {
  function qs(id){ return document.getElementById(id); }

  // Global functions so inline onclick ALWAYS works
  window.GS_openMenu = function () {
    const menu = qs("mobileMenu");
    if (!menu) return;

    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  window.GS_closeMenu = function () {
    const menu = qs("mobileMenu");
    if (!menu) return;

    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    // close dropdown too
    const dropMenu = qs("dropMenu");
    const dropOpener = qs("dropOpener");
    const dropChev = qs("dropChev");

    if (dropMenu) {
      dropMenu.classList.remove("is-open");
      dropMenu.setAttribute("aria-hidden", "true");
    }
    if (dropOpener) dropOpener.setAttribute("aria-expanded", "false");
    if (dropChev) dropChev.textContent = "▾";
  };

  window.GS_toggleDrop = function () {
    const dropMenu = qs("dropMenu");
    const dropOpener = qs("dropOpener");
    const dropChev = qs("dropChev");
    if (!dropMenu || !dropOpener) return;

    const isOpen = dropMenu.classList.toggle("is-open");
    dropMenu.setAttribute("aria-hidden", String(!isOpen));
    dropOpener.setAttribute("aria-expanded", String(isOpen));
    if (dropChev) dropChev.textContent = isOpen ? "▴" : "▾";
  };

  // Also attach normal listeners (nice to have)
  document.addEventListener("DOMContentLoaded", () => {
    const openBtn = qs("openMenu");
    const closeBtn = qs("closeMenu");
    const backdrop = qs("menuBackdrop");
    const dropOpener = qs("dropOpener");

    if (openBtn) openBtn.addEventListener("click", window.GS_openMenu);
    if (closeBtn) closeBtn.addEventListener("click", window.GS_closeMenu);
    if (backdrop) backdrop.addEventListener("click", window.GS_closeMenu);
    if (dropOpener) dropOpener.addEventListener("click", window.GS_toggleDrop);
  });

  // ESC closes menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.GS_closeMenu();
  });
})();
