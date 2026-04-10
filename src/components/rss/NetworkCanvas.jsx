import React, { useEffect, useRef } from "react";

const NetworkCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) return;

    let width = 0;
    let height = 0;
    let running = true;

    // =====================
    // Resize
    // =====================
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      gl.viewport(0, 0, canvas.width, canvas.height);

      generateGrid();
    };

    window.addEventListener("resize", resize);

    // =====================
    // GL Setup
    // =====================
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    // =====================
    // Theme
    // =====================
    let secondary = [1, 1, 1];

    const parse = (v) => {
      const m = v.match(/[\d.]+/g);
      return [
        parseFloat(m[0]) / 255,
        parseFloat(m[1]) / 255,
        parseFloat(m[2]) / 255,
      ];
    };

    let isLight = false;

    const updateTheme = () => {
      const s = getComputedStyle(document.documentElement);

      isLight = s.getPropertyValue("color-scheme").includes("light");

      const parsed = parse(s.getPropertyValue("--effect-secondary"));

      // force stronger contrast in light mode
      secondary = isLight
        ? [0.15, 0.15, 0.2] // dark graphite tone
        : parsed;
    };

    updateTheme();

    new MutationObserver(updateTheme).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // =====================
    // Scroll intensity
    // =====================
    let state = 1;

    const handleScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;

      if (y < vh * 0.8) state = 1;
      else if (y < vh * 2) state = 0.6;
      else state = 0.3;
    };

    window.addEventListener("scroll", handleScroll);

    // =====================
    // Mouse
    // =====================
    const mouse = { x: -9999, y: -9999 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // =====================
    // Grid
    // =====================
    const GRID_SIZE = 45;
    let grid = [];

    const generateGrid = () => {
      grid = [];

      for (let x = 0; x <= GRID_SIZE; x++) {
        for (let y = 0; y <= GRID_SIZE; y++) {
          grid.push({
            x: (x / GRID_SIZE) * width,
            y: (y / GRID_SIZE) * height,
          });
        }
      }
    };

    resize();

    // =====================
    // Shader
    // =====================
    const vs = `
      attribute vec2 position;
      attribute float alpha;
      varying float vAlpha;

      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        vAlpha = alpha;
      }
    `;

    const fs = `
      precision mediump float;
      uniform vec3 color;
      varying float vAlpha;

      void main() {
        gl_FragColor = vec4(color, vAlpha);
      }
    `;

    const createProgram = () => {
      const v = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(v, vs);
      gl.compileShader(v);

      const f = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(f, fs);
      gl.compileShader(f);

      const p = gl.createProgram();
      gl.attachShader(p, v);
      gl.attachShader(p, f);
      gl.linkProgram(p);

      return p;
    };

    const program = createProgram();
    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "position");
    const alphaLoc = gl.getAttribLocation(program, "alpha");
    const colorLoc = gl.getUniformLocation(program, "color");

    const buffer = gl.createBuffer();

    // =====================
    // Animate
    // =====================
    let time = 0;

    const animate = () => {
      if (!running) return;

      gl.clear(gl.COLOR_BUFFER_BIT);
      time += 0.01;

      const lines = [];

      grid.forEach((p, i) => {
        let nx = p.x;
        let ny = p.y;

        // ===== Mouse crawl effect (localized distortion)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let localBoost = 0;

        if (dist < 180) {
          const strength = (1 - dist / 180) * 25 * state;

          nx += dx * 0.06 * strength;
          ny += dy * 0.06 * strength;

          localBoost = (1 - dist / 180) * (isLight ? 0.35 : 0.2);
        }

        // ===== subtle ambient wave (very low, keeps it alive)
        const wave = Math.sin(time + p.x * 0.01 + p.y * 0.01) * 0.8 * state;

        nx += wave;
        ny += wave;

        const cx = (nx / width) * 2 - 1;
        const cy = (ny / height) * -2 + 1;

        const right = grid[i + 1];
        const down = grid[i + GRID_SIZE + 1];

        const baseAlpha = isLight ? 0.28 : 0.06;
        const alpha = baseAlpha * state;

        const pushLine = (x1, y1, x2, y2) => {
          const thickness = isLight ? 0.0025 : 0.0015;

          lines.push(x1, y1, alpha + localBoost);
          lines.push(x2, y2, alpha);

          lines.push(x1 + thickness, y1, alpha * 0.9);
          lines.push(x2 + thickness, y2, alpha * 0.9);

          lines.push(x1, y1 + thickness, alpha * 0.9);
          lines.push(x2, y2 + thickness, alpha * 0.9);
        };

        if (right && (i + 1) % (GRID_SIZE + 1) !== 0) {
          const rx = (right.x / width) * 2 - 1;
          const ry = (right.y / height) * -2 + 1;

          const thickness = isLight ? 0.0025 : 0.0015;

          // main line
          pushLine(cx, cy, rx, ry);
        }

        if (down) {
          const dx2 = (down.x / width) * 2 - 1;
          const dy2 = (down.y / height) * -2 + 1;

          const thickness = isLight ? 0.0025 : 0.0015;

          // main line
          pushLine(cx, cy, dx2, dy2);
        }
      });

      const draw = (data, color) => {
        const arr = new Float32Array(data);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.DYNAMIC_DRAW);

        const stride = 3 * 4;

        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, 0);

        gl.enableVertexAttribArray(alphaLoc);
        gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, stride, 8);

        gl.uniform3fv(colorLoc, color);

        gl.drawArrays(gl.LINES, 0, arr.length / 3);
      };

      draw(lines, secondary);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

export default NetworkCanvas;
