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
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "Fox/glTF/Fox.gltf",
  (gltf) => {
    // console.log("succes");
    console.log(gltf);

    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    console.log(action);
    action.play();
    // while (gltf.scene.children.length) {
    //   scene.add(gltf.scene.children[0]);
    gltf.scene.scale.set(0.025, 0.025, 0.025);
    scene.add(gltf.scene);
  },
  (progress) => {
    console.log("progress");
  },
  (failed) => {
    console.log("failed");
  },
);

/**
 * Website Generator
 */

debugObject.startingDistance = 3.75;
debugObject.objectDistance = 3;
debugObject.amount = 4;
gui.add(debugObject, "amount").step(1).min(0).max(15).onChange("to be done");
const selectionMeshes = [];

const material = new THREE.MeshBasicMaterial({ wireframe: true });

const websiteGenerator = function () {
  for (let i = 0; i < debugObject.amount; i++) {
    // Html duplication part
    const duplicateTemplate = template1.cloneNode(true);
    document.body.appendChild(duplicateTemplate);
    template1.style.display = "grid";

    // cube adding part
    const cubeDistance = -debugObject.objectDistance * i;
    const finalDistance = cubeDistance - debugObject.startingDistance;

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

    cube.position.set(-1.5, finalDistance, 0);
    scene.add(cube);
    selectionMeshes.push(cube);
  }
};

websiteGenerator();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
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
});

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

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// scroll
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  camera.position.y = -(scrollY / sizes.height) * 3;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Mixer
  if (mixer) {
    mixer.update(deltaTime);
  }

  selectionMeshes.forEach((cube, index) => {
    cube.rotation.x = 0.1 * elapsedTime + index * 0.05;
    cube.rotation.y = 0.12 * elapsedTime + index * 0.05;
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
