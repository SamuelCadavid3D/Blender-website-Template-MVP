import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Native js
const template1 = document.querySelector(".showcase");

/**
 * Base
 */
// Debug
const gui = new GUI();

const debugObject = {};

let mixer = null;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// 3D models

const imported3DModels = [];

function centerModelInParent(model, parent) {
  parent.add(model);
  model.position.set(0, 0, 0);
  model.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(model);
  const worldCenter = bounds.getCenter(new THREE.Vector3());
  const parentCenter = parent.worldToLocal(worldCenter);

  model.position.sub(parentCenter);
}

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/Fox/glTF/Fox.gltf",
  (gltf) => {
    // console.log("succes");
    console.log(gltf);

    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    console.log(action);
    action.play();

    gltf.scene.scale.set(0.015, 0.015, 0.015);

    const parentCube = selectionMeshes[0];
    if (!parentCube) return;

    centerModelInParent(gltf.scene, parentCube);
    imported3DModels.push(gltf.scene);
  },
  (progress) => {
    console.log("progress");
  },
  (failed) => {
    console.log("failed");
  },
);
gltfLoader.load(
  "/Duck/glTF/Duck.gltf",
  (gltf) => {
    // console.log("succes");
    console.log(gltf);

    gltf.scene.scale.set(0.7, 0.7, 0.7);

    const parentCube = selectionMeshes[2];
    if (!parentCube) return;

    centerModelInParent(gltf.scene, parentCube);
    imported3DModels.push(gltf.scene);
  },
  (progress) => {
    console.log("progress");
  },
  (failed) => {
    console.log("failed");
  },
);
let gameBoy = null;
gltfLoader.load(
  "nintendo_game_boy_original_1989.glb",
  (gltf) => {
    // console.log("succes");
    gameBoy = gltf.scene;
    console.log(gltf);
    let size = 10;
    gltf.scene.scale.set(size, size, size);
    gltf.scene.position.x = 1;

    scene.add(gltf.scene);
  },
  (progress) => {
    console.log("progress");
  },
  (failed) => {
    console.log("failed");
  },
);
gltfLoader.load(
  "/Fox/glTF/Fox.gltf",
  (gltf) => {
    // console.log("succes");
    console.log(gltf);

    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[1]);
    console.log(action);
    action.play();

    gltf.scene.scale.set(0.015, 0.015, 0.015);

    const parentCube = selectionMeshes[1];
    if (!parentCube) return;

    centerModelInParent(gltf.scene, parentCube);
    imported3DModels.push(gltf.scene);
  },
  (progress) => {
    console.log("progress");
  },
  (failed) => {
    console.log("failed");
  },
);

const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(2, 3, 4);
scene.add(keyLight);

/**
 * Website Generator
 */

debugObject.startingDistance = 3.75;
debugObject.objectDistance = 3;
debugObject.amount = 3;
const selectionMeshes = [];
const websiteSections = [];

const material = new THREE.MeshBasicMaterial({ wireframe: true });

const websiteGenerator = function () {
  for (let i = 0; i < debugObject.amount; i++) {
    // Html duplication part
    const duplicateTemplate = template1.cloneNode(true);
    duplicateTemplate.style.display = "grid";
    document.body.appendChild(duplicateTemplate);
    websiteSections.push(duplicateTemplate);

    // cube adding part
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

    cube.position.set(-1.5, 0, 0);
    scene.add(cube);
    selectionMeshes.push(cube);
  }
};

const regenerateWebsite = () => {
  websiteSections.forEach((section) => section.remove());
  websiteSections.length = 0;

  selectionMeshes.forEach((mesh) => {
    scene.remove(mesh);
    mesh.traverse((child) => {
      if (child.isMesh) child.geometry.dispose();
    });
  });
  selectionMeshes.length = 0;

  websiteGenerator();
  positionMeshesAtSectionCenters();
};

gui
  .add(debugObject, "amount")
  .step(1)
  .min(0)
  .max(15)
  .onChange(regenerateWebsite);

websiteGenerator();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const positionMeshesAtSectionCenters = () => {
  websiteSections.forEach((section, index) => {
    const mesh = selectionMeshes[index];
    if (!mesh) return;

    const bounds = section.getBoundingClientRect();
    const sectionCenter = bounds.top + window.scrollY + bounds.height / 2;
    const viewportCenter = sizes.height / 2;

    mesh.position.y =
      -((sectionCenter - viewportCenter) / sizes.height) *
      debugObject.objectDistance;
  });
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  positionMeshesAtSectionCenters();
});

positionMeshesAtSectionCenters();

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(0, 0, 3);
camera.lookAt(0, 0, 0);
scene.add(camera);

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

cameraGroup.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

const cursor = {};
cursor.x = 0;
cursor.y = 0;

debugObject.cameraSensibility = 2;
window.addEventListener("mousemove", function (event) {
  cursor.x =
    (event.clientX / sizes.width - 0.25) / debugObject.cameraSensibility;
  cursor.y =
    (event.clientY / sizes.height - 0.25) / debugObject.cameraSensibility;
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// scroll
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  camera.position.y = -(scrollY / sizes.height) * debugObject.objectDistance;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Mixer
  if (mixer) {
    mixer.update(deltaTime);
  }

  selectionMeshes.forEach((cube, index) => {
    // cube.rotation.x = 0.01 * elapsedTime + index * 0.05;
    cube.rotation.y = 0.12 * elapsedTime + index * 0.05;
  });

  // animate camera
  camera.position.y = (-scrollY / sizes.height) * debugObject.objectDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  if (gameBoy) {
    gameBoy.rotation.y = elapsedTime * 0.052;
    gameBoy.rotation.x = elapsedTime * 0.05;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
