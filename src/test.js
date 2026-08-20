function duplicateSection(title, description) {
  const duplicatedSection = templatePart.cloneNode(true);

  duplicatedSection.querySelector("h2").textContent = title;
  duplicatedSection.querySelector(".process-panel p:last-child").textContent =
    description;

  document.body.appendChild(duplicatedSection);
}

const material = new THREE.MeshBasicMaterial({ wireframe: true });
const sectionMeshes = [];
debugObject.amount = 4;
gui.add(debugObject, "amount").onChange(console.log("hi"));
const amount = debugObject.amount;
const objectDistance = 3;
const startingDistance = 3;
let xAxis = -1.5;

const templateFunction = () => {
  for (let i = 0; i < amount; i++) {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

    cube.position.y = -objectDistance * i;
    cube.position.y += -startingDistance;
    cube.position.x = xAxis;
    sectionMeshes.push(cube);
    scene.add(cube);
    gui.add(cube.position, "x").min(-10).max(10).step(0.5);
    gui.add(cube.position, "y").min(-10).max(10).step(0.5);
    gui.add(cube.position, "z").min(-10).max(10).step(0.5);

    if (i > 0) {
      duplicateSection(
        "Second model",
        "This model was created by refining the original shape.",
      );
    }
  }
};
