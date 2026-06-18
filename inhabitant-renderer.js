/* ============================================================
   Inhabitant renderer — possession face (signal | relief)
   ============================================================ */
(function (global) {
  "use strict";

  /** @type {"signal"|"relief"} */
  var RENDER_MODE = "signal";

  var SEG_W = 160;
  var SEG_H = 200;
  var PLANE_H = 2.65;

  function radialDepthCanvas(w, h) {
    var c = document.createElement("canvas");
    c.width = w || 256;
    c.height = h || 320;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(c.width * 0.5, c.height * 0.4, 0, c.width * 0.5, c.height * 0.5, c.width * 0.55);
    g.addColorStop(0, "#f2f2f2");
    g.addColorStop(0.55, "#888");
    g.addColorStop(1, "#1a1a1a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    return c;
  }

  function luminanceFromImage(img, T) {
    var c = document.createElement("canvas");
    c.width = img.naturalWidth || img.width || 256;
    c.height = img.naturalHeight || img.height || 320;
    var ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, c.width, c.height);
    var data = ctx.getImageData(0, 0, c.width, c.height);
    var d = data.data;
    for (var i = 0; i < d.length; i += 4) {
      var lum = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      d[i] = d[i + 1] = d[i + 2] = lum;
    }
    ctx.putImageData(data, 0, 0);
    var tex = new T.CanvasTexture(c);
    if (T.NoColorSpace) tex.colorSpace = T.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("img " + url)); };
      img.src = url;
    });
  }

  function tintImage(img, cssFilter) {
    return new Promise(function (resolve) {
      var c = document.createElement("canvas");
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      var ctx = c.getContext("2d");
      if (cssFilter) ctx.filter = cssFilter;
      ctx.drawImage(img, 0, 0);
      var out = new Image();
      out.onload = function () { resolve(out); };
      out.onerror = function () { resolve(img); };
      out.src = c.toDataURL("image/png");
    });
  }

  function inhabitantMaterial(T) {
    return new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: T.DoubleSide,
      uniforms: {
        uPhoto: { value: null },
        uDepth: { value: null },
        uTime: { value: 0 },
        uClarity: { value: 0 },
        uArrival: { value: 0 },
        uRecession: { value: 0 },
        uDrift: { value: 1 },
        uDetune: { value: 0 },
        uReliefMix: { value: 0 },
        uDispScale: { value: 0.42 },
        uTint: { value: new T.Color(0x46ff97) },
        uHasPhoto: { value: 0 }
      },
      vertexShader: [
        "uniform sampler2D uDepth;",
        "uniform float uDispScale;",
        "uniform float uReliefMix;",
        "uniform float uTime;",
        "uniform float uDrift;",
        "varying vec2 vUv;",
        "varying vec3 vNorm;",
        "void main(){",
        "  vUv = uv;",
        "  float d = texture2D(uDepth, uv).r;",
        "  vec3 pos = position;",
        "  pos.z += (d - 0.35) * uDispScale * uReliefMix;",
        "  pos.x += sin(uTime * 0.35 + pos.y * 0.8) * 0.014 * uDrift;",
        "  pos.y += cos(uTime * 0.28 + pos.x * 0.6) * 0.009 * uDrift;",
        "  vNorm = normalize(normalMatrix * normal);",
        "  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);",
        "}"
      ].join("\n"),
      fragmentShader: [
        "uniform sampler2D uPhoto;",
        "uniform float uTime;",
        "uniform float uClarity;",
        "uniform float uArrival;",
        "uniform float uRecession;",
        "uniform float uDetune;",
        "uniform float uReliefMix;",
        "uniform vec3 uTint;",
        "uniform float uHasPhoto;",
        "varying vec2 vUv;",
        "varying vec3 vNorm;",
        "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }",
        "void main(){",
        "  vec2 uv = vUv;",
        "  float eff = uClarity * uArrival * (1.0 - uRecession);",
        "  float staticAmt = mix(1.0 - smoothstep(0.0, 0.92, eff), 1.0, uDetune * 0.88);",
        "  vec2 chroma = vec2(0.004 + staticAmt * 0.02, 0.0);",
        "  vec3 col = vec3(0.01);",
        "  if(uHasPhoto > 0.5){",
        "    float r = texture2D(uPhoto, uv + chroma).r;",
        "    float g = texture2D(uPhoto, uv).g;",
        "    float b = texture2D(uPhoto, uv - chroma).b;",
        "    col = vec3(r,g,b);",
        "  }",
        "  float n = hash(uv * 480.0 + uTime * 14.0);",
        "  col = mix(col, col * (0.35 + n * 0.95), staticAmt * 0.62);",
        "  float scan = mix(1.0, step(0.52, fract(uv.y * 280.0 + uTime * 0.35)), staticAmt * 0.48);",
        "  col *= scan;",
        "  float vig = smoothstep(0.98, 0.22, distance(uv, vec2(0.5)));",
        "  col *= mix(0.08 + vig * 0.18, 0.38 + vig * 0.62, eff);",
        "  float rim = pow(1.0 - abs(vNorm.z), 2.2);",
        "  col += uTint * rim * (0.07 + uReliefMix * 0.05) * eff;",
        "  float a = mix(0.12, 0.94, eff) * vig;",
        "  gl_FragColor = vec4(col, a);",
        "}"
      ].join("\n")
    });
  }

  function makeInhabitantRenderer(container, opts) {
    var T = global.THREE;
    if (!T || !container) return null;

    var mode = (opts && opts.mode) || RENDER_MODE;
    var reduce = !!(opts && opts.reduceMotion);

    var w = Math.max(container.clientWidth, 280);
    var h = Math.max(container.clientHeight, 280);
    var renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    var cv = renderer.domElement;
    cv.className = "inhabitant-canvas";
    container.appendChild(cv);

    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(34, w / h, 0.1, 100);
    var camZ = 3.35;
    camera.position.set(0, 0.08, camZ);

    var key = new T.DirectionalLight(0xffffff, mode === "relief" ? 1.15 : 0.62);
    key.position.set(0.4, 2.8, 3.6);
    scene.add(key);
    scene.add(new T.AmbientLight(0xffffff, 0.26));

    var group = new T.Group();
    scene.add(group);

    var mat = inhabitantMaterial(T);
    mat.uniforms.uReliefMix.value = mode === "relief" ? 1 : 0;
    var mesh = null;
    var pointer = { x: 0, y: 0 };
    var clarity = 0;
    var arrival = 0;
    var recession = 0;
    var drift = 1;
    var arrivalAnim = null;
    var recessionAnim = null;
    var raf = null;
    var running = false;
    var loadGen = 0;

    function disposeGeo() {
      if (mesh) {
        group.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        mesh = null;
      }
    }

    function buildMesh(aspect) {
      disposeGeo();
      var planeW = PLANE_H * aspect;
      var geo = new T.PlaneGeometry(planeW, PLANE_H, SEG_W, SEG_H);
      mesh = new T.Mesh(geo, mat);
      group.add(mesh);
    }

    function render() {
      renderer.render(scene, camera);
    }

    function loop(t) {
      raf = global.requestAnimationFrame(loop);
      if (arrivalAnim) {
        var pa = Math.min(1, (t - arrivalAnim.t0) / arrivalAnim.dur);
        var ea = 1 - Math.pow(1 - pa, 2.2);
        arrival = arrivalAnim.from + (arrivalAnim.to - arrivalAnim.from) * ea;
        mat.uniforms.uArrival.value = arrival;
        camera.position.z = camZ - arrival * 0.12;
        if (pa >= 1) {
          if (arrivalAnim.onDone) arrivalAnim.onDone();
          arrivalAnim = null;
        }
      }
      if (recessionAnim) {
        var pr = Math.min(1, (t - recessionAnim.t0) / recessionAnim.dur);
        recession = recessionAnim.from + (recessionAnim.to - recessionAnim.from) * pr;
        mat.uniforms.uRecession.value = recession;
        if (pr >= 1) {
          if (recessionAnim.onDone) recessionAnim.onDone();
          recessionAnim = null;
        }
      }
      var sway = Math.sin(t * 0.0005) * 0.16;
      group.rotation.y = sway + pointer.x * 0.048;
      group.rotation.x = Math.sin(t * 0.00038) * 0.028 - pointer.y * 0.052;
      mat.uniforms.uTime.value = t * 0.001;
      mat.uniforms.uClarity.value = clarity;
      mat.uniforms.uDrift.value = drift;
      render();
    }

    function setInhabitant(spec) {
      if (!spec) return;
      mat.uniforms.uTint.value.setHex(spec.tintHex || 0x46ff97);
      var presence = spec.presence || { scale: 1, y: 0 };
      group.scale.setScalar(presence.scale || 1);
      group.position.y = presence.y || 0;
      var gen = ++loadGen;
      var fallbacks = spec.fallbacks || [];

      function tryPhoto(urls) {
        if (!urls.length) return Promise.reject(new Error("no photo"));
        return loadImage(urls[0]).catch(function () { return tryPhoto(urls.slice(1)); });
      }

      tryPhoto([spec.photo].concat(fallbacks)).then(function (img) {
        if (gen !== loadGen) return;
        var chain = Promise.resolve(img);
        if (spec.tintFilter) chain = chain.then(function (im) { return tintImage(im, spec.tintFilter); });
        return chain;
      }).then(function (img) {
        if (gen !== loadGen || !img) return;
        var aspect = (img.naturalWidth || img.width || 1) / (img.naturalHeight || img.height || 1);
        buildMesh(aspect);
        var colorTex = new T.Texture(img);
        if (T.SRGBColorSpace) colorTex.colorSpace = T.SRGBColorSpace;
        colorTex.needsUpdate = true;
        mat.uniforms.uPhoto.value = colorTex;
        mat.uniforms.uHasPhoto.value = 1;
        return loadImage(spec.depth).catch(function () { return null; }).then(function (depthImg) {
          if (gen !== loadGen) return;
          var depthTex;
          if (depthImg) {
            depthTex = new T.Texture(depthImg);
            if (T.NoColorSpace) depthTex.colorSpace = T.NoColorSpace;
            depthTex.needsUpdate = true;
          } else {
            depthTex = luminanceFromImage(img, T);
          }
          mat.uniforms.uDepth.value = depthTex;
          render();
        });
      }).catch(function () {
        if (gen !== loadGen) return;
        buildMesh(0.78);
        mat.uniforms.uHasPhoto.value = 0;
        mat.uniforms.uDepth.value = new T.CanvasTexture(radialDepthCanvas(256, 320));
        render();
      });
    }

    function setClarity(c) {
      clarity = Math.max(0, Math.min(1, c));
      mat.uniforms.uClarity.value = clarity;
      render();
    }

    function arrive(ms, onDone) {
      recession = 0;
      recessionAnim = null;
      mat.uniforms.uRecession.value = 0;
      arrivalAnim = { t0: performance.now(), dur: ms || 2000, from: arrival, to: 1, onDone: onDone || null };
    }

    function recede(ms, onDone) {
      arrival = 0;
      mat.uniforms.uArrival.value = 0;
      arrivalAnim = null;
      recessionAnim = { t0: performance.now(), dur: ms || 1200, from: recession, to: 1, onDone: onDone || null };
    }

    function still() {
      drift = 0;
      clarity = 1;
      arrival = 1;
      recession = 0;
      mat.uniforms.uClarity.value = 1;
      mat.uniforms.uArrival.value = 1;
      mat.uniforms.uRecession.value = 0;
      mat.uniforms.uDrift.value = 0;
      render();
    }

    function setDetune(d) {
      mat.uniforms.uDetune.value = Math.max(0, Math.min(1, d));
      render();
    }

    function setDrift(on) {
      drift = on ? 1 : 0;
      mat.uniforms.uDrift.value = drift;
    }

    function start() {
      if (running) return;
      running = true;
      if (reduce) { render(); return; }
      loop(performance.now());
    }

    function stop() {
      running = false;
      if (raf) global.cancelAnimationFrame(raf);
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

    container.addEventListener("pointermove", function (e) {
      var r = container.getBoundingClientRect();
      if (!r.width) return;
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });

    function dispose() {
      stop();
      disposeGeo();
      mat.dispose();
      renderer.dispose();
      if (cv.parentNode) cv.parentNode.removeChild(cv);
    }

    return {
      setInhabitant: setInhabitant,
      setClarity: setClarity,
      arrive: arrive,
      recede: recede,
      still: still,
      setDrift: setDrift,
      setDetune: setDetune,
      start: start,
      stop: stop,
      resize: resize,
      dispose: dispose
    };
  }

  global.InhabitantRenderer = {
    get RENDER_MODE() { return RENDER_MODE; },
    set RENDER_MODE(v) {
      if (v === "signal" || v === "relief") RENDER_MODE = v;
    },
    create: makeInhabitantRenderer
  };
})(typeof window !== "undefined" ? window : this);
