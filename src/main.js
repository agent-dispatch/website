const header = document.querySelector(".site-header");

function updateHeaderState() {
  if (!header) return;
  header.dataset.scrolled = String(window.scrollY > 24);
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();
