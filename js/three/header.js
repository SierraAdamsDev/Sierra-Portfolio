import * as THREE from "three";

export function createHeaderSparkle(container) {
  if (!container) {
    return null;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    1,
    0.1,
    100
  );

  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  container.appendChild(renderer.domElement);

  /*
   * Four-point sparkle shape.
   */
  const sparkleShape = new THREE.Shape();

  sparkleShape.moveTo(0, 1.15);
  sparkleShape.lineTo(0.22, 0.22);
  sparkleShape.lineTo(1.15, 0);
  sparkleShape.lineTo(0.22, -0.22);
  sparkleShape.lineTo(0, -1.15);
  sparkleShape.lineTo(-0.22, -0.22);
  sparkleShape.lineTo(-1.15, 0);
  sparkleShape.lineTo(-0.22, 0.22);
  sparkleShape.closePath();

  /*
   * More extrusion and bevel depth make the shape
   * read clearly as a real 3D object.
   */
  const geometry = new THREE.ExtrudeGeometry(
    sparkleShape,
    {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.16,
      bevelSize: 0.12,
      bevelOffset: 0,
      bevelSegments: 6,
      curveSegments: 8,
      steps: 1
    }
  );

  geometry.center();
  geometry.computeVertexNormals();

  /*
   * Physical material keeps proper Three.js lighting
   * while adding iridescent color shifts.
   */
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x9ddcff,
    metalness: 0.22,
    roughness: 0.18,

    clearcoat: 1,
    clearcoatRoughness: 0.08,

    iridescence: 1,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [180, 520],

    sheen: 0.65,
    sheenRoughness: 0.24,
    sheenColor: new THREE.Color("#c4b5fd"),

    emissive: new THREE.Color("#442b74"),
    emissiveIntensity: 0.2,

    side: THREE.DoubleSide
  });

  const sparkle = new THREE.Mesh(
    geometry,
    material
  );

  sparkle.scale.setScalar(0.72);
  sparkle.rotation.set(
    -0.22,
    0.35,
    0.08
  );

  scene.add(sparkle);

  /*
   * Lighting is intentionally uneven so the front,
   * bevels, and extruded sides read differently.
   */
  const ambientLight = new THREE.AmbientLight(
    0x9fbaff,
    1.35
  );

  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(
    0xffffff,
    3.2
  );

  keyLight.position.set(
    3,
    4,
    5
  );

  scene.add(keyLight);

  const cyanLight = new THREE.PointLight(
    0x55e7ff,
    20,
    12
  );

  cyanLight.position.set(
    -2.5,
    1.8,
    3
  );

  scene.add(cyanLight);

  const lavenderLight = new THREE.PointLight(
    0xc4b5fd,
    18,
    12
  );

  lavenderLight.position.set(
    2.5,
    -1.5,
    2.5
  );

  scene.add(lavenderLight);

  const pinkLight = new THREE.PointLight(
    0xf9a8d4,
    12,
    10
  );

  pinkLight.position.set(
    0,
    -3,
    1.5
  );

  scene.add(pinkLight);

  /*
   * A smaller rear sparkle adds a faint halo and
   * stronger silhouette without flattening the shape.
   */
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x8fdcff,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide
  });

  const glow = new THREE.Mesh(
    geometry,
    glowMaterial
  );

  glow.scale.setScalar(1.12);
  sparkle.add(glow);

  const pointerTarget = {
    x: 0,
    y: 0
  };

  const pointerCurrent = {
    x: 0,
    y: 0
  };

  function resizeRenderer() {
    const width = Math.max(
      container.clientWidth,
      1
    );

    const height = Math.max(
      container.clientHeight,
      1
    );

    renderer.setSize(
      width,
      height,
      false
    );

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function handlePointerMove(event) {
    const bounds =
      container.getBoundingClientRect();

    pointerTarget.x =
      ((event.clientX - bounds.left) /
        bounds.width) *
        2 -
      1;

    pointerTarget.y =
      -(
        ((event.clientY - bounds.top) /
          bounds.height) *
          2 -
        1
      );
  }

  function handlePointerLeave() {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
  }

  const resizeObserver =
    new ResizeObserver(resizeRenderer);

  resizeObserver.observe(container);

  container.addEventListener(
    "pointermove",
    handlePointerMove
  );

  container.addEventListener(
    "pointerleave",
    handlePointerLeave
  );

  let animationFrameId = null;

  function render(time = 0) {
    const seconds = time * 0.001;

    pointerCurrent.x +=
      (pointerTarget.x -
        pointerCurrent.x) *
      0.09;

    pointerCurrent.y +=
      (pointerTarget.y -
        pointerCurrent.y) *
      0.09;

    /*
     * This motion is intentionally visible enough
     * to prove the object is 3D.
     */
    if (!prefersReducedMotion) {
      sparkle.rotation.x =
        -0.22 +
        Math.sin(seconds * 1.1) * 0.24 +
        pointerCurrent.y * 0.32;

      sparkle.rotation.y =
        0.35 +
        Math.sin(seconds * 0.9) * 0.42 +
        pointerCurrent.x * 0.55;

      sparkle.rotation.z =
        0.08 +
        Math.sin(seconds * 0.7) * 0.10;

      sparkle.position.y =
        Math.sin(seconds * 1.5) * 0.07;

      const pulse =
        0.72 +
        Math.sin(seconds * 2.0) * 0.03;

      sparkle.scale.setScalar(pulse);

      /*
       * Moving lights make the colors shift across
       * the bevels instead of appearing painted on.
       */
      cyanLight.position.x =
        Math.sin(seconds * 0.8) * 3;

      cyanLight.position.y =
        1.8 +
        Math.cos(seconds * 0.7) * 1.2;

      lavenderLight.position.x =
        Math.cos(seconds * 0.65) * 3;

      lavenderLight.position.y =
        -1.5 +
        Math.sin(seconds * 0.75) * 1.3;

      pinkLight.position.x =
        Math.sin(seconds * 0.5) * 2;
    } else {
      sparkle.rotation.set(
        -0.22,
        0.35,
        0.08
      );
    }

    renderer.render(
      scene,
      camera
    );

    animationFrameId =
      window.requestAnimationFrame(render);
  }

  resizeRenderer();
  render();

  function destroy() {
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(
        animationFrameId
      );
    }

    resizeObserver.disconnect();

    container.removeEventListener(
      "pointermove",
      handlePointerMove
    );

    container.removeEventListener(
      "pointerleave",
      handlePointerLeave
    );

    geometry.dispose();
    material.dispose();
    glowMaterial.dispose();
    renderer.dispose();

    renderer.domElement.remove();
  }

  return {
    scene,
    camera,
    renderer,
    sparkle,
    destroy
  };
}