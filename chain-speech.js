/* ============================================================
   Chain speech — reliable Web Speech for possession VO
   ============================================================ */
(function (global) {
  "use strict";

  var cachedVoices = [];
  var pending = null;
  var activeText = "";

  function synth() {
    return global.speechSynthesis || null;
  }

  function refreshVoices() {
    var s = synth();
    if (!s) return cachedVoices;
    try {
      var list = s.getVoices();
      if (list && list.length) cachedVoices = list;
    } catch (e) {}
    return cachedVoices;
  }

  if (synth()) {
    refreshVoices();
    synth().addEventListener("voiceschanged", function () {
      refreshVoices();
      if (pending) flushPending();
    });
  }

  function findVoice(side) {
    refreshVoices();
    var voices = cachedVoices;
    if (!voices.length) return null;
    var preferFemale = side === "inner";
    var en = [];
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang && voices[i].lang.indexOf("en") === 0) en.push(voices[i]);
    }
    var pool = en.length ? en : voices;
    var prefer = preferFemale
      ? [/Samantha/i, /Karen/i, /Moira/i, /Victoria/i, /Fiona/i, /Tessa/i]
      : [/Alex/i, /Tom/i, /Daniel/i, /Fred/i, /Aaron/i, /Nathan/i];
    for (var p = 0; p < prefer.length; p++) {
      for (var j = 0; j < pool.length; j++) {
        if (prefer[p].test(pool[j].name || "")) return pool[j];
      }
    }
    for (var k = 0; k < pool.length; k++) {
      var name = pool[k].name || "";
      if (preferFemale && /female|woman/i.test(name)) return pool[k];
      if (!preferFemale && /male|man/i.test(name)) return pool[k];
    }
    return pool[0] || null;
  }

  function flushPending() {
    if (!pending) return;
    var job = pending;
    pending = null;
    speak(job.text, job.opts, job.onDone);
  }

  function buildUtterance(text, opts, finish) {
    var utt = new global.SpeechSynthesisUtterance(text);
    utt.rate = opts.rate != null ? opts.rate : (opts.side === "inner" ? 0.96 : 0.92);
    utt.pitch = opts.pitch != null ? opts.pitch : (opts.side === "inner" ? 1.02 : 0.98);
    utt.volume = opts.volume != null ? opts.volume : 1;
    utt.lang = opts.lang || "en-US";
    var voice = findVoice(opts.side);
    if (voice) utt.voice = voice;
    utt.onstart = function () {
      activeText = text;
      if (opts.onStart) opts.onStart();
    };
    utt.onend = function () {
      if (activeText === text) activeText = "";
      finish(null);
    };
    utt.onerror = function (e) {
      if (activeText === text) activeText = "";
      finish(e || new Error("speech"));
    };
    return utt;
  }

  function speak(text, opts, onDone) {
    opts = opts || {};
    var s = synth();
    if (!text || !s) return false;

    refreshVoices();

    if (!cachedVoices.length && !opts._voiceRetry) {
      pending = { text: text, opts: Object.assign({}, opts, { _voiceRetry: true }), onDone: onDone };
      global.setTimeout(function () {
        if (pending && pending.text === text) flushPending();
      }, 200);
      return true;
    }

    if (opts.replace === false && activeText === text && (s.speaking || s.pending)) {
      return true;
    }

    var finished = false;
    function finish(err) {
      if (finished) return;
      finished = true;
      if (onDone) onDone(err || null);
    }

    try {
      if (opts.replace !== false) {
        activeText = "";
        s.cancel();
      }
      s.resume();
      var utt = buildUtterance(text, opts, finish);
      s.speak(utt);
    } catch (e) {
      finish(e);
    }
    return true;
  }

  function prime() {
    var s = synth();
    if (!s) return;
    refreshVoices();
    try { s.resume(); } catch (e) {}
    if (!cachedVoices.length) {
      global.setTimeout(refreshVoices, 250);
    }
  }

  function cancel() {
    pending = null;
    activeText = "";
    var s = synth();
    if (s) { try { s.cancel(); } catch (e) {} }
  }

  function speaking() {
    var s = synth();
    try { return !!(s && (s.speaking || s.pending)); } catch (e) { return false; }
  }

  global.ChainSpeech = {
    speak: speak,
    prime: prime,
    cancel: cancel,
    speaking: speaking,
    refreshVoices: refreshVoices
  };
})(typeof window !== "undefined" ? window : this);
