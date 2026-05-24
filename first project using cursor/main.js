(() => {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wrapAngle = (a) => {
    a %= TAU;
    if (a < 0) a += TAU;
    return a;
  };

  const MAP = [
    "1111111111111111",
    "1..............1",
    "1..11.....11...1",
    "1..1.......1...1",
    "1..1..22...1...1",
    "1......2.......1",
    "1..111.....111.1",
    "1......3.......1",
    "1..11.....11...1",
    "1..............1",
    "1...111..111...1",
    "1..............1",
    "1..11......11..1",
    "1..............1",
    "1..............1",
    "1111111111111111",
  ];

  const H = MAP.length;
  const W = MAP[0].length;

  const ui = {
    overlay: null,
    startBtn: null,
    enemyHp: null,
    playerHp: null,
  };

  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
  };

  const state = {
    running: false,
    lastT: performance.now(),
    player: {
      x: 3.5,
      y: 3.5,
      a: Math.PI * 0.25,
      hp: 100,
      fireCd: 0,
    },
    enemy: {
      x: 12.5,
      y: 12.5,
      a: Math.PI * 1.25,
      hp: 100,
      fireCd: 0,
      wanderT: 0,
      wanderA: 0,
      mode: "patrol",
    },
    flashT: 0,
  };

  const canvas = document.createElement("canvas");
  canvas.id = "game";
  canvas.tabIndex = 0;
  const ctx = canvas.getContext("2d", { alpha: false });
  document.body.appendChild(canvas);

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function cellAt(x, y) {
    const cx = Math.floor(x);
    const cy = Math.floor(y);
    if (cx < 0 || cy < 0 || cx >= W || cy >= H) return "1";
    return MAP[cy][cx];
  }

  function isWall(ch) {
    return ch !== ".";
  }

  function canMoveTo(x, y, r) {
    // circle vs grid cells (sample 4 points)
    const pts = [
      [x - r, y - r],
      [x + r, y - r],
      [x - r, y + r],
      [x + r, y + r],
    ];
    for (const [px, py] of pts) {
      if (isWall(cellAt(px, py))) return false;
    }
    return true;
  }

  function start() {
    if (state.running) return;
    state.running = true;
    ui.overlay?.classList.add("hidden");
    canvas.focus();
  }

  function restart() {
    state.player.x = 3.5;
    state.player.y = 3.5;
    state.player.a = Math.PI * 0.25;
    state.player.hp = 100;
    state.player.fireCd = 0;

    state.enemy.x = 12.5;
    state.enemy.y = 12.5;
    state.enemy.a = Math.PI * 1.25;
    state.enemy.hp = 100;
    state.enemy.fireCd = 0;
    state.enemy.wanderT = 0;
    state.enemy.mode = "patrol";

    state.running = false;
    ui.overlay?.classList.remove("hidden");
    setOverlayText("Click to focus", "Arrow keys to move/turn, Space to shoot.");
  }

  function setOverlayText(big, small) {
    const bigEl = ui.overlay?.querySelector(".big");
    const smallEl = ui.overlay?.querySelector(".small");
    if (bigEl) bigEl.textContent = big;
    if (smallEl) smallEl.innerHTML = small;
  }

  function updateHUD() {
    if (ui.enemyHp) ui.enemyHp.textContent = String(Math.max(0, Math.round(state.enemy.hp)));
    if (ui.playerHp) ui.playerHp.textContent = String(Math.max(0, Math.round(state.player.hp)));
  }

  function setKey(e, down) {
    if (e.code in keys) {
      keys[e.code] = down;
      e.preventDefault();
    }
    if (down && e.code === "KeyR") restart();
  }

  function castRay(ox, oy, ang, maxDist = 40) {
    // DDA grid traversal (2D)
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);

    let mapX = Math.floor(ox);
    let mapY = Math.floor(oy);

    const deltaDistX = dx === 0 ? 1e9 : Math.abs(1 / dx);
    const deltaDistY = dy === 0 ? 1e9 : Math.abs(1 / dy);

    let stepX, stepY;
    let sideDistX, sideDistY;

    if (dx < 0) {
      stepX = -1;
      sideDistX = (ox - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - ox) * deltaDistX;
    }

    if (dy < 0) {
      stepY = -1;
      sideDistY = (oy - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - oy) * deltaDistY;
    }

    let hit = false;
    let side = 0;
    let ch = "1";

    for (let i = 0; i < 1024; i++) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      if (mapX < 0 || mapY < 0 || mapX >= W || mapY >= H) break;
      ch = MAP[mapY][mapX];
      if (isWall(ch)) {
        hit = true;
        break;
      }
      const approxDist = Math.min(sideDistX, sideDistY);
      if (approxDist > maxDist) break;
    }

    let dist = maxDist;
    if (hit) {
      dist =
        side === 0
          ? (mapX - ox + (1 - stepX) / 2) / (dx || 1e-9)
          : (mapY - oy + (1 - stepY) / 2) / (dy || 1e-9);
      dist = Math.abs(dist);
    }

    // Intersection position
    const hx = ox + dx * dist;
    const hy = oy + dy * dist;

    return { dist, hit, side, ch, hx, hy };
  }

  function lineOfSight(ax, ay, bx, by) {
    const ang = Math.atan2(by - ay, bx - ax);
    const ray = castRay(ax, ay, ang, Math.hypot(bx - ax, by - ay));
    return !ray.hit || ray.dist >= Math.hypot(bx - ax, by - ay) - 0.12;
  }

  function tryShoot(from, target, dmg, spread = 0.03) {
    if (from.fireCd > 0) return false;
    from.fireCd = 0.22;
    state.flashT = 0.06;

    const ang = wrapAngle(from.a + (Math.random() * 2 - 1) * spread);
    const ray = castRay(from.x, from.y, ang, 40);

    const tx = target.x - from.x;
    const ty = target.y - from.y;
    const tdist = Math.hypot(tx, ty);
    const tang = wrapAngle(Math.atan2(ty, tx));
    let da = Math.abs(wrapAngle(tang - wrapAngle(ang)));
    da = Math.min(da, TAU - da);

    // Very simple "hitbox": if target is close to ray direction and not behind wall
    const within = da < 0.06 && tdist < ray.dist + 0.2;
    const los = lineOfSight(from.x, from.y, target.x, target.y);
    if (within && los) {
      target.hp -= dmg;
      return true;
    }
    return false;
  }

  function updatePlayer(dt) {
    const TURN = 2.6;
    const MOVE = 3.6;
    const R = 0.18;

    if (keys.ArrowLeft) state.player.a = wrapAngle(state.player.a - TURN * dt);
    if (keys.ArrowRight) state.player.a = wrapAngle(state.player.a + TURN * dt);

    const fwd = keys.ArrowUp ? 1 : 0;
    const back = keys.ArrowDown ? 1 : 0;
    const mv = fwd - back;

    if (mv !== 0) {
      const nx = state.player.x + Math.cos(state.player.a) * mv * MOVE * dt;
      const ny = state.player.y + Math.sin(state.player.a) * mv * MOVE * dt;
      if (canMoveTo(nx, state.player.y, R)) state.player.x = nx;
      if (canMoveTo(state.player.x, ny, R)) state.player.y = ny;
    }

    if (keys.Space && state.enemy.hp > 0) {
      // player has "tighter" spread
      tryShoot(state.player, state.enemy, 12, 0.015);
    }
  }

  function updateEnemy(dt, t) {
    if (state.enemy.hp <= 0) return;
    const MOVE = 2.7;
    const TURN = 2.2;
    const R = 0.18;

    const dx = state.player.x - state.enemy.x;
    const dy = state.player.y - state.enemy.y;
    const dist = Math.hypot(dx, dy);
    const sees = dist < 10.5 && lineOfSight(state.enemy.x, state.enemy.y, state.player.x, state.player.y);
    state.enemy.mode = sees ? "chase" : "patrol";

    if (state.enemy.mode === "chase") {
      const desired = wrapAngle(Math.atan2(dy, dx));
      let delta = wrapAngle(desired - state.enemy.a);
      if (delta > Math.PI) delta -= TAU;
      state.enemy.a = wrapAngle(state.enemy.a + clamp(delta, -TURN * dt, TURN * dt));

      const desiredDist = 3.2;
      const mv = dist > desiredDist ? 1 : dist < 2.3 ? -0.6 : 0;
      if (mv !== 0) {
        const nx = state.enemy.x + Math.cos(state.enemy.a) * mv * MOVE * dt;
        const ny = state.enemy.y + Math.sin(state.enemy.a) * mv * MOVE * dt;
        if (canMoveTo(nx, state.enemy.y, R)) state.enemy.x = nx;
        if (canMoveTo(state.enemy.x, ny, R)) state.enemy.y = ny;
      }

      const facing = (() => {
        let da = Math.abs(wrapAngle(desired - state.enemy.a));
        da = Math.min(da, TAU - da);
        return da;
      })();

      if (dist < 9.5 && facing < 0.35 && state.player.hp > 0) {
        // enemy has wider spread + slower fire rate
        if (state.enemy.fireCd <= 0) state.enemy.fireCd = 0.55;
        if (state.enemy.fireCd <= 0.24) tryShoot(state.enemy, state.player, 8, 0.05);
      }
    } else {
      if (t > state.enemy.wanderT) {
        state.enemy.wanderT = t + 700 + Math.random() * 1100;
        state.enemy.wanderA = wrapAngle(Math.random() * TAU);
      }
      let delta = wrapAngle(state.enemy.wanderA - state.enemy.a);
      if (delta > Math.PI) delta -= TAU;
      state.enemy.a = wrapAngle(state.enemy.a + clamp(delta, -1.8 * dt, 1.8 * dt));

      const nx = state.enemy.x + Math.cos(state.enemy.a) * MOVE * 0.65 * dt;
      const ny = state.enemy.y + Math.sin(state.enemy.a) * MOVE * 0.65 * dt;
      if (canMoveTo(nx, state.enemy.y, R)) state.enemy.x = nx;
      if (canMoveTo(state.enemy.x, ny, R)) state.enemy.y = ny;
    }
  }

  function render() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // sky + floor
    const grdSky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    grdSky.addColorStop(0, "#06070a");
    grdSky.addColorStop(1, "#0b1530");
    ctx.fillStyle = grdSky;
    ctx.fillRect(0, 0, w, h * 0.52);
    ctx.fillStyle = "#06070a";
    ctx.fillRect(0, h * 0.52, w, h * 0.48);

    const fov = Math.PI / 3;
    const rays = Math.floor(Math.min(560, Math.max(220, w)));
    const colW = w / rays;

    // enemy sprite projected later
    const edx = state.enemy.x - state.player.x;
    const edy = state.enemy.y - state.player.y;
    const enemyDist = Math.hypot(edx, edy);
    const enemyAng = wrapAngle(Math.atan2(edy, edx));
    let rel = wrapAngle(enemyAng - state.player.a);
    if (rel > Math.PI) rel -= TAU;

    const enemyVisible =
      state.enemy.hp > 0 &&
      enemyDist < 20 &&
      Math.abs(rel) < fov * 0.6 &&
      lineOfSight(state.player.x, state.player.y, state.enemy.x, state.enemy.y);

    let enemyScreenX = 0;
    let enemySize = 0;
    if (enemyVisible) {
      const proj = (rel / (fov / 2)) * (w / 2);
      enemyScreenX = w / 2 + proj;
      enemySize = clamp((h / (enemyDist + 0.1)) * 0.65, 10, h * 0.85);
    }

    for (let i = 0; i < rays; i++) {
      const x = (i / (rays - 1)) * 2 - 1;
      const ang = wrapAngle(state.player.a + x * (fov / 2));
      const hit = castRay(state.player.x, state.player.y, ang, 40);
      const fish = Math.cos(x * (fov / 2));
      const dist = Math.max(0.001, hit.dist * fish);

      const wallH = clamp(h / dist, 0, h * 1.8);
      const y0 = (h - wallH) / 2;

      let base = "#13214b";
      if (hit.ch === "2") base = "#1a2d52";
      if (hit.ch === "3") base = "#2a1a3d";
      const shade = clamp(1 / (1 + dist * 0.12), 0.08, 1);
      const side = hit.side ? 0.75 : 1;

      ctx.fillStyle = applyShade(base, shade * side);
      ctx.fillRect(i * colW, y0, colW + 1, wallH);

      // simple floor fade
      const fog = clamp(dist / 26, 0, 1);
      ctx.fillStyle = `rgba(6,7,10,${0.35 * fog})`;
      ctx.fillRect(i * colW, y0, colW + 1, wallH);
    }

    // enemy sprite (draw after walls; hides behind walls by depth check)
    if (enemyVisible) {
      const ex = enemyScreenX - enemySize * 0.24;
      const ey = h / 2 - enemySize * 0.45;
      const behindWall = (() => {
        const hit = castRay(state.player.x, state.player.y, enemyAng, 40);
        return hit.hit && hit.dist < enemyDist - 0.08;
      })();

      if (!behindWall) {
        ctx.save();
        ctx.globalAlpha = 0.95;
        // glow
        ctx.fillStyle = "rgba(255,58,87,0.12)";
        ctx.beginPath();
        ctx.ellipse(enemyScreenX, h / 2, enemySize * 0.22, enemySize * 0.35, 0, 0, TAU);
        ctx.fill();
        // body
        ctx.fillStyle = "#ff5a70";
        roundRect(ctx, ex, ey, enemySize * 0.48, enemySize * 0.9, enemySize * 0.18);
        ctx.fill();
        // eye
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(enemyScreenX + enemySize * 0.08, h / 2 - enemySize * 0.12, enemySize * 0.05, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
    }

    // muzzle flash overlay
    if (state.flashT > 0) {
      ctx.fillStyle = `rgba(155,211,255,${clamp(state.flashT / 0.06, 0, 1) * 0.08})`;
      ctx.fillRect(0, 0, w, h);
    }

    // Debug line (helps confirm render + keys)
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(10, h - 34, 420, 22);
    ctx.fillStyle = "#e8eefc";
    ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(
      `running=${state.running}  keys[up=${keys.ArrowUp ? 1 : 0} left=${keys.ArrowLeft ? 1 : 0} right=${keys.ArrowRight ? 1 : 0} space=${keys.Space ? 1 : 0}]  player=(${state.player.x.toFixed(
        2
      )},${state.player.y.toFixed(2)})`,
      16,
      h - 18
    );
  }

  function applyShade(hex, s) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const rr = Math.round(r * s);
    const gg = Math.round(g * s);
    const bb = Math.round(b * s);
    return `rgb(${rr},${gg},${bb})`;
  }

  function roundRect(c, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }

  function updateOverlayWinLose() {
    if (state.player.hp <= 0) {
      state.running = false;
      ui.overlay?.classList.remove("hidden");
      setOverlayText("You lost", "Press <b>R</b> to restart.<br/>Arrow keys move/turn • Space shoots.");
    } else if (state.enemy.hp <= 0) {
      state.running = false;
      ui.overlay?.classList.remove("hidden");
      setOverlayText("You win", "Press <b>R</b> to restart.<br/>Arrow keys move/turn • Space shoots.");
    }
  }

  function tick(now) {
    requestAnimationFrame(tick);
    const dt = clamp((now - state.lastT) / 1000, 0, 0.05);
    state.lastT = now;

    state.player.fireCd = Math.max(0, state.player.fireCd - dt);
    state.enemy.fireCd = Math.max(0, state.enemy.fireCd - dt);
    state.flashT = Math.max(0, state.flashT - dt);

    if (state.running) {
      updatePlayer(dt);
      updateEnemy(dt, now);
      updateOverlayWinLose();
    }

    updateHUD();
    render();
  }

  function initDom() {
    ui.overlay = document.getElementById("overlay");
    ui.startBtn = document.getElementById("startBtn");
    ui.enemyHp = document.getElementById("enemyHp");
    ui.playerHp = document.getElementById("playerHp");

    ui.startBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      start();
    });
    ui.overlay?.addEventListener("click", () => start());

    window.addEventListener("keydown", (e) => setKey(e, true));
    window.addEventListener("keyup", (e) => setKey(e, false));
    window.addEventListener("resize", resize);

    resize();
    updateHUD();
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDom);
  } else {
    initDom();
  }
})();

