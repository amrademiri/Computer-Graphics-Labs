import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const stage=document.querySelector('#stage');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(47,1,.1,100);
camera.position.set(5,3.7,7.5);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
stage.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xc7deff,0x465472,2.4));
const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(4,6,7);scene.add(light);
const fill=new THREE.DirectionalLight(0x83c5ff,1.5);fill.position.set(-5,2,-4);scene.add(fill);
const objectGroup=new THREE.Group();scene.add(objectGroup);
const floor=new THREE.Mesh(new THREE.CircleGeometry(2.4,50),new THREE.MeshBasicMaterial({color:0x2a395b,transparent:true,opacity:.34}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.03;scene.add(floor);
let mesh=null,edges=null,vertexPoints=null;
function buildProfile(shape){
 // [height, radius]: the vase rim is open while the crystal has pointed ends.
 return shape==='vase'?
  [[-1.8,.48],[-1.62,.66],[-1.25,.85],[-.7,1.12],[.05,1.2],[.65,1.04],[1.12,.73],[1.63,.76],[1.9,.82]]:
  [[-1.95,0],[-1.5,.8],[-.75,1.16],[.55,.95],[1.45,.58],[2,0]];
}
function makeGeometry(profile,sides,openTop){
 const vertices=[],indices=[],colors=[];
 for(let j=0;j<profile.length;j++){
  const [y,r]=profile[j];
  for(let i=0;i<sides;i++){
   const theta=(2*Math.PI*i/sides);
   const x=r*Math.cos(theta),z=r*Math.sin(theta);
   vertices.push(x,y,z);
   const t=j/(profile.length-1),stripe=i/sides;
   const col=new THREE.Color().setHSL(openTop?.06+.025*Math.sin(t*Math.PI):.53+.09*Math.sin(stripe*18),openTop?.44:.73,openTop?.64-.1*t:.56+.10*Math.cos(t*Math.PI));
   colors.push(col.r,col.g,col.b);
  }
 }
 for(let j=0;j<profile.length-1;j++)for(let i=0;i<sides;i++){
  const next=(i+1)%sides,a=j*sides+i,b=j*sides+next,c=(j+1)*sides+i,d=(j+1)*sides+next;
  indices.push(a,c,b,b,c,d);
 }
 // Seal the vase's bottom by adding a center vertex and triangular fan.
 if(openTop){
  const bottom=vertices.length/3;
  vertices.push(0,profile[0][0],0);colors.push(.6,.35,.25);
  for(let i=0;i<sides;i++)indices.push(bottom,i,(i+1)%sides);
 }
 const g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 g.setIndex(indices);
 g.computeVertexNormals();
 return g;
}
function rebuild(){
 if(mesh){objectGroup.remove(mesh,edges,vertexPoints);mesh.geometry.dispose();mesh.material.dispose();edges.geometry.dispose();edges.material.dispose();vertexPoints.geometry.dispose();vertexPoints.material.dispose();}
 const shape=document.getElementById('shape').value,sides=Number(document.getElementById('sides').value);
 const g=makeGeometry(buildProfile(shape),sides,shape==='vase');
 mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,metalness:shape==='crystal'?.6:.12,roughness:shape==='crystal'?.2:.34,flatShading:shape==='crystal'}));
 objectGroup.add(mesh);
 edges=new THREE.LineSegments(new THREE.EdgesGeometry(g,5),new THREE.LineBasicMaterial({color:0x13223a,transparent:true,opacity:.6}));
 objectGroup.add(edges);
 vertexPoints=new THREE.Points(g,new THREE.PointsMaterial({color:0xffd4a3,size:.085,sizeAttenuation:true,depthTest:false}));
 objectGroup.add(vertexPoints);
 edges.visible=document.getElementById('wireframe').checked;
 vertexPoints.visible=document.getElementById('vertices').checked;
 document.getElementById('sidesValue').textContent=sides;
 document.getElementById('stats').textContent=`Shape: ${shape}\nVertex count: ${g.getAttribute('position').count}\nTriangle count: ${g.getIndex().count/3}\nIndices: ${g.getIndex().count}\nNormals: computed\nFaces: indexed triangles`.replaceAll('\\n','\n');
}
for(const id of ['shape','sides','wireframe','vertices'])document.getElementById(id).addEventListener('input',rebuild);
const rotate=document.getElementById('rotate');rotate.addEventListener('input',()=>document.getElementById('rotateValue').textContent=Number(rotate.value).toFixed(1));
document.getElementById('reset').addEventListener('click',()=>{
 document.getElementById('shape').value='crystal';document.getElementById('sides').value=8;
 document.getElementById('wireframe').checked=false;document.getElementById('vertices').checked=false;
 rotate.value=.4;document.getElementById('rotateValue').textContent='0.4';objectGroup.rotation.set(0,0,0);rebuild();
});
function resize(){camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight)}window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);objectGroup.rotation.y+=Math.min(clock.getDelta(),.05)*Number(rotate.value);controls.update();renderer.render(scene,camera)}
rebuild();animate();
