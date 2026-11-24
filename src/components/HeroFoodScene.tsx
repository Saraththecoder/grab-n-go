import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

interface HeroFoodSceneProps {
  scrollProgress: number;
  reducedMotion: boolean;
}

/**
 * Generates a subtle speckled matte stoneware texture on an offscreen canvas.
 */
function createStonewareTexture(baseHex: string, speckHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle mineral speckles
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 1.4 + 0.3;
    ctx.fillStyle = speckHex;
    ctx.globalAlpha = Math.random() * 0.22 + 0.04;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Generates dough or crispy fried crust texture + bump map.
 */
function createMomoTexture(variant: 'steamed' | 'fried'): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = 512;
  mapCanvas.height = 512;
  const mctx = mapCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bctx = bumpCanvas.getContext('2d')!;

  if (variant === 'steamed') {
    mctx.fillStyle = '#F7EFE3';
    mctx.fillRect(0, 0, 512, 512);
    // Warm translucent filling hint near mid-belly
    const grad = mctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#FFF8EE');
    grad.addColorStop(0.55, '#F4E8D6');
    grad.addColorStop(1, '#EAD7BE');
    mctx.fillStyle = grad;
    mctx.fillRect(0, 0, 512, 512);

    bctx.fillStyle = '#808080';
    bctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 1800; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const rad = Math.random() * 2.2 + 0.4;
      mctx.fillStyle = '#FFFFFF';
      mctx.globalAlpha = Math.random() * 0.14;
      mctx.beginPath();
      mctx.arc(x, y, rad, 0, Math.PI * 2);
      mctx.fill();

      bctx.fillStyle = i % 2 === 0 ? '#969696' : '#6c6c6c';
      bctx.globalAlpha = 0.12;
      bctx.beginPath();
      bctx.arc(x, y, rad, 0, Math.PI * 2);
      bctx.fill();
    }
  } else {
    const grad = mctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#E39A3B');
    grad.addColorStop(0.5, '#C9751F');
    grad.addColorStop(1, '#9E4B10');
    mctx.fillStyle = grad;
    mctx.fillRect(0, 0, 512, 512);

    bctx.fillStyle = '#808080';
    bctx.fillRect(0, 0, 512, 512);

    // Golden fried blisters
    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const rad = Math.random() * 4.5 + 1.0;
      mctx.fillStyle = i % 3 === 0 ? '#F2BA5E' : '#8A3E0A';
      mctx.globalAlpha = Math.random() * 0.25 + 0.05;
      mctx.beginPath();
      mctx.arc(x, y, rad, 0, Math.PI * 2);
      mctx.fill();

      bctx.fillStyle = i % 2 === 0 ? '#C8C8C8' : '#4A4A4A';
      bctx.globalAlpha = 0.28;
      bctx.beginPath();
      bctx.arc(x, y, rad, 0, Math.PI * 2);
      bctx.fill();
    }
  }

  mctx.globalAlpha = 1;
  bctx.globalAlpha = 1;

  const map = new THREE.CanvasTexture(mapCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  return { map, bumpMap };
}

/**
 * Generates kraft takeaway box texture with subtle fiber grain and minimal stamp.
 */
function createKraftBoxTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#C99F72';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 3200; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#B58B5D' : '#D9B288';
    ctx.globalAlpha = 0.18;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 6 + 1, 1);
  }
  ctx.globalAlpha = 1;

  // Minimal printed brand band
  ctx.fillStyle = '#191716';
  ctx.fillRect(48, 210, 416, 4);
  ctx.fillStyle = '#F26A05';
  ctx.fillRect(48, 224, 90, 8);
  ctx.fillStyle = '#191716';
  ctx.font = 'bold 34px "Space Grotesk", sans-serif';
  ctx.fillText('GRAB N GO', 48, 280);
  ctx.font = '500 16px monospace';
  ctx.fillStyle = '#4A3A2A';
  ctx.fillText('FRESH CAMPUS PREP · SLOT READY', 48, 308);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Creates a high-resolution sculpted pleated momo geometry (not a plain primitive).
 */
function createPleatedMomoGeometry(pleatCount = 14, seed = 0): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.42, 72, 48);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const angle = Math.atan2(v.z, v.x);
    const radiusXZ = Math.sqrt(v.x * v.x + v.z * v.z);
    // Normalize vertical t in [0, 1] from bottom (-0.42) to top (+0.42)
    const t = THREE.MathUtils.clamp((v.y + 0.42) / 0.84, 0, 1);

    // Flatten bottom to sit naturally on the plate
    let y = v.y;
    if (y < -0.18) {
      y = -0.18 + (y + 0.18) * 0.25;
    }

    // Taper smoothly toward a twisted pinched crown at the top
    const waistProfile =
      t < 0.35
        ? THREE.MathUtils.lerp(0.86, 1.08, t / 0.35)
        : THREE.MathUtils.lerp(1.08, 0.22, Math.pow((t - 0.35) / 0.65, 1.35));

    // Radial spiral pleats concentrated in upper two-thirds
    const pleatStrength = THREE.MathUtils.smoothstep(t, 0.2, 0.85) * 0.068;
    const spiralAngle = angle + t * 0.85 + seed;
    const pleatWave = Math.sin(spiralAngle * pleatCount) * pleatStrength;

    // Gentle organic irregularity
    const organic =
      1 + 0.04 * Math.sin(angle * 2 + seed * 1.7) + 0.025 * Math.cos(angle * 3 - seed);

    const scaleXZ = (waistProfile + pleatWave) * organic;
    const nx = radiusXZ > 0.0001 ? (v.x / radiusXZ) * radiusXZ * scaleXZ : 0;
    const nz = radiusXZ > 0.0001 ? (v.z / radiusXZ) * radiusXZ * scaleXZ : 0;

    // Slight crown lift at pinch
    const crownLift = t > 0.82 ? Math.pow((t - 0.82) / 0.18, 1.4) * 0.09 : 0;

    pos.setXYZ(i, nx, y * 0.88 + crownLift + 0.2, nz);
  }

  geo.computeVertexNormals();
  return geo;
}

function FoodComposition({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: number;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const trayRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const assets = useMemo(() => {
    const plateTex = createStonewareTexture('#F6F1EA', '#B8ADA1');
    const ramekinTex = createStonewareTexture('#24201E', '#3D3632');
    const steamedMaps = createMomoTexture('steamed');
    const friedMaps = createMomoTexture('fried');
    const kraftTex = createKraftBoxTexture();

    // Ceramic stoneware plate profile via LatheGeometry
    const platePoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1.45, 0),
      new THREE.Vector2(1.62, 0.04),
      new THREE.Vector2(1.98, 0.17),
      new THREE.Vector2(2.04, 0.23),
      new THREE.Vector2(2.01, 0.26),
      new THREE.Vector2(1.92, 0.24),
      new THREE.Vector2(1.52, 0.09),
      new THREE.Vector2(0, 0.07),
    ];
    const plateGeo = new THREE.LatheGeometry(platePoints, 72);

    // Dipping sauce ramekin profile
    const ramekinPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.42, 0),
      new THREE.Vector2(0.5, 0.26),
      new THREE.Vector2(0.48, 0.28),
      new THREE.Vector2(0.43, 0.26),
      new THREE.Vector2(0.36, 0.06),
      new THREE.Vector2(0, 0.06),
    ];
    const ramekinGeo = new THREE.LatheGeometry(ramekinPoints, 48);

    const steamedGeos = [0.2, 1.4, 2.7].map((s) => createPleatedMomoGeometry(14, s));
    const friedGeos = [3.9, 5.1, 6.2].map((s) => createPleatedMomoGeometry(13, s));

    // Organic glossy chili-garlic chutney texture
    const sauceCanvas = document.createElement('canvas');
    sauceCanvas.width = 256;
    sauceCanvas.height = 256;
    const sctx = sauceCanvas.getContext('2d')!;
    const sGrad = sctx.createRadialGradient(128, 128, 12, 128, 128, 128);
    sGrad.addColorStop(0, '#B91C0C');
    sGrad.addColorStop(0.65, '#991509');
    sGrad.addColorStop(1, '#6E0D05');
    sctx.fillStyle = sGrad;
    sctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 450; i++) {
      sctx.fillStyle = i % 3 === 0 ? '#E03E1A' : '#4A0802';
      sctx.globalAlpha = 0.35;
      sctx.beginPath();
      sctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 2.6 + 0.5, 0, Math.PI * 2);
      sctx.fill();
    }
    sctx.globalAlpha = 1;
    const sauceTex = new THREE.CanvasTexture(sauceCanvas);
    sauceTex.colorSpace = THREE.SRGBColorSpace;

    return {
      plateTex,
      ramekinTex,
      steamedMaps,
      friedMaps,
      kraftTex,
      sauceTex,
      plateGeo,
      ramekinGeo,
      steamedGeos,
      friedGeos,
    };
  }, []);

  useEffect(() => {
    return () => {
      assets.plateTex.dispose();
      assets.ramekinTex.dispose();
      assets.steamedMaps.map.dispose();
      assets.steamedMaps.bumpMap.dispose();
      assets.friedMaps.map.dispose();
      assets.friedMaps.bumpMap.dispose();
      assets.kraftTex.dispose();
      assets.sauceTex.dispose();
      assets.plateGeo.dispose();
      assets.ramekinGeo.dispose();
      assets.steamedGeos.forEach((g) => g.dispose());
      assets.friedGeos.forEach((g) => g.dispose());
    };
  }, [assets]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const targetRotY = reducedMotion
      ? 0.22
      : 0.22 + pointer.current.x * 0.22 + Math.sin(t * 0.35) * 0.06 + scrollProgress * 0.45;
    const targetRotX = reducedMotion
      ? 0.36
      : 0.36 + pointer.current.y * 0.1 + scrollProgress * 0.12;
    const targetY = reducedMotion ? 0 : -scrollProgress * 0.35;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      4.5,
      delta,
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      4.5,
      delta,
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      4.5,
      delta,
    );

    if (trayRef.current && !reducedMotion) {
      trayRef.current.rotation.y = -0.45 + Math.sin(t * 0.4) * 0.04 + pointer.current.x * 0.1;
    }
  });

  const steamedPlacements: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
    { pos: [-1.06, 0.07, -0.42], rot: [0.02, 0.4, -0.04] },
    { pos: [-0.98, 0.07, 0.44], rot: [-0.03, 1.8, 0.03] },
    { pos: [-0.28, 0.07, -0.98], rot: [0.03, 2.7, 0.02] },
  ];

  const friedPlacements: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
    { pos: [0.96, 0.07, -0.46], rot: [-0.03, 0.9, 0.04] },
    { pos: [1.02, 0.07, 0.4], rot: [0.04, 2.2, -0.02] },
    { pos: [0.22, 0.07, 1.02], rot: [-0.02, 3.6, 0.03] },
  ];

  const herbGarnishPositions: Array<{ pos: [number, number, number]; rot: [number, number, number]; scale: number }> = [
    { pos: [-0.45, 0.11, 0.72], rot: [0.1, 0.4, 0.2], scale: 1 },
    { pos: [0.46, 0.11, -0.78], rot: [-0.1, 1.9, -0.15], scale: 0.9 },
    { pos: [-0.15, 0.25, 0.08], rot: [0.2, 2.6, 0.1], scale: 0.75 },
    { pos: [0.58, 0.1, 0.28], rot: [0.05, 1.1, -0.2], scale: 0.85 },
  ];

  return (
    <group ref={groupRef} rotation={[0.36, 0.22, 0]}>
      <Float
        speed={reducedMotion ? 0 : 1.35}
        rotationIntensity={reducedMotion ? 0 : 0.08}
        floatIntensity={reducedMotion ? 0 : 0.22}
      >
        {/* Stoneware ceramic plate */}
        <mesh geometry={assets.plateGeo} castShadow receiveShadow>
          <meshStandardMaterial
            map={assets.plateTex}
            roughness={0.62}
            metalness={0.04}
          />
        </mesh>

        {/* Center ceramic ramekin with glossy spicy chili-garlic chutney */}
        <group position={[0, 0.07, 0]}>
          <mesh geometry={assets.ramekinGeo} castShadow receiveShadow>
            <meshStandardMaterial
              map={assets.ramekinTex}
              roughness={0.35}
              metalness={0.08}
            />
          </mesh>
          <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.41, 48]} />
            <meshPhysicalMaterial
              map={assets.sauceTex}
              roughness={0.14}
              clearcoat={1}
              clearcoatRoughness={0.08}
              sheen={0.5}
              sheenColor="#FF6B35"
            />
          </mesh>
          {/* Sesame seed garnish specks on sauce */}
          {[
            [0.12, 0.224, 0.08],
            [-0.14, 0.224, -0.09],
            [0.04, 0.224, -0.16],
            [-0.08, 0.224, 0.15],
          ].map((p, idx) => (
            <mesh key={idx} position={p as [number, number, number]} rotation={[0, idx * 0.8, 0]}>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshStandardMaterial color="#F7E6C4" roughness={0.5} />
            </mesh>
          ))}
        </group>

        {/* Sculpted steamed momos */}
        {steamedPlacements.map((item, idx) => (
          <mesh
            key={`steamed-${idx}`}
            geometry={assets.steamedGeos[idx]}
            position={item.pos}
            rotation={item.rot}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              map={assets.steamedMaps.map}
              bumpMap={assets.steamedMaps.bumpMap}
              bumpScale={0.008}
              roughness={0.56}
              sheen={0.38}
              sheenColor="#FFF8EB"
              clearcoat={0.08}
            />
          </mesh>
        ))}

        {/* Sculpted crispy golden fried momos */}
        {friedPlacements.map((item, idx) => (
          <mesh
            key={`fried-${idx}`}
            geometry={assets.friedGeos[idx]}
            position={item.pos}
            rotation={item.rot}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              map={assets.friedMaps.map}
              bumpMap={assets.friedMaps.bumpMap}
              bumpScale={0.022}
              roughness={0.44}
              metalness={0.05}
            />
          </mesh>
        ))}

        {/* Fresh coriander / scallion micro-garnish */}
        {herbGarnishPositions.map((g, idx) => (
          <mesh
            key={`herb-${idx}`}
            position={g.pos}
            rotation={g.rot}
            scale={[g.scale, g.scale * 0.25, g.scale * 0.55]}
            castShadow
          >
            <dodecahedronGeometry args={[0.075, 1]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#2D7D46' : '#3E9657'} roughness={0.65} />
          </mesh>
        ))}

        {/* Rotating Kraft Takeaway Container tucked gracefully behind the plate */}
        <group ref={trayRef} position={[-1.42, 0.34, -1.52]} rotation={[0.04, -0.45, -0.02]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.38, 0.52, 0.94]} />
            <meshStandardMaterial
              map={assets.kraftTex}
              roughness={0.86}
              metalness={0.02}
            />
          </mesh>
          {/* Box lid lip */}
          <mesh position={[0, 0.27, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.44, 0.08, 1.0]} />
            <meshStandardMaterial
              map={assets.kraftTex}
              roughness={0.82}
              metalness={0.02}
            />
          </mesh>
          {/* Orange tamper-evident pickup seal strip */}
          <mesh position={[0, 0.312, 0.16]}>
            <boxGeometry args={[0.24, 0.015, 0.72]} />
            <meshStandardMaterial color="#F26A05" roughness={0.45} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

export function HeroFoodScene({ scrollProgress, reducedMotion }: HeroFoodSceneProps) {
  return (
    <div className="relative h-full w-full" aria-label="Interactive 3D plate of steamed and fried momos with chili chutney and takeaway box">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 3.6, 5.65], fov: 33 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.65} color="#FFF4E6" />
        <directionalLight
          position={[4.5, 7, 4.5]}
          intensity={1.9}
          color="#FFF8F0"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={20}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0005}
        />
        <spotLight
          position={[-4, 4.5, -2.5]}
          angle={0.45}
          penumbra={0.85}
          intensity={1.1}
          color="#F26A05"
        />
        <pointLight position={[2.2, 1.5, -3]} intensity={0.45} color="#FFE5CC" />

        <Environment resolution={256} frames={1} environmentIntensity={0.65}>
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[0, 5, 2]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[10, 5, 1]}
            color="#FFF9F2"
          />
          <Lightformer
            form="rect"
            intensity={1.5}
            position={[-5, 2, -1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[6, 5, 1]}
            color="#FFE6CC"
          />
          <Lightformer
            form="circle"
            intensity={1.3}
            position={[5, 1.5, -2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[5, 5, 1]}
            color="#F26A05"
          />
        </Environment>

        <FoodComposition scrollProgress={scrollProgress} reducedMotion={reducedMotion} />

        <ContactShadows
          position={[0, -0.45, 0]}
          opacity={0.34}
          scale={8.5}
          blur={2.4}
          far={4}
          color="#191716"
        />
      </Canvas>
    </div>
  );
}
