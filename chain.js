/* ============================================================
   THE CHAIN — Movement I · Yesterday
   Green Videonics CG build. Orbit engine.

   Seven fragments orbit a glowing core. Selecting a node rotates
   the ring to bring it front. Two channels recolour the suite:
   OUTER (green, the code) / INNER (red, the guard). Order toggles
   the orbit between AS REMEMBERED (scrambled) and AS RECEIVED
   (the chain's true sequence). Agency withheld: witness only.
   ============================================================ */
(function () {
  "use strict";

  var STORE = "thechain_mvt1_green_v1";
  var SCORE_CUE = [
    { label: "HAIZINA", page: "https://soundcloud.com/parkdl/haizina-drum-bass-piano/s-hPaOloeJk62", api: "https://api.soundcloud.com/tracks/2246396927", secret: "s-hPaOloeJk62" },
    { label: "THE STAIRS", page: "https://soundcloud.com/parkdl/the-stairs-ruff-mix/s-6ZWiZALOuLX", api: "https://api.soundcloud.com/tracks/2282565227", secret: "s-6ZWiZALOuLX" },
    { label: "THE WEIGHT", page: "https://soundcloud.com/parkdl/the-weight-2-w-guits/s-4LV9f9lZ7rW", api: "https://api.soundcloud.com/tracks/2272915949", secret: "s-4LV9f9lZ7rW" },
    { label: "FADY", page: "https://soundcloud.com/parkdl/fady-oohs-3/s-MDVt4YfqhS3", api: "https://api.soundcloud.com/tracks/2260182809", secret: "s-MDVt4YfqhS3" },
    { label: "IRERY AHO", page: "https://soundcloud.com/parkdl/irery-aho-live-drums-guit/s-mIXJYuegPeZ", api: "https://api.soundcloud.com/tracks/2247689000", secret: "s-mIXJYuegPeZ" },
    { label: "THE EYES", page: "https://soundcloud.com/parkdl/song-4-the-eyes-ballad-starts-amazing-and-stays-that-way-5/s-aPkxeqOwa7F", api: "https://api.soundcloud.com/tracks/2220807767", secret: "s-aPkxeqOwa7F" },
    { label: "THE DUST", page: "https://soundcloud.com/parkdl/song-2-the-dust-rap-cool-fast-rap-slow-chorus-3/s-fTiCv0DJxiv", api: "https://api.soundcloud.com/tracks/2220807764", secret: "s-fTiCv0DJxiv" }
  ];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.InhabitantRenderer) window.InhabitantRenderer.RENDER_MODE = "signal";

  var FALL_SLICE = {
    recognition: "Neither of them did this. The code did, through both of them. mpanandevo. fanompoana. It was never them.",
    recognitionAudio: "/audio/mvt1/recognition.mp3",
    hum: "/audio/mvt1/room-hum.mp3",
    inhabitants: {
      outer: {
        key: "noble",
        channelLabel: "THE NOBLE",
        rankLabel: "THE ELDER · KEEPS THE LINE",
        presence: { scale: 1, y: 0.08 },
        lines: [
          "You are keeping the line clean.",
          "This is not cruelty. It is duty.",
          "He thinks you are breaking it. You are holding it together.",
          "The law was here before you."
        ],
        voices: [
          "/audio/mvt1/noble-1.mp3",
          "/audio/mvt1/noble-2.mp3",
          "/audio/mvt1/noble-3.mp3",
          "/audio/mvt1/noble-4.mp3"
        ],
        photo: "/img/mvt1/noble.jpg",
        depth: "/img/mvt1/noble-depth.jpg",
        fallbacks: ["/img/mvt1/characters/noble.png"],
        tint: 0x46ff97
      },
      inner: {
        key: "disowned",
        channelLabel: "THE DISOWNED",
        rankLabel: "THE CHILD · BEFORE THE NAME",
        presence: { scale: 0.72, y: -0.28 },
        lines: [
          "You brought your son home.",
          "You said his name. Tonga le boay keliko.",
          "The door did not open.",
          "What broke you was not a stranger. It was your father, loving you through a law."
        ],
        voices: [
          "/audio/mvt1/disowned-1.mp3",
          "/audio/mvt1/disowned-2.mp3",
          "/audio/mvt1/disowned-3.mp3",
          "/audio/mvt1/disowned-4.mp3"
        ],
        photo: "/img/mvt1/disowned.jpg",
        depth: "/img/mvt1/disowned-depth.jpg",
        fallbacks: ["/img/mvt1/characters/son.jpg", "/img/mvt1/characters/noble.png"],
        tint: 0xff5546,
        tintFilter: "sepia(0.3) saturate(1.35) hue-rotate(-16deg) brightness(0.8)"
      }
    }
  };
  var DEFAULT_CH_OUTER = "THE WORLD";
  var DEFAULT_CH_INNER = "INSIDE HIM";

  var FRAGS = [
    { id: "fall", recv: 1, cue: 1, backgroundImage: "/img/mvt1/fall-ranavalona.png", tc: "00:00", era: "1971 · before the name", title: "THE FIRST FALL",
      line: "\u201cTonga le boay keliko.\u201d \u2014 the sentence that began the severance.",
      roles: [{ t: "THE NOBLE", lead: true }, { t: "THE DISOWNED" }],
      outer: "The line is cut before he even has a name. Something that was meant to keep flowing \u2014 hasina \u2014 goes quiet here first, and the long cut from the ancestors begins.",
      inner: { g: "NO ONE GUARDING YET", line: "A debt opened with no one yet alive to owe it.", seed: "a verdict, still looking for someone to land on", idle: true } },
    { id: "blessing", recv: 2, cue: 2, backgroundImage: "/img/mvt1/DP144486.jpg", tc: "04:12", era: "childhood · the blessing", title: "THE DOOR AGAINST THE WALL",
      line: "A tso-drano laid like a hand on the head \u2014 and like a seal on a door.",
      roles: [{ t: "THE GRANDMOTHER", lead: true }],
      outer: "Protection and the cage arrive in one gesture. The first lesson: safety has walls.",
      inner: { g: "THE PROSECUTOR ARRIVES", line: "Watch yourself first, before anyone outside can.", seed: "the part of him that watches him first" } },
    { id: "backseat", recv: 3, cue: 3, backgroundImage: "/img/mvt1/Rainandriamampandry_ex_gouverneur_de_Tamatave_et_sa_famille.jpg", tc: "09:48", era: "childhood · the language", title: "TAUGHT BEFORE HE COULD SPELL IT",
      line: "The caste vocabulary, passed back over the seat, in the voice of the people who love him.",
      roles: [{ t: "THE DOCTOR", lead: true }, { t: "THE SON", lead: true }],
      outer: "It comes in through care and language, before he can even read. It wears the face of love. What's hurting him is never them \u2014 it's what speaks through them: mpanandevo, fanompoana.",
      inner: { g: "THE PROSECUTOR, AT HIS POST", line: "Convict yourself first, and no one outside can.", seed: "the voice that agrees with them before they finish" } },
    { id: "glass", recv: 4, cue: 4, backgroundImage: "/img/mvt1/glass-mother.jpg", tc: "14:30", era: "childhood · the separation", title: "THE MOTHER ON THE FAR SIDE",
      line: "The airport glass \u2014 close enough to see, never close enough to hold.",
      roles: [{ t: "THE DOCTOR", lead: true }],
      outer: "Separation rehearsed until it feels like weather. What you reach for lives behind something clear and hard.",
      inner: { g: "THE SABOTEUR ARRIVES", line: "It hurts less if you decide you never wanted it.", seed: "the part that talks him out of reaching" } },
    { id: "sudbury", recv: 5, cue: 5, backgroundImage: "/img/mvt1/DP144488.jpg", tc: "19:06", era: "childhood · the shelter", title: "THE CAGE THAT WAS ALSO THE SHELTER",
      line: "The only safe room had a lock on the inside and the outside both.",
      roles: [{ t: "THE CAGE" }],
      outer: "Smallness bought safety; safety required smallness. To be protected is to be contained, and to be contained is to be safe.",
      inner: { g: "THE PUNISHER ARRIVES", line: "Stay small and you stay safe; step out and you'll pay.", seed: "the part that makes trying hurt" } },
    { id: "installed", recv: 6, cue: 0, backgroundImage: "/img/mvt1/DP144490.jpg", tc: "31:00", era: "Haizina · the darkness, lowest", title: "IT RUNS ON ITS OWN NOW", terminus: true, locked: true,
      line: "Not a new thing that happened \u2014 the weight of all the others, carried now without anyone choosing to.",
      roles: [{ t: "HAIZINA", lead: true }],
      outer: "By now it just runs, on its own. What was hurting him was never the people who loved him \u2014 it was what spoke through them: mpanandevo, fanompoana, Babylon. The way out isn't escape, and it isn't revenge. It's being seen \u2014 and that's Tomorrow.",
      inner: { g: "THEY NEVER LEAVE", line: "No one hired them tonight. They were always already here.", seed: "no one has to hold them in place anymore" } }
  ];
  var byId = {}; FRAGS.forEach(function (f) { byId[f.id] = f; });
  var TOTAL = FRAGS.length;
  var STEP = 360 / TOTAL;
  var RECEIVED = FRAGS.slice().sort(function (a, b) { return a.recv - b.recv; }).map(function (f) { return f.id; });
  var REMEMBERED = ["backseat", "fall", "glass", "blessing", "sudbury", "installed"];

  // character roster — who hands the chain down, one per memory
  var CHARS = {
    fall:      { p:1, name:"THE NOBLE",       fac:"BLOOD", model:"noble",       hands:"Cuts the line before it ever reaches you \u2014 the first fall, 1971." },
    blessing:  { p:2, name:"THE GRANDMOTHER", fac:"BLOOD", model:"grandmother", hands:"Lays a hand on your head, and builds the door against a wall." },
    backseat:  { p:3, name:"THE SON",         fac:"BLOOD", model:"son",         hands:"Hands you the words for the world before you can read them." },
    glass:     { p:4, name:"THE DOCTOR",      fac:"BLOOD", model:"doctor",      hands:"Always on the far side of the glass \u2014 close enough to see." },
    sudbury:   { p:5, name:"THE CAGE",        fac:"PLACE", model:"cage",        hands:"A room that is also the only shelter you have \u2014 locked from both sides." },
    installed: { p:6, name:"HAIZINA",         fac:"DARK",  model:"orb",         hands:"The weight of all of them, running on its own. Unlocks once you've met the other five.", locked:true }
  };
  function kindOf(c) { return c.fac === "PLACE" ? "place" : c.fac === "DARK" ? "dark" : "person"; }
  function innerSVG(kind) {
    if (kind === "place") return '<path class="fig" d="M18 112 V54 L50 28 L82 54 V112 Z"/><rect class="fig win" x="33" y="76" width="12" height="14"/><rect class="fig win" x="55" y="76" width="12" height="14"/><rect class="fig win" x="44" y="94" width="12" height="18"/>';
    if (kind === "dark") return '<circle class="fig" cx="50" cy="56" r="28"/><path class="fig" opacity="0.45" d="M50 12 l5 18 18-7 -9 17 19 6 -19 6 9 17 -18-7 -5 18 -5-18 -18 7 9-17 -19-6 19-6 -9-17 18 7z"/>';
    return '<path class="fig" d="M50 10c11 0 19 10 19 23s-8 25-19 25-19-12-19-25 8-23 19-23zM8 112c0-24 19-42 42-42s42 18 42 42z"/>';
  }
  function flatSVG(kind) { return '<svg viewBox="0 0 100 116" preserveAspectRatio="xMidYMax meet">' + innerSVG(kind) + '</svg>'; }
  function build3d(kind) {
    var svg = '<svg viewBox="0 0 100 116" preserveAspectRatio="xMidYMid meet">' + innerSVG(kind) + '</svg>';
    return '<div class="stage3d"><div class="turntable"></div><div class="fig-tilt"><div class="figure">' +
      '<div class="plane front">' + svg + '</div><div class="plane side">' + svg + '</div>' +
      '<div class="plane back">' + svg + '</div><div class="plane side2">' + svg + '</div>' +
      '</div></div></div>';
  }
  var FACTAG = { BLOOD:"BLOOD \u00b7 FAMILY", PLACE:"A PLACE", WORLD:"THE WORLD", DARK:"THE FEELING" };

  var state = { witnessed: [], order: "remembered", channel: "outer", active: REMEMBERED[0], opened: false };
  load();

  // elements
  var crt = document.getElementById("crt");
  var stage = document.getElementById("stage");
  var ring = document.getElementById("ring");
  var core = document.getElementById("core");
  var coreSeed = document.getElementById("coreSeed");
  var charSelect = document.getElementById("charSelect");
  var roster = document.getElementById("roster");
  var rosterWrap = document.getElementById("rosterWrap");
  var featured = document.getElementById("featured");
  var fWatermark = document.getElementById("fWatermark");
  var fPortrait = document.getElementById("fPortrait");
  var fP1 = document.getElementById("fP1");
  var fName = document.getElementById("fName");
  var fRole = document.getElementById("fRole");
  var fHands = document.getElementById("fHands");
  var fTags = document.getElementById("fTags");
  var rosterBtn = document.getElementById("rosterBtn");
  var memCrumb = document.getElementById("memCrumb");
  var memCrumbHome = document.getElementById("memCrumbHome");
  var memCrumbBack = document.getElementById("memCrumbBack");
  var memCrumbIdx = document.getElementById("memCrumbIdx");
  var memCrumbTitle = document.getElementById("memCrumbTitle");
  var masterTc = document.getElementById("masterTc");
  var score = document.getElementById("score");
  var brandHome = document.getElementById("brandHome");
  var chOuter = document.getElementById("chOuter");
  var chInner = document.getElementById("chInner");
  var ordRemembered = document.getElementById("ordRemembered");
  var ordReceived = document.getElementById("ordReceived");
  var orderNote = document.getElementById("orderNote");
  var jogPrev = document.getElementById("jogPrev");
  var jogNext = document.getElementById("jogNext");
  var wsegs = document.querySelectorAll("#wsegs i");
  var wcount = document.getElementById("wcount");
  // readout
  var roChannel = document.getElementById("roChannel");
  var roFrag = document.getElementById("roFrag");
  var roTc = document.getElementById("roTc");
  var roEra = document.getElementById("roEra");
  var roRoles = document.getElementById("roRoles");
  var roDecode = document.getElementById("roDecode");
  var roSeed = document.getElementById("roSeed");
  var roSeedTxt = document.getElementById("roSeedTxt");
  // title card
  var tcYr = document.getElementById("tcYr");
  var tcIdx = document.getElementById("tcIdx");
  var tcTitle = document.getElementById("tcTitle");
  var tcLine = document.getElementById("tcLine");
  var memBg = document.getElementById("memBg");
  var memBgA = document.getElementById("memBgA");
  var memBgB = document.getElementById("memBgB");
  var developZone = document.getElementById("developZone");
  var developHint = document.getElementById("developHint");
  var developPersp = document.getElementById("developPersp");
  var recognitionFlash = document.getElementById("recognitionFlash");
  var recognitionLineEl = document.getElementById("recognitionLine");
  var seenCountEl = document.getElementById("seenCount");
  var inhabitantMount = document.getElementById("inhabitantMount");
  var testimonyLayer = document.getElementById("testimonyLayer");
  var testimonyLine = document.getElementById("testimonyLine");
  var testimonyPrompt = document.getElementById("testimonyPrompt");
  var possessionLineN = document.getElementById("possessionLineN");
  var chainStrip = document.getElementById("chainStrip");
  var tuneGate = document.getElementById("tuneGate");
  var tuneGateBtn = document.getElementById("tuneGateBtn");
  var developTurn = document.getElementById("developTurn");
  var inhabitantView = null;
  var possession = null;
  var roomHum = null;
  var roomHumVol = 0;
  var synthHumCtx = null;
  var synthHumGain = null;
  var synthHumSrc = null;
  var fallStemRAF = null;
  var audioUnlocked = false;
  var pendingFallEntry = false;
  var currentCaption = "";
  var SCORE_VOL_SCALE = 0.35; // song at ~35% so testimony lines sit clearly above it
  var fallHoldIdx = 0;
  var fallHoldActive = false;
  var fallHoldTuned = [false, false, false, false];
  var fallHoldTimer = null;
  var fallLineAudio = null;
  var lastSyncScoreVol = -1;
  var USE_FALL_MP3 = false; // enable once /audio/mvt1/*.mp3 files exist

  var RING_R = 356;
  var nodeEls = {};
  var memBgSlot = 0;
  var memBgReady = {};

  // ============================================================
  // ORBIT
  // ============================================================
  function angleOf(id) {
    var arr = state.order === "received" ? RECEIVED : REMEMBERED;
    return arr.indexOf(id) * STEP;
  }

  function linkSvg() {
    return '<span class="lk"><svg viewBox="0 0 24 24"><rect x="3" y="8" width="11" height="8" rx="4"/><rect x="10" y="8" width="11" height="8" rx="4"/></svg></span>';
  }

  function buildNodes() {
    // remove existing
    Object.keys(nodeEls).forEach(function (k) { if (nodeEls[k] && nodeEls[k].parentNode) nodeEls[k].parentNode.removeChild(nodeEls[k]); });
    nodeEls = {};
    ring.style.setProperty("--r", RING_R);
    FRAGS.forEach(function (f) {
      var node = document.createElement("div");
      node.className = "node" + (f.terminus ? " terminus" : "");
      node.setAttribute("data-id", f.id);
      node.style.setProperty("--r", RING_R);
      node.style.setProperty("--a", angleOf(f.id) + "deg");
      node.innerHTML =
        '<div class="badge" role="button" tabindex="0" aria-label="Fragment ' + f.recv + ': ' + f.title + '">' +
          '<span class="n">' + f.recv + '</span>' + linkSvg() +
        '</div>' +
        '<span class="tip">' + f.title + '</span>';
      var badge = node.querySelector(".badge");
      badge.addEventListener("click", function () { onNode(f.id); });
      badge.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNode(f.id); } });
      ring.appendChild(node);
      nodeEls[f.id] = node;
    });
    refreshNodes();
  }

  function repositionNodes() {
    FRAGS.forEach(function (f) { if (nodeEls[f.id]) nodeEls[f.id].style.setProperty("--a", angleOf(f.id) + "deg"); });
  }

  function refreshNodes() {
    FRAGS.forEach(function (f) {
      var n = nodeEls[f.id]; if (!n) return;
      n.classList.toggle("witnessed", state.witnessed.indexOf(f.id) !== -1);
      n.classList.toggle("seen", getMemState(f.id).seen);
      n.classList.toggle("active", f.id === state.active);
      n.classList.toggle("locked", !!f.terminus && isTerminusLocked());
    });
  }

  // ============================================================
  // SEE / DEVELOP — press and hold to bring memory into focus
  // ============================================================
  var DEVELOP_RISE = 1 / 3.6;
  var DEVELOP_DECAY = 0.11;
  var LOCK_THRESH = 0.95;
  var developing = false;
  var developPointer = false;
  var developSpace = false;
  var developRAF = null;
  var lastDevelopTs = 0;

  function defaultMemState() {
    return { clarity: 0, seen: false, viewedWorld: false, viewedInside: false };
  }

  function initMemoryStates() {
    if (!state.memoryState || typeof state.memoryState !== "object") state.memoryState = {};
    FRAGS.forEach(function (f) {
      var m = state.memoryState[f.id];
      if (!m || typeof m !== "object") {
        state.memoryState[f.id] = defaultMemState();
        return;
      }
      m.clarity = typeof m.clarity === "number" ? Math.max(0, Math.min(1, m.clarity)) : 0;
      m.seen = !!m.seen;
      m.viewedWorld = !!m.viewedWorld;
      m.viewedInside = !!m.viewedInside;
      if (m.seen) m.clarity = 1;
    });
  }

  function getMemState(id) {
    if (!state.memoryState[id]) state.memoryState[id] = defaultMemState();
    return state.memoryState[id];
  }

  function recognitionLineFor(f) {
    if (f.id === "fall") return FALL_SLICE.recognition;
    return f.outer || "";
  }

  function defaultFallSides() {
    return {
      outer: { seen: false },
      inner: { seen: false }
    };
  }

  function fallInhabPayload(ch) {
    var inh = FALL_SLICE.inhabitants[ch === "inner" ? "inner" : "outer"];
    return {
      channelLabel: inh.channelLabel,
      rankLabel: inh.rankLabel || "",
      key: inh.key,
      lines: inh.lines,
      voices: inh.voices,
      photo: inh.photo,
      depth: inh.depth,
      fallbacks: inh.fallbacks || [],
      tintHex: inh.tint,
      tintFilter: inh.tintFilter || null,
      presence: inh.presence || { scale: 1, y: 0 }
    };
  }

  function syncInhabitantChrome(ch) {
    var inh = FALL_SLICE.inhabitants[ch === "inner" ? "inner" : "outer"];
    document.body.setAttribute("data-inhabitant", inh.key || (ch === "inner" ? "disowned" : "noble"));
  }

  function getFallSides() {
    if (!state.fallSides) state.fallSides = defaultFallSides();
    return state.fallSides;
  }

  function isPossessionMode() {
    return state.opened && state.active === "fall" && charSelect.classList.contains("gone");
  }

  function fallInhabitant(ch) {
    return FALL_SLICE.inhabitants[ch === "inner" ? "inner" : "outer"];
  }

  function syncPossessionUI() {
    if (!chOuter || !chInner) return;
    if (!isPossessionMode()) {
      chOuter.textContent = DEFAULT_CH_OUTER;
      chInner.textContent = DEFAULT_CH_INNER;
      document.body.classList.remove("memory-possession", "recognition-moment");
      if (chainStrip) chainStrip.hidden = true;
      return;
    }
    document.body.classList.add("memory-possession");
    chOuter.textContent = FALL_SLICE.inhabitants.outer.channelLabel;
    chInner.textContent = FALL_SLICE.inhabitants.inner.channelLabel;
    if (chainStrip) {
      chainStrip.hidden = false;
      syncChainStrip();
    }
  }

  function syncChainStrip() {
    if (!chainStrip) return;
    var ticks = chainStrip.querySelectorAll(".chain-strip-tick");
    Array.prototype.forEach.call(ticks, function (el) {
      var id = el.getAttribute("data-id");
      el.classList.toggle("lit", getMemState(id).seen || state.witnessed.indexOf(id) !== -1);
      el.classList.toggle("active", id === state.active);
    });
  }

  function ensureInhabitantView() {
    if (!window.InhabitantRenderer || !inhabitantMount) return null;
    if (!inhabitantView) {
      try {
        inhabitantMount.innerHTML = "";
        inhabitantView = window.InhabitantRenderer.create(inhabitantMount, {
          mode: window.InhabitantRenderer.RENDER_MODE,
          reduceMotion: reduceMotion
        });
        if (inhabitantView) inhabitantView.start();
      } catch (e) {
        // Face renderer failed (e.g. no WebGL). The testimony must still run.
        inhabitantView = null;
      }
    }
    return inhabitantView;
  }

  function ensureSynthHum() {
    if (synthHumCtx) return synthHumCtx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    synthHumCtx = new AC();
    var bufferSize = 2 * synthHumCtx.sampleRate;
    var noiseBuffer = synthHumCtx.createBuffer(1, bufferSize, synthHumCtx.sampleRate);
    var output = noiseBuffer.getChannelData(0);
    var last = 0;
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      output[i] = last * 3.5;
    }
    synthHumSrc = synthHumCtx.createBufferSource();
    synthHumSrc.buffer = noiseBuffer;
    synthHumSrc.loop = true;
    var filter = synthHumCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;
    synthHumGain = synthHumCtx.createGain();
    synthHumGain.gain.value = 0;
    synthHumSrc.connect(filter);
    filter.connect(synthHumGain);
    synthHumGain.connect(synthHumCtx.destination);
    synthHumSrc.start(0);
    return synthHumCtx;
  }

  function ensureRoomHum() {
    if (roomHum) return roomHum;
    if (!FALL_SLICE.hum) return null;
    roomHum = new Audio();
    roomHum.loop = true;
    roomHum.preload = "auto";
    roomHum.volume = 0;
    roomHum.addEventListener("error", function () {
      roomHum = null;
      ensureSynthHum();
    });
    roomHum.src = FALL_SLICE.hum;
    roomHum.play().catch(function () { ensureSynthHum(); });
    return roomHum;
  }

  function setHumTarget(vol) {
    roomHumVol = vol;
    ensureRoomHum();
    ensureSynthHum();
    if (synthHumCtx && synthHumGain) {
      if (synthHumCtx.state === "suspended") synthHumCtx.resume();
    }
    kickFallAudio();
  }

  function tickFallAudio() {
    var any = false;
    var hum = roomHum;
    if (hum) {
      var hc = hum.volume;
      var hn = hc + (roomHumVol - hc) * 0.08;
      if (Math.abs(hn - roomHumVol) < 0.006) hn = roomHumVol;
      else any = true;
      hum.volume = Math.max(0, Math.min(0.35, hn));
      if (roomHumVol > 0.02 && hum.paused) hum.play().catch(function () { ensureSynthHum(); });
      if (roomHumVol <= 0.01 && hn <= 0.006) { hum.pause(); hum.currentTime = 0; }
    }
    if (synthHumGain) {
      var scoreOn = score && score.classList.contains("playing");
      var tgt = Math.max(0, Math.min(scoreOn ? 0.045 : 0.09, roomHumVol * (scoreOn ? 0.25 : 0.4)));
      var cur = synthHumGain.gain.value;
      var sn = cur + (tgt - cur) * 0.08;
      if (Math.abs(sn - tgt) < 0.002) sn = tgt;
      else any = true;
      synthHumGain.gain.value = sn;
    }
    if (any) fallStemRAF = requestAnimationFrame(tickFallAudio);
    else fallStemRAF = null;
  }

  function kickFallAudio() {
    if (!fallStemRAF) fallStemRAF = requestAnimationFrame(tickFallAudio);
  }

  function stopPossessionAudio() {
    if (fallStemRAF) { cancelAnimationFrame(fallStemRAF); fallStemRAF = null; }
    roomHumVol = 0;
    if (roomHum) { roomHum.pause(); roomHum.volume = 0; }
    if (synthHumGain) synthHumGain.gain.value = 0;
  }

  function showCaption(text, tuned) {
    if (!testimonyLine) return;
    currentCaption = text || "";
    testimonyLine.textContent = currentCaption;
    testimonyLine.classList.remove("is-visible", "is-tuned", "is-muted");
    if (text) {
      hideTestimonyPrompt();
      testimonyLine.classList.add("is-visible");
      if (tuned) testimonyLine.classList.add("is-tuned");
    } else if (fallPossessionActive()) {
      showTestimonyPrompt();
    }
    if (testimonyLayer) {
      testimonyLayer.hidden = !(fallPossessionActive() || text);
    }
  }

  function updatePossessionRead(ch, line, total) {
    syncInhabitantChrome(ch);
    if (possessionLineN) possessionLineN.textContent = line + " / " + total;
  }

  function showTurnPrompt(completedCh) {
    if (!developTurn || getMemState("fall").seen) return;
    if (fallBothSidesSeen()) { developTurn.hidden = true; return; }
    var other = completedCh === "outer" ? "inner" : "outer";
    if (getFallSides()[other].seen) { developTurn.hidden = true; return; }
    developTurn.hidden = false;
    developTurn.textContent = "PRESS C \u00b7 HEAR THE OTHER SIDE";
  }

  function hidePossessionVisuals() {
    if (inhabitantView) inhabitantView.setClarity(0);
    if (inhabitantMount) {
      inhabitantMount.hidden = true;
      inhabitantMount.classList.remove("is-on");
      inhabitantMount.setAttribute("aria-hidden", "true");
    }
    if (testimonyLayer) testimonyLayer.hidden = true;
    if (possessionLineN) possessionLineN.textContent = "";
    if (developTurn) developTurn.hidden = true;
    document.body.removeAttribute("data-inhabitant");
    hideTestimonyPrompt();
    clearFallHoldTimer();
    stopFallLineAudio();
    cancelFallSpeech();
    showCaption("");
    stopPossessionAudio();
    if (possession) { possession.stop(); possession = null; }
  }

  function markFallSideComplete(ch) {
    var fs = getFallSides()[ch];
    fs.seen = true;
    var m = getMemState("fall");
    if (ch === "outer") m.viewedWorld = true;
    else m.viewedInside = true;
    save();
  }

  function fallSideComplete(ch) {
    return !!getFallSides()[ch].seen;
  }

  function fallBothSidesSeen() {
    return fallSideComplete("outer") && fallSideComplete("inner");
  }

  function resetFallSessionIfNeeded() {
    var m = getMemState("fall");
    if (m.seen) return;
    if (fallBothSidesSeen()) {
      state.fallSides = defaultFallSides();
      save();
    }
  }

  function clearFallHoldTimer() {
    if (fallHoldTimer) { clearTimeout(fallHoldTimer); fallHoldTimer = null; }
  }

  function resetFallHoldState() {
    fallHoldIdx = 0;
    fallHoldActive = false;
    fallHoldTuned = [false, false, false, false];
    clearFallHoldTimer();
  }

  function stopFallLineAudio() {
    if (fallLineAudio) {
      fallLineAudio.pause();
      fallLineAudio.removeAttribute("src");
      fallLineAudio = null;
    }
  }

  function cancelFallSpeech() {
    if (window.ChainSpeech) window.ChainSpeech.cancel();
  }

  function fallLineWaitMs(text) {
    var words = (text || "").split(/\s+/).filter(Boolean).length;
    return Math.max(3000, Math.min(8000, words * 380 + 700));
  }

  function fallActiveSide() {
    return state.channel === "inner" ? "inner" : "outer";
  }

  // Reveal one testimony line: caption + counter + TTS (MP3 optional).
  // Timer drives advance so hold never deadlocks if speech events fail.
  function playFallLine(i) {
    var ch = fallActiveSide();
    var inh = fallInhabitant(ch);
    var line = inh.lines[i];
    if (!line) return;

    // 1) Visuals first — the words and counter must appear no matter what
    // happens with audio/speech below. Nothing here can throw.
    fallHoldIdx = i;
    fallHoldActive = true;
    hideTestimonyPrompt();
    if (developTurn) developTurn.hidden = true;
    updatePossessionRead(ch, i + 1, 4);
    showCaption(line, true);
    if (inhabitantView) inhabitantView.setClarity(1);
    setHumTarget(0.01);

    // 2) Timer drives the advance — guaranteed, independent of speech.
    clearFallHoldTimer();
    fallHoldTimer = setTimeout(onFallLineDone, fallLineWaitMs(line));

    // 3) Audio / speech is best-effort and fully isolated. Deferred to a later
    // tick and wrapped so a throw or hang can never break the line reveal.
    var url = USE_FALL_MP3 && inh.voices && inh.voices[i];
    setTimeout(function () {
      try {
        stopFallLineAudio();
        cancelFallSpeech();
      } catch (e) {}
      function startTTS() {
        try {
          primeSpeech();
          if (window.ChainSpeech) {
            window.ChainSpeech.speak(line, { side: ch, immediate: true, replace: true });
          }
        } catch (e) {}
      }
      if (url) {
        try {
          fallLineAudio = new Audio(url);
          fallLineAudio.preload = "auto";
          fallLineAudio.addEventListener("ended", function () { fallLineAudio = null; });
          fallLineAudio.addEventListener("error", function () { fallLineAudio = null; startTTS(); });
          fallLineAudio.play().then(function () {}).catch(function () { fallLineAudio = null; startTTS(); });
        } catch (e) { startTTS(); }
      } else {
        startTTS();
      }
    }, 0);
  }

  function onFallLineDone() {
    clearFallHoldTimer();
    stopFallLineAudio();
    cancelFallSpeech();
    setHumTarget(0.06);
    fallHoldActive = false;
    fallHoldTuned[fallHoldIdx] = true;
    var ch = fallActiveSide();

    if (fallHoldIdx >= 3) {
      if (!fallSideComplete(ch)) markFallSideComplete(ch);
      if (fallBothSidesSeen()) {
        fallRecognition();
      } else {
        showTurnPrompt(ch);
        showTestimonyPrompt("PRESS C \u00b7 HEAR THE OTHER SIDE");
      }
      return;
    }

    fallHoldIdx++;
    if (isDevelopActive()) {
      playFallLine(fallHoldIdx);
    } else {
      showTestimonyPrompt("PRESS \u00b7 HOLD \u00b7 NEXT LINE");
    }
  }

  function fallBeginHold() {
    if (!fallPossessionActive()) return;
    if (fallHoldActive) return;
    if (fallSideComplete(fallActiveSide())) return;
    if (fallHoldIdx > 3) return;
    playFallLine(fallHoldIdx);
  }

  function fallSwitchSide(ch) {
    if (!fallPossessionActive()) return;
    if (ch === fallActiveSide()) return;
    if (!fallSideComplete(fallActiveSide())) return;
    if (fallSideComplete(ch)) return;
    clearFallHoldTimer();
    fallHoldActive = false;
    fallHoldIdx = 0;
    fallHoldTuned = [false, false, false, false];
    state.channel = ch;
    document.body.setAttribute("data-channel", ch);
    if (chOuter) chOuter.classList.toggle("on", ch === "outer");
    if (chInner) chInner.classList.toggle("on", ch === "inner");
    syncInhabitantChrome(ch);
    if (inhabitantView) {
      inhabitantView.setInhabitant(fallInhabPayload(ch));
      inhabitantView.setClarity(0);
      if (inhabitantView.arrive) inhabitantView.arrive(1400);
    }
    updatePossessionRead(ch, 1, 4);
    showCaption("");
    if (developTurn) developTurn.hidden = true;
    showTestimonyPrompt("PRESS \u00b7 HOLD TO REVEAL");
    save();
  }

  function fallRecognition() {
    var m = getMemState("fall");
    clearFallHoldTimer();
    fallHoldActive = false;
    document.body.classList.add("recognition-moment");
    if (inhabitantView && inhabitantView.still) inhabitantView.still();
    showCaption(FALL_SLICE.recognition, true);
    fireRecognition("fall");
    if (developTurn) developTurn.hidden = true;
    hideTestimonyPrompt();
    m.clarity = 1;
    m.seen = true;
    updateSeenMeter();
    syncChainStrip();
    refreshNodes();
    setTimeout(function () {
      document.body.classList.remove("recognition-moment");
      showCaption("");
      setHumTarget(0.08);
      applyClarityVisuals("fall");
    }, 3400);
    save();
  }

  function fallPossessionActive() {
    return isPossessionMode() && audioUnlocked && !fallBothSidesSeen() && !getMemState("fall").seen;
  }

  function canDevelop(id) {
    if (id === "fall" && isPossessionMode()) return audioUnlocked && !fallBothSidesSeen();
    return !getMemState(id).seen;
  }

  // Whether a press should be accepted at all. For fall this also allows the
  // pre-tune-in press (so startDevelop's safety net can tune in), not just the
  // already-unlocked develop case.
  function canPress(id) {
    if (id === "fall" && isPossessionMode()) return !fallBothSidesSeen();
    return canDevelop(id);
  }

  function showTestimonyPrompt(text) {
    if (!testimonyPrompt) return;
    testimonyPrompt.textContent = text || "PRESS · HOLD TO REVEAL";
    testimonyPrompt.hidden = false;
  }

  function armFallGate() {
    pendingFallEntry = true;
    audioUnlocked = false;
    stopIdle();
    if (tuneGate) {
      tuneGate.hidden = false;
      tuneGate.classList.remove("is-off");
      tuneGate.setAttribute("aria-hidden", "false");
    }
    preloadFallScore();
  }

  function disarmFallGate() {
    pendingFallEntry = false;
    if (tuneGate) {
      tuneGate.hidden = true;
      tuneGate.classList.add("is-off");
      tuneGate.setAttribute("aria-hidden", "true");
    }
  }

  function hideTestimonyPrompt() {
    if (testimonyPrompt) testimonyPrompt.hidden = true;
  }

  function showFallStageUI(ch) {
    if (!isPossessionMode()) return;
    ch = ch || state.channel || "outer";
    syncPossessionUI();
    syncInhabitantChrome(ch);
    state.channel = ch;
    document.body.setAttribute("data-channel", ch);
    if (chOuter) chOuter.classList.toggle("on", ch === "outer");
    if (chInner) chInner.classList.toggle("on", ch === "inner");
    if (inhabitantMount) {
      inhabitantMount.hidden = false;
      inhabitantMount.classList.add("is-on");
      inhabitantMount.setAttribute("aria-hidden", "false");
    }
    if (testimonyLayer) testimonyLayer.hidden = false;
    updatePossessionRead(ch, 1, 4);
    showCaption("");
    showTestimonyPrompt();
    updateDevelopZone("fall");
  }

  // Fall testimony is fully owned by chain.js (timer-driven hold sequence).
  // The 3D renderer is used only for the face; possession stays null.
  function startVoicePossession() {
    if (!audioUnlocked) return;
    var m = getMemState("fall");
    var sides = getFallSides();
    var startCh = sides.outer.seen ? "inner" : "outer";
    if (sides.outer.seen && sides.inner.seen) startCh = state.channel || "outer";
    state.channel = startCh;
    document.body.setAttribute("data-channel", startCh);
    if (chOuter) chOuter.classList.toggle("on", startCh === "outer");
    if (chInner) chInner.classList.toggle("on", startCh === "inner");
    showFallStageUI(startCh);

    var view = ensureInhabitantView();
    var payload = fallInhabPayload(startCh);
    possession = null;

    var fullyDone = m.seen && fallBothSidesSeen();

    if (view) {
      view.setInhabitant(payload);
      if (view.setDrift) view.setDrift(1);
      if (fullyDone) {
        view.setClarity(1);
        if (view.still) view.still();
      } else {
        view.setClarity(0);
        if (view.arrive) view.arrive(1600);
      }
      requestAnimationFrame(function () { if (inhabitantView) inhabitantView.resize(); });
    }

    if (fullyDone) {
      showCaption("");
      hideTestimonyPrompt();
      updatePossessionRead(startCh, 4, 4);
      return;
    }

    resetFallHoldState();
    updatePossessionRead(startCh, 1, 4);
    showCaption("");
    showTestimonyPrompt("PRESS \u00b7 HOLD TO REVEAL");
    ensureDevelopLoop();
  }

  function stopPossession() {
    hidePossessionVisuals();
    document.body.classList.remove("memory-possession", "recognition-moment");
    if (chainStrip) chainStrip.hidden = true;
  }

  function possessionChannelTurn(ch) {
    if (!possession || !isPossessionMode()) return;
    if (getMemState("fall").seen) return;
    var cur = possession.getSide();
    if (ch === cur) return;
    if (!fallSideComplete(cur)) return;
    possession.switchSide(ch, fallInhabPayload(ch));
    if (developTurn) developTurn.hidden = true;
  }

  function countSeen() {
    var n = 0;
    FRAGS.forEach(function (f) { if (getMemState(f.id).seen) n++; });
    return n;
  }

  function updateSeenMeter() {
    if (seenCountEl) seenCountEl.textContent = countSeen() + "/" + TOTAL;
  }

  function inMemoryView() {
    return state.opened && charSelect.classList.contains("gone");
  }

  function perspectiveGate(id) {
    if (id === "fall") return fallBothSidesSeen();
    var m = getMemState(id);
    return m.viewedWorld && m.viewedInside;
  }

  function trackPerspective(id) {
    if (id === "fall") return;
    var m = getMemState(id);
    if (state.channel === "outer") m.viewedWorld = true;
    else m.viewedInside = true;
    tryCompleteRecognition(id);
  }

  function tryCompleteRecognition(id) {
    var m = getMemState(id);
    if (m.seen || m.clarity < LOCK_THRESH) return;
    if (perspectiveGate(id)) lockSeen(id);
  }

  function setScoreVolume(v) {
    if (!scWidget) return;
    var n = typeof v === "number" ? v : 100;
    scWidget.setVolume(Math.max(0, Math.min(100, Math.round(n * SCORE_VOL_SCALE))));
  }

  function syncMusicToClarity(c, seen) {
    if (!scWidget || !scReady) return;
    if (!score.classList.contains("playing")) return;
    var vol;
    if (state.active === "fall" && audioUnlocked && !seen) {
      vol = Math.max(72, Math.round(Math.max(0.72, c) * 100));
    } else {
      var floor = (state.active === "fall" && audioUnlocked) ? 0.55 : 0.45;
      vol = Math.round((seen ? 1 : Math.max(floor, c)) * 100);
    }
    if (vol === lastSyncScoreVol) return;
    lastSyncScoreVol = vol;
    setScoreVolume(vol);
  }

  function maybePlayForDevelop(c) {
    if (!scWidget || !scReady || score.classList.contains("playing")) return;
    if (c > 0.15) {
      scoreAutoplayPending = true;
      scWidget.play();
    }
  }

  function updateDevelopPrompt(id) {
    if (!developPersp) return;
    var m = getMemState(id);
    if (m.seen) { developPersp.hidden = true; return; }
    if (id === "fall") {
      developPersp.hidden = true;
      if (developHint) developHint.textContent = "PRESS · HOLD TO REVEAL";
      return;
    }
    var need = !m.viewedWorld || !m.viewedInside;
    developPersp.hidden = !(need && m.clarity >= 0.5);
    if (!developPersp.hidden) {
      if (!m.viewedWorld && !m.viewedInside) developPersp.textContent = "SEE THE WORLD \u00b7 THEN INSIDE HIM";
      else if (!m.viewedWorld) developPersp.textContent = "LOOK FROM THE WORLD";
      else developPersp.textContent = "LOOK FROM INSIDE HIM";
    }
  }

  function updateDevelopZone(id) {
    if (!developZone) return;
    var show = inMemoryView() && canDevelop(id);
    developZone.hidden = !show;
    developZone.setAttribute("aria-hidden", show ? "false" : "true");
    if (developHint) {
      // Fall uses the centered testimony prompt as its single instruction;
      // keep the develop-zone hint hidden to avoid a duplicate line.
      if (id === "fall") developHint.hidden = true;
      else developHint.hidden = !show;
    }
  }

  function primeSpeech() {
    if (window.ChainSpeech) window.ChainSpeech.prime();
    else if (window.speechSynthesis) window.speechSynthesis.getVoices();
  }

  function applyClarityVisuals(id) {
    var m = getMemState(id);
    var c = m.seen ? 1 : m.clarity;
    var memSeenVisual = m.seen && !(id === "fall" && fallPossessionActive());
    stage.style.setProperty("--clarity", String(c));
    stage.style.setProperty("--seen", memSeenVisual ? "1" : "0");
    stage.classList.toggle("mem-seen", memSeenVisual);
    stage.classList.toggle("clarity-waiting", !m.seen && id === "fall" && possession && fallSideComplete(possession.getSide()) && !fallBothSidesSeen());
    updateDevelopPrompt(id);
    updateDevelopZone(id);
    if (id === "fall" && inhabitantView && !possession) inhabitantView.setClarity(c);
    syncMusicToClarity(c, m.seen);
  }

  function fireRecognition(id) {
    var f = byId[id];
    if (!f || !recognitionFlash || !recognitionLineEl) return;
    recognitionLineEl.textContent = recognitionLineFor(f);
    recognitionFlash.hidden = false;
    recognitionFlash.classList.remove("is-on");
    void recognitionFlash.offsetWidth;
    recognitionFlash.classList.add("is-on");
    setTimeout(function () {
      recognitionFlash.hidden = true;
      recognitionFlash.classList.remove("is-on");
    }, 3200);
  }

  function lockSeen(id) {
    var m = getMemState(id);
    if (m.seen) return;
    m.clarity = 1;
    m.seen = true;
    developing = false;
    developPointer = false;
    developSpace = false;
    stage.classList.remove("developing");
    applyClarityVisuals(id);
    refreshNodes();
    updateSeenMeter();
    syncChainStrip();

    if (id === "fall" && possession) {
      document.body.classList.add("recognition-moment");
      showCaption(FALL_SLICE.recognition, true);
      possession.fireRecognition(FALL_SLICE.recognition, FALL_SLICE.recognitionAudio);
      fireRecognition(id);
      if (developTurn) developTurn.hidden = true;
      setTimeout(function () {
        possession.recess();
        document.body.classList.remove("recognition-moment");
        showCaption("");
        setHumTarget(0.08);
      }, 3200);
    } else {
      fireRecognition(id);
    }
    save();
  }

  function isDevelopActive() {
    return developing && (developPointer || developSpace);
  }

  function developTick(ts) {
    if (!inMemoryView()) {
      developing = false;
      developPointer = false;
      developSpace = false;
      stage.classList.remove("developing");
      developRAF = null;
      return;
    }
    var id = state.active;
    var m = getMemState(id);
    if (m.seen && !(id === "fall" && fallPossessionActive())) {
      developRAF = null;
      developing = false;
      stage.classList.remove("developing");
      return;
    }
    var dt = Math.min(0.05, (ts - lastDevelopTs) / 1000);
    lastDevelopTs = ts;

    if (id === "fall" && fallPossessionActive()) {
      var holdingFall = isDevelopActive();
      var targetC = (fallHoldActive || holdingFall) ? 1 : Math.max(0.22, m.clarity);
      m.clarity += (targetC - m.clarity) * Math.min(1, dt * 3.5);
      if (inhabitantView) inhabitantView.setClarity(m.clarity);
      if (fallHoldActive) maybePlayForDevelop(0.85);
      applyClarityVisuals(id);
      developRAF = requestAnimationFrame(developTick);
      return;
    }

    if (isDevelopActive()) {
      var prev = m.clarity;
      m.clarity = Math.min(LOCK_THRESH, m.clarity + DEVELOP_RISE * dt);
      if (m.clarity > prev) maybePlayForDevelop(m.clarity);
      if (m.clarity >= LOCK_THRESH && perspectiveGate(id)) {
        lockSeen(id);
        developRAF = null;
        return;
      }
    } else if (m.clarity > 0) {
      m.clarity = Math.max(0, m.clarity - DEVELOP_DECAY * dt);
    }

    applyClarityVisuals(id);

    if (isDevelopActive() || m.clarity > 0.001) {
      developRAF = requestAnimationFrame(developTick);
    } else {
      developRAF = null;
      developing = false;
      stage.classList.remove("developing");
      save();
    }
  }

  function ensureDevelopLoop() {
    if (developRAF) return;
    lastDevelopTs = performance.now();
    developRAF = requestAnimationFrame(developTick);
  }

  function startDevelop(e) {
    if (!inMemoryView()) return;
    // Safety net: on the fall memory but possession never unlocked (e.g. the
    // gate was missed or a stale state hid it) — tune in now, inside this user
    // gesture, so a press always recovers the testimony instead of doing nothing.
    if (state.active === "fall" && !audioUnlocked && !fallBothSidesSeen()) {
      onTuneIn();
      return;
    }
    if (!canDevelop(state.active)) return;
    developing = true;
    if (e && typeof e.pointerId === "number") {
      developPointer = true;
      if (stage.setPointerCapture) {
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
      }
    }
    stage.classList.add("developing");
    if (state.active === "fall" && fallPossessionActive()) fallBeginHold();
    ensureDevelopLoop();
  }

  function endDevelopPointer(e) {
    developPointer = false;
    if (e && typeof e.pointerId === "number" && stage.releasePointerCapture) {
      try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    if (!developSpace) {
      developing = false;
      stage.classList.remove("developing");
      ensureDevelopLoop();
    }
  }

  function endDevelopSpace() {
    developSpace = false;
    if (!developPointer) {
      developing = false;
      stage.classList.remove("developing");
      ensureDevelopLoop();
    }
  }

  function onStagePointerDown(e) {
    if (!inMemoryView()) return;
    if (!canPress(state.active)) return;
    if (e.target.closest(".node .badge, .readout, button, .recognition-flash, .lower, .chain-strip")) return;
    startDevelop(e);
  }

  stage.addEventListener("pointerdown", onStagePointerDown);
  if (developZone) {
    developZone.addEventListener("pointerdown", function (e) {
      if (!inMemoryView() || !canPress(state.active)) return;
      e.preventDefault();
      startDevelop(e);
    });
  }
  stage.addEventListener("pointerup", endDevelopPointer);
  stage.addEventListener("pointercancel", endDevelopPointer);
  stage.addEventListener("pointerleave", function (e) {
    if (developPointer && e.relatedTarget && !stage.contains(e.relatedTarget)) endDevelopPointer(e);
  });

  // ring rotation
  var spin = 0, idleRAF = null, idling = false;
  function startIdle() {
    if (reduceMotion) return;
    idling = true;
    ring.style.transition = "none";
    function step() {
      if (!idling) return;
      spin += 0.08;
      ring.style.transform = "rotateY(" + spin + "deg)";
      idleRAF = requestAnimationFrame(step);
    }
    idleRAF = requestAnimationFrame(step);
  }
  function stopIdle() { idling = false; if (idleRAF) cancelAnimationFrame(idleRAF); idleRAF = null; }
  function rotateToFront(id) {
    stopIdle();
    var target = -angleOf(id);
    while (target - spin > 180) target -= 360;
    while (target - spin < -180) target += 360;
    spin = target;
    ring.style.transition = "transform 0.7s cubic-bezier(0.2,0.7,0.2,1)";
    ring.style.transform = "rotateY(" + spin + "deg)";
  }

  // ============================================================
  // SELECT
  // ============================================================
  function onNode(id) {
    var f = byId[id];
    if (f.terminus && isTerminusLocked()) { denyTerminus(); return; }
    playScoreOnGesture(scoreCueFor(id));
    select(id, true);
  }

  function isTerminusLocked() {
    var others = FRAGS.filter(function (f) { return !f.terminus; });
    return others.filter(function (f) { return state.witnessed.indexOf(f.id) !== -1; }).length < others.length;
  }

  function denyTerminus() {
    var n = nodeEls["installed"];
    if (n && !reduceMotion && n.animate) {
      n.animate([{ filter: "none" }, { filter: "brightness(2.4)" }, { filter: "none" }], { duration: 320, easing: "steps(3)" });
    }
    orderNote.classList.add("warn");
    var prev = orderNote.textContent;
    orderNote.textContent = "locked · witness the other five first";
    setTimeout(function () { orderNote.classList.remove("warn"); setOrderNote(); }, 2000);
  }

  function select(id, withGlitch) {
    var f = byId[id];
    if (!f) return;
    var wasFall = state.active === "fall" && id !== "fall";
    state.active = id;
    if (state.opened) {
      if (id === "fall") {
        // Reaching the fall memory through any in-app nav (node, jog, strip)
        // must arm the TUNE IN gate so possession can initialize.
        if (!audioUnlocked) armFallGate();
      } else if (wasFall) {
        audioUnlocked = false;
        stopPossession();
        resetFallHoldState();
        disarmFallGate();
        startClock();
        if (!reduceMotion) startIdle();
      }
    }
    rotateToFront(id);
    if (withGlitch && !reduceMotion) {
      crt.classList.remove("glitching"); stage.classList.remove("glitching");
      void crt.offsetWidth;
      crt.classList.add("glitching"); stage.classList.add("glitching");
      setTimeout(function () { crt.classList.remove("glitching"); stage.classList.remove("glitching"); }, 360);
    }
    witness(id);
    render(f);
    refreshNodes();
    if (state.opened) {
      syncMusicToClarity(getMemState(id).seen ? 1 : Math.max(0.45, getMemState(id).clarity), getMemState(id).seen);
    }
    developPointer = false;
    developSpace = false;
    if (!getMemState(id).seen) {
      developing = false;
      stage.classList.remove("developing");
    }
    save();
  }

  function witness(id) {
    if (state.witnessed.indexOf(id) === -1) state.witnessed.push(id);
    updateMeter();
    if (state.witnessed.indexOf("installed") !== -1) { crt.classList.add("installed"); coreSeed.innerHTML = "IT HOLDS<br>ON ITS OWN"; }
  }

  function updateMeter() {
    var count = state.witnessed.length;
    wcount.textContent = count + "/" + TOTAL;
    Array.prototype.forEach.call(wsegs, function (s, i) {
      s.classList.toggle("lit", i < count);
      s.classList.toggle("t", i === TOTAL - 1 && state.witnessed.indexOf("installed") !== -1 && i < count);
    });
  }

  // ============================================================
  // RENDER active fragment into CG card + readout
  // ============================================================
  function bgSrc(path) {
    return encodeURI(path);
  }

  function preloadMemoryBackgrounds() {
    FRAGS.forEach(function (f) {
      if (!f.backgroundImage) return;
      var src = f.backgroundImage;
      var img = new Image();
      img.onload = function () { memBgReady[src] = true; };
      img.onerror = function () { memBgReady[src] = false; };
      img.src = bgSrc(src);
    });
  }

  function hideMemoryBackground() {
    if (memBg) memBg.classList.remove("visible");
  }

  function layerSrc(el) {
    if (!el) return "";
    return el.currentSrc || el.src || "";
  }

  function updateMemoryBackground(f) {
    if (!memBg || !memBgA || !memBgB) return;
    if (!state.opened || !f || !f.backgroundImage) {
      hideMemoryBackground();
      return;
    }
    var src = f.backgroundImage;
    if (memBgReady[src] === false) {
      hideMemoryBackground();
      return;
    }
    if (memBgReady[src] !== true) {
      var probe = new Image();
      probe.onload = function () {
        memBgReady[src] = true;
        updateMemoryBackground(f);
      };
      probe.onerror = function () {
        memBgReady[src] = false;
        hideMemoryBackground();
      };
      probe.src = bgSrc(src);
      return;
    }
    var active = memBgSlot === 0 ? memBgA : memBgB;
    var next = memBgSlot === 0 ? memBgB : memBgA;
    var url = bgSrc(src);
    var cur = layerSrc(active);
    if (cur && (cur.indexOf(src) !== -1 || cur.indexOf(url) !== -1)) {
      memBg.classList.add("visible");
      return;
    }
    next.src = url;
    active.classList.remove("is-active");
    next.classList.add("is-active");
    memBgSlot = 1 - memBgSlot;
    memBg.classList.add("visible");
  }

  function updateMemCrumb(f) {
    if (!memCrumb) return;
    var inMemory = state.opened && charSelect.classList.contains("gone");
    document.body.classList.toggle("memory-open", inMemory);
    memCrumb.hidden = !inMemory;
    if (!inMemory || !f) return;
    if (memCrumbIdx) memCrumbIdx.textContent = "MEMORY " + f.recv + " OF " + TOTAL;
    if (memCrumbTitle) memCrumbTitle.textContent = f.title;
  }

  function render(f) {
    syncPossessionUI();
    tcYr.textContent = f.era.toUpperCase();
    tcIdx.textContent = "MEMORY " + f.recv + " OF " + TOTAL;
    tcTitle.textContent = f.title;
    tcLine.textContent = f.line;

    if (f.id === "fall") {
      roChannel.textContent = fallInhabitant(state.channel).channelLabel;
    } else {
      roChannel.textContent = state.channel === "inner" ? "INSIDE HIM" : "THE WORLD";
    }
    roFrag.textContent = f.recv + " / " + TOTAL;
    roEra.textContent = f.era.toUpperCase();

    roRoles.innerHTML = f.roles.map(function (r) {
      return '<span class="chip' + (r.lead ? " lead" : "") + '">' + r.t + '</span>';
    }).join("");

    if (f.id !== "fall") {
      if (state.channel === "inner") {
        roDecode.innerHTML = "<b>" + f.inner.g + "</b><br>" + f.inner.line;
        roSeedTxt.textContent = f.inner.seed;
        roSeed.classList.toggle("idle", !!f.inner.idle);
      } else {
        roDecode.innerHTML = f.outer;
        roSeedTxt.textContent = "it was never them";
        roSeed.classList.remove("idle");
      }
    }

    if (f.id === "fall") {
      if (audioUnlocked) startVoicePossession();
    } else {
      stopPossession();
      updateMemoryBackground(f);
    }
    updateMemCrumb(f);
    trackPerspective(f.id);
    applyClarityVisuals(f.id);
    syncChainStrip();
  }

  // ============================================================
  // CHANNEL
  // ============================================================
  function setChannel(ch) {
    if (isPossessionMode() && fallPossessionActive()) {
      if (ch !== fallActiveSide()) fallSwitchSide(ch);
      return;
    }
    state.channel = ch;
    document.body.setAttribute("data-channel", ch);
    chOuter.classList.toggle("on", ch === "outer");
    chInner.classList.toggle("on", ch === "inner");
    trackPerspective(state.active);
    if (tv && !charSelect.classList.contains("gone")) tv.setChannelTint(ch);
    render(byId[state.active]);
    refreshNodes();
    save();
  }
  chOuter.addEventListener("click", function () { setChannel("outer"); });
  chInner.addEventListener("click", function () { setChannel("inner"); });

  // ============================================================
  // ORDER
  // ============================================================
  function setOrder(order) {
    state.order = order;
    ordRemembered.setAttribute("aria-pressed", order === "remembered" ? "true" : "false");
    ordReceived.setAttribute("aria-pressed", order === "received" ? "true" : "false");
    setOrderNote();
    repositionNodes();
    rotateToFront(state.active);
    save();
  }
  function setOrderNote() {
    orderNote.textContent = state.order === "received" ? "the chain's true sequence" : "how memory surfaces";
  }
  ordRemembered.addEventListener("click", function () { setOrder("remembered"); });
  ordReceived.addEventListener("click", function () { setOrder("received"); });

  // ============================================================
  // JOG + KEYBOARD
  // ============================================================
  function jog(dir) {
    if (isPossessionMode() && !getMemState("fall").seen) return;
    var arr = state.order === "received" ? RECEIVED : REMEMBERED;
    var i = arr.indexOf(state.active);
    var n = i + dir;
    while (n >= 0 && n < arr.length) {
      if (!(byId[arr[n]].terminus && isTerminusLocked())) {
        playScoreOnGesture(scoreCueFor(arr[n]));
        select(arr[n], true);
        return;
      }
      n += dir;
    }
  }
  jogPrev.addEventListener("click", function () { jog(-1); });
  jogNext.addEventListener("click", function () { jog(1); });
  document.addEventListener("keydown", function (e) {
    if (!state.opened || !charSelect.classList.contains("gone")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); jog(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); jog(-1); }
    else if (e.key.toLowerCase() === "c") { setChannel(state.channel === "outer" ? "inner" : "outer"); }
    else if (e.code === "Space" && canDevelop(state.active)) {
      e.preventDefault();
      if (!developSpace) {
        developSpace = true;
        developing = true;
        if (state.active === "fall" && fallPossessionActive()) fallBeginHold();
        stage.classList.add("developing");
        ensureDevelopLoop();
      }
    }
  });
  document.addEventListener("keyup", function (e) {
    if (e.code === "Space") endDevelopSpace();
  });

  // ============================================================
  // SCORE CUE + CLOCK + COLD OPEN
  // ============================================================
  var scoreIframe = document.getElementById("haizinaPlayer");
  var scoreLabel = document.getElementById("scoreLabel");
  var scWidget = null;
  var scReady = false;
  var scLoadPending = false;
  var loadedCueIdx = -1;
  var scoreAutoplayPending = false;
  var pendingCue = null;
  var pendingAutoplay = false;
  var cueIdx = 0;
  var scoreGestureUnlocked = false;
  var scoreInited = false;
  var scoreWidgetBound = false;

  function unlockScoreGesture() {
    scoreGestureUnlocked = true;
  }
  document.addEventListener("pointerdown", unlockScoreGesture, true);
  document.addEventListener("keydown", unlockScoreGesture, true);

  function scoreEmbedSrc(track, autoplay) {
    return "https://w.soundcloud.com/player/?visual=false&url=" + encodeURIComponent(track.api) +
      "&secret_token=" + encodeURIComponent(track.secret) +
      "&auto_play=" + (autoplay ? "true" : "false") +
      "&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false&color=%2346ff97";
  }

  function updateScoreLabel() {
    var t = SCORE_CUE[cueIdx];
    if (scoreLabel && t) scoreLabel.textContent = t.label;
    if (score && t) score.setAttribute("aria-label", "Play score — " + t.label);
  }

  function scoreCueFor(id) {
    var f = byId[id];
    return f && typeof f.cue === "number" ? f.cue : 0;
  }

  function startScoreForMemory(id, autoplay) {
    loadScoreCue(scoreCueFor(id), autoplay !== false);
  }

  function pauseScore() {
    if (scWidget && scReady) scWidget.pause();
    score.classList.remove("playing");
  }

  function previewScoreForMemory(id) {
    loadScoreCue(scoreCueFor(id), false);
  }

  // Preload the fall score (paused) so the widget is READY before TUNE IN is
  // pressed. That lets the click trigger a true synchronous gesture-play, which
  // low-MEI / incognito Chrome and Safari both require to start audio. We also
  // actively defeat any stray autoplay (SoundCloud's load(auto_play:false) does
  // not reliably stop playback) so the score truly waits behind the gate.
  function preloadFallScore() {
    try {
      previewScoreForMemory("fall");
      var killStrayAutoplay = function () {
        if (audioUnlocked) return; // user tuned in — leave the score playing
        if (scWidget) { try { scWidget.pause(); } catch (e) {} }
        if (score) score.classList.remove("playing");
      };
      killStrayAutoplay();
      setTimeout(killStrayAutoplay, 300);
      setTimeout(killStrayAutoplay, 900);
      setTimeout(killStrayAutoplay, 1700);
    } catch (e) {}
  }

  function ensureScorePlaying(vol) {
    if (!scWidget || !scReady || scLoadPending) {
      scoreAutoplayPending = true;
      return false;
    }
    setScoreVolume(typeof vol === "number" ? vol : 100);
    scWidget.play();
    return true;
  }

  function retryScorePlay(delays) {
    (delays || [0, 120, 400, 900, 1800]).forEach(function (ms) {
      setTimeout(function () {
        if (!scoreAutoplayPending) return;
        if (ensureScorePlaying(100)) scoreAutoplayPending = false;
      }, ms);
    });
  }

  /** Call only from click / pointerdown / keydown handlers — sync play() in gesture context */
  function playScoreOnGesture(i) {
    unlockScoreGesture();
    var t = SCORE_CUE[i];
    if (!t) return;
    cueIdx = i;
    updateScoreLabel();
    scoreAutoplayPending = true;
    if (scWidget && scReady && !scLoadPending && loadedCueIdx === i) {
      if (ensureScorePlaying(100)) {
        scoreAutoplayPending = false;
        retryScorePlay([120, 500]);
      }
      return;
    }
    loadScoreCue(i, true);
    retryScorePlay();
  }

  function loadScoreCue(i, autoplay) {
    var t = SCORE_CUE[i];
    if (!t) return;
    var shouldPlay = !!autoplay;
    cueIdx = i;
    updateScoreLabel();
    if (scWidget && scReady && !scLoadPending && loadedCueIdx === i) {
      if (shouldPlay) {
        scoreAutoplayPending = true;
        if (ensureScorePlaying(100)) scoreAutoplayPending = false;
        else retryScorePlay();
      }
      return;
    }
    if (!scWidget) {
      pendingCue = i;
      pendingAutoplay = shouldPlay;
      scoreAutoplayPending = shouldPlay;
      if (scoreIframe) scoreIframe.src = scoreEmbedSrc(t, shouldPlay);
      if (shouldPlay) retryScorePlay();
      return;
    }
    if (scLoadPending) {
      pendingCue = i;
      pendingAutoplay = shouldPlay;
      scoreAutoplayPending = shouldPlay;
      return;
    }
    scoreAutoplayPending = shouldPlay;
    scReady = false;
    scLoadPending = true;
    scWidget.load(t.page, { auto_play: shouldPlay });
    if (shouldPlay) retryScorePlay();
  }

  function advanceScoreCue() {
    if (cueIdx + 1 < SCORE_CUE.length) loadScoreCue(cueIdx + 1, true);
    else score.classList.remove("playing");
  }

  function toggleScorePlayback() {
    unlockScoreGesture();
    if (!scWidget || !scReady || scLoadPending) {
      hardStartScore(cueIdx);
      return;
    }
    scWidget.isPaused(function (paused) {
      if (paused) ensureScorePlaying(100);
      else scWidget.pause();
    });
  }

  function onScorePlay() {
    score.classList.add("playing");
    scoreAutoplayPending = false;
    lastSyncScoreVol = -1;
    if (charSelect && !charSelect.classList.contains("gone")) {
      setScoreVolume(100);
      return;
    }
    var ms = getMemState(state.active);
    if (state.active === "fall" && audioUnlocked && !ms.seen) {
      setScoreVolume(Math.max(72, Math.round(Math.max(0.72, ms.clarity) * 100)));
      return;
    }
    syncMusicToClarity(ms.seen ? 1 : Math.max(0.45, ms.clarity), ms.seen);
  }

  function onScoreReady() {
    scReady = true;
    scLoadPending = false;
    loadedCueIdx = cueIdx;
    updateScoreLabel();
    if (pendingCue !== null) {
      var i = pendingCue;
      var ap = pendingAutoplay;
      pendingCue = null;
      pendingAutoplay = false;
      loadScoreCue(i, ap);
      return;
    }
    if (scoreAutoplayPending) {
      scoreAutoplayPending = false;
      ensureScorePlaying(100);
    }
  }

  function bindScoreWidget() {
    if (!scoreIframe || !window.SC || !window.SC.Widget) return false;
    if (!scWidget) scWidget = SC.Widget(scoreIframe);
    if (scoreWidgetBound) return true;
    scoreWidgetBound = true;
    scWidget.bind(SC.Widget.Events.READY, onScoreReady);
    scWidget.bind(SC.Widget.Events.PLAY, onScorePlay);
    scWidget.bind(SC.Widget.Events.PAUSE, function () { score.classList.remove("playing"); });
    scWidget.bind(SC.Widget.Events.FINISH, advanceScoreCue);
    return true;
  }

  /** Load + play score inside a user-gesture handler */
  function hardStartScore(i) {
    var t = SCORE_CUE[i];
    if (!t || !scoreIframe) return;
    unlockScoreGesture();
    cueIdx = i;
    scoreAutoplayPending = true;
    updateScoreLabel();
    loadedCueIdx = -1;
    scReady = false;
    scLoadPending = true;
    // Reload the iframe with autoplay baked into the URL. The play intent
    // travels with the navigation, which we trigger inside the user gesture —
    // this is what lets Safari actually start the audio.
    scoreIframe.src = scoreEmbedSrc(t, true);
    scoreWidgetBound = false;
    scWidget = null;
    bindScoreWidget();
    retryScorePlay([0, 400, 1000, 2000, 3500]);
  }

  function initScore() {
    if (scoreInited || !scoreIframe || !window.SC || !window.SC.Widget) return;
    scoreInited = true;
    bindScoreWidget();
    updateScoreLabel();
  }

  score.addEventListener("click", toggleScorePlayback);

  if (window.SC && window.SC.Widget) initScore();
  else {
    var scApi = document.querySelector('script[src*="soundcloud.com/player/api"]');
    if (scApi) scApi.addEventListener("load", initScore);
  }

  var frames = 0, clockTimer = null;
  function startClock() {
    if (clockTimer) return;
    clockTimer = setInterval(function () {
      frames++;
      var s = Math.floor(frames / 25);
      masterTc.textContent = ("0" + Math.floor(s / 3600)).slice(-2) + ":" + ("0" + (Math.floor(s / 60) % 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2) + ":" + ("0" + (frames % 25)).slice(-2);
    }, 40);
  }

  // ============================================================
  // CHARACTER SELECT
  // ============================================================
  var csPick = RECEIVED[0];
  var csHover = null;

  // ---- character relief (P1–P4 photos + depth-displaced hologram) ----
  var CHAR_PHOTOS = {
    fall:     { color: "/img/mvt1/characters/noble.png",       depth: "/img/mvt1/characters/noble-depth.jpg" },
    blessing: { color: "/img/mvt1/characters/grandmother.jpg", depth: "/img/mvt1/characters/grandmother-depth.jpg" },
    backseat: { color: "/img/mvt1/characters/son.jpg",         depth: "/img/mvt1/characters/son-depth.jpg" },
    glass:    { color: "/img/mvt1/characters/doctor.jpg",       depth: "/img/mvt1/characters/doctor-depth.jpg" }
  };
  var RELIEF_SEG_W = 200;
  var RELIEF_SEG_H = 260;
  var RELIEF_DISPLACEMENT = 0.32;
  var RELIEF_OPACITY = 0.7;
  var CHANNEL_TINT = { outer: 0x46ff97, inner: 0xff5546 };

  var tv = null;
  var FCOL = { BLOOD: 0x46ff97, PLACE: 0x4ff6ff, WORLD: 0xff5546, DARK: 0xff7a4d };

  function channelTintHex() {
    return CHANNEL_TINT[state.channel === "inner" ? "inner" : "outer"];
  }

  function rosterPortraitHtml(id, c, locked) {
    if (locked || c.model === "cage" || c.model === "orb") return flatSVG(kindOf(c));
    var ph = CHAR_PHOTOS[id];
    if (ph) return '<img class="cc-photo" src="' + ph.color + '" alt="" decoding="async" />';
    return flatSVG(kindOf(c));
  }

  function holoOverlayMaterial(T, tintHex) {
    return new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      side: T.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uTint: { value: new T.Color(tintHex) },
        uFlick: { value: 1 }
      },
      vertexShader: [
        "varying vec2 vUv;",
        "varying vec3 vNorm;",
        "void main(){",
        "  vUv = uv;",
        "  vNorm = normalize(normalMatrix * normal);",
        "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
        "}"
      ].join("\n"),
      fragmentShader: [
        "uniform float uTime;",
        "uniform vec3 uTint;",
        "uniform float uFlick;",
        "varying vec2 vUv;",
        "varying vec3 vNorm;",
        "void main(){",
        "  float scan = step(0.5, fract(vUv.y * 260.0 + uTime * 0.45));",
        "  float rim = pow(1.0 - abs(vNorm.z), 2.0);",
        "  float a = scan * rim * uFlick * 0.32;",
        "  vec3 col = uTint * a;",
        "  col.r += sin(uTime * 3.0) * 0.025;",
        "  col.b += cos(uTime * 2.6) * 0.025;",
        "  gl_FragColor = vec4(col, a);",
        "}"
      ].join("\n")
    });
  }

  function luminanceDepthFromImage(img, T) {
    var c = document.createElement("canvas");
    c.width = img.naturalWidth || img.width;
    c.height = img.naturalHeight || img.height;
    var ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, c.width, c.height);
    var data = ctx.getImageData(0, 0, c.width, c.height);
    var d = data.data;
    for (var i = 0; i < d.length; i += 4) {
      var lum = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      d[i] = d[i + 1] = d[i + 2] = lum;
    }
    ctx.putImageData(data, 0, 0);
    // soften auto-depth so relief reads as face, not spikes
    var blur = document.createElement("canvas");
    blur.width = c.width;
    blur.height = c.height;
    var bctx = blur.getContext("2d");
    bctx.filter = "blur(4px)";
    bctx.drawImage(c, 0, 0);
    var tex = new T.CanvasTexture(blur);
    if (T.NoColorSpace) tex.colorSpace = T.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  function makeReliefViewer(container) {
    if (!window.THREE) return null;
    var T = window.THREE;
    var w = Math.max(container.clientWidth, 280);
    var h = Math.max(container.clientHeight, 320);
    var renderer;
    try {
      renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      return null;
    }
    if (!renderer) return null;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.setClearAlpha(0);
    var cv = renderer.domElement;
    cv.className = "relief-canvas";
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:2";
    container.appendChild(cv);

    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(32, w / h, 0.1, 100);
    camera.position.set(0, 0, 3.55);

    var key = new T.DirectionalLight(0xffffff, 1.25);
    key.position.set(1.1, 2.6, 3.8);
    scene.add(key);
    var rim = new T.DirectionalLight(0xbfffe0, 0.9);
    rim.position.set(-2.4, 0.6, -2.2);
    scene.add(rim);
    scene.add(new T.AmbientLight(0xffffff, 0.32));

    var group = new T.Group();
    scene.add(group);

    var holoMat = null;
    var reliefMesh = null;
    var pointer = { x: 0, y: 0 };
    var raf = null;
    var running = false;
    var reduce = reduceMotion;
    var lastIcon = { model: "noble", col: 0x46ff97, lock: false };
    var currentReliefId = null;

    function disposeObj(o) {
      if (!o) return;
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach(function (m) { m.dispose(); });
        else o.material.dispose();
      }
    }

    function clearGroup() {
      while (group.children.length) {
        var c = group.children.pop();
        disposeObj(c);
      }
      holoMat = null;
      reliefMesh = null;
    }

    function bust(prof) {
      return new T.LatheGeometry(prof.map(function (p) { return new T.Vector2(p[0], p[1]); }), 56);
    }
    var PROF = {
      noble: [[0.02,-1.3],[0.8,-1.26],[0.84,-1.05],[0.62,-0.85],[0.34,-0.62],[0.24,-0.35],[0.24,-0.1],[0.4,0.12],[0.56,0.42],[0.58,0.7],[0.46,0.95],[0.24,1.12],[0.02,1.2]],
      grandmother: [[0.02,-1.2],[1.06,-1.16],[1.08,-0.94],[0.84,-0.7],[0.5,-0.5],[0.32,-0.32],[0.32,-0.12],[0.5,0.06],[0.66,0.32],[0.66,0.56],[0.52,0.78],[0.3,0.92],[0.02,0.98]],
      son: [[0.02,-1.28],[1.22,-1.24],[1.24,-1.0],[0.92,-0.74],[0.5,-0.56],[0.32,-0.4],[0.32,-0.18],[0.5,0.0],[0.66,0.3],[0.68,0.56],[0.54,0.8],[0.3,0.98],[0.02,1.05]],
      doctor: [[0.02,-1.24],[0.82,-1.2],[0.85,-1.0],[0.6,-0.78],[0.34,-0.6],[0.22,-0.4],[0.22,-0.16],[0.38,0.04],[0.52,0.32],[0.54,0.58],[0.44,0.82],[0.24,1.0],[0.02,1.07]]
    };

    function addFig(geo, col, lock) {
      var solid = new T.Mesh(geo, new T.MeshPhongMaterial({
        color: col, emissive: col, emissiveIntensity: lock ? 0.1 : 0.28,
        transparent: true, opacity: lock ? 0.06 : 0.22, flatShading: true, shininess: 40, side: T.DoubleSide
      }));
      var wire = new T.LineSegments(new T.WireframeGeometry(geo), new T.LineBasicMaterial({
        color: col, transparent: true, opacity: lock ? 0.16 : 0.58
      }));
      group.add(solid);
      group.add(wire);
    }

    function setIconModel(model, col, lock) {
      clearGroup();
      currentReliefId = null;
      lastIcon = { model: model, col: col, lock: lock };
      if (model === "cage") {
        var body = new T.BoxGeometry(1.5, 1.45, 1.2); body.translate(0, -0.42, 0); addFig(body, col, lock);
        var roof = new T.ConeGeometry(1.18, 0.95, 4); roof.rotateY(Math.PI / 4); roof.translate(0, 0.72, 0); addFig(roof, col, lock);
        [-0.32, 0, 0.32].forEach(function (x) {
          var bar = new T.BoxGeometry(0.07, 1.32, 0.07); bar.translate(x, -0.45, 0.62); addFig(bar, col, lock);
        });
      } else if (model === "orb") {
        addFig(new T.IcosahedronGeometry(1.15, 1), col, lock);
        addFig(new T.IcosahedronGeometry(1.62, 0), col, lock);
      } else {
        addFig(bust(PROF[model] || PROF.son), col, lock);
        if (model === "noble") { var crown = new T.ConeGeometry(0.46, 0.62, 4); crown.translate(0, 1.42, 0); addFig(crown, col, lock); }
        else if (model === "grandmother") { var bun = new T.SphereGeometry(0.26, 16, 12); bun.translate(0, 1.04, 0); addFig(bun, col, lock); }
        else if (model === "doctor") { var collar = new T.TorusGeometry(0.42, 0.06, 10, 30); collar.rotateX(Math.PI / 2); collar.translate(0, -0.34, 0); addFig(collar, col, lock); }
        else if (model === "son") { var brow = new T.TorusGeometry(0.5, 0.08, 8, 4); brow.rotateX(Math.PI / 2); brow.translate(0, 0.5, 0); addFig(brow, col, lock); }
      }
      render();
    }

    function buildRelief(colorTex, depthTex, tintHex) {
      clearGroup();
      var img = colorTex.image;
      var aspect = (img.width || 1) / (img.height || 1);
      var planeH = 2.55;
      var planeW = planeH * aspect;
      var geo = new T.PlaneGeometry(planeW, planeH, RELIEF_SEG_W, RELIEF_SEG_H);
      var tint = new T.Color(tintHex);
      reliefMesh = new T.Mesh(geo, new T.MeshStandardMaterial({
        map: colorTex,
        displacementMap: depthTex,
        displacementScale: planeH * RELIEF_DISPLACEMENT,
        displacementBias: -planeH * RELIEF_DISPLACEMENT * 0.18,
        transparent: true,
        opacity: RELIEF_OPACITY,
        depthWrite: false,
        roughness: 0.68,
        metalness: 0.04,
        emissive: tint,
        emissiveIntensity: 0.14
      }));
      group.add(reliefMesh);
      holoMat = holoOverlayMaterial(T, tintHex);
      var holo = new T.Mesh(geo.clone(), holoMat);
      holo.position.z = 0.003;
      group.add(holo);
      render();
    }

    var loadGen = 0;

    function loadImage(url) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = function () { reject(new Error("img fail " + url)); };
        img.src = url;
      });
    }

    function setCharacter(charId, tintHex, locked) {
      var c = CHARS[charId];
      var photos = CHAR_PHOTOS[charId];
      var useIcon = locked || !photos || c.model === "cage" || c.model === "orb";
      if (useIcon) {
        setIconModel(locked ? "orb" : c.model, tintHex, locked);
        return;
      }
      if (reliefMesh && currentReliefId === charId) {
        setChannelTint(state.channel === "inner" ? "inner" : "outer");
        render();
        return;
      }
      currentReliefId = charId;
      var gen = ++loadGen;
      clearGroup();
      render();
      Promise.all([
        loadImage(photos.color),
        loadImage(photos.depth).catch(function () { return null; })
      ]).then(function (res) {
        if (gen !== loadGen) return;
        var colorImg = res[0];
        var depthImg = res[1];
        var colorTex = new T.Texture(colorImg);
        if (T.SRGBColorSpace) colorTex.colorSpace = T.SRGBColorSpace;
        colorTex.needsUpdate = true;
        var depthTex;
        if (depthImg) {
          depthTex = new T.Texture(depthImg);
          if (T.NoColorSpace) depthTex.colorSpace = T.NoColorSpace;
          depthTex.needsUpdate = true;
        } else {
          depthTex = luminanceDepthFromImage(colorImg, T);
        }
        buildRelief(colorTex, depthTex, tintHex);
        currentReliefId = charId;
      }).catch(function () {
        if (gen !== loadGen) return;
        setIconModel(c.model || "son", tintHex, false);
      });
    }

    function setChannelTint(channel) {
      var hex = CHANNEL_TINT[channel === "inner" ? "inner" : "outer"];
      if (holoMat) holoMat.uniforms.uTint.value.setHex(hex);
      if (reliefMesh && reliefMesh.material) {
        reliefMesh.material.emissive.setHex(hex);
        reliefMesh.material.needsUpdate = true;
      }
    }

    container.addEventListener("pointermove", function (e) {
      var r = container.getBoundingClientRect();
      if (!r.width) return;
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });

    function render() { renderer.render(scene, camera); }

    function loop(t) {
      raf = requestAnimationFrame(loop);
      var sway = Math.sin(t * 0.00055) * 0.21;
      group.rotation.y = sway + pointer.x * 0.055;
      group.rotation.x = Math.sin(t * 0.0004) * 0.035 - pointer.y * 0.065;
      if (holoMat) {
        holoMat.uniforms.uTime.value = t * 0.001;
        holoMat.uniforms.uFlick.value = 0.86 + Math.sin(t * 0.0045) * 0.14;
      }
      render();
    }

    function start() {
      if (running) return;
      running = true;
      if (reduce) { render(); running = false; return; }
      loop(performance.now());
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    function resize() {
      var ww = Math.max(container.clientWidth, 280);
      var hh = Math.max(container.clientHeight, 280);
      if (!ww || !hh) return;
      renderer.setSize(ww, hh);
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
      render();
    }

    return { setCharacter: setCharacter, setIconModel: setIconModel, setChannelTint: setChannelTint, start: start, stop: stop, resize: resize };
  }

  function ensurePortraitViewer() {
    if (!window.THREE) return null;
    if (!tv) {
      fPortrait.innerHTML = "";
      tv = makeReliefViewer(fPortrait);
    }
    return tv;
  }

  function kickPortraitViewer(id, locked) {
    var viewer = ensurePortraitViewer();
    if (!viewer) return;
    fPortrait.className = "fportrait" + (locked ? " lockedfig" : "");
    viewer.setCharacter(id, channelTintHex(), locked);
    viewer.setChannelTint(state.channel);
    requestAnimationFrame(function () {
      viewer.resize();
      viewer.start();
    });
  }

  function facClass(fac) { return fac === "PLACE" ? "fac-place" : (fac === "WORLD" || fac === "DARK") ? "fac-world" : ""; }
  function charLocked(id) { return !!CHARS[id].locked && isTerminusLocked(); }

  function paintFeatured(id) {
    var c = CHARS[id];
    if (!c) return;
    var locked = charLocked(id);
    Array.prototype.forEach.call(roster.querySelectorAll(".char-card"), function (el) {
      var cid = el.getAttribute("data-id");
      el.classList.toggle("sel", cid === csPick);
      el.classList.toggle("hover", !!csHover && cid === csHover);
    });
    featured.className = "featured " + facClass(c.fac);
    fWatermark.textContent = c.p;
    if (window.THREE) kickPortraitViewer(id, locked);
    else {
      fPortrait.className = "fportrait" + (locked ? " lockedfig" : "");
      fPortrait.innerHTML = build3d(locked ? "dark" : kindOf(c));
    }
    fP1.textContent = "P" + c.p + " / " + TOTAL;
    fName.textContent = locked ? "LOCKED" : c.name;
    fHands.textContent = c.hands;
    fTags.innerHTML = (locked ? '<span class="ftag">LOCKED</span>' : '<span class="ftag">MEMORY ' + c.p + ' OF ' + TOTAL + '</span>');
  }

  function playRosterScore(id, fromGesture) {
    if (charLocked(id)) {
      pauseScore();
      return;
    }
    if (fromGesture) {
      playScoreOnGesture(scoreCueFor(id));
      return;
    }
    loadScoreCue(scoreCueFor(id), false);
  }

  function previewChar(id) {
    if (!CHARS[id] || csHover === id) return;
    csHover = id;
    paintFeatured(id);
    loadScoreCue(scoreCueFor(id), false);
  }

  function rosterPreviewTarget(e) {
    if (!charSelect || charSelect.classList.contains("gone")) return null;
    if (!roster || !roster.contains(e.target)) return null;
    var card = e.target.closest(".char-card");
    return card ? card.getAttribute("data-id") : null;
  }

  function onRosterPointerOver(e) {
    var id = rosterPreviewTarget(e);
    if (id) previewChar(id);
  }

  function onRosterPointerDown(e) {
    var id = rosterPreviewTarget(e);
    if (!id) return;
    unlockScoreGesture();
    if (csHover !== id) previewChar(id);
    playRosterScore(id, true);
  }

  function onRosterPointerLeave(e) {
    if (!csHover || !rosterWrap) return;
    var next = e.relatedTarget;
    if (next && rosterWrap.contains(next)) return;
    clearRosterHover();
  }

  function buildRoster() {
    roster.innerHTML = "";
    RECEIVED.forEach(function (id) {
      var c = CHARS[id];
      var locked = charLocked(id);
      var card = document.createElement("button");
      card.className = "char-card " + facClass(c.fac) + (locked ? " locked" : "");
      card.setAttribute("data-id", id);
      card.innerHTML =
        '<span class="cc-idx">P' + c.p + '</span>' +
        '<span class="cc-dots">' + (locked ? '' : '<i></i><i></i><i></i>') + '</span>' +
        '<span class="cc-portrait">' + rosterPortraitHtml(id, c, locked) + '</span>' +
        (locked ? '<span class="cc-lock">?</span>' : '') +
        '<span class="cc-plate"><span class="cc-name">' + (locked ? "LOCKED" : c.name) + '</span></span>';
      card.addEventListener("click", function () {
        if (charLocked(id)) { highlightChar(id); return; }
        enterWith(id);
      });
      roster.appendChild(card);
    });
  }

  function clearRosterHover() {
    if (!csHover) return;
    csHover = null;
    paintFeatured(csPick);
    playRosterScore(csPick);
  }

  function highlightChar(id) {
    csPick = id;
    csHover = null;
    paintFeatured(id);
    playScoreOnGesture(scoreCueFor(id));
  }

  function onTuneIn() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    pendingFallEntry = false;
    resetFallSessionIfNeeded();
    primeSpeech();
    syncPossessionUI();
    showFallStageUI(getFallSides().outer.seen ? "inner" : "outer");
    startVoicePossession();
    if (tuneGate) {
      tuneGate.classList.add("is-off");
      setTimeout(function () {
        tuneGate.hidden = true;
        tuneGate.setAttribute("aria-hidden", "true");
      }, 900);
    }
    startClock();
    unlockScoreGesture();
    // Start the score synchronously inside this click. Browsers (esp. Safari and
    // low-MEI / incognito Chrome) only permit audio that begins within the
    // user-gesture call stack. Because the score is preloaded when the gate
    // appears, the widget is already READY, so playScoreOnGesture issues a true
    // synchronous play(); hardStartScore is the reload fallback if it wasn't.
    try { playScoreOnGesture(scoreCueFor("fall")); } catch (e) { hardStartScore(scoreCueFor("fall")); }
    ensureSynthHum();
    if (synthHumCtx && synthHumCtx.state === "suspended") synthHumCtx.resume();
    setHumTarget(0.06);
    applyClarityVisuals("fall");
    ensureDevelopLoop();
  }
  if (tuneGateBtn) tuneGateBtn.addEventListener("click", onTuneIn);

  function enterWith(id) {
    if (charLocked(id)) return;
    if (id !== "fall") playScoreOnGesture(scoreCueFor(id));
    charSelect.classList.add("gone");
    if (tv) tv.stop();
    state.opened = true;

    if (id === "fall") {
      pendingFallEntry = true;
      audioUnlocked = false;
      stopIdle();
      if (tuneGate) {
        tuneGate.hidden = false;
        tuneGate.classList.remove("is-off");
        tuneGate.setAttribute("aria-hidden", "false");
      }
      preloadFallScore();
      select(id, true);
    } else {
      startClock();
      if (!reduceMotion) startIdle();
      select(id, true);
    }
    save();
  }

  function openRoster() {
    pauseScore();
    stopIdle();
    buildRoster();
    highlightChar(charLocked(csPick) ? RECEIVED[0] : csPick);
    charSelect.classList.remove("gone");
    if (tv) { requestAnimationFrame(function () { tv.resize(); tv.start(); }); }
  }

  function goHome() {
    if (!charSelect.classList.contains("gone")) return;
    developing = false;
    developPointer = false;
    developSpace = false;
    if (developRAF) { cancelAnimationFrame(developRAF); developRAF = null; }
    stage.classList.remove("developing");
    state.opened = false;
    audioUnlocked = false;
    pendingFallEntry = false;
    if (tuneGate) {
      tuneGate.classList.add("is-off");
      tuneGate.hidden = true;
      tuneGate.setAttribute("aria-hidden", "true");
    }
    stopPossession();
    syncPossessionUI();
    hideMemoryBackground();
    updateMemCrumb(null);
    openRoster();
    save();
  }

  function featuredPick() { return csHover || csPick; }

  window.addEventListener("resize", function () {
    if (tv) tv.resize();
    if (inhabitantView) inhabitantView.resize();
  });
  if (roster) {
    roster.addEventListener("pointerover", onRosterPointerOver);
    roster.addEventListener("pointerdown", onRosterPointerDown);
  }
  if (rosterWrap) rosterWrap.addEventListener("pointerleave", onRosterPointerLeave);

  rosterBtn.addEventListener("click", goHome);
  if (brandHome) brandHome.addEventListener("click", goHome);
  if (memCrumbHome) memCrumbHome.addEventListener("click", goHome);
  if (memCrumbBack) memCrumbBack.addEventListener("click", goHome);
  if (featured) {
    featured.addEventListener("click", function () {
      if (charSelect.classList.contains("gone")) return;
      var id = featuredPick();
      if (!charLocked(id)) enterWith(id);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (charSelect.classList.contains("gone")) return;
    var i = RECEIVED.indexOf(csPick);
    if (e.key === "ArrowRight") { e.preventDefault(); highlightChar(RECEIVED[Math.min(RECEIVED.length - 1, i + 1)]); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); highlightChar(RECEIVED[Math.max(0, i - 1)]); }
    else if (e.key === "Enter") { e.preventDefault(); var id = featuredPick(); if (!charLocked(id)) enterWith(id); }
  });

  // ============================================================
  // PERSISTENCE
  // ============================================================
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  function load() {
    try {
      var raw = localStorage.getItem(STORE);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && typeof s === "object") {
          if (Array.isArray(s.witnessed)) state.witnessed = s.witnessed.filter(function (id) { return byId[id]; });
          if (s.order === "received" || s.order === "remembered") state.order = s.order;
          if (s.channel === "inner" || s.channel === "outer") state.channel = s.channel;
          if (s.active && byId[s.active]) state.active = s.active;
          state.opened = !!s.opened;
          if (s.memoryState && typeof s.memoryState === "object") state.memoryState = s.memoryState;
          if (s.fallSides && typeof s.fallSides === "object") state.fallSides = s.fallSides;
        }
      }
    } catch (e) {}
    initMemoryStates();
    if (!state.fallSides) state.fallSides = defaultFallSides();
    ["outer", "inner"].forEach(function (ch) {
      var s = state.fallSides[ch];
      if (s && typeof s.seen !== "boolean") {
        s.seen = !!(s.testimonyDone && s.clarityLocked);
      }
    });
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    document.body.setAttribute("data-channel", state.channel);
    chOuter.classList.toggle("on", state.channel === "outer");
    chInner.classList.toggle("on", state.channel === "inner");
    ordRemembered.setAttribute("aria-pressed", state.order === "remembered" ? "true" : "false");
    ordReceived.setAttribute("aria-pressed", state.order === "received" ? "true" : "false");
    setOrderNote();
    ring.classList.remove("idle");
    preloadMemoryBackgrounds();
    buildNodes();
    updateMeter();
    updateSeenMeter();
    if (state.witnessed.indexOf("installed") !== -1) { crt.classList.add("installed"); coreSeed.innerHTML = "IT HOLDS<br>ON ITS OWN"; }

    // park ring on active without glitch
    csPick = (state.active && !charLocked(state.active)) ? state.active : RECEIVED[0];
    buildRoster();
    if (state.opened && state.active === "fall" && !charLocked(state.active)) {
      // Entering the fall memory: park the ring but do NOT autoplay. The score
      // must wait behind the TUNE IN gate and start on that click, so we only
      // preload it paused here (highlightChar would have played it immediately).
      csPick = "fall";
      csHover = null;
      paintFeatured("fall");
      preloadFallScore();
    } else {
      highlightChar(csPick);
    }

    if (state.opened && state.active && !charLocked(state.active)) {
      charSelect.classList.add("gone");
      if (state.active === "fall") {
        audioUnlocked = false;
        if (tuneGate) {
          tuneGate.hidden = false;
          tuneGate.classList.remove("is-off");
          tuneGate.setAttribute("aria-hidden", "false");
        }
        stopIdle();
      } else {
        startClock();
        if (!reduceMotion) startIdle();
        else stopIdle();
        if (tuneGate) {
          tuneGate.hidden = true;
          tuneGate.classList.add("is-off");
          tuneGate.setAttribute("aria-hidden", "true");
        }
      }
    } else {
      if (tuneGate) {
        tuneGate.hidden = true;
        tuneGate.classList.add("is-off");
        tuneGate.setAttribute("aria-hidden", "true");
      }
      state.opened = false;
      hideMemoryBackground();
      charSelect.classList.remove("gone");
    }

    spin = -angleOf(state.active);
    ring.style.transition = "none";
    ring.style.transform = "rotateY(" + spin + "deg)";
    render(byId[state.active]);
    refreshNodes();
  }
  init();
})();
