(function () {
  'use strict';

  /* ── DATA ─────────────────────────────────────────────────── */

  const MEMORIES = [
    {
      title: 'THE FIRST FALL',
      era: '1971 · BEFORE THE NAME',
      seed: 'WHERE IT\nGOES QUIET',
      seeded: true,
      outer: {
        roles: ['THE NOBLE', 'THE DISOWNED', 'THE CHOSEN'],
        decode: 'A grandson is announced. The throne room waits. Andriantsimihetry — the one who does not come down — sits elevated, backlit, face in shadow.'
      },
      inner: {
        roles: ['THE NOBLE'],
        decode: 'He grips the armrest. Not a miracle — contamination. Olona maloto. The line must stay pure even if the man breaks.'
      },
      line: 'The one who does not come down sat in the chair that made him a god to his own fear.'
    },
    {
      title: 'TONGA LE BOAY KELIKO',
      era: '1971 · THE ANNOUNCEMENT',
      seed: 'THE MIRACLE\nREFUSED',
      seeded: true,
      outer: {
        roles: ['THE DISOWNED', 'THE CHOSEN', 'NIRINA'],
        decode: 'Désiré enters with Hanta and the baby Nirina. Hope in uniform. A flight attendant bringing a grandson to a father who built walls against love.'
      },
      inner: {
        roles: ['THE DISOWNED'],
        decode: 'He thought a grandson would rewrite the ledger. How could a grandfather refuse a grandson? He did not know the cage was older than blood.'
      },
      line: 'Your grandson has arrived — and the silence after the phrase was the answer.'
    },
    {
      title: 'NAHETRY RAZANA',
      era: '1971 · THE WORD',
      seed: 'ANCESTORS\nINVOKED',
      seeded: true,
      outer: {
        roles: ['THE NOBLE', 'THE DISOWNED'],
        decode: 'The mouth moves. Rage without volume in the archive — you lowered the ancestors. Andevo blood in the lineage. The tomb door closes on the living.'
      },
      inner: {
        roles: ['THE NOBLE'],
        decode: 'Nahetry razana — you have lowered the ancestors. The words are weapons forged centuries before he was born. He fires them and calls it duty.'
      },
      line: 'He destroyed his family to keep his height — and called it honoring the dead.'
    },
    {
      title: 'THE DOOR',
      era: '1971 · AFTER',
      seed: 'DISOWNED\nSEALED',
      seeded: false,
      outer: {
        roles: ['THE DISOWNED', 'THE CHOSEN', 'THE WITNESS'],
        decode: 'They leave. The door closes. Young Naivo watches from the hall — body storing what the mind cannot yet name. Rejection of mother. Rejection of self.'
      },
      inner: {
        roles: ['THE WITNESS'],
        decode: 'The child sees the door shut. He does not understand fully. But his body keeps the record. Proof someone saw. Proof it happened.'
      },
      line: 'The son disappeared the moment the grandson was announced.'
    },
    {
      title: 'OLONA MALOTO',
      era: '1971 · THE SYSTEM',
      seed: 'PURE\nORIGINS',
      seeded: false,
      outer: {
        roles: ['THE NOBLE', 'HIGHLAND CASTE'],
        decode: 'Impure blood. The Merina caste system — andriana, hova, andevo — predates the French by centuries. Slaves denied tombs. Hereditary spiritual exclusion.'
      },
      inner: {
        roles: ['THE NOBLE'],
        decode: 'He believes he protects a people from disappearing. The preservation instinct is real. The cruelty is a choice. He chose the cage.'
      },
      line: 'Andevo have no tombs — so he made his son a ghost while still breathing.'
    },
    {
      title: 'INTO THE BOTTLE',
      era: '1971 · THE FALL',
      seed: 'HEIGHT\nLOST',
      seeded: false,
      outer: {
        roles: ['THE NOBLE'],
        decode: 'Alone in the chair. Bottle in hand. The one who would not come down came down into alcohol, silence, the slow erasure of a man who chose walls over grandchildren.'
      },
      inner: {
        roles: ['THE NOBLE'],
        decode: 'The fall is not repentance. The disownment stands. He drinks to survive what he carries — the cage does not kill outright; it makes you kill yourself slowly.'
      },
      line: 'The chair empties. A dark puddle beneath. He fell. The bias never did.'
    },
    {
      title: 'LOOP SEEDED',
      era: '1971 → ALL YESTERDAYS',
      seed: 'MVT II\nTODAY',
      seeded: true,
      outer: {
        roles: ['THE CHAIN', 'ALL GENERATIONS'],
        decode: 'Tomorrow becomes the next yesterday. The door he builds is the door his children walk through. 1993. 2007. 2025. Same wound. Different decade.'
      },
      inner: {
        roles: ['YOU', 'THE BEAUTIFUL'],
        decode: 'The chain installed. You inherit the map and the wound. Movement II waits — but first you name what was handed down.'
      },
      line: 'The loop is seeded. The next movement is already recording.'
    }
  ];

  const CHARACTERS = [
    {
      id: 'noble',
      num: 1,
      p: 'P1',
      name: 'THE NOBLE',
      short: 'NOBLE',
      hands: 'Andriantsimihetry — the one who does not come down. He held the height until the height held him.',
      tags: ['1971', 'ANDRIANA', 'THE FALL'],
      color: '#1a1208'
    },
    {
      id: 'disowned',
      num: 2,
      p: 'P2',
      name: 'THE DISOWNED',
      short: 'DISOWNED',
      hands: 'Uncle Désiré. Chose love anyway. Brought the baby. Watched the door close.',
      tags: ['1971', 'ANDEVO', 'SURVIVED'],
      color: '#0a1420'
    },
    {
      id: 'chosen',
      num: 3,
      p: 'P3',
      name: 'THE CHOSEN',
      short: 'CHOSEN',
      hands: 'Hanta. Beside him when the throne turned away. The one they called impure.',
      tags: ['1971', 'ANDEVO', 'MOTHER'],
      color: '#140a18'
    },
    {
      id: 'witness',
      num: 4,
      p: 'P4',
      name: 'THE WITNESS',
      short: 'WITNESS',
      hands: 'Cousin Naivo. Saw 1971 happen to his father. Body stored what the mind could not name.',
      tags: ['1971', 'CHILD', 'PROOF'],
      color: '#081410'
    },
    {
      id: 'son',
      num: 5,
      p: 'P5',
      name: 'THE SON',
      short: 'SON',
      hands: 'Your father. Young in 1971 — already inside the system, already learning the script.',
      tags: ['1971', 'HEIR LINE', 'NEXT'],
      color: '#101008'
    },
    {
      id: 'doctor',
      num: 6,
      p: 'P6',
      name: 'THE DOCTOR',
      short: 'DOCTOR',
      hands: 'Your mother. Not yet fallen — but the seed is in the soil. Three doctorates ahead of her.',
      tags: ['BEFORE', 'BRILLIANCE', 'SEED'],
      color: '#0c1014'
    }
  ];

  /* ── STATE ──────────────────────────────────────────────────── */

  let charIdx = 0;
  let memIdx = 0;
  let channel = 'outer';
  let order = 'remembered';
  let visited = new Set();
  let tcTimer = null;
  let tcRunning = false;
  let frame = 0;
  let tcBase = { h: 0, m: 0, s: 0, f: 0 };

  /* ── DOM ────────────────────────────────────────────────────── */

  const $ = (id) => document.getElementById(id);

  const els = {
    charSelect: $('charSelect'),
    crt: $('crt'),
    roster: $('roster'),
    fWatermark: $('fWatermark'),
    fPortrait: $('fPortrait'),
    fP1: $('fP1'),
    fName: $('fName'),
    fHands: $('fHands'),
    fTags: $('fTags'),
    csEnter: $('csEnter'),
    ring: $('ring'),
    coreSeed: $('coreSeed'),
    roChannel: $('roChannel'),
    roFrag: $('roFrag'),
    roEra: $('roEra'),
    roRoles: $('roRoles'),
    roDecode: $('roDecode'),
    roSeed: $('roSeed'),
    roSeedTxt: $('roSeedTxt'),
    tcYr: $('tcYr'),
    tcIdx: $('tcIdx'),
    tcTitle: $('tcTitle'),
    tcLine: $('tcLine'),
    masterTc: $('masterTc'),
    wsegs: $('wsegs'),
    wcount: $('wcount'),
    orderNote: $('orderNote'),
    score: $('score'),
    orbit: $('orbit')
  };

  /* ── HELPERS ────────────────────────────────────────────────── */

  function memoriesForChar() {
    const list = MEMORIES.slice();
    if (order === 'received') list.reverse();
    return list;
  }

  function currentMem() {
    return memoriesForChar()[memIdx];
  }

  function channelView(mem) {
    return mem[channel === 'inner' ? 'inner' : 'outer'];
  }

  function fmtTc() {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(tcBase.h)}:${pad(tcBase.m)}:${pad(tcBase.s)}:${pad(tcBase.f)}`;
  }

  function tickTc() {
    tcBase.f++;
    if (tcBase.f >= 24) { tcBase.f = 0; tcBase.s++; }
    if (tcBase.s >= 60) { tcBase.s = 0; tcBase.m++; }
    if (tcBase.m >= 60) { tcBase.m = 0; tcBase.h++; }
    els.masterTc.textContent = fmtTc();
  }

  function typeLine(text) {
    clearTimeout(tcTimer);
    tcRunning = true;
    els.tcLine.textContent = '';
    let i = 0;
    const step = () => {
      if (i <= text.length) {
        els.tcLine.textContent = text.slice(0, i);
        i++;
        tcTimer = setTimeout(step, 22 + Math.random() * 18);
      } else {
        tcRunning = false;
      }
    };
    step();
  }

  function updateChainMeter() {
    const segs = els.wsegs.querySelectorAll('i');
    const count = visited.size;
    segs.forEach((seg, i) => seg.classList.toggle('lit', i < count));
    els.wcount.textContent = `${count}/6`;
  }

  /* ── ROSTER / CHARACTER SELECT ──────────────────────────────── */

  function renderRoster() {
    els.roster.innerHTML = '';
    CHARACTERS.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (i === charIdx ? ' on' : '');
      btn.innerHTML = `<span class="num">${c.num}</span><span class="lbl">${c.short}</span>`;
      btn.addEventListener('click', () => selectChar(i));
      els.roster.appendChild(btn);
    });
  }

  function selectChar(i) {
    charIdx = (i + CHARACTERS.length) % CHARACTERS.length;
    const c = CHARACTERS[charIdx];
    els.fWatermark.textContent = c.num;
    els.fPortrait.style.background = `linear-gradient(180deg, ${c.color} 0%, #020604 100%)`;
    els.fP1.textContent = c.p;
    els.fName.textContent = c.name;
    els.fHands.textContent = c.hands;
    els.fTags.innerHTML = c.tags.map((t) => `<span>${t}</span>`).join('');
    renderRoster();
  }

  /* ── ORBIT NODES ────────────────────────────────────────────── */

  function buildNodes() {
    els.ring.querySelectorAll('.node').forEach((n) => n.remove());
    const mems = memoriesForChar();
    const count = mems.length;
    const r = parseFloat(getComputedStyle(els.ring).getPropertyValue('--r')) || 178;

    mems.forEach((mem, i) => {
      const angle = (360 / count) * i - 90;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'node' + (i === memIdx ? ' on' : '') + (visited.has(i) ? ' visited' : '');
      btn.style.setProperty('--angle', angle + 'deg');
      btn.style.setProperty('--r', r);
      btn.innerHTML = `<span class="dot" data-n="${i + 1}"></span>`;
      btn.addEventListener('click', () => goMem(i));
      els.ring.appendChild(btn);
    });
  }

  /* ── MEMORY VIEW ────────────────────────────────────────────── */

  function goMem(i) {
    memIdx = Math.max(0, Math.min(memoriesForChar().length - 1, i));
    visited.add(memIdx);
    renderMemory();
    buildNodes();
    updateChainMeter();
  }

  function renderMemory() {
    const mem = currentMem();
    const view = channelView(mem);
    const total = memoriesForChar().length;

    els.roChannel.textContent = channel === 'inner' ? 'INSIDE HIM' : 'THE WORLD';
    els.roFrag.textContent = `${memIdx + 1} / ${total}`;
    els.roEra.textContent = mem.era;
    els.roRoles.innerHTML = view.roles.map((r) => `<span>${r}</span>`).join('');
    els.roDecode.textContent = view.decode;
    els.coreSeed.innerHTML = mem.seed.replace(/\n/g, '<br>');

    els.roSeed.classList.toggle('lit', mem.seeded);
    els.roSeedTxt.textContent = mem.seeded ? 'SEEDED' : 'DORMANT';

    els.tcYr.textContent = mem.era;
    els.tcIdx.textContent = `MEMORY ${memIdx + 1} OF ${total}`;
    els.tcTitle.textContent = mem.title;
    typeLine(mem.line);

    els.ring.classList.toggle('active', true);
  }

  /* ── CRT ENTER / EXIT ───────────────────────────────────────── */

  function enterCrt() {
    els.charSelect.classList.add('off');
    els.crt.classList.add('on', 'power-on');
    memIdx = 0;
    visited = new Set([0]);
    buildNodes();
    renderMemory();
    updateChainMeter();
    setTimeout(() => els.crt.classList.remove('power-on'), 700);
    initThree();
  }

  function exitToRoster() {
    els.crt.classList.remove('on');
    els.charSelect.classList.remove('off');
  }

  /* ── CONTROLS ───────────────────────────────────────────────── */

  function setChannel(ch) {
    channel = ch;
    document.body.dataset.channel = ch;
    $('chOuter').classList.toggle('on', ch === 'outer');
    $('chInner').classList.toggle('on', ch === 'inner');
    renderMemory();
  }

  function setOrder(ord) {
    order = ord;
    $('ordRemembered').setAttribute('aria-pressed', ord === 'remembered');
    $('ordReceived').setAttribute('aria-pressed', ord === 'received');
    els.orderNote.textContent = ord === 'remembered' ? 'how memory surfaces' : 'how inheritance arrives';
    memIdx = 0;
    visited = new Set([0]);
    buildNodes();
    renderMemory();
    updateChainMeter();
  }

  function bindControls() {
    els.csEnter.addEventListener('click', enterCrt);
    $('rosterBtn').addEventListener('click', exitToRoster);
    $('jogPrev').addEventListener('click', () => goMem(memIdx - 1));
    $('jogNext').addEventListener('click', () => goMem(memIdx + 1));
    $('chOuter').addEventListener('click', () => setChannel('outer'));
    $('chInner').addEventListener('click', () => setChannel('inner'));
    $('ordRemembered').addEventListener('click', () => setOrder('remembered'));
    $('ordReceived').addEventListener('click', () => setOrder('received'));

    els.score.addEventListener('click', () => {
      els.score.classList.toggle('playing');
    });

    document.addEventListener('keydown', (e) => {
      if (!els.charSelect.classList.contains('off')) {
        if (e.key === 'ArrowRight') { e.preventDefault(); selectChar(charIdx + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); selectChar(charIdx - 1); }
        if (e.key === 'Enter') { e.preventDefault(); enterCrt(); }
        return;
      }
      if (e.key === 'ArrowRight') { e.preventDefault(); goMem(memIdx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goMem(memIdx - 1); }
      if (e.key === 'o' || e.key === 'O') setChannel('outer');
      if (e.key === 'i' || e.key === 'I') setChannel('inner');
      if (e.key === 'Escape') exitToRoster();
    });
  }

  /* ── THREE.JS AMBIENT FIELD ─────────────────────────────────── */

  let threeRenderer = null;

  function initThree() {
    if (threeRenderer || typeof THREE === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:.12;pointer-events:none;';
    els.orbit.prepend(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 4;

    const geo = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i < 400; i++) {
      pts.push(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));

    const mat = new THREE.PointsMaterial({ color: 0x39ff7a, size: 0.02, transparent: true, opacity: 0.6 });
    const cloud = new THREE.Points(geo, mat);
    scene.add(cloud);

    threeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function resize() {
      const w = els.orbit.clientWidth;
      const h = els.orbit.clientHeight;
      threeRenderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function animate() {
      frame++;
      cloud.rotation.y = frame * 0.0004;
      cloud.rotation.x = frame * 0.00015;
      threeRenderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();
  }

  /* ── LOOP ───────────────────────────────────────────────────── */

  function loop() {
    if (els.crt.classList.contains('on')) tickTc();
    requestAnimationFrame(loop);
  }

  /* ── INIT ───────────────────────────────────────────────────── */

  function init() {
    selectChar(0);
    bindControls();
    loop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
