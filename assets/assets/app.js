const menu = document.getElementById("mobileMenu");
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");
const backdrop = document.getElementById("menuBackdrop");

function openMenu(){
  if(!menu) return;
  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden","false");
}
function closeMenu(){
  if(!menu) return;
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden","true");
}

openBtn && openBtn.addEventListener("click", openMenu);
closeBtn && closeBtn.addEventListener("click", closeMenu);
backdrop && backdrop.addEventListener("click", closeMenu);
