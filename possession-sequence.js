/* ============================================================
   Possession sequence — Memory 1 plays in time
   ============================================================ */
(function (global) {
  "use strict";

  var PHASE = {
    IDLE: "idle",
    ARRIVAL: "arrival",
    TESTIMONY: "testimony",
    TURN: "turn",
    RECOGNITION: "recognition",
    RECESSION: "recession",
    DONE: "done"
  };

  var ARRIVAL_MS = 2000;
  var TURN_MS = 1200;
  var RECESSION_MS = 2200;
  var LINE_SEC = 3.4;
  var LOCK = 0.95;

  function makePossessionSequence(opts) {
    var renderer = opts.renderer;
    var onStemVolume = opts.onStemVolume || function () {};
    var onHumVolume = opts.onHumVolume || function () {};

    var phase = PHASE.IDLE;
    var side = "outer";
    var clarity = 0;
    var arrivalT0 = 0;
    var lineIdx = 0;
    var lineProgress = 0;
    var lines = [];
    var turnPending = null;
    var vo = null;
    var voReady = false;
    var useVo = false;

    function loadVO(url) {
      voReady = false;
      useVo = false;
      if (vo) {
        vo.pause();
        vo = null;
      }
      if (!url) return;
      vo = new Audio();
      vo.preload = "auto";
      vo.addEventListener("canplaythrough", function () { voReady = true; useVo = true; }, { once: true });
      vo.addEventListener("error", function () { vo = null; voReady = false; useVo = false; });
      vo.src = url;
    }

    function inhabitantSpec(inh) {
      return {
        photo: inh.photo,
        depth: inh.depth,
        fallbacks: inh.fallbacks || [],
        tintHex: inh.tint,
        tintFilter: inh.tintFilter || null
      };
    }

    function begin(ch, inhabitant) {
      side = ch;
      lines = inhabitant.testimony || [];
      lineIdx = 0;
      lineProgress = 0;
      clarity = 0;
      phase = PHASE.ARRIVAL;
      arrivalT0 = performance.now();
      renderer.setDrift(1);
      renderer.setInhabitant(inhabitantSpec(inhabitant));
      renderer.arrive(ARRIVAL_MS);
      onStemVolume(ch, 0.22);
      onHumVolume(0.12);
      loadVO(inhabitant.vo);
    }

    function currentLineText() {
      if (!lines.length) return "";
      return lines[Math.min(lineIdx, lines.length - 1)] || "";
    }

    function tick(dt, developing) {
      if (phase === PHASE.IDLE || phase === PHASE.DONE) {
        return { clarity: clarity, lineText: currentLineText(), lineIdx: lineIdx, sideComplete: false, phase: phase };
      }

      if (phase === PHASE.TURN) {
        return { clarity: clarity, lineText: "", lineIdx: lineIdx, sideComplete: false, phase: phase };
      }

      if (phase === PHASE.ARRIVAL) {
        var t = Math.min(1, (performance.now() - arrivalT0) / ARRIVAL_MS);
        clarity = t * 0.36;
        renderer.setClarity(clarity);
        onStemVolume(side, 0.18 + t * 0.22);
        if (t >= 1) phase = PHASE.TESTIMONY;
        return { clarity: clarity, lineText: currentLineText(), lineIdx: lineIdx, sideComplete: false, phase: phase };
      }

      if (phase === PHASE.RECOGNITION) {
        renderer.setClarity(1);
        renderer.still();
        onStemVolume(side, 0.85);
        return { clarity: 1, lineText: "", lineIdx: lineIdx, sideComplete: false, phase: phase };
      }

      if (phase === PHASE.RECESSION) {
        clarity = Math.max(0, clarity - dt * 0.35);
        renderer.setClarity(clarity);
        onStemVolume(side, Math.max(0, clarity * 0.4));
        onHumVolume(0.08);
        if (clarity <= 0.02) {
          phase = PHASE.DONE;
          onStemVolume(side, 0);
          onHumVolume(0.1);
        }
        return { clarity: clarity, lineText: "", lineIdx: lineIdx, sideComplete: false, phase: phase };
      }

      // TESTIMONY
      if (developing) {
        clarity = Math.min(LOCK, clarity + dt / 3.6);
        if (useVo && vo && voReady && !vo.paused) {
          var dur = vo.duration || 1;
          var frac = vo.currentTime / dur;
          var targetIdx = Math.min(lines.length - 1, Math.floor(frac * lines.length));
          if (targetIdx > lineIdx) {
            lineIdx = targetIdx;
            lineProgress = 0;
          }
          lineProgress = Math.min(0.98, frac * lines.length - lineIdx);
        } else {
          lineProgress += dt / LINE_SEC;
          while (lineProgress >= 1 && lineIdx < lines.length - 1) {
            lineProgress -= 1;
            lineIdx++;
          }
        }
        if (useVo && vo && voReady && vo.paused && developing) {
          vo.play().catch(function () { useVo = false; });
        }
      } else {
        clarity = Math.max(0, clarity - dt * 0.11);
        if (vo && !vo.paused) vo.pause();
      }

      renderer.setClarity(clarity);
      onStemVolume(side, developing ? Math.max(0.28, clarity * 0.75) : clarity * 0.35);

      var testimonyDone = lines.length > 0 && lineIdx >= lines.length - 1 && lineProgress >= 0.9;
      var sideComplete = clarity >= LOCK && testimonyDone;

      return {
        clarity: clarity,
        lineText: currentLineText(),
        lineIdx: lineIdx,
        sideComplete: sideComplete,
        phase: phase
      };
    }

    function switchSide(newCh, inhabitant) {
      if (phase !== PHASE.TESTIMONY && phase !== PHASE.ARRIVAL) return;
      if (newCh === side) return;
      phase = PHASE.TURN;
      turnPending = { ch: newCh, inhabitant: inhabitant };
      if (vo) { vo.pause(); vo = null; }
      onStemVolume(side, 0);
      renderer.recede(TURN_MS, function () {
        recessionReset();
        begin(turnPending.ch, turnPending.inhabitant);
        turnPending = null;
      });
    }

    function recessionReset() {
      // renderer.recede callback — begin() resets recession via arrive
    }

    function fireRecognition() {
      phase = PHASE.RECOGNITION;
      if (vo) { vo.pause(); vo = null; }
      renderer.still();
      renderer.setClarity(1);
      onStemVolume(side, 0.7);
    }

    function recess() {
      phase = PHASE.RECESSION;
      renderer.setDrift(0);
      renderer.recede(RECESSION_MS);
      onStemVolume(side, 0.15);
    }

    function stop() {
      phase = PHASE.IDLE;
      if (vo) { vo.pause(); vo = null; }
      onStemVolume("outer", 0);
      onStemVolume("inner", 0);
    }

    function getPhase() { return phase; }
    function getSide() { return side; }

    return {
      begin: begin,
      tick: tick,
      switchSide: switchSide,
      fireRecognition: fireRecognition,
      recess: recess,
      stop: stop,
      getPhase: getPhase,
      getSide: getSide,
      PHASE: PHASE
    };
  }

  global.PossessionSequence = {
    create: makePossessionSequence,
    PHASE: PHASE
  };
})(typeof window !== "undefined" ? window : this);
