import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const stage = document.querySelector('#stage');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
camera.position.set(4.6, 3.2, 6.2);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(stage.clientWidth, stage.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.prepend(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 15;
scene.add(new THREE.HemisphereLight(0xd6e9ff, 0x33405b, 2));
const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(4, 7, 5);
scene.add(keyLight);
const colors = [0x7bdbe5,0x9a8bff,0xffb77e,0x8bdda7,0xed91ca,0xc1d0f0];
const materials = colors.map(color => new THREE.MeshStandardMaterial({color, metalness:.18, roughness:.35}));
const cube = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), materials);
scene.add(cube);
const edges = new THREE.LineSegments(new THREE.EdgesGeometry(cube.geometry), new THREE.LineBasicMaterial({color:0x111f3a}));
cube.add(edges);
let playing = true;
let speedX = .6, speedY = .9;
const clock = new THREE.Clock();
const stats = document.querySelector('#stats');
for (const axis of ['X', 'Y']) {
  document.querySelector('#speed'+axis).addEventListener('input', e => {
    const value = Number(e.target.value);
    if (axis === 'X') speedX = value; else speedY = value;
    document.querySelector('#speed'+axis+'Value').textContent = value.toFixed(1);
  });
}
document.querySelector('#wireframe').addEventListener('change', e => {
  edges.visible = !e.target.checked;
  materials.forEach(m => {m.wireframe = e.target.checked;});
});
document.querySelector('#pause').addEventListener('click', e => {
  playing = !playing;
  e.target.textContent = playing ? 'Pause rotation' : 'Resume rotation';
});
document.querySelector('#reset').addEventListener('click', () => {
  cube.rotation.set(0, 0, 0);
  speedX = .6; speedY = .9;
  for (const [id,v] of [['speedX',speedX],['speedY',speedY]]) {
    document.getElementById(id).value = v;
    document.getElementById(id+'Value').textContent = v.toFixed(1);
  }
});
function resize() {
  camera.aspect = stage.clientWidth / stage.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(stage.clientWidth, stage.clientHeight);
}
window.addEventListener('resize', resize);
resize();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), .05);
  if (playing) { cube.rotation.x += speedX*dt; cube.rotation.y += speedY*dt; }
  controls.update();
  stats.textContent = `X: ${THREE.MathUtils.radToDeg(cube.rotation.x).toFixed(1)}°\nY: ${THREE.MathUtils.radToDeg(cube.rotation.y).toFixed(1)}°\nAnimation: ${playing?'running':'paused'}`.replaceAll('\\n', '\n');
  renderer.render(scene, camera);
}
animate();
