import * as THREE from "three";

export function createProfilePhoto(container) {
  if (!container) {
    return null;
  }

  const image = container.querySelector("img");

  if (!image) {
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

  camera.position.set(0, 0, 3.5);

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
    "profileThreeCanvas"
  );

  container.appendChild(renderer.domElement);

  /*
   * A thin box keeps the photograph looking
   * like a real object instead of a flat plane.
   */
  const geometry = new THREE.BoxGeometry(
    2.3,
    2.3,
    0.12,
    1,
    1,
    1
  );

  const textureLoader = new THREE.TextureLoader();

  let photoTexture = null;
  let photoMaterial = null;
  let sideMaterial = null;
  let photoMesh = null;
  let animationFrameId = null;
  let isReady = false;

  const pointerTarget = {
    x: 0,
    y: 0
  };

  const pointerCurrent = {
    x: 0,
    y: 0
  };

  let hoverTarget = 0;
  let hoverCurrent = 0;

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
    if (!isReady || prefersReducedMotion) {
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

    hoverTarget = 1;
  }

  function handlePointerEnter() {
    if (!prefersReducedMotion) {
      hoverTarget = 1;
    }
  }

  function handlePointerLeave() {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
    hoverTarget = 0;
  }

  textureLoader.load(
    image.src,

    (texture) => {
      texture.colorSpace =
        THREE.SRGBColorSpace;

      photoTexture = texture;

      photoMaterial =
        new THREE.MeshPhysicalMaterial({
          map: photoTexture,
          roughness: 0.58,
          metalness: 0,
          clearcoat: 0.42,
          clearcoatRoughness: 0.3
        });

      sideMaterial =
        new THREE.MeshStandardMaterial({
          color: 0x1f3d2b,
          roughness: 0.72,
          metalness: 0.04
        });

      const materials = [
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        photoMaterial,
        sideMaterial
      ];

      photoMesh = new THREE.Mesh(
        geometry,
        materials
      );

      photoMesh.rotation.set(
        -0.02,
        0.04,
        0
      );

      scene.add(photoMesh);

      const ambientLight =
        new THREE.AmbientLight(
          0xffffff,
          1.85
        );

      scene.add(ambientLight);

      const keyLight =
        new THREE.DirectionalLight(
          0xffffff,
          2.7
        );

      keyLight.position.set(
        2.5,
        3,
        4
      );

      scene.add(keyLight);

      const cyanLight =
        new THREE.PointLight(
          0x67e8f9,
          8,
          10
        );

      cyanLight.position.set(
        -2.5,
        -1,
        3
      );

      scene.add(cyanLight);

      const lavenderLight =
        new THREE.PointLight(
          0xc4b5fd,
          7,
          10
        );

      lavenderLight.position.set(
        2.5,
        0,
        3
      );

      scene.add(lavenderLight);

      isReady = true;

      container.classList.add(
        "profileThreeReady"
      );
    },

    undefined,

    (error) => {
      console.error(
        "Profile texture failed to load:",
        error
      );

      renderer.domElement.remove();
    }
  );

  const resizeObserver =
    new ResizeObserver(resizeRenderer);

  resizeObserver.observe(container);

  container.addEventListener(
    "pointermove",
    handlePointerMove
  );

  container.addEventListener(
    "pointerenter",
    handlePointerEnter
  );

  container.addEventListener(
    "pointerleave",
    handlePointerLeave
  );

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

    hoverCurrent +=
      (hoverTarget -
        hoverCurrent) *
      0.07;

    if (photoMesh) {
      if (prefersReducedMotion) {
        photoMesh.rotation.set(
          -0.02,
          0.04,
          0
        );
      } else {
        photoMesh.rotation.x =
          -0.02 -
          pointerCurrent.y *
            0.12 *
            hoverCurrent +
          Math.sin(seconds * 0.55) *
            0.01;

        photoMesh.rotation.y =
          0.04 +
          pointerCurrent.x *
            0.16 *
            hoverCurrent +
          Math.sin(seconds * 0.42) *
            0.02;

        photoMesh.rotation.z =
          pointerCurrent.x *
            0.006 *
            hoverCurrent;

        photoMesh.position.y =
          Math.sin(seconds * 0.75) *
          0.02;

        photoMesh.position.z =
          hoverCurrent * 0.08;

        const scale =
          1 +
          hoverCurrent * 0.018;

        photoMesh.scale.setScalar(scale);
      }
    }

    renderer.render(
      scene,
      camera
    );

    animationFrameId =
      window.requestAnimationFrame(
        render
      );
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
      "pointerenter",
      handlePointerEnter
    );

    container.removeEventListener(
      "pointerleave",
      handlePointerLeave
    );

    geometry.dispose();
    photoTexture?.dispose();
    photoMaterial?.dispose();
    sideMaterial?.dispose();

    renderer.dispose();
    renderer.domElement.remove();

    container.classList.remove(
      "profileThreeReady"
    );
  }

  return {
    scene,
    camera,
    renderer,
    get photoMesh() {
      return photoMesh;
    },
    destroy
  };
}