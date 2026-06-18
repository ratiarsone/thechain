/* ============================================================
   Chain speech — reliable Web Speech for possession VO
   ============================================================ */
(function (global) {
  "use strict";

  var cachedVoices = [];
  var resumeInterval = null;
  var pending = null;

  function synth() {
    return global.speechSynthesis || null;
  }

  function refreshVoices() {
    var s = synth();
    if (!s) return cachedVoices;
    var list = s.getVoices();
    if (list && list.length) cachedVoices = list;
    return cachedVoices;
  }

  if (synth()) {
    refreshVoices();
    synth().addEventListener("voiceschanged", function () {
      refreshVoices();
      if (pending) flushPending();
    });
  }

  function stopKeepAlive() {
    if (resumeInterval) {
      clearInterval(resumeInterval);
      resumeInterval = null;
    }
  }

  function startKeepAlive() {
    if (resumeInterval) return;
    resumeInterval = setInterval(function () {
      var s = synth();
      if (!s) return stopKeepAlive();
      if (s.speaking) {
        s.pause();
        s.resume();
      } else {
        stopKeepAlive();
      }
    }, 120);
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
    for (var j = 0; j < pool.length; j++) {
      var name = pool[j].name || "";
      if (preferFemale && /female|woman|samantha|victoria|karen|moira|fiona|tessa/i.test(name)) return pool[j];
      if (!preferFemale && /male|man|daniel|alex|fred|tom|aaron|nathan/i.test(name)) return pool[j];
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
    utt.rate = opts.rate != null ? opts.rate : (opts.side === "inner" ? 0.94 : 0.82);
    utt.pitch = opts.pitch != null ? opts.pitch : (opts.side === "inner" ? 1.1 : 0.74);
    utt.volume = opts.volume != null ? opts.volume : 1;
    utt.lang = opts.lang || "en-US";
    var voice = findVoice(opts.side);
    if (voice) utt.voice = voice;
    utt.onstart = function () {
      if (opts.onStart) opts.onStart();
    };
    utt.onend = function () { finish(null); };
    utt.onerror = function (e) { finish(e || new Error("speech")); };
    return utt;
  }

  function speak(text, opts, onDone) {
    opts = opts || {};
    var s = synth();
    if (!text || !s) return false;

    refreshVoices();
    s.resume();
    startKeepAlive();

    if (!cachedVoices.length && !opts._voiceRetry) {
      pending = { text: text, opts: Object.assign({}, opts, { _voiceRetry: true }), onDone: onDone };
      global.setTimeout(function () {
        if (pending && pending.text === text) flushPending();
      }, 150);
    }

    var finished = false;
    function finish(err) {
      if (finished) return;
      finished = true;
      if (onDone) onDone(err || null);
      if (!s.speaking && !s.pending) stopKeepAlive();
    }

    if (opts.replace !== false) s.cancel();

    function enqueue(retry) {
      var utt = buildUtterance(text, opts, finish);
      s.speak(utt);
      if (!retry && !opts.immediate) {
        global.setTimeout(function () {
          if (!finished && !s.speaking && !s.pending) enqueue(true);
        }, 300);
      }
    }

    if (opts.immediate) {
      enqueue(false);
    } else {
      global.setTimeout(function () { enqueue(false); }, 16);
    }
    return true;
  }

  function prime() {
    var s = synth();
    if (!s) return;
    refreshVoices();
    s.resume();
  }

  function cancel() {
    pending = null;
    var s = synth();
    if (s) s.cancel();
    stopKeepAlive();
  }

  function speaking() {
    var s = synth();
    return !!(s && (s.speaking || s.pending));
  }

  global.ChainSpeech = {
    speak: speak,
    prime: prime,
    cancel: cancel,
    speaking: speaking,
    refreshVoices: refreshVoices
  };
})(typeof window !== "undefined" ? window : this);
