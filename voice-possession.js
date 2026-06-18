/* ============================================================
   Voice possession — Memory 1 driven by VO, hold to tune
   ============================================================ */
(function (global) {
  "use strict";

  var PHASE = {
    IDLE: "idle",
    ARRIVAL: "arrival",
    LINES: "lines",
    TURN: "turn",
    RECOGNITION: "recognition",
    RECESSION: "recession",
    DONE: "done"
  };

  var ARRIVAL_MS = 2000;
  var TURN_MS = 1200;
  var RECESSION_MS = 2200;
  var FALLBACK_LINE_MS = 2500;
  var USE_MP3 = false;
  var TUNE_RISE = 1 / 2.6;
  var TUNE_DECAY = 0.13;
  var TUNE_LOCK = 0.9;

  function makeVoicePossession(opts) {
    var renderer = opts.renderer;
    var onHum = opts.onHum || function () {};
    var onLineChange = opts.onLineChange || function () {};
    var onSideComplete = opts.onSideComplete || function () {};
    var onTurnReady = opts.onTurnReady || function () {};
    var onSideReplay = opts.onSideReplay || function () {};
    var onAwaitingHold = opts.onAwaitingHold || function () {};

    var audioCtx = null;
    var voiceFilter = null;
    var voiceGainNode = null;
    var voiceConnected = false;

    var phase = PHASE.IDLE;
    var side = "outer";
    var inhabitant = null;
    var lineIdx = 0;
    var lineTunedDuring = [false, false, false, false];
    var lineEverTuned = false;
    var tuneClarity = 0;
    var detuneAmt = 1;
    var arrivalT0 = 0;
    var awaitingHold = true;
    var lineActive = false;

    var currentEl = null;
    var currentSource = null;
    var fallbackTimer = null;
    var turnPending = null;
    var recAudio = null;
    var lineVoiceStarted = false;

    function isSpeaking() {
      if (global.ChainSpeech) return global.ChainSpeech.speaking();
      return !!(global.speechSynthesis && global.speechSynthesis.speaking);
    }

    function initAudio() {
      if (audioCtx) return audioCtx;
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
      voiceFilter = audioCtx.createBiquadFilter();
      voiceFilter.type = "lowpass";
      voiceFilter.frequency.value = 18000;
      voiceFilter.Q.value = 0.6;
      voiceGainNode = audioCtx.createGain();
      voiceGainNode.gain.value = 1;
      voiceFilter.connect(voiceGainNode);
      voiceGainNode.connect(audioCtx.destination);
      return audioCtx;
    }

    function resumeAudio() {
      initAudio();
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    }

    function inhabitantSpec(inh) {
      return {
        photo: inh.photo,
        depth: inh.depth,
        fallbacks: inh.fallbacks || [],
        tintHex: inh.tintHex || inh.tint,
        tintFilter: inh.tintFilter || null
      };
    }

    function setDetune(amount) {
      detuneAmt = Math.max(0, Math.min(1, amount));
      if (voiceFilter) voiceFilter.frequency.value = 18000 - detuneAmt * 15000;
      if (voiceGainNode) voiceGainNode.gain.value = 1 - detuneAmt * 0.62;
      if (renderer.setDetune) renderer.setDetune(detuneAmt);
      onHum(0.06 + detuneAmt * 0.12);
    }

    function stopCurrentLine() {
      if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
      if (global.ChainSpeech) global.ChainSpeech.cancel();
      else if (global.speechSynthesis) global.speechSynthesis.cancel();
      if (currentEl) {
        currentEl.pause();
        currentEl.removeAttribute("src");
        currentEl = null;
      }
      if (currentSource) {
        try { currentSource.disconnect(); } catch (e) {}
        currentSource = null;
        voiceConnected = false;
      }
      lineActive = false;
    }

    function speakLine(caption, onDone) {
      if (!caption) return false;
      resumeAudio();
      var done = onDone || onLineEnded;
      if (global.ChainSpeech) {
        return global.ChainSpeech.speak(caption, {
          side: side,
          replace: true,
          immediate: true,
          onStart: function () { lineVoiceStarted = true; }
        }, function (err) {
          if (err) {
            lineVoiceStarted = false;
            fallbackTimer = setTimeout(onLineEnded, FALLBACK_LINE_MS);
            return;
          }
          lineVoiceStarted = true;
          done();
        });
      }
      if (!global.speechSynthesis) {
        fallbackTimer = setTimeout(onLineEnded, FALLBACK_LINE_MS);
        return false;
      }
      global.speechSynthesis.cancel();
      var utt = new global.SpeechSynthesisUtterance(caption);
      utt.rate = side === "inner" ? 0.94 : 0.82;
      utt.onstart = function () { lineVoiceStarted = true; };
      utt.onend = function () { lineVoiceStarted = true; done(); };
      utt.onerror = function () {
        lineVoiceStarted = false;
        fallbackTimer = setTimeout(onLineEnded, FALLBACK_LINE_MS);
      };
      global.speechSynthesis.speak(utt);
      return true;
    }

    function startFallbackLine() {
      var caption = (inhabitant.lines && inhabitant.lines[lineIdx]) || "";
      if (speakLine(caption, onLineEnded)) return;
      fallbackTimer = setTimeout(onLineEnded, FALLBACK_LINE_MS);
    }

    function emitLineChange() {
      var caption = (inhabitant.lines && inhabitant.lines[lineIdx]) || "";
      onLineChange({
        side: side,
        line: lineIdx + 1,
        total: 4,
        caption: caption,
        label: inhabitant.channelLabel || ""
      });
    }

    function playLine(i) {
      stopCurrentLine();
      lineEverTuned = false;
      lineVoiceStarted = false;
      lineIdx = i;
      lineActive = true;
      emitLineChange();

      var caption = (inhabitant.lines && inhabitant.lines[i]) || "";
      var url = inhabitant.voices && inhabitant.voices[i];

      if (!USE_MP3 || !url) {
        startFallbackLine();
        return;
      }

      resumeAudio();
      currentEl = new Audio(url);
      currentEl.preload = "auto";
      currentEl.crossOrigin = "anonymous";
      currentEl.addEventListener("ended", onLineEnded);
      currentEl.addEventListener("error", function () { startFallbackLine(); });
      currentEl.play().then(function () {
        if (audioCtx && !voiceConnected) {
          try {
            currentSource = audioCtx.createMediaElementSource(currentEl);
            currentSource.connect(voiceFilter);
            voiceConnected = true;
          } catch (e) {
            voiceConnected = false;
          }
        }
      }).catch(function () { startFallbackLine(); });
    }

    function onLineEnded() {
      if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
      lineActive = false;
      lineTunedDuring[lineIdx] = lineEverTuned;

      if (lineIdx < 3) {
        if (lineEverTuned) {
          lineIdx++;
          onLineChange({
            side: side,
            line: lineIdx + 1,
            total: 4,
            caption: null,
            keepCaption: true,
            label: inhabitant.channelLabel || ""
          });
          lineEverTuned = false;
        }
        awaitingHold = true;
        onAwaitingHold(lineIdx);
        return;
      }

      var allTuned = lineTunedDuring.every(Boolean);
      if (allTuned) {
        onSideComplete(side);
        onTurnReady(side);
      } else {
        onSideReplay(side);
        lineTunedDuring = [false, false, false, false];
        lineIdx = 0;
        lineEverTuned = false;
        awaitingHold = true;
        onAwaitingHold(0);
      }
    }

    /** Hold begins — reveal current line and play VO */
    function revealOnHold() {
      if (phase !== PHASE.LINES && phase !== PHASE.ARRIVAL) return;
      if (!awaitingHold || lineActive) return;
      awaitingHold = false;
      playLine(lineIdx);
    }

    function begin(ch, inh) {
      resumeAudio();
      side = ch;
      inhabitant = inh;
      lineIdx = 0;
      lineTunedDuring = [false, false, false, false];
      tuneClarity = 0;
      detuneAmt = 1;
      awaitingHold = true;
      lineActive = false;
      phase = PHASE.ARRIVAL;
      arrivalT0 = performance.now();
      renderer.setDrift(1);
      renderer.setInhabitant(inhabitantSpec(inh));
      renderer.setClarity(0);
      setDetune(1);
      onHum(0.1);
      phase = PHASE.LINES;
      onLineChange({
        side: side,
        line: 1,
        total: 4,
        caption: "",
        label: inhabitant.channelLabel || ""
      });
      onAwaitingHold(0);
      renderer.arrive(ARRIVAL_MS, function () {
        if (phase === PHASE.ARRIVAL) phase = PHASE.LINES;
      });
    }

    function tick(dt, holding) {
      if (phase === PHASE.IDLE || phase === PHASE.DONE) {
        return { clarity: tuneClarity, lineIdx: lineIdx, sideComplete: false, phase: phase, detune: detuneAmt };
      }

      if (phase === PHASE.TURN) {
        return { clarity: tuneClarity, lineIdx: lineIdx, sideComplete: false, phase: phase, detune: detuneAmt };
      }

      if (phase === PHASE.ARRIVAL) {
        var t = Math.min(1, (global.performance.now() - arrivalT0) / ARRIVAL_MS);
        tuneClarity = t * 0.32;
        renderer.setClarity(tuneClarity);
        if (holding) tuneClarity = Math.min(TUNE_LOCK, tuneClarity + TUNE_RISE * dt);
        setDetune(holding ? Math.max(0, 1 - tuneClarity) : 1 - tuneClarity * 0.4);
        return { clarity: tuneClarity, lineIdx: 0, sideComplete: false, phase: phase, detune: detuneAmt };
      }

      if (phase === PHASE.RECOGNITION) {
        tuneClarity = 1;
        setDetune(0);
        renderer.setClarity(1);
        return { clarity: 1, lineIdx: lineIdx, sideComplete: false, phase: phase, detune: 0 };
      }

      if (phase === PHASE.RECESSION) {
        tuneClarity = Math.max(0, tuneClarity - dt * 0.4);
        setDetune(1 - tuneClarity);
        renderer.setClarity(tuneClarity);
        if (tuneClarity <= 0.02) phase = PHASE.DONE;
        return { clarity: tuneClarity, lineIdx: lineIdx, sideComplete: false, phase: phase, detune: detuneAmt };
      }

      if (holding) {
        tuneClarity = Math.min(TUNE_LOCK, tuneClarity + TUNE_RISE * dt);
        lineEverTuned = true;
      } else {
        tuneClarity = Math.max(0, tuneClarity - TUNE_DECAY * dt);
      }
      setDetune(1 - tuneClarity);
      renderer.setClarity(tuneClarity);

      return {
        clarity: tuneClarity,
        lineIdx: lineIdx,
        caption: (inhabitant.lines && inhabitant.lines[lineIdx]) || "",
        sideComplete: lineTunedDuring.every(Boolean) && lineIdx >= 3 && phase === PHASE.LINES,
        phase: phase,
        detune: detuneAmt,
        tuned: tuneClarity > 0.42
      };
    }

    function switchSide(newCh, inh) {
      if (newCh === side) return;
      if (phase !== PHASE.LINES && phase !== PHASE.ARRIVAL) return;
      phase = PHASE.TURN;
      turnPending = { ch: newCh, inh: inh };
      stopCurrentLine();
      onHum(0.15);
      renderer.recede(TURN_MS, function () {
        begin(turnPending.ch, turnPending.inh);
        turnPending = null;
      });
    }

    function fireRecognition(text, audioUrl) {
      phase = PHASE.RECOGNITION;
      stopCurrentLine();
      renderer.still();
      renderer.setClarity(1);
      setDetune(0);
      onHum(0.05);
      if (audioUrl) {
        recAudio = new Audio(audioUrl);
        recAudio.play().catch(function () {});
      }
    }

    function recess() {
      phase = PHASE.RECESSION;
      stopCurrentLine();
      if (recAudio) { recAudio.pause(); recAudio = null; }
      renderer.setDrift(0);
      renderer.recede(RECESSION_MS);
      onHum(0.04);
    }

    function stop() {
      phase = PHASE.IDLE;
      stopCurrentLine();
      if (recAudio) { recAudio.pause(); recAudio = null; }
      onHum(0);
    }

    return {
      begin: begin,
      tick: tick,
      switchSide: switchSide,
      fireRecognition: fireRecognition,
      recess: recess,
      stop: stop,
      revealOnHold: revealOnHold,
      getPhase: function () { return phase; },
      getSide: function () { return side; },
      unlockAudio: resumeAudio,
      PHASE: PHASE
    };
  }

  global.VoicePossession = {
    create: makeVoicePossession,
    PHASE: PHASE
  };
})(typeof window !== "undefined" ? window : this);
