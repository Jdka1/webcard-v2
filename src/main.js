const canvas = document.querySelector("#matrix-canvas");

if (!canvas) {
  throw new Error("Matrix canvas is only expected on the homepage.");
}

const c = canvas.getContext("2d");
const homeCard = document.querySelector(".home-card");

const baseFontHeight = 22;
const fontFamily = '"Syne Mono", Meiryo, monospace';
const numbers = "0123456789";
const operators = "#+-\\/|=";
const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲ";
const hiragana = "あいうえおかきくけこがぎぐげごさしすせそざじずぜぞたちつてとだぢづでどなにぬねのはひふへほばびぶべぼぱぴぷぺぽまみむめもやゆよらりるれろわゐゑをん";
const alphabet = numbers + operators + katakana + hiragana + "ARYANMEHRA";

const spawnInterval = 720;
const density = 0.48;
const glitchInterval = 520;
const glitchAmount = 0.012;
const moveScale = 0.0064;
const speedBase = 0.72;
const speedDeviation = 0.2;
const streaks = 1.5;
const brightRatio = 0.08;
const enteredZoom = 1.22;
const autoScrollSpeed = 0.018;

let cardScale = 1;
let dpr = 1;
let w = 0;
let h = 0;
let fontHeight = baseFontHeight;
let charHeight = 0;
let colWidth = 0;
let colsPerLine = 0;
let charsOnCol = 0;
let prevTime = 0;
let glitchCollect = 0;
let spawnCollect = 0;
let hasEntered = false;
let matrixScroll = 0;

const trails = [];

const randomGlyph = () => ({
  glyph: alphabet[Math.floor(Math.random() * alphabet.length)],
  bright: Math.random() < brightRatio,
});

const universe = Array.from({ length: 1200 }, randomGlyph);

function setCardScale(nextScale) {
  cardScale = Math.max(0.72, Math.min(1.45, nextScale));
  document.documentElement.style.setProperty("--card-scale", cardScale.toFixed(3));
  document.body.classList.toggle("is-entered", hasEntered);
}

function updateMatrixMetrics({ reset = false } = {}) {
  fontHeight = baseFontHeight;
  c.font = `${fontHeight}px ${fontFamily}`;
  c.textBaseline = "top";

  const charSize = c.measureText("ネ");
  colWidth = Math.max(12, charSize.width * 1.42);
  charHeight = fontHeight * 1.45;
  charsOnCol = Math.max(1, Math.ceil(h / charHeight));
  colsPerLine = Math.max(1, Math.ceil(w / colWidth));

  if (reset) {
    trails.length = 0;
  }

  spawnTrails();
}

function setCanvasExtents() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  updateMatrixMetrics({ reset: true });
}

function makeTrail(col, maxSpeed = null, headAt = null) {
  let speed = speedBase + (Math.random() * speedDeviation * 2 - speedDeviation);

  if (maxSpeed > 0 && speed > maxSpeed) {
    speed = maxSpeed;
  }

  return {
    col,
    depth: 0.35 + Math.random() * 0.9,
    universeAt: Math.floor(Math.random() * universe.length),
    headAt: headAt ?? -Math.floor(Math.random() * 2 * charsOnCol),
    speed,
    length: Math.floor(Math.random() * streaks * charsOnCol) + 8,
  };
}

function clear() {
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = "#fbfaf7";
  c.fillRect(0, 0, w, h);
}

const colors = {
  regular: "rgba(0, 90, 32, 0.16)",
  bright: "rgba(0, 125, 44, 0.24)",
  head: [
    "rgba(17, 17, 17, 0.34)",
    "rgba(0, 120, 45, 0.28)",
    "rgba(0, 100, 38, 0.22)",
    "rgba(0, 90, 32, 0.18)",
  ],
  tail: [
    "rgba(0, 30, 12, 0.02)",
    "rgba(0, 55, 20, 0.06)",
    "rgba(0, 70, 28, 0.1)",
    "rgba(0, 85, 32, 0.13)",
  ],
};

function parallaxPoint(x, y, depth = 1) {
  const strength = Math.max(-0.035, Math.min(0.035, matrixScroll * 0.000018 * depth));
  return {
    x: x + (x - w / 2) * strength,
    y: y + (y - h / 2) * strength,
  };
}

function wrapY(y) {
  const gutter = charHeight * 4;
  const range = h + gutter * 2;
  return ((((y + gutter) % range) + range) % range) - gutter;
}

function drawGlyph(item, x, y, color, depth = 1) {
  const scrolledY = wrapY(y + matrixScroll * (0.45 + depth * 0.65));
  const point = parallaxPoint(x, scrolledY, depth);

  c.fillStyle = color;
  c.shadowColor = "rgba(0, 85, 32, 0.16)";
  c.shadowBlur = 2 + depth * 5;
  c.shadowOffsetX = depth * 1.3;
  c.shadowOffsetY = depth * 2.2;

  c.fillText(item.glyph, point.x, point.y);
  c.shadowBlur = 0;
  c.shadowOffsetX = 0;
  c.shadowOffsetY = 0;
}

function drawTrail(trail) {
  const head = Math.round(trail.headAt);
  if (head < 0) return;

  const x = trail.col * colWidth;
  let y = head * charHeight + charHeight * 0.28;

  for (let i = 0; i < trail.length; i += 1, y -= charHeight) {
    if (y < 0) break;
    if (y > h) continue;

    const item = universe[(trail.universeAt + head - i) % universe.length];

    let color = item.bright ? colors.bright : colors.regular;

    if (i < colors.head.length) {
      color = colors.head[i];
    } else if (trail.length - i - 1 < colors.tail.length) {
      color = colors.tail[trail.length - i - 1];
    }

    drawGlyph(item, x, y, color, trail.depth);
  }
}

function moveTrails(distance) {
  const trailsToRemove = [];

  trails.forEach((trail, index) => {
    trail.headAt += trail.speed * distance;

    if ((trail.headAt - trail.length) * charHeight > h) {
      trailsToRemove.push(index);
    }
  });

  while (trailsToRemove.length > 0) {
    trails.splice(trailsToRemove.pop(), 1);
  }
}

function spawnTrails() {
  const topTrailPerCol = [];

  trails.forEach((trail) => {
    const trailTop = trail.headAt - trail.length;
    const top = topTrailPerCol[trail.col];
    if (!top || top.headAt - top.length > trailTop) {
      topTrailPerCol[trail.col] = trail;
    }
  });

  for (let i = 0; i < colsPerLine; i += 1) {
    let spawnProbability = 0;
    let maxSpeed = null;
    let headAt = null;

    if (!topTrailPerCol[i]) {
      spawnProbability = 1;
    } else {
      const topTrail = topTrailPerCol[i];
      const tip = Math.round(topTrail.headAt) - topTrail.length;
      if (tip > 0) {
        const emptySpaceRatio = tip / charsOnCol;
        spawnProbability = emptySpaceRatio;
        maxSpeed = topTrail.speed * (1 + emptySpaceRatio);
        headAt = 0;
      }
    }

    if (Math.random() < spawnProbability * density) {
      trails.push(makeTrail(i, maxSpeed, headAt));
    }
  }
}

function glitchUniverse(count) {
  for (let i = 0; i < count; i += 1) {
    universe[Math.floor(Math.random() * universe.length)] = randomGlyph();
  }
}

function tick(time) {
  const elapsed = time - prevTime;
  prevTime = time;

  matrixScroll += elapsed * autoScrollSpeed;
  moveTrails(elapsed * moveScale);

  spawnCollect += elapsed;
  while (spawnCollect > spawnInterval) {
    spawnCollect -= spawnInterval;
    spawnTrails();
  }

  glitchCollect += elapsed;
  while (glitchCollect > glitchInterval) {
    glitchCollect -= glitchInterval;
    glitchUniverse(Math.floor(universe.length * glitchAmount));
  }

  clear();
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.font = `${fontHeight}px ${fontFamily}`;
  c.textBaseline = "top";
  trails.forEach((trail) => drawTrail(trail));

  requestAnimationFrame(tick);
}

function toggleEntered() {
  hasEntered = !hasEntered;
  setCardScale(hasEntered ? enteredZoom : 1);
}

window.addEventListener("resize", setCanvasExtents);
window.addEventListener("wheel", (event) => {
  event.preventDefault();
  matrixScroll += event.deltaY * 0.9;
}, { passive: false });

homeCard?.addEventListener("click", (event) => {
  if (event.target.closest("a")) return;
  toggleEntered();
});

homeCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleEntered();
  }
});

setCardScale(1);
setCanvasExtents();
requestAnimationFrame((time) => {
  prevTime = time;
  requestAnimationFrame(tick);
});
