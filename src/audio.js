const clickSound = new Audio("/public/audio/mc-click-sound.mov");
clickSound.preload = "auto";
clickSound.crossOrigin = "anonymous";

const clickGain = 3;
let audioContext = null;
let sourceNode = null;

function setupAudioGraph() {
  if (audioContext) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  audioContext = new AudioContextClass();
  sourceNode = audioContext.createMediaElementSource(clickSound);
  const gainNode = audioContext.createGain();
  gainNode.gain.value = clickGain;
  sourceNode.connect(gainNode).connect(audioContext.destination);
}

function playClickSound() {
  setupAudioGraph();

  if (audioContext?.state === "suspended") {
    audioContext.resume();
  }

  clickSound.currentTime = 0;
  clickSound.play().catch(() => {
    // Browsers can reject playback before a trusted user gesture is established.
  });
}

function isSoundTarget(target) {
  return Boolean(target.closest("a, button, [role='button']"));
}

document.addEventListener("click", (event) => {
  if (!isSoundTarget(event.target)) return;
  playClickSound();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (!event.target.closest("[role='button']")) return;
  playClickSound();
});
