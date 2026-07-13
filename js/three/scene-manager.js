import * as THREE from "three";

import {
  createHeaderSparkle
} from "./header.js";

import {
  createProfilePhoto
} from "./profile.js";

import {
  createDevDiaryCharm
} from "./dev-diary.js";

console.log(
  "Three.js connected:",
  THREE.REVISION
);

const threeFeatures = [];

function registerFeature(feature) {
  if (feature) {
    threeFeatures.push(feature);
  }
}

function initializeThreeFeatures() {
  registerFeature(
    createHeaderSparkle(
      document.getElementById(
        "headerSparkle"
      )
    )
  );

  registerFeature(
    createProfilePhoto(
      document.querySelector(
        ".profilePic"
      )
    )
  );

  registerFeature(
    createDevDiaryCharm(
      document.getElementById(
        "devDiaryCharm"
      )
    )
  );
}

function destroyThreeFeatures() {
  threeFeatures.forEach((feature) => {
    feature.destroy?.();
  });

  threeFeatures.length = 0;
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeThreeFeatures,
    { once: true }
  );
} else {
  initializeThreeFeatures();
}

window.addEventListener(
  "pagehide",
  destroyThreeFeatures,
  { once: true }
);