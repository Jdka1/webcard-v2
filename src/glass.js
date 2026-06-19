const glassCard = document.querySelector(".intro");
const heroPhoto = document.querySelector(".hero-photo");

if (glassCard) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const setGlassBackground = () => {
    if (!heroPhoto) return;

    const imageUrl = heroPhoto.currentSrc || heroPhoto.src;
    glassCard.style.setProperty("--glass-bg", `url("${imageUrl}")`);
  };

  const setGlassPosition = (x, y) => {
    const dx = (x - 50) * 0.28;
    const dy = (y - 50) * 0.28;
    const angle = 135 + dx * 0.7;

    glassCard.style.setProperty("--glass-x", `${x}%`);
    glassCard.style.setProperty("--glass-y", `${y}%`);
    glassCard.style.setProperty("--glass-dx", `${dx}px`);
    glassCard.style.setProperty("--glass-dy", `${dy}px`);
    glassCard.style.setProperty("--glass-angle", `${angle}deg`);
    glassCard.style.setProperty("--glass-shift-x", `${dx * -0.06}px`);
    glassCard.style.setProperty("--glass-shift-y", `${dy * -0.06}px`);
    glassCard.style.setProperty("--glass-lens-x", `${dx * -0.9}px`);
    glassCard.style.setProperty("--glass-lens-y", `${dy * -0.9}px`);
  };

  setGlassBackground();
  heroPhoto?.addEventListener("load", setGlassBackground);

  glassCard.addEventListener("pointermove", (event) => {
    const rect = glassCard.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

    setGlassPosition(x, y);
  });

  glassCard.addEventListener("pointerleave", () => {
    setGlassPosition(50, 50);
  });
}
