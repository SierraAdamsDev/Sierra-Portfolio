import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function createDevDiaryCharm(container) {
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

  camera.position.set(0, 0, 5.5);

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

  renderer.domElement.classList.add(
    "devDiaryThreeCanvas"
  );

  container.appendChild(renderer.domElement);

  /*
   * The floppy is a group made from several
   * simple geometries.
   */
  const floppy = new THREE.Group();

  /*
   * FLOPPY BODY
   */
  const bodyGeometry = new RoundedBoxGeometry(
    2.15,
    2.15,
    0.34,
    5,
    0.12
  );

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x2b2b2b,
    metalness: 0.12,
    roughness: 0.42,
    clearcoat: 0.4,
    clearcoatRoughness: 0.28
  });

  const body = new THREE.Mesh(
    bodyGeometry,
    bodyMaterial
  );

  floppy.add(body);

  /*
   * IRIDESCENT SHUTTER
   */
  const shutterGeometry = new RoundedBoxGeometry(
    1.34,
    0.64,
    0.16,
    4,
    0.08
  );

  const shutterMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0x9ddcff,
      metalness: 0.48,
      roughness: 0.14,

      clearcoat: 1,
      clearcoatRoughness: 0.05,

      iridescence: 1,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [180, 520],

      sheen: 0.7,
      sheenRoughness: 0.2,
      sheenColor: new THREE.Color("#c4b5fd"),

      emissive: new THREE.Color("#3b235f"),
      emissiveIntensity: 0.14
    });

  const shutter = new THREE.Mesh(
    shutterGeometry,
    shutterMaterial
  );

  shutter.position.set(
    0,
    0.63,
    0.24
  );

  floppy.add(shutter);

  /*
   * SHUTTER OPENING
   */
  const shutterSlotGeometry =
    new RoundedBoxGeometry(
      0.34,
      0.3,
      0.05,
      3,
      0.04
    );

  const darkMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x171717,
      roughness: 0.72,
      metalness: 0.08
    });

  const shutterSlot = new THREE.Mesh(
    shutterSlotGeometry,
    darkMaterial
  );

  shutterSlot.position.set(
    0.29,
    0.63,
    0.34
  );

  floppy.add(shutterSlot);

  /*
   * FRONT LABEL
   */
  const labelGeometry = new RoundedBoxGeometry(
    1.48,
    0.78,
    0.08,
    4,
    0.07
  );

  const labelMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xf8f5ee,
      roughness: 0.72,
      metalness: 0,
      clearcoat: 0.12,
      clearcoatRoughness: 0.62
    });

  const label = new THREE.Mesh(
    labelGeometry,
    labelMaterial
  );

  label.position.set(
    0,
    -0.25,
    0.24
  );

  floppy.add(label);

  /*
   * LABEL LINES
   */
  const lineGeometry =
    new RoundedBoxGeometry(
      0.98,
      0.06,
      0.035,
      2,
      0.02
    );

  const lineMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x6e8fbf
    });

  const lineOne = new THREE.Mesh(
    lineGeometry,
    lineMaterial
  );

  lineOne.position.set(
    0,
    -0.09,
    0.3
  );

  floppy.add(lineOne);

  const lineTwo = lineOne.clone();

  lineTwo.scale.x = 0.75;
  lineTwo.position.y = -0.3;

  floppy.add(lineTwo);

  /*
   * LOWER HUB
   */
  const hubGeometry = new THREE.CylinderGeometry(
    0.26,
    0.26,
    0.09,
    32
  );

  const hubMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0x8fdcff,
      metalness: 0.5,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [160, 480]
    });

  const hub = new THREE.Mesh(
    hubGeometry,
    hubMaterial
  );

  hub.rotation.x = Math.PI / 2;

  hub.position.set(
    0,
    -0.78,
    0.25
  );

  floppy.add(hub);

  /*
   * HUB CENTER
   */
  const hubCenterGeometry =
    new THREE.CylinderGeometry(
      0.1,
      0.1,
      0.11,
      24
    );

  const hubCenter = new THREE.Mesh(
    hubCenterGeometry,
    darkMaterial
  );

  hubCenter.rotation.x = Math.PI / 2;

  hubCenter.position.set(
    0,
    -0.78,
    0.31
  );

  floppy.add(hubCenter);

  /*
   * WRITE-PROTECT TAB
   */
  const tabGeometry =
    new RoundedBoxGeometry(
      0.25,
      0.29,
      0.08,
      3,
      0.03
    );

  const tabMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xc9a24d,
      metalness: 0.35,
      roughness: 0.22,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12
    });

  const writeProtectTab = new THREE.Mesh(
    tabGeometry,
    tabMaterial
  );

  writeProtectTab.position.set(
    -0.72,
    -0.75,
    0.25
  );

  floppy.add(writeProtectTab);

  /*
   * SMALL CORNER CUTOUT
   */
  const cornerGeometry =
    new RoundedBoxGeometry(
      0.3,
      0.24,
      0.08,
      3,
      0.03
    );

  const cornerCutout = new THREE.Mesh(
    cornerGeometry,
    darkMaterial
  );

  cornerCutout.position.set(
    0.7,
    -0.76,
    0.24
  );

  floppy.add(cornerCutout);

  /*
   * Initial positioning
   */
  floppy.scale.setScalar(0.78);

floppy.rotation.set(
  -0.26,
  0.46,
  -0.22
);

  scene.add(floppy);

  /*
   * LIGHTING
   */
  const ambientLight = new THREE.AmbientLight(
    0xaec8ff,
    1.45
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
    18,
    12
  );

  cyanLight.position.set(
    -2.5,
    1.5,
    3
  );

  scene.add(cyanLight);

  const lavenderLight = new THREE.PointLight(
    0xc4b5fd,
    16,
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
    10,
    10
  );

  pinkLight.position.set(
    0,
    -2.5,
    2
  );

  scene.add(pinkLight);

  /*
   * POINTER STATE
   */
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
    if (prefersReducedMotion) {
      return;
    }

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
      0.08;

    pointerCurrent.y +=
      (pointerTarget.y -
        pointerCurrent.y) *
      0.08;

    if (!prefersReducedMotion) {
      floppy.rotation.x =
        -0.26 +
        Math.sin(seconds * 0.72) * 0.12 +
        pointerCurrent.y * 0.2;

      floppy.rotation.y =
        0.46 +
        Math.sin(seconds * 0.55) * 0.3 +
        pointerCurrent.x * 0.32;

      floppy.rotation.z =
        -0.22 +
        Math.sin(seconds * 0.42) * 0.07;

      floppy.position.y =
        Math.sin(seconds * 1.05) * 0.06;

      floppy.position.x =
        Math.cos(seconds * 0.7) * 0.025;

      const pulse =
        0.78 +
        Math.sin(seconds * 1.35) * 0.014;

      floppy.scale.setScalar(pulse);

      cyanLight.position.x =
        Math.sin(seconds * 0.8) * 3;

      lavenderLight.position.x =
        Math.cos(seconds * 0.65) * 3;

      pinkLight.position.y =
        -2.5 +
        Math.sin(seconds * 0.5) * 1.4;
    } else {
      floppy.rotation.set(
        -0.2,
        0.34,
        -0.08
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

    bodyGeometry.dispose();
    shutterGeometry.dispose();
    shutterSlotGeometry.dispose();
    labelGeometry.dispose();
    lineGeometry.dispose();
    hubGeometry.dispose();
    hubCenterGeometry.dispose();
    tabGeometry.dispose();
    cornerGeometry.dispose();

    bodyMaterial.dispose();
    shutterMaterial.dispose();
    darkMaterial.dispose();
    labelMaterial.dispose();
    lineMaterial.dispose();
    hubMaterial.dispose();
    tabMaterial.dispose();

    renderer.dispose();
    renderer.domElement.remove();
  }

  return {
    scene,
    camera,
    renderer,
    floppy,
    destroy
  };
}