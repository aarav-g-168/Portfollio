// Original lightweight laptop model for the portfolio. No third-party model assets.
import { writeFile, mkdir } from 'node:fs/promises';
import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then((value) => { this.result = value; this.onloadend?.(); }); }
};
const scene = new Scene();
const silver = new MeshStandardMaterial({ color: '#939889', metalness: .75, roughness: .32 });
const black = new MeshStandardMaterial({ color: '#10140f', metalness: .15, roughness: .5 });
const keyMaterial = new MeshStandardMaterial({ color: '#232820', roughness: .65 });
const trackMaterial = new MeshStandardMaterial({ color: '#72796b', metalness: .65, roughness: .4 });
function box(name, dimensions, position, material, rounded = true) {
  const mesh = new Mesh(rounded ? new RoundedBoxGeometry(...dimensions, 2, .035) : new BoxGeometry(...dimensions), material);
  mesh.name = name; mesh.position.set(...position); scene.add(mesh); return mesh;
}
box('Unibody', [4,.14,2.5], [0,-.08,0], silver);
box('Keyboard well', [3.5,.018,1.05], [0,0,-.45], black);
box('Trackpad', [1.35,.015,.66], [0,.002,.63], trackMaterial);
box('Display shell', [3.94,2.31,.11], [0,1.12,-1.13], silver);
box('Display bezel', [3.78,2.17,.035], [0,1.12,-1.055], black);
box('Hinge', [3.2,.1,.13], [0,0,-1.1], black);
const keyGeometry = new RoundedBoxGeometry(.205,.035,.145,1,.012);
for (let row=0; row<5; row++) for(let col=0; col<14; col++) {
  const key = new Mesh(keyGeometry,keyMaterial); key.position.set(-1.55+col*.239,.03,-.84+row*.185); scene.add(key);
}
box('Space', [1.3,.035,.14], [0,.03,.11], keyMaterial);
const glb = await new GLTFExporter().parseAsync(scene,{binary:true});
await mkdir('public/preview',{recursive:true});
await writeFile('public/preview/laptop.glb',Buffer.from(glb));
console.log(`Created original laptop model: ${glb.byteLength} bytes`);
