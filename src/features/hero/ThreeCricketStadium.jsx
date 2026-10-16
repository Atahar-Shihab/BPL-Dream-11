import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { playBatShotSound, playClickSound, playCheerSound } from '../../utils/soundEffects';

const ThreeCricketStadium = ({ isDarkMode = false, initialMode = 'ball-red' }) => {
  const mountRef = useRef(null);
  const [modelMode, setModelMode] = useState(initialMode); // 'ball-red' | 'ball-white' | 'trophy'
  const [hitFeedback, setHitFeedback] = useState(null);

  // References to communicate with the Three.js animation loop without re-creating scene
  const triggerHitRef = useRef(null);
  const setModelModeRef = useRef(null);

  const handleHit = useCallback(() => {
    if (triggerHitRef.current) {
      triggerHitRef.current();
    }
  }, []);

  const handleSwitchMode = (newMode) => {
    playClickSound();
    setModelMode(newMode);
    if (setModelModeRef.current) {
      setModelModeRef.current(newMode);
    }
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth || 340;
    const height = currentMount.clientHeight || 280;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    currentMount.appendChild(renderer.domElement);

    // Master Group for 3D Interactive Object
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // -------------------------------------------------------------
    // 1. Procedural Ball Textures (Red Leather & White T20)
    // -------------------------------------------------------------
    const createBallTexture = (isWhite = false) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      if (isWhite) {
        // Crisp White T20 Ball with pearl sheen
        const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.7, '#e2e8f0');
        grad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Seam (Emerald green chevron stitch)
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(0, 256);
        ctx.lineTo(512, 256);
        ctx.stroke();

        ctx.strokeStyle = '#064e3b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 256);
        ctx.lineTo(512, 256);
        ctx.stroke();

        ctx.strokeStyle = '#a7f3d0';
        ctx.lineWidth = 2.5;
        for (let x = 0; x < 512; x += 12) {
          ctx.beginPath();
          ctx.moveTo(x, 246);
          ctx.lineTo(x + 6, 256);
          ctx.lineTo(x, 266);
          ctx.stroke();
        }
      } else {
        // Rich Cherry Red Leather Ball
        const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
        grad.addColorStop(0, '#dc2626');
        grad.addColorStop(0.7, '#991b1b');
        grad.addColorStop(1, '#450a0a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Subtle leather texture pores
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        for (let i = 0; i < 2000; i++) {
          ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
        }

        // White chevron seam
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(0, 256);
        ctx.lineTo(512, 256);
        ctx.stroke();

        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 256);
        ctx.lineTo(512, 256);
        ctx.stroke();

        ctx.strokeStyle = '#f4f4f5';
        ctx.lineWidth = 2.5;
        for (let x = 0; x < 512; x += 12) {
          ctx.beginPath();
          ctx.moveTo(x, 246);
          ctx.lineTo(x + 6, 256);
          ctx.lineTo(x, 266);
          ctx.stroke();
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    };

    const redBallTexture = createBallTexture(false);
    const whiteBallTexture = createBallTexture(true);

    // -------------------------------------------------------------
    // 2. Cricket Ball 3D Mesh
    // -------------------------------------------------------------
    const ballGroup = new THREE.Group();
    ballGroup.visible = initialMode !== 'trophy';
    sceneGroup.add(ballGroup);

    const ballGeometry = new THREE.SphereGeometry(1.6, 64, 64);
    const ballMaterial = new THREE.MeshPhysicalMaterial({
      map: initialMode === 'ball-white' ? whiteBallTexture : redBallTexture,
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.75,
    });
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    ballGroup.add(ballMesh);

    // Golden Orbital Ring around Ball
    const ringGeometry = new THREE.TorusGeometry(2.35, 0.04, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xe7fb25,
      emissive: 0xe7fb25,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 3;
    ballGroup.add(ringMesh);

    // -------------------------------------------------------------
    // 3. Procedural BPL Championship Trophy Group
    // -------------------------------------------------------------
    const trophyGroup = new THREE.Group();
    trophyGroup.visible = initialMode === 'trophy';
    sceneGroup.add(trophyGroup);

    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.25,
      roughness: 0.18,
      metalness: 0.9,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
    });

    const darkBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.3,
      metalness: 0.5,
    });

    // Trophy Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.45, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkBaseMaterial);
    baseMesh.position.y = -1.6;
    trophyGroup.add(baseMesh);

    // Gold Ring Trim on Base
    const baseTrimGeo = new THREE.TorusGeometry(1.25, 0.06, 16, 32);
    const baseTrim = new THREE.Mesh(baseTrimGeo, goldMaterial);
    baseTrim.rotation.x = Math.PI / 2;
    baseTrim.position.y = -1.35;
    trophyGroup.add(baseTrim);

    // Trophy Stem / Pillar
    const stemGeo = new THREE.CylinderGeometry(0.35, 0.5, 1.2, 32);
    const stemMesh = new THREE.Mesh(stemGeo, goldMaterial);
    stemMesh.position.y = -0.75;
    trophyGroup.add(stemMesh);

    // Trophy Chalice Cup Body
    const cupGeo = new THREE.CylinderGeometry(1.1, 0.45, 1.4, 32);
    const cupMesh = new THREE.Mesh(cupGeo, goldMaterial);
    cupMesh.position.y = 0.5;
    trophyGroup.add(cupMesh);

    // Trophy Handles (Left and Right)
    const handleGeo = new THREE.TorusGeometry(0.55, 0.07, 16, 32, Math.PI);
    const leftHandle = new THREE.Mesh(handleGeo, goldMaterial);
    leftHandle.position.set(-0.95, 0.55, 0);
    leftHandle.rotation.z = -Math.PI / 2;
    trophyGroup.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, goldMaterial);
    rightHandle.position.set(0.95, 0.55, 0);
    rightHandle.rotation.z = Math.PI / 2;
    trophyGroup.add(rightHandle);

    // Champion Star at the peak
    const starGeo = new THREE.OctahedronGeometry(0.35, 0);
    const starMesh = new THREE.Mesh(starGeo, goldMaterial);
    starMesh.position.y = 1.45;
    trophyGroup.add(starMesh);

    // -------------------------------------------------------------
    // 4. Shockwave Ring & Hit Sparks
    // -------------------------------------------------------------
    const shockwaveGeo = new THREE.TorusGeometry(1.6, 0.06, 16, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xffea00,
      transparent: true,
      opacity: 0,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    scene.add(shockwaveMesh);

    // Floating Stadium Ambient Particles
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 8;

      colors[i] = 0.95;
      colors[i + 1] = Math.random() > 0.5 ? 0.95 : 0.65;
      colors[i + 2] = Math.random() > 0.5 ? 0.2 : 0.85;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // -------------------------------------------------------------
    // 5. Lighting (Stadium Floodlights)
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const floodlightTop = new THREE.DirectionalLight(0xffffff, 2.5);
    floodlightTop.position.set(5, 8, 6);
    scene.add(floodlightTop);

    const stadiumGreenLight = new THREE.DirectionalLight(0x10b981, 1.2);
    stadiumGreenLight.position.set(-6, -3, 4);
    scene.add(stadiumGreenLight);

    const goldRimLight = new THREE.PointLight(0xf59e0b, 2.8, 14);
    goldRimLight.position.set(0, -2, 3);
    scene.add(goldRimLight);

    // -------------------------------------------------------------
    // 6. Interactive Physics & Inertia Drag Handlers
    // -------------------------------------------------------------
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let hitAnimationProgress = 1;

    const onPointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      currentMount.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      velocityX = deltaX * 0.008;
      velocityY = deltaY * 0.008;

      sceneGroup.rotation.y += velocityX;
      sceneGroup.rotation.x += velocityY;

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      currentMount.style.cursor = 'grab';
    };

    // Trigger Shot Hit Function
    triggerHitRef.current = () => {
      playBatShotSound();
      hitAnimationProgress = 0;
      shockwaveMesh.scale.set(1, 1, 1);
      shockwaveMat.opacity = 0.9;

      // Tumbling impulse
      velocityX = (Math.random() - 0.5) * 0.4 + 0.25;
      velocityY = (Math.random() - 0.5) * 0.3;

      const outcomes = [
        '⚡ CRACK! MAXIMUM 6 RUNS! 🏏',
        '🔥 GLORIOUS COVER DRIVE FOR 4! 🔥',
        '🚀 MONSTER 108M SIX OVER MID-WICKET!',
        '🎯 BOUNDARY! PURE CRICKETING CLASS!',
      ];
      const pick = outcomes[Math.floor(Math.random() * outcomes.length)];
      setHitFeedback(pick);

      if (pick.includes('6')) {
        playCheerSound();
      }

      setTimeout(() => {
        setHitFeedback(null);
      }, 2500);
    };

    // Mode Switcher Ref
    setModelModeRef.current = (mode) => {
      if (mode === 'trophy') {
        ballGroup.visible = false;
        trophyGroup.visible = true;
      } else {
        trophyGroup.visible = false;
        ballGroup.visible = true;
        ballMaterial.map = mode === 'ball-white' ? whiteBallTexture : redBallTexture;
        ballMaterial.needsUpdate = true;
      }
    };

    currentMount.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    currentMount.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Window Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Inertia decay
      if (!isDragging) {
        sceneGroup.rotation.y += velocityX;
        sceneGroup.rotation.x += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;

        // Default gentle ambient orbit
        sceneGroup.rotation.y += 0.006;
      }

      // Ball / Ring specific continuous rotation
      if (ballGroup.visible) {
        ballMesh.rotation.y += 0.005;
        ringMesh.rotation.z = -elapsedTime * 0.7;
      }

      // Trophy star spinning atop
      if (trophyGroup.visible) {
        starMesh.rotation.y += 0.04;
        starMesh.rotation.x += 0.02;
      }

      // Hit animation shockwave expansion
      if (hitAnimationProgress < 1) {
        hitAnimationProgress += 0.035;
        const scaleVal = 1 + hitAnimationProgress * 2.5;
        shockwaveMesh.scale.set(scaleVal, scaleVal, scaleVal);
        shockwaveMat.opacity = Math.max(0, 0.9 * (1 - hitAnimationProgress));
      }

      // Ambient particle motion
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      currentMount.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      ballGeometry.dispose();
      ballMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      baseGeo.dispose();
      baseTrimGeo.dispose();
      stemGeo.dispose();
      cupGeo.dispose();
      handleGeo.dispose();
      starGeo.dispose();
      goldMaterial.dispose();
      darkBaseMaterial.dispose();
      shockwaveGeo.dispose();
      shockwaveMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      redBallTexture.dispose();
      whiteBallTexture.dispose();
      renderer.dispose();

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [isDarkMode, initialMode]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[360px] mx-auto">
      {/* 3D Canvas Canvas Wrap */}
      <div className="relative w-full flex justify-center">
        <div
          ref={mountRef}
          onClick={handleHit}
          className="three-canvas-container"
          title="Drag 360° to rotate • Click to Strike Shot!"
          aria-label="Interactive Three.js 3D Cricket Experience"
          style={{
            width: '100%',
            height: '260px',
            cursor: 'grab',
            touchAction: 'none',
          }}
        />

        {/* Dynamic Hit Feedback Toast */}
        {hitFeedback && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-yellow-400 text-neutral-950 font-black text-xs shadow-2xl animate-bounce whitespace-nowrap border-2 border-white">
            {hitFeedback}
          </div>
        )}
      </div>

      {/* Interactive Controls Bar: Model Switcher & Strike Shot */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1 bg-black/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg z-20">
        <button
          type="button"
          onClick={() => handleSwitchMode('ball-red')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
            modelMode === 'ball-red'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="Red Leather Test Ball"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          Red Ball
        </button>

        <button
          type="button"
          onClick={() => handleSwitchMode('ball-white')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
            modelMode === 'ball-white'
              ? 'bg-white text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="White T20 Match Ball"
        >
          <span className="w-2 h-2 rounded-full bg-white border border-neutral-400 inline-block" />
          White T20
        </button>

        <button
          type="button"
          onClick={() => handleSwitchMode('trophy')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
            modelMode === 'trophy'
              ? 'bg-yellow-400 text-neutral-950 shadow-md font-black'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="BPL Championship Trophy"
        >
          🏆 Trophy
        </button>

        <button
          type="button"
          onClick={handleHit}
          className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 text-[11px] font-black shadow transition active:scale-90 cursor-pointer ml-1"
          title="Smash the cricket ball for a boundary!"
        >
          ⚡ Hit!
        </button>
      </div>

      <span className="text-[10px] text-neutral-400 mt-1.5 flex items-center gap-1">
        <span>Drag 360° to spin</span>
        <span>•</span>
        <span>Click to smash shot</span>
      </span>
    </div>
  );
};

export default ThreeCricketStadium;
