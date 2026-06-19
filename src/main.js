const canvas = document.querySelector("#matrix-canvas");

if (!canvas) {
  throw new Error("Matrix canvas is only expected on the homepage.");
}

const c = canvas.getContext("2d");
const homeCard = document.querySelector(".home-card");

const fontHeight = 22;
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
const moveScale = 0.0048;
const speedBase = 0.62;
const speedDeviation = 0.2;
const streaks = 1.5;
const brightRatio = 0.08;
const minZoom = 0.025;
const maxZoom = 72;
const enteredZoom = 2.35;
const revealZoom = 1.45;

let zoom = 1;
let dpr = 1;
let w = 0;
let h = 0;
let charHeight = 0;
let colWidth = 0;
let colsPerLine = 0;
let charsOnCol = 0;
let prevTime = 0;
let glitchCollect = 0;
let spawnCollect = 0;
let explosion = null;
let visibleGlyphs = [];

const trails = [];

const randomGlyph = () => ({
  glyph: alphabet[Math.floor(Math.random() * alphabet.length)],
  flipped: Math.random() < 0.5,
  bright: Math.random() < brightRatio,
});

const universe = Array.from({ length: 1200 }, randomGlyph);

function setZoom(nextZoom) {
  zoom = Math.max(minZoom, Math.min(maxZoom, nextZoom));
  document.documentElement.style.setProperty("--scene-scale", zoom.toFixed(3));
  document.body.classList.toggle("is-entered", zoom >= revealZoom);
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
  c.font = `${fontHeight}px ${fontFamily}`;
  c.textBaseline = "top";

  const charSize = c.measureText("ネ");
  colWidth = Math.max(12, charSize.width * 1.42);
  charHeight = fontHeight * 1.45;
  charsOnCol = Math.max(1, Math.ceil(h / charHeight));
  colsPerLine = Math.max(1, Math.ceil(w / colWidth));
  trails.length = 0;
  spawnTrails();
}

function makeTrail(col, maxSpeed = null, headAt = null) {
  let speed = speedBase + (Math.random() * speedDeviation * 2 - speedDeviation);

  if (maxSpeed > 0 && speed > maxSpeed) {
    speed = maxSpeed;
  }

  return {
    col,
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

function useSceneTransform() {
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.translate(w / 2, h / 2);
  c.scale(zoom, zoom);
  c.translate(-w / 2, -h / 2);
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

function drawGlyph(item, x, y, color, record = true) {
  c.fillStyle = color;

  if (record) {
    visibleGlyphs.push({
      glyph: item.glyph,
      flipped: item.flipped,
      x,
      y,
      color,
    });
  }

  if (item.flipped) {
    c.save();
    c.translate(x + colWidth, y);
    c.scale(-1, 1);
    c.fillText(item.glyph, 0, 0);
    c.restore();
  } else {
    c.fillText(item.glyph, x, y);
  }
}

function drawTrail(trail, record = true) {
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

    drawGlyph(item, x, y, color, record);
  }
}

function drawExplosion(time) {
  const elapsed = time - explosion.startedAt;
  const progress = Math.min(1, elapsed / explosion.duration);
  const eased = 1 - Math.pow(1 - progress, 3);

  explosion.particles.forEach((particle) => {
    const item = {
      glyph: particle.glyph,
      flipped: particle.flipped,
    };
    drawGlyph(
      item,
      particle.x + particle.dx * eased,
      particle.y + particle.dy * eased,
      particle.color,
      false,
    );
  });

  if (progress >= 1) {
    const nextZoom = explosion.nextZoom;
    explosion = null;
    setZoom(nextZoom);
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

  if (!explosion) {
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
  }

  clear();
  useSceneTransform();
  c.font = `${fontHeight}px ${fontFamily}`;
  c.textBaseline = "top";
  visibleGlyphs = [];

  if (explosion) {
    drawExplosion(time);
  } else {
    trails.forEach((trail) => drawTrail(trail));
  }

  requestAnimationFrame(tick);
}

function makeExplosionParticles() {
  const source = visibleGlyphs.length > 0
    ? visibleGlyphs
    : trails.flatMap((trail) => {
      const head = Math.round(trail.headAt);
      return Array.from({ length: Math.min(trail.length, 12) }, (_, index) => {
        const item = universe[(trail.universeAt + head - index) % universe.length];
        return {
          glyph: item.glyph,
          flipped: item.flipped,
          x: trail.col * colWidth,
          y: (head - index) * charHeight,
          color: item.bright ? colors.bright : colors.regular,
        };
      });
    });

  const limited = source
    .filter((glyph) => glyph.y >= -charHeight && glyph.y <= h + charHeight)
    .slice(0, 950);

  return limited.map((glyph) => {
    const dx = glyph.x - w / 2;
    const dy = glyph.y - h / 2;
    const distance = Math.max(Math.hypot(dx, dy), 1);
    const radius = 18 + Math.random() * 64;
    return {
      ...glyph,
      dx: (dx / distance) * radius + (Math.random() - 0.5) * 18,
      dy: (dy / distance) * radius + (Math.random() - 0.5) * 18,
    };
  });
}

function toggleEntered() {
  if (explosion) return;

  explosion = {
    duration: 720,
    particles: makeExplosionParticles(),
    startedAt: performance.now(),
    nextZoom: document.body.classList.contains("is-entered") ? 1 : enteredZoom,
  };
}

window.addEventListener("resize", setCanvasExtents);
window.addEventListener("wheel", (event) => {
  event.preventDefault();
  const factor = Math.exp(-event.deltaY * 0.0018);
  setZoom(zoom * factor);
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

setZoom(1);
setCanvasExtents();
requestAnimationFrame((time) => {
  prevTime = time;
  requestAnimationFrame(tick);
});
