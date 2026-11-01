import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const stage=document.querySelector('#stage');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(49,1,.1,1200);
camera.position.set(0,15,23);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
stage.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.maxDistance=60;controls.minDistance=6;
scene.add(new THREE.AmbientLight(0x6a7aaf,.85));
const sunLight=new THREE.PointLight(0xffe3b4,85,110);
scene.add(sunLight);
const sunRoot=new THREE.Group();scene.add(sunRoot);
const sun=new THREE.Mesh(new THREE.SphereGeometry(1.8,48,32),new THREE.MeshBasicMaterial({color:0xffd466}));
sunRoot.add(sun);
const sunHalo=new THREE.Mesh(new THREE.SphereGeometry(2.18,36,24),new THREE.MeshBasicMaterial({color:0xffa62c,transparent:true,opacity:.095,side:THREE.BackSide}));
sunRoot.add(sunHalo);
function body(radius,color,parent){const o=new THREE.Mesh(new THREE.SphereGeometry(radius,32,20),new THREE.MeshStandardMaterial({color,roughness:.82,metalness:.04}));parent.add(o);return o;}
const earthPivot=new THREE.Group();sunRoot.add(earthPivot);
const earthNode=new THREE.Group();earthNode.position.x=6.2;earthPivot.add(earthNode);
const earth=body(.72,0x3f87df,earthNode);
const continent=new THREE.Mesh(new THREE.SphereGeometry(.727,24,18),new THREE.MeshStandardMaterial({color:0x72d59d,roughness:.9,transparent:true,opacity:.18}));earth.add(continent);
const moonPivot=new THREE.Group();earthNode.add(moonPivot);
const moonNode=new THREE.Group();moonNode.position.x=1.45;moonPivot.add(moonNode);
const moon=body(.2,0xc6c9d7,moonNode);
const marsPivot=new THREE.Group();sunRoot.add(marsPivot);
const marsNode=new THREE.Group();marsNode.position.x=10.3;marsPivot.add(marsNode);
const mars=body(.55,0xd97a55,marsNode);
const phobosPivot=new THREE.Group();marsNode.add(phobosPivot);
const phobosNode=new THREE.Group();phobosNode.position.x=1.2;phobosPivot.add(phobosNode);
const phobos=body(.15,0xaaa09b,phobosNode);
function ring(radius,color,segments=140){
 const points=Array.from({length:segments+1},(_,i)=>{const t=i/segments*Math.PI*2;return new THREE.Vector3(Math.cos(t)*radius,0,Math.sin(t)*radius)});
 const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity:.48}));return line;
}
const orbitRings=[ring(6.2,0x5f8bce),ring(10.3,0xb07a61)];
orbitRings.forEach(o=>scene.add(o));
const moonRing=ring(1.45,0x7383b2);earthNode.add(moonRing);orbitRings.push(moonRing);
const phobosRing=ring(1.2,0x8a6c65);marsNode.add(phobosRing);orbitRings.push(phobosRing);
function textSprite(text){
 const c=document.createElement('canvas');c.width=256;c.height=76;
 const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);ctx.font='bold 35px sans-serif';ctx.textAlign='center';ctx.fillStyle='#e8f2ff';ctx.fillText(text,128,47);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(2.5,.75,1);return s;
}
const labels=[];
for (const [node,name,y] of [[sun,'SUN',2.7],[earthNode,'EARTH',1.45],[moonNode,'MOON',.6],[marsNode,'MARS',1.1],[phobosNode,'PHOBOS',.52]]) {
 const label=textSprite(name);label.position.y=y;node.add(label);labels.push(label);
}
let seed=719;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const starPos=[];
for(let i=0;i<850;i++){let x=(rand()-.5)*270,y=(rand()-.5)*160,z=(rand()-.5)*270;if(x*x+y*y+z*z<900)z-=65;starPos.push(x,y,z);}
const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));
scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xbfd0ff,size:.19,sizeAttenuation:true,transparent:true,opacity:.85})));
const speed=document.querySelector('#speed');let elapsed=0,playing=true;
speed.addEventListener('input',()=>document.querySelector('#speedValue').textContent=Number(speed.value).toFixed(1)+'×');
document.querySelector('#orbits').addEventListener('change',e=>orbitRings.forEach(o=>o.visible=e.target.checked));
document.querySelector('#labels').addEventListener('change',e=>labels.forEach(l=>l.visible=e.target.checked));
document.querySelector('#pause').addEventListener('click',e=>{playing=!playing;e.target.textContent=playing?'Pause simulation':'Resume simulation';});
document.querySelector('#reset').addEventListener('click',()=>elapsed=0);
const clock=new THREE.Clock();
function resize(){camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight)}
window.addEventListener('resize',resize);resize();
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.06);
 if(playing)elapsed+=dt*Number(speed.value);
 earthPivot.rotation.y=elapsed*.35;
 moonPivot.rotation.y=elapsed*1.7;
 marsPivot.rotation.y=.7+elapsed*.19;
 phobosPivot.rotation.y=elapsed*2.4;
 earth.rotation.y=elapsed*1.8;moon.rotation.y=elapsed*.18;mars.rotation.y=elapsed*1.5;phobos.rotation.y=elapsed*.4;
 sun.rotation.y=elapsed*.05;sunHalo.scale.setScalar(1+Math.sin(elapsed*3)*.012);
 document.querySelector('#status').textContent=`Time: ${elapsed.toFixed(1)} units\nEarth orbit angle: ${THREE.MathUtils.radToDeg(earthPivot.rotation.y% (Math.PI*2)).toFixed(0)}°\nMars orbit angle: ${THREE.MathUtils.radToDeg(marsPivot.rotation.y% (Math.PI*2)).toFixed(0)}°\n${playing?'Animated':'Paused'}`.replaceAll('\\n','\n');
 controls.update();renderer.render(scene,camera);
}
animate();
