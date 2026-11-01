import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const stage=document.querySelector('#stage');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(44,1,.1,100);
camera.position.set(3,3.5,11);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
stage.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
controls.target.set(0,1.3,0);
scene.add(new THREE.HemisphereLight(0xd6e5ff,0x29374c,2.4));
const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-3,8,8);scene.add(light);
const hand=new THREE.Group();hand.rotation.z=-.08;scene.add(hand);
const metal=new THREE.MeshStandardMaterial({color:0xa1cde6,metalness:.68,roughness:.27});
const shell=new THREE.MeshStandardMaterial({color:0x536e91,metalness:.44,roughness:.38});
const jointsMaterial=new THREE.MeshStandardMaterial({color:0x83f0df,metalness:.55,roughness:.25});
const accent=new THREE.MeshStandardMaterial({color:0xffae8d,metalness:.48,roughness:.3});
function box(parent,size,pos,material,bevel=false){
 const o=new THREE.Mesh(new THREE.BoxGeometry(...size),material);o.position.set(...pos);parent.add(o);return o;
}
function sphere(parent,r,pos,material){const o=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),material);o.position.set(...pos);parent.add(o);return o;}
box(hand,[2.3,2.6,.62],[0,0,0],shell);
box(hand,[2.1,2.4,.7],[0,.04,.08],metal);
box(hand,[.88,.85,.6],[0,-1.7,-.08],shell);
sphere(hand,.46,[0,-1.15,0],jointsMaterial);
for(let i=0;i<4;i++)box(hand,[.24,.27,.08],[-.78+i*.52,.54,.42],accent);
// All finger segments are constructed along +Y from an explicit pivot joint.
function finger(x,lengths){
 const root=new THREE.Group();root.position.set(x,1.3,.03);hand.add(root);
 const joints=[];let parent=root;
 lengths.forEach((length,i)=>{
   const hinge=new THREE.Group();if(i>0)hinge.position.y=lengths[i-1];parent.add(hinge);
   joints.push(hinge);
   sphere(hinge,.16,[0,0,0],jointsMaterial);
   const segment=box(hinge,[.34,length,.36],[0,length/2,0],i===0?metal:shell);
   segment.castShadow=true;
   parent=hinge;
 });
 sphere(parent,.15,[0,lengths[lengths.length-1],0],jointsMaterial);
 return {root,joints};
}
const fingers=[
 finger(-.81,[.92,.61,.49]),
 finger(-.28,[1.14,.76,.57]),
 finger(.28,[1.08,.70,.53]),
 finger(.81,[.86,.57,.45])
];
const thumbBase=new THREE.Group();thumbBase.position.set(-1.14,-.65,.22);thumbBase.rotation.z=1.15;hand.add(thumbBase);
const thumbRoot=new THREE.Group();thumbBase.add(thumbRoot);
const thumbJoints=[];let thumbParent=thumbRoot;
const thumbLengths=[.86,.64];
thumbLengths.forEach((len,i)=>{
 const hinge=new THREE.Group();if(i)hinge.position.y=thumbLengths[i-1];thumbParent.add(hinge);thumbJoints.push(hinge);
 sphere(hinge,.18,[0,0,0],jointsMaterial);
 box(hinge,[.43,len,.44],[0,len/2,0],metal);
 thumbParent=hinge;
});
sphere(thumbParent,.2,[0,thumbLengths[1],0],jointsMaterial);
const curl=document.getElementById('curl'),thumb=document.getElementById('thumb'),spread=document.getElementById('spread'),wave=document.getElementById('wave');
let time=0;
function pose(){
 let bend=Number(curl.value)/100;
 let tb=Number(thumb.value)/100;
 if(wave.checked){bend=.4+.35*Math.sin(time*2.2);tb=.45+.3*Math.sin(time*2.2+1.2);}
 const fan=THREE.MathUtils.degToRad(Number(spread.value));
 fingers.forEach((f,i)=>{
    f.root.rotation.z=(i-1.5)*-fan/1.65;
    f.joints.forEach((j,k)=>j.rotation.x=(k===0?.65:1.18)*bend);
 });
 thumbJoints[0].rotation.x=tb*.85;
 thumbJoints[1].rotation.x=tb*1.2;
 thumbBase.rotation.z=1.15-tb*.24;
 document.getElementById('curlValue').textContent=Math.round(bend*100)+'%';
 document.getElementById('thumbValue').textContent=Math.round(tb*100)+'%';
 document.getElementById('spreadValue').textContent=spread.value+'°';
}
for(const inp of [curl,thumb,spread,wave])inp.addEventListener('input',pose);
document.getElementById('open').addEventListener('click',()=>{wave.checked=false;curl.value=0;thumb.value=0;spread.value=16;pose()});
document.getElementById('fist').addEventListener('click',()=>{wave.checked=false;curl.value=100;thumb.value=100;spread.value=0;pose()});
function resize(){camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight)}window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);time+=Math.min(clock.getDelta(),.05);if(wave.checked)pose();controls.update();renderer.render(scene,camera)}
pose();animate();
