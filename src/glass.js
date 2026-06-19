const glassCard = document.querySelector(".intro");

if (glassCard) {
  const setGlassPosition = (x, y) => {
    glassCard.style.setProperty("--glass-x", `${x}%`);
    glassCard.style.setProperty("--glass-y", `${y}%`);
  };

  glassCard.addEventListener("pointermove", (event) => {
    const rect = glassCard.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setGlassPosition(x, y);
  });

  glassCard.addEventListener("pointerleave", () => {
    setGlassPosition(50, 50);
  });
}
