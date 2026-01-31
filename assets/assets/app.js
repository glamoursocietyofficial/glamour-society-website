// Screen switching
document.querySelectorAll("[data-screen]").forEach(btn=>{
  btn.addEventListener("click",e=>{
    const target=btn.getAttribute("data-screen");
    showScreen(target);
  });
});

function showScreen(name){
  document.querySelectorAll(".screen").forEach(s=>{
    s.classList.remove("is-active");
  });

  const target=document.querySelector(`[data-screen-name="${name}"]`);
  if(target) target.classList.add("is-active");
}

// Drawer menu
const drawer=document.getElementById("drawer");
if(drawer){
  document.getElementById("openDrawer").onclick=()=>{
    drawer.style.display="block";
  };

  document.getElementById("closeDrawer").onclick=()=>{
    drawer.style.display="none";
  };

  document.getElementById("drawerBackdrop").onclick=()=>{
    drawer.style.display="none";
  };
}

// Model modal
const modal=document.getElementById("profileModal");

document.querySelectorAll("[data-open-profile]").forEach(card=>{
  card.onclick=()=>{
    modal.style.display="block";
  };
});

if(modal){
  document.getElementById("closeModal").onclick=()=>{
    modal.style.display="none";
  };

  document.getElementById("modalBackdrop").onclick=()=>{
    modal.style.display="none";
  };
}
