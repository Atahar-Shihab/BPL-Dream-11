import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeCricketStadium = ({ isDarkMode = false }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const width = currentMount.clientWidth || 320;
    const height = currentMount.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    currentMount.appendChild(renderer.domElement);

    // Group for all rotating elements
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // 1. Procedural 3D Cricket Ball Leather Canvas Texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich cherry red gradient base
    const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
    grad.addColorStop(0, '#d91e2b');
    grad.addColorStop(0.7, '#a60f1b');
    grad.addColorStop(1, '#66050d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle leather pebble texture
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i < 2000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // Cricket Ball Seam (Double white stitched seam with chevron pattern)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.stroke();

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.stroke();

    // Seam stitches (chevron hatch lines)
    ctx.strokeStyle = '#f1f1f1';
    ctx.lineWidth = 2.5;
    for (let x = 0; x < 512; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 246);
      ctx.lineTo(x + 6, 256);
      ctx.lineTo(x, 266);
      ctx.stroke();
    }

    const ballTexture = new THREE.CanvasTexture(canvas);
    ballTexture.wrapS = THREE.RepeatWrapping;
    ballTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Ball Mesh
    const ballGeometry = new THREE.SphereGeometry(1.6, 64, 64);
    const ballMaterial = new THREE.MeshPhysicalMaterial({
      map: ballTexture,
      roughness: 0.28,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.7,
    });
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    sceneGroup.add(ballMesh);

    // 2. Glowing Golden Energy Ring around Cricket Ball
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
    sceneGroup.add(ringMesh);

    // 3. 3D Stadium Particle Field (floating motes of light)
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 8;

      colors[i] = 0.9;
      colors[i + 1] = Math.random() > 0.5 ? 0.98 : 0.7;
      colors[i + 2] = Math.random() > 0.5 ? 0.15 : 0.9;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. Stadium Lighting (Floodlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const floodlightTop = new THREE.DirectionalLight(0xffffff, 2.2);
    floodlightTop.position.set(5, 8, 6);
    scene.add(floodlightTop);

    const stadiumGreenLight = new THREE.DirectionalLight(0x00ff88, 1.2);
    stadiumGreenLight.position.set(-6, -3, 4);
    scene.add(stadiumGreenLight);

    const goldRimLight = new THREE.PointLight(0xe7fb25, 2.5, 12);
    goldRimLight.position.set(0, -2, 3);
    scene.add(goldRimLight);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = x / (rect.width / 2);
      mouseY = y / (rect.height / 2);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = currentMount.getBoundingClientRect();
        mouseX = (touch.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        mouseY = (touch.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      }
    };

    // Scroll 3D Dynamic Reactivity
    let scrollRotation = 0;
    const handleScroll = () => {
      scrollRotation = window.scrollY * 0.0035;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    currentMount.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Window Resize
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

      // Smooth inertia rotation
      targetRotationY = mouseX * 1.2 + scrollRotation;
      targetRotationX = -mouseY * 0.8;

      ballMesh.rotation.y += 0.008;
      ballMesh.rotation.x = THREE.MathUtils.lerp(ballMesh.rotation.x, targetRotationX + Math.sin(elapsedTime * 0.6) * 0.1, 0.06);
      ballMesh.rotation.z = THREE.MathUtils.lerp(ballMesh.rotation.z, targetRotationY, 0.06);

      // Ring counter-rotation
      ringMesh.rotation.z = -elapsedTime * 0.7;
      ringMesh.rotation.y = Math.sin(elapsedTime * 0.5) * 0.4;

      // Particle floating
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Slight camera parallax
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX * 0.4, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouseY * 0.4, 0.05);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousemove', handleMouseMove);
      currentMount.removeEventListener('touchmove', handleTouchMove);

      ballGeometry.dispose();
      ballMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      ballTexture.dispose();
      renderer.dispose();

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [isDarkMode]);

  return (
    <div
      ref={mountRef}
      className="three-canvas-container"
      title="Interactive 3D Cricket Ball - Drag or Scroll to rotate!"
      aria-label="Interactive 3D Cricket Ball"
      style={{
        width: '100%',
        maxWidth: '360px',
        height: '280px',
        margin: '0 auto',
        cursor: 'grab',
        touchAction: 'none',
      }}
    />
  );
};

export default ThreeCricketStadium;
