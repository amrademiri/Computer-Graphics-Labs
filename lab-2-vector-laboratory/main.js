import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const stage = document.querySelector('#stage');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50,1,.1,200);
camera.position.set(9,9,13);
const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
stage.prepend(renderer.domElement);
const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;
controls.target.set(0,1,0);
scene.add(new THREE.HemisphereLight(0xffffff,0x1d315a,2));
scene.add(new THREE.AxesHelper(6));
const grid = new THREE.GridHelper(18,18,0x52658f,0x273653);
scene.add(grid);
const read = id => new THREE.Vector3(...['x','y','z'].map(axis => {
  const n = Number(document.querySelector(`#${id} [data-axis="${axis}"]`).value);
  return Number.isFinite(n)?n:0;
}));
const fmt = (v) => `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;
const origin = new THREE.Vector3(0,0,0);
function arrow(color) {
  const a = new THREE.ArrowHelper(new THREE.Vector3(0,1,0),origin,1,color,.3,.2);
  scene.add(a); return a;
}
const arrowA=arrow(0x70e2f4),arrowB=arrow(0xb499ff),arrowSum=arrow(0x80e3a0),arrowCross=arrow(0xffb36c);
function setArrow(a, v, base=origin) {
  a.position.copy(base);
  const length = v.length();
  a.visible = length > 1e-7;
  if (a.visible) {
    a.setDirection(v.clone().normalize());
    a.setLength(length,Math.min(.45,length*.25),Math.min(.24,length*.14));
  }
}
const planeGeometry = new THREE.PlaneGeometry(13,13);
const plane = new THREE.Mesh(planeGeometry,new THREE.MeshBasicMaterial({color:0x1e9ba9,side:THREE.DoubleSide,transparent:true,opacity:.16,depthWrite:false}));
plane.rotation.x=-Math.PI/2;
scene.add(plane);
const planeOutline = new THREE.LineSegments(new THREE.EdgesGeometry(planeGeometry),new THREE.LineBasicMaterial({color:0x327d91}));
plane.add(planeOutline);
const rayLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([origin,origin.clone().add(new THREE.Vector3(0,-1,0))]),new THREE.LineBasicMaterial({color:0xffdc75}));
scene.add(rayLine);
const rayOriginMarker = new THREE.Mesh(new THREE.SphereGeometry(.12,14,10),new THREE.MeshBasicMaterial({color:0xffdc75}));
scene.add(rayOriginMarker);
const hitMarker = new THREE.Mesh(new THREE.SphereGeometry(.19,16,12),new THREE.MeshBasicMaterial({color:0xff72bd}));
scene.add(hitMarker);
function update(){
  const a=read('vecA'), b=read('vecB'),sum=a.clone().add(b), diff=a.clone().sub(b),cross=a.clone().cross(b);
  setArrow(arrowA,a);setArrow(arrowB,b);setArrow(arrowSum,sum);setArrow(arrowCross,cross);
  arrowSum.visible=arrowSum.visible&&document.querySelector('#showSum').checked;
  arrowCross.visible=arrowCross.visible&&document.querySelector('#showCross').checked;
  const angle=a.length()>1e-8&&b.length()>1e-8?THREE.MathUtils.radToDeg(a.angleTo(b)).toFixed(2)+'°':'undefined (zero vector)';
  const proj=b.lengthSq()>1e-10?b.clone().multiplyScalar(a.dot(b)/b.lengthSq()):null;
  document.querySelector('#vectorsOutput').textContent =
    `A + B   = ${fmt(sum)}\nA - B   = ${fmt(diff)}\nA · B   = ${a.dot(b).toFixed(2)}\nA × B   = ${fmt(cross)}\n|A|     = ${a.length().toFixed(2)}\n|B|     = ${b.length().toFixed(2)}\nunit(A) = ${a.length()>1e-8?fmt(a.clone().normalize()):'undefined'}\nangle   = ${angle}\nprojᵦ A = ${proj?fmt(proj):'undefined'}`.replaceAll('\\n','\n');
  const h=Number(document.querySelector('#planeHeight').value);
  document.querySelector('#planeValue').textContent=h.toFixed(2);
  plane.position.y=h;
  const ro=read('rayOrigin'),rd=read('rayDirection');
  rayOriginMarker.position.copy(ro);
  let message;
  const valid=rd.lengthSq()>1e-12;
  if(!valid){message='Ray direction is zero: no ray.';hitMarker.visible=false;}
  else if(Math.abs(rd.y)<1e-9){message= Math.abs(ro.y-h)<1e-9 ? 'Ray lies in the plane (infinitely many intersections).' : 'Ray parallel to plane: no intersection.';hitMarker.visible=false;}
  else {
    const t=(h-ro.y)/rd.y;
    if(t>=0){
      const hit=ro.clone().addScaledVector(rd,t);
      hitMarker.position.copy(hit);hitMarker.visible=true;
      message=`HIT: t = ${t.toFixed(3)}\nP = O + tD = ${fmt(hit)}`.replaceAll('\\n','\n');
    }else{message=`No forward hit: t = ${t.toFixed(3)} (behind origin).`;hitMarker.visible=false;}
  }
  const rayEnd=valid?ro.clone().addScaledVector(rd.clone().normalize(),12):ro.clone();
  rayLine.geometry.dispose();
  rayLine.geometry=new THREE.BufferGeometry().setFromPoints([ro,rayEnd]);
  document.querySelector('#intersectionOutput').textContent=`Plane: y = ${h.toFixed(2)}\nOrigin: ${fmt(ro)}\nDirection: ${fmt(rd)}\n${message}`.replaceAll('\\n','\n');
}
document.querySelectorAll('input').forEach(el=>el.addEventListener('input',update));
document.querySelector('#reset').addEventListener('click',()=>{
  const defaults={vecA:[3,2,1],vecB:[-1,3,2],rayOrigin:[-3,4,-2],rayDirection:[1,-2,1]};
  for(const [id,values] of Object.entries(defaults))document.querySelectorAll(`#${id} input`).forEach((el,i)=>el.value=values[i]);
  document.querySelector('#planeHeight').value=0;
  document.querySelector('#showCross').checked=true;
  document.querySelector('#showSum').checked=true;
  update();
});
function resize(){camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight)}
window.addEventListener('resize',resize);resize();update();
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}
animate();
