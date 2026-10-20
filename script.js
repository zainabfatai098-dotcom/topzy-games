let isSignup = false;

function toggleAuth() {
  isSignup = !isSignup;
  document.getElementById('auth-title').textContent = isSignup ? 'Create Account' : 'Log In';
  document.getElementById('auth-btn').textContent = isSignup ? 'Sign Up' : 'Log In';
  document.getElementById('switch-text').textContent = isSignup 
    ? 'Already have an account? Log In' 
    : "Don't have an account? Sign Up";
}

function handleAuth() {
  const email = document.getElementById('email').value.trim().toLowerCase();
  const pass = document.getElementById('password').value;
  if (!email.includes('@') || !email.includes('.')) return alert('Enter a valid email');
  if (pass.length < 4) return alert('Password must be at least 4 characters');

  let users = JSON.parse(localStorage.getItem('topzyUsers') || '{}');

  if (isSignup) {
    if (users[email]) return alert('Email already registered. Please log in.');
    users[email] = pass;
    localStorage.setItem('topzyUsers', JSON.stringify(users));
    localStorage.setItem('topzyCurrent', email);
    alert('Account created!');
    enterApp(email);
  } else {
    if (users[email] === pass) {
      localStorage.setItem('topzyCurrent', email);
      enterApp(email);
    } else {
      alert('Wrong email or password');
    }
  }
}

function enterApp(email) {
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('welcome').textContent = email.split('@')[0];
  renderGames();
}

function logout() {
  if (confirm('Are you sure you want to log out?')) {
    localStorage.removeItem('topzyCurrent');
    location.reload();
  }
}

const cur = localStorage.getItem('topzyCurrent');
if (cur) enterApp(cur);

const games = [
  { id: 'sliding', name: 'Sliding Puzzle', icon: '🧩' },
  { id: 'memory', name: 'Memory Match', icon: '🧠' },
  { id: 'sudoku', name: 'Sudoku', icon: '🔢' },
  { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: '❌' },
  { id: 'guess', name: 'Number Guess', icon: '🎯' },
  { id: 'mole', name: 'Whack-a-Mole', icon: '🔨' },
  { id: 'balloon', name: 'Balloon Pop', icon: '🎈' },
  { id: 'tetris', name: 'Tetris', icon: '🟦' },
  { id: 'speed', name: 'Speed Tap', icon: '👆' },
  { id: 'carrace', name: 'Car Race', icon: '🏎️' }
];

function renderGames() {
  document.getElementById('game-select').innerHTML = games.map(g => `
    <div class="card" onclick="play('${g.id}')">
      <div class="icon">${g.icon}</div>
      <div class="name">${g.name}</div>
    </div>`).join('');
}

function back() {
  document.getElementById('game-select').style.display = 'grid';
  document.getElementById('area').classList.remove('active');
}

function play(id) {
  document.getElementById('game-select').style.display = 'none';
  document.getElementById('area').classList.add('active');
  const box = document.getElementById('game-content');
  const loaders = {
    sliding: loadSliding,
    memory: loadMemory,
    sudoku: loadSudoku,
    tictactoe: loadTTT,
    guess: loadGuess,
    mole: loadMole,
    balloon: loadBalloon,
    tetris: loadTetris,
    speed: loadSpeed,
    carrace: loadCarRace
  };
  if (loaders[id]) loaders[id](box);
}

function loadSliding(c) {
  c.innerHTML = `<div class="gc"><h2>Sliding Puzzle</h2><div class="controls"><button class="btn" onclick="sh()">Shuffle</button><span id="mv">Moves: 0</span></div><div id="sb" class="gb" style="grid-template-columns:repeat(4,68px)"></div></div>`;
  let t = [...Array(15).keys()].map(i => i + 1).concat(null);
  let e = 15, m = 0;
  const render = () => {
    const b = document.getElementById('sb');
    b.innerHTML = '';
    t.forEach((n, i) => {
      const d = document.createElement('div');
      d.className = 'cell';
      d.style.cssText = 'width:68px;height:68px;font-size:1.5rem';
      d.textContent = n || '';
      if (n) d.onclick = () => move(i);
      b.appendChild(d);
    });
  };
  const move = i => {
    const r = Math.floor(i / 4), col = i % 4;
    const er = Math.floor(e / 4), ec = e % 4;
    if (Math.abs(r - er) + Math.abs(col - ec) !== 1) return;
    [t[i], t[e]] = [t[e], t[i]];
    e = i; m++;
    document.getElementById('mv').textContent = 'Moves: ' + m;
    render();
  };
  window.sh = () => {
    for (let k = 0; k < 120; k++) {
      const neigh = [];
      const r = Math.floor(e / 4), col = e % 4;
      if (r > 0) neigh.push(e - 4);
      if (r < 3) neigh.push(e + 4);
      if (col > 0) neigh.push(e - 1);
      if (col < 3) neigh.push(e + 1);
      const x = neigh[Math.floor(Math.random() * neigh.length)];
      [t[x], t[e]] = [t[e], t[x]];
      e = x;
    }
    m = 0;
    render();
  };
  window.sh();
}

function loadMemory(c) {
  c.innerHTML = `<div class="gc"><h2>Memory Match</h2><div class="controls"><button class="btn" onclick="nm()">New Game</button><span id="ms">0/8</span></div><div id="mb" class="gb" style="grid-template-columns:repeat(4,75px)"></div></div>`;
  const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
  window.nm = () => {
    let cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flipped = [], matched = 0, lock = false;
    document.getElementById('ms').textContent = '0/8';
    const board = document.getElementById('mb');
    board.innerHTML = '';
    cards.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'cell';
      card.style.cssText = 'width:75px;height:75px;font-size:1.8rem';
      card.innerHTML = `<span style="display:none">${emoji}</span>`;
      card.onclick = () => {
        if (lock || flipped.includes(i)) return;
        card.querySelector('span').style.display = 'block';
        flipped.push(i);
        if (flipped.length === 2) {
          lock = true;
          const [a, b] = flipped;
          if (cards[a] === cards[b]) {
            matched++;
            document.getElementById('ms').textContent = matched + '/8';
            flipped = []; lock = false;
          } else {
            setTimeout(() => {
              [a, b].forEach(x => {
                document.getElementById('mb').children[x].querySelector('span').style.display = 'none';
              });
              flipped = []; lock = false;
            }, 600);
          }
        }
      };
      board.appendChild(card);
    });
  };
  window.nm();
}

function loadSudoku(c) {
  c.innerHTML = `<div class="gc"><h2>Sudoku</h2><p style="margin:20px">Full Sudoku coming later.</p></div>`;
}

function loadTTT(c) {
  c.innerHTML = `<div class="gc"><h2>Tic-Tac-Toe</h2><div class="controls"><button class="btn" onclick="rt()">New Game</button><span id="ts">X's turn</span></div><div id="tb" class="gb" style="grid-template-columns:repeat(3,75px)"></div></div>`;
  let cells = Array(9).fill('');
  let turn = 'X', done = false;
  const render = () => {
    const b = document.getElementById('tb');
    b.innerHTML = '';
    cells.forEach((v, i) => {
      const d = document.createElement('div');
      d.className = 'cell';
      d.style.cssText = 'width:75px;height:75px;font-size:1.8rem';
      d.textContent = v;
      d.onclick = () => {
        if (!v && !done) {
          cells[i] = turn;
          turn = turn === 'X' ? 'O' : 'X';
          document.getElementById('ts').textContent = turn + "'s turn";
          render();
          check();
        }
      };
      b.appendChild(d);
    });
  };
  const check = () => {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    if (wins.some(p => cells[p[0]] && cells[p[0]] === cells[p[1]] && cells[p[1]] === cells[p[2]])) {
      document.getElementById('ts').textContent = (turn === 'X' ? 'O' : 'X') + ' wins!';
      done = true;
    } else if (cells.every(x => x)) {
      document.getElementById('ts').textContent = 'Draw';
      done = true;
    }
  };
  window.rt = () => {
    cells = Array(9).fill('');
    turn = 'X'; done = false;
    document.getElementById('ts').textContent = "X's turn";
    render();
  };
  window.rt();
}

function loadGuess(c) {
  c.innerHTML = `<div class="gc"><h2>Number Guess</h2><p>Guess a number 1–100</p><input id="gi" type="number" style="padding:8px;width:90px;margin:10px;text-align:center"><button class="btn" onclick="gg()">Guess</button><p id="gm" class="msg"></p><button class="btn" onclick="gn()">New Number</button></div>`;
  let secret = Math.floor(Math.random() * 100) + 1;
  window.gg = () => {
    const v = +document.getElementById('gi').value;
    const msg = document.getElementById('gm');
    if (v === secret) msg.textContent = '🎉 Correct!';
    else if (v < secret) msg.textContent = 'Too low';
    else msg.textContent = 'Too high';
  };
  window.gn = () => {
    secret = Math.floor(Math.random() * 100) + 1;
    document.getElementById('gm').textContent = 'New number ready!';
  };
}

function loadMole(c) {
  c.innerHTML = `
    <div class="gc">
      <h2>Whack-a-Mole</h2>
      <div class="controls">
        <button class="btn" onclick="startMole()">Start</button>
        <span id="mscore">Score: 0</span>
      </div>
      <div id="mole-grid" style="display:grid;grid-template-columns:repeat(3,90px);gap:12px;margin:16px auto;justify-content:center"></div>
      <p id="mmsg" class="msg"></p>
    </div>`;

  let score = 0, running = false, interval;
  const holes = 9;

  window.startMole = () => {
    if (running) return;
    running = true;
    score = 0;
    document.getElementById('mscore').textContent = 'Score: 0';
    document.getElementById('mmsg').textContent = '';
    const grid = document.getElementById('mole-grid');
    grid.innerHTML = '';
    for (let i = 0; i < holes; i++) {
      const hole = document.createElement('div');
      hole.style.cssText = 'width:90px;height:90px;background:#2a2a3a;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;cursor:pointer';
      hole.onclick = () => {
        if (hole.textContent === '🐹') {
          score += 10;
          document.getElementById('mscore').textContent = 'Score: ' + score;
          hole.textContent = '';
        }
      };
      grid.appendChild(hole);
    }

    function pop() {
      if (!running) return;
      const cells = grid.children;
      Array.from(cells).forEach(cell => cell.textContent = '');
      const idx = Math.floor(Math.random() * holes);
      cells[idx].textContent = '🐹';
      setTimeout(() => { if (cells[idx].textContent === '🐹') cells[idx].textContent = ''; }, 800);
    }

    interval = setInterval(pop, 900);
    setTimeout(() => {
      running = false;
      clearInterval(interval);
      document.getElementById('mmsg').textContent = 'Time up! Final score: ' + score;
    }, 20000);
  };
}

function loadBalloon(c) {
  c.innerHTML = `<div class="gc"><h2>Balloon Pop</h2><div class="controls"><button class="btn" onclick="startBalloons()">Start</button><span id="bscore">Score: 0</span></div><div id="balloon-area" style="position:relative;height:320px;background:#1a1a2e;border-radius:12px;overflow:hidden;margin:12px auto;max-width:420px"></div><p id="bmsg" class="msg"></p></div>`;
  let score = 0, running = false, interval;
  window.startBalloons = () => {
    if (running) return;
    running = true;
    score = 0;
    document.getElementById('bscore').textContent = 'Score: 0';
    document.getElementById('bmsg').textContent = '';
    const area = document.getElementById('balloon-area');
    area.innerHTML = '';
    function spawn() {
      if (!running) return;
      const balloon = document.createElement('div');
      balloon.textContent = '🎈';
      balloon.style.cssText = `position:absolute;font-size:2.8rem;left:${Math.random() * 75}%;top:${Math.random() * 65}%;cursor:pointer;user-select:none`;
      balloon.onclick = () => {
        score += 10;
        document.getElementById('bscore').textContent = 'Score: ' + score;
        balloon.remove();
      };
      area.appendChild(balloon);
      setTimeout(() => balloon.remove(), 1600);
    }
    interval = setInterval(spawn, 650);
    setTimeout(() => {
      running = false;
      clearInterval(interval);
      document.getElementById('bmsg').textContent = 'Time up! Final score: ' + score;
    }, 20000);
  };
}

function loadTetris(c) {
  c.innerHTML = `
    <div class="gc">
      <h2>Tetris</h2>
      <div class="controls">
        <button class="btn" onclick="startTetris()">Start / Restart</button>
        <span id="tscore">Score: 0</span>
      </div>
      <canvas id="tetris" width="240" height="480" style="background:#0a0a12;border:3px solid #333;border-radius:8px;margin:10px auto;display:block"></canvas>
      <p id="tmsg" class="msg"></p>
      <p style="color:#a0a0b0;margin-top:8px">← → Move &nbsp; ↓ Drop &nbsp; ↑ Rotate</p>
    </div>`;

  const canvas = document.getElementById('tetris');
  const ctx = canvas.getContext('2d');
  const COLS = 10, ROWS = 20, BLOCK = 24;
  let grid, current, score = 0, gameLoop, playing = false;

  const pieces = [
    { shape: [[1,1,1,1]], color: '#00f0f0' },
    { shape: [[1,1],[1,1]], color: '#f0f000' },
    { shape: [[0,1,0],[1,1,1]], color: '#a000f0' },
    { shape: [[1,0,0],[1,1,1]], color: '#f0a000' },
    { shape: [[0,0,1],[1,1,1]], color: '#0000f0' },
    { shape: [[0,1,1],[1,1,0]], color: '#00f000' },
    { shape: [[1,1,0],[0,1,1]], color: '#f00000' }
  ];

  function reset() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    score = 0;
    document.getElementById('tscore').textContent = 'Score: 0';
    document.getElementById('tmsg').textContent = '';
    spawn();
  }

  function spawn() {
    const p = pieces[Math.floor(Math.random() * pieces.length)];
    current = {
      shape: p.shape.map(row => [...row]),
      color: p.color,
      x: Math.floor(COLS / 2) - 1,
      y: 0
    };
    if (collides()) {
      playing = false;
      clearInterval(gameLoop);
      document.getElementById('tmsg').textContent = 'Game Over! Score: ' + score;
    }
  }

  function collides(dx = 0, dy = 0, shape = current.shape) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const nx = current.x + x + dx;
          const ny = current.y + y + dy;
          if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && grid[ny][nx])) return true;
        }
      }
    }
    return false;
  }

  function lock() {
    current.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val && current.y + y >= 0) {
          grid[current.y + y][current.x + x] = current.color;
        }
      });
    });
    clearLines();
    spawn();
  }

  function clearLines() {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r].every(cell => cell)) {
        grid.splice(r, 1);
        grid.unshift(Array(COLS).fill(null));
        cleared++;
        r++;
      }
    }
    if (cleared) {
      score += cleared * 100 * cleared;
      document.getElementById('tscore').textContent = 'Score: ' + score;
    }
  }

  function rotate() {
    const rotated = current.shape[0].map((_, i) => current.shape.map(row => row[i]).reverse());
    if (!collides(0, 0, rotated)) current.shape = rotated;
  }

  function draw() {
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = grid[r][c];
          ctx.fillRect(c * BLOCK, r * BLOCK, BLOCK - 1, BLOCK - 1);
        }
      }
    }
    if (current) {
      ctx.fillStyle = current.color;
      current.shape.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val) {
            ctx.fillRect((current.x + x) * BLOCK, (current.y + y) * BLOCK, BLOCK - 1, BLOCK - 1);
          }
        });
      });
    }
  }

  function tick() {
    if (!playing) return;
    if (!collides(0, 1)) {
      current.y++;
    } else {
      lock();
    }
    draw();
  }

  window.startTetris = () => {
    clearInterval(gameLoop);
    playing = true;
    reset();
    gameLoop = setInterval(tick, 500);
    draw();
  };

  document.onkeydown = (e) => {
    if (!playing) return;
    if (e.key === 'ArrowLeft' && !collides(-1, 0)) current.x--;
    if (e.key === 'ArrowRight' && !collides(1, 0)) current.x++;
    if (e.key === 'ArrowDown' && !collides(0, 1)) current.y++;
    if (e.key === 'ArrowUp') rotate();
    draw();
  };
}

function loadSpeed(c) {
  c.innerHTML = `<div class="gc"><h2>Speed Tap</h2><div class="controls"><button class="btn" onclick="startSpeed()">Start (10s)</button><span id="sscore">Clicks: 0</span></div><div id="speed-btn" style="width:180px;height:180px;margin:20px auto;background:#7c5cfc;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:700;cursor:pointer;user-select:none">TAP</div><p id="smsg" class="msg"></p></div>`;
  let clicks = 0, running = false;
  window.startSpeed = () => {
    if (running) return;
    running = true;
    clicks = 0;
    document.getElementById('sscore').textContent = 'Clicks: 0';
    document.getElementById('smsg').textContent = 'Go!';
    const btn = document.getElementById('speed-btn');
    btn.onclick = () => {
      if (!running) return;
      clicks++;
      document.getElementById('sscore').textContent = 'Clicks: ' + clicks;
    };
    setTimeout(() => {
      running = false;
      btn.onclick = null;
      document.getElementById('smsg').textContent = `Time up! You got ${clicks} clicks.`;
    }, 10000);
  };
}

function loadCarRace(c) {
  c.innerHTML = `<div class="gc"><h2>Car Race</h2><div class="controls"><button class="btn" onclick="sr()">Start Race</button><span id="rs">Score: 0</span></div><canvas id="rc" width="280" height="400" style="background:#111827;border-radius:12px;display:block;margin:12px auto"></canvas><p id="rmsg" class="msg"></p><p style="color:#a0a0b0;margin-top:8px">Use ← → arrow keys to move</p></div>`;
  const canvas = document.getElementById('rc');
  const ctx = canvas.getContext('2d');
  let playerX = 120, score = 0, obstacles = [], running = false, speed = 4;
  const cars = ['🚗','🚙','🚕','🚓'];

  function draw() {
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 280, 400);
    ctx.strokeStyle = '#4b5563';
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(140, 0);
    ctx.lineTo(140, 400);
    ctx.stroke();
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏎️', playerX + 20, 360);
    obstacles.forEach(o => {
      ctx.font = '32px serif';
      ctx.fillText(cars[o.type], o.x + 18, o.y + 30);
    });
  }

  function loop() {
    if (!running) return;
    obstacles.forEach(o => o.y += speed);
    obstacles = obstacles.filter(o => o.y < 420);
    if (Math.random() < 0.03) {
      obstacles.push({ x: Math.random() < 0.5 ? 50 : 190, y: -50, type: Math.floor(Math.random() * 4) });
    }
    for (let o of obstacles) {
      if (o.y > 310 && Math.abs(o.x - playerX) < 40) {
        running = false;
        document.getElementById('rmsg').textContent = 'Crashed! Score: ' + score;
        return;
      }
    }
    score++;
    document.getElementById('rs').textContent = 'Score: ' + score;
    if (score % 180 === 0) speed += 0.5;
    draw();
    requestAnimationFrame(loop);
  }

  window.sr = () => {
    playerX = 120; score = 0; obstacles = []; speed = 4; running = true;
    document.getElementById('rmsg').textContent = '';
    loop();
  };

  document.onkeydown = (e) => {
    if (!running) return;
    if (e.key === 'ArrowLeft' && playerX > 25) playerX -= 20;
    if (e.key === 'ArrowRight' && playerX < 215) playerX += 20;
  };
  draw();
}