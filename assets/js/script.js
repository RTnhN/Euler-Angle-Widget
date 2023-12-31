function updateCubeRotation() {
  const order =
    controls.frameOfReference === "Body"
      ? controls.rotationOrder
      : controls.rotationOrder.split("").reverse().join("");
  cube.rotation.copy(
    new THREE.Euler(
      THREE.MathUtils.degToRad(controls.rotationX),
      THREE.MathUtils.degToRad(controls.rotationY),
      THREE.MathUtils.degToRad(controls.rotationZ),
      order
    )
  );
}
const container = document.getElementById("myContainer");

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  -container.clientWidth / 200,
  container.clientWidth / 200,
  container.clientHeight / 200,
  -container.clientHeight / 200,
  0,
  200
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xd3d3d3 }); // Light grey
const cube = new THREE.Mesh(geometry, material);

// Add edges to the cube
const edges = new THREE.EdgesGeometry(geometry);
const line = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);
cube.add(line);

// Add global axis
const axesHelperFixed = new THREE.AxesHelper(1);
axesHelperFixed.position.set(1, -2, 0); // Offset position
scene.add(axesHelperFixed);

// Add body axis
const axesHelper = new THREE.AxesHelper(2);
cube.add(axesHelper);

scene.add(cube);
camera.position.z = 5;

// Create GUI controls
const gui = new dat.GUI();
const controls = {
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  rotationOrder: "XYZ",
  frameOfReference: "Body",
};

gui.add(controls, "rotationX", 0, 360).onChange(updateCubeRotation);
gui.add(controls, "rotationY", 0, 360).onChange(updateCubeRotation);
gui.add(controls, "rotationZ", 0, 360).onChange(updateCubeRotation);
gui.add(controls, "rotationOrder", [ 'XYZ', 'XZY', 'YXZ', 'YZX', 'ZXY', 'ZYX' ]).onChange(updateCubeRotation);
gui.add(controls, "frameOfReference", ["Body", "Global"])
  .onChange(updateCubeRotation);

// Add text to the cube
const loader = new THREE.FontLoader();
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black
    const textMaterialGlobal = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
    }); // Black
    const textGeometryGlobal = new THREE.TextGeometry(
      "Global Coordinates",
      {
        font: font,
        size: 0.1,
        height: 0.005,
      }
    );
    const textMeshGlobal = new THREE.Mesh(
      textGeometryGlobal,
      textMaterialGlobal
    );
    textMeshGlobal.position.set(1, -2.2 , 0);
    scene.add(textMeshGlobal);

    ["X", "Y", "Z"].forEach((letter, index) => {
      const textGeometry = new THREE.TextGeometry(letter, {
        font: font,
        size: 0.2,
        height: 0.01,
      });

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textGeometry.computeBoundingBox();
      const centerOffset = -0.5 *
        (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);

      if (letter === "X") {
        textMesh.rotation.y = -Math.PI / 2;
        textMesh.position.set(0.51, centerOffset, centerOffset);
      } else if (letter === "Y") {
        textMesh.rotation.x = Math.PI / 2;
        textMesh.position.set(centerOffset, 0.51, centerOffset);
      } else if (letter === "Z") {
        textMesh.position.set(centerOffset, centerOffset, 0.51);
      }

      cube.add(textMesh);
    });
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
container.appendChild(renderer.domElement);