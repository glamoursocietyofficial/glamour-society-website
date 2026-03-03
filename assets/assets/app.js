/* House of Elévara — Mobile Menu Controller */

(function () {

  const qs = (id) => document.getElementById(id);

  const body = document.body;

  const menu = () => qs("mobileMenu");
  const dropMenu = () => qs("dropMenu");
  const dropOpener = () => qs("dropOpener");
  const dropChev = () => qs("dropChev");

  /* OPEN MENU */
  window.EV_openMenu = function () {

    const m = menu();
    if (!m) return;

    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");

    body.classList.add("no-scroll");
  };


  /* CLOSE MENU */
  window.EV_closeMenu = function () {

    const m = menu();
    if (!m) return;

    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");

    body.classList.remove("no-scroll");

    closeDropdown();
  };


  /* TOGGLE DROPDOWN */
  window.EV_toggleDrop = function () {

    const dm = dropMenu();
    const opener = dropOpener();

    if (!dm || !opener) return;

    const isOpen = dm.classList.toggle("is-open");

    dm.setAttribute("aria-hidden", String(!isOpen));
    opener.setAttribute("aria-expanded", String(isOpen));

    if (dropChev()) dropChev().textContent = isOpen ? "▴" : "▾";
  };


  /* CLOSE DROPDOWN */
  function closeDropdown() {

    const dm = dropMenu();
    const opener = dropOpener();

    if (!dm || !opener) return;

    dm.classList.remove("is-open");
    dm.setAttribute("aria-hidden", "true");

    opener.setAttribute("aria-expanded", "false");

    if (dropChev()) dropChev().textContent = "▾";
  }


  /* DOM READY */
  document.addEventListener("DOMContentLoaded", () => {

    const openBtn = qs("openMenu");
    const closeBtn = qs("closeMenu");
    const backdrop = qs("menuBackdrop");
    const opener = dropOpener();

    if (openBtn) openBtn.addEventListener("click", window.EV_openMenu);
    if (closeBtn) closeBtn.addEventListener("click", window.EV_closeMenu);
    if (backdrop) backdrop.addEventListener("click", window.EV_closeMenu);
    if (opener) opener.addEventListener("click", window.EV_toggleDrop);

  });


  /* ESC KEY CLOSE */
  document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
      window.EV_closeMenu();
    }

  });


})();
