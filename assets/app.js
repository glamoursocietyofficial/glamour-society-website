/* House of Elévara — Bulletproof Mobile Menu (GS + EV compatible) */

(function () {
  const qs = (id) => document.getElementById(id);

  function closeDropdown() {
    const dm = qs("dropMenu");
    const opener = qs("dropOpener");
    const chev = qs("dropChev");

    if (dm) {
      dm.classList.remove("is-open");
      dm.setAttribute("aria-hidden", "true");
    }
    if (opener) opener.setAttribute("aria-expanded", "false");
    if (chev) chev.textContent = "▾";
  }

  function openMenu() {
    const menu = qs("mobileMenu");
    if (!menu) return;

    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeMenu() {
    const menu = qs("mobileMenu");
    if (!menu) return;

    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    closeDropdown();
  }

  function toggleDrop() {
    const dm = qs("dropMenu");
    const opener = qs("dropOpener");
    const chev = qs("dropChev");
    if (!dm || !opener) return;

    const isOpen = dm.classList.toggle("is-open");
    dm.setAttribute("aria-hidden", String(!isOpen));
    opener.setAttribute("aria-expanded", String(isOpen));
    if (chev) chev.textContent = isOpen ? "▴" : "▾";
  }

  // --- Keep your existing HTML working ---
  window.GS_openMenu = openMenu;
  window.GS_closeMenu = closeMenu;
  window.GS_toggleDrop = toggleDrop;

  // --- Optional aliases (if you ever switch HTML later) ---
  window.EV_openMenu = openMenu;
  window.EV_closeMenu = closeMenu;
  window.EV_toggleDrop = toggleDrop;

  document.addEventListener("DOMContentLoaded", () => {
    const openBtn = qs("openMenu");
    const closeBtn = qs("closeMenu");
    const backdrop = qs("menuBackdrop");
    const dropOpener = qs("dropOpener");

    if (openBtn) openBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);
    if (dropOpener) dropOpener.addEventListener("click", toggleDrop);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();
