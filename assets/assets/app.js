document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("mobileMenu");
  const openBtn = document.getElementById("openMenu");
  const closeBtn = document.getElementById("closeMenu");
  const backdrop = document.getElementById("menuBackdrop");

  const dropOpener = document.getElementById("dropOpener");
  const dropMenu = document.getElementById("dropMenu");
  const dropChev = document.getElementById("dropChev");

  // Hard fail if any core menu element is missing
  if (!menu || !openBtn || !closeBtn || !backdrop) {
    console.warn("Missing menu elements (check IDs):", {
      mobileMenu: !!menu,
      openMenu: !!openBtn,
      closeMenu: !!closeBtn,
      menuBackdrop: !!backdrop
    });
    return;
  }

  function openMenu() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    // Close dropdown too
    if (dropMenu && dropOpener) {
      dropMenu.classList.remove("is-open");
      dropMenu.setAttribute("aria-hidden", "true");
      dropOpener.setAttribute("aria-expanded", "false");
      if (dropChev) dropChev.textContent = "▾";
    }
  }

  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);

  // ESC closes menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
  });

  // Dropdown inside menu
  if (dropOpener && dropMenu) {
    // start collapsed
    dropMenu.setAttribute("aria-hidden", "true");
    dropOpener.setAttribute("aria-expanded", "false");

    dropOpener.addEventListener("click", () => {
      const isOpen = dropMenu.classList.toggle("is-open");
      dropMenu.setAttribute("aria-hidden", String(!isOpen));
      dropOpener.setAttribute("aria-expanded", String(isOpen));
      if (dropChev) dropChev.textContent = isOpen ? "▴" : "▾";
    });
  }
});
