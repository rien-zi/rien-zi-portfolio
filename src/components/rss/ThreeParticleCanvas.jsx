import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeParticleCanvas = () => {
  const mountRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isMounted = true;

    // =====================
    // CONFIG
    // =====================
    const CONFIG = {
      PARTICLE_COUNT: Math.min(180, Math.floor(window.innerWidth * 0.25)),
      RIPPLE_SPEED: 1.2,
      RIPPLE_WIDTH: 0.16,
      RIPPLE_STRENGTH: 0.15,
      DRIFT_STRENGTH: 0.015,
      CURSOR_INFLUENCE: 0.01,
      DAMPING: 0.92,
      ACCELERATION: 0.02,
    };

    // =====================
    // COLORS
    // =====================
    const css = getComputedStyle(document.documentElement);

    const palette = [
      css.getPropertyValue("--particles1").trim(),
      css.getPropertyValue("--particles2").trim(),
      css.getPropertyValue("--particles3").trim(),
      css.getPropertyValue("--particles4").trim(),
    ].map((c) => new THREE.Color(c));

    // =====================
    // Scene
    // =====================
    const scene = new THREE.Scene();

    let width = window.innerWidth;
    let height = window.innerHeight;

    let spreadX = (width / height) * 5;
    let spreadY = 4.5;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // =====================
    // Comma texture
    // =====================
    const createCommaTexture = () => {
      const size = 120;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.font = "24px serif";
      ctx.globalAlpha = 0.8;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("'", size / 2, size / 2 + 10);

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    const commaTexture = createCommaTexture();

    // =====================
    // Geometry
    // =====================
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
    const basePositions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
    const colors = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
    const angles = new Float32Array(CONFIG.PARTICLE_COUNT);
    const velocities = new Float32Array(CONFIG.PARTICLE_COUNT * 2);

    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      velocities[i * 2] = 0;
      velocities[i * 2 + 1] = 0;
      angles[i] = 0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("angle", new THREE.BufferAttribute(angles, 1));

    // =====================
    // Shaders
    // =====================
    const vertexShader = `
      attribute vec3 color;
      attribute float angle;

      varying vec3 vColor;
      varying float vAngle;

      void main() {
        vColor = color;
        vAngle = angle;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 6.0 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;

      varying vec3 vColor;
      varying float vAngle;

      void main() {
        vec2 coord = gl_PointCoord;

        float s = sin(vAngle);
        float c = cos(vAngle);

        coord -= 0.5;
        coord = vec2(
          coord.x * c - coord.y * s,
          coord.x * s + coord.y * c
        );
        coord += 0.5;

        vec4 tex = texture2D(uTexture, coord);
        if (tex.a < 0.5) discard;

        gl_FragColor = vec4(vColor, tex.a * 0.5);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: commaTexture },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // =====================
    // Mouse
    // =====================
    const mouse = { x: 0, y: 0 };
    let rippleCenter = { x: 0, y: 0 };
    let rippleTime = 0;

    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / width) * 2 - 1;
      mouse.y = -(e.clientY / height) * 2 + 1;

      rippleCenter.x = mouse.x * (spreadX / 2);
      rippleCenter.y = mouse.y * (spreadY / 2);

      rippleTime = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // =====================
    // Resize
    // =====================
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      spreadX = (width / height) * 5;
      spreadY = 4.5;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // =====================
    // Animation
    // =====================
    const pos = geometry.attributes.position.array;

    const animate = () => {
      if (!isMounted) return;

      const time = performance.now() * 0.001;
      rippleTime += 0.016 * CONFIG.RIPPLE_SPEED;

      for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        const ix = i * 3;

        const baseX = basePositions[ix];
        const baseY = basePositions[ix + 1];

        let targetX = baseX;
        let targetY = baseY;

        // drift
        targetX += Math.sin(baseY * 1.5 + time) * CONFIG.DRIFT_STRENGTH;
        targetY += Math.cos(baseX * 1.5 + time) * CONFIG.DRIFT_STRENGTH;

        const dx = targetX - rippleCenter.x;
        const dy = targetY - rippleCenter.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // ripple wave
        const ripple = Math.exp(
          -Math.pow((dist - rippleTime) / CONFIG.RIPPLE_WIDTH, 2),
        );

        const rippleForce = ripple * CONFIG.RIPPLE_STRENGTH;

        if (dist > 0.001) {
          targetX += (dx / dist) * rippleForce;
          targetY += (dy / dist) * rippleForce;
        }

        // color shift (KEY ADDITION)
        const baseColorIndex = i % palette.length;
        const baseColor = palette[baseColorIndex];
        const highlightColor = palette[(baseColorIndex + 1) % palette.length];

        const ring = Math.exp(
          -Math.pow((dist - rippleTime) / (CONFIG.RIPPLE_WIDTH * 0.5), 2),
        );

        // only highlight the wave edge
        const mixFactor = Math.pow(ring, 3); // sharper ring

        colors[ix] = baseColor.r + (highlightColor.r - baseColor.r) * mixFactor;
        colors[ix + 1] =
          baseColor.g + (highlightColor.g - baseColor.g) * mixFactor;
        colors[ix + 2] =
          baseColor.b + (highlightColor.b - baseColor.b) * mixFactor;

        // velocity
        let vx = velocities[i * 2];
        let vy = velocities[i * 2 + 1];

        vx += (targetX - pos[ix]) * CONFIG.ACCELERATION;
        vy += (targetY - pos[ix + 1]) * CONFIG.ACCELERATION;

        vx *= CONFIG.DAMPING;
        vy *= CONFIG.DAMPING;

        pos[ix] += vx;
        pos[ix + 1] += vy;

        velocities[i * 2] = vx;
        velocities[i * 2 + 1] = vy;

        // angle from velocity
        angles[i] = Math.atan2(vy, vx);
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.angle.needsUpdate = true;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // =====================
    // Cleanup
    // =====================
    return () => {
      isMounted = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.9,
      }}
    />
  );
};

export default ThreeParticleCanvas;
