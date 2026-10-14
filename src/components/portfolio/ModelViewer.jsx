// Portfolio-specific adaptation of React Bits ModelViewer (David Haz).
// https://reactbits.dev/components/model-viewer
// Retains its auto-framing, normalized GLTF stage and demand rendering approach.
// Replaces orbit gestures with a controlled, reversible camera path to the screen.
// License: vendor/REACT-BITS-LICENSE.md
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const screen = { x: 0, y: 1.12, z: -1.032, width: 3.57, height: 2.008 };

function Stage({ progress, onReady, onScreenRect, onInteractionRect, onArrive }) {
  const { scene } = useGLTF('/preview/laptop.glb');
  const loadedTexture = useTexture('/preview/macfolio.webp');
  const texture = useMemo(() => { const copy = loadedTexture.clone(); copy.colorSpace = THREE.SRGBColorSpace; return copy; }, [loadedTexture]);
  const object = useMemo(() => scene.clone(true), [scene]);
  const bounds = useMemo(() => {
    const box = new THREE.Box3().setFromObject(object);
    const extent = box.getSize(new THREE.Vector3());
    return { box, center: box.getCenter(new THREE.Vector3()), scale: 2 / Math.max(extent.x,extent.y,extent.z), radius: extent.length() / Math.max(extent.x,extent.y,extent.z) };
  }, [object]);
  const outerRef = useRef(null), fitRef = useRef(null), current = useRef(0), arrived = useRef(false);
  const { camera, size, invalidate } = useThree();
  useEffect(() => { onReady(); invalidate(); return () => texture.dispose(); }, [texture, onReady, invalidate]);
  useEffect(() => { invalidate(); }, [progress, invalidate]);
  useFrame((_, delta) => {
    current.current = THREE.MathUtils.damp(current.current, progress, 9, Math.min(delta,.05));
    const p = current.current;
    const turning = THREE.MathUtils.smoothstep(p,0,.45);
    const approach = THREE.MathUtils.smoothstep(p,.4,1);
    outerRef.current.rotation.set(.14*(1-turning),-.5*(1-turning),.035*(1-turning));
    const aspect = size.width/size.height;
    const halfView = Math.tan(THREE.MathUtils.degToRad(30)/2);
    const fitDistance = bounds.radius / (1.35*halfView*Math.min(1,aspect));
    const screenDistance = screen.width*bounds.scale/(2*halfView*aspect)*1.08;
    const targetY = (screen.y-bounds.center.y)*bounds.scale*approach;
    const targetZ = (screen.z-bounds.center.z)*bounds.scale*approach;
    camera.position.set(0,targetY,targetZ+THREE.MathUtils.lerp(fitDistance,screenDistance,approach));
    camera.lookAt(0,targetY,targetZ); camera.updateProjectionMatrix();
    outerRef.current.updateMatrixWorld(true);
    const points = [[-screen.width/2,screen.y+screen.height/2,screen.z],[screen.width/2,screen.y-screen.height/2,screen.z]].map((point) => fitRef.current.localToWorld(new THREE.Vector3(...point)).project(camera));
    onScreenRect({ left: (points[0].x+1)*size.width/2, top: (1-points[0].y)*size.height/2, width: (points[1].x-points[0].x)*size.width/2, height: (points[0].y-points[1].y)*size.height/2 });
    const corners = [];
    for (const x of [bounds.box.min.x,bounds.box.max.x]) for (const y of [bounds.box.min.y,bounds.box.max.y]) for (const z of [bounds.box.min.z,bounds.box.max.z]) corners.push(fitRef.current.localToWorld(new THREE.Vector3(x,y,z)).project(camera));
    onInteractionRect({ left:Math.min(...corners.map((p) => (p.x+1)*size.width/2)), right:Math.max(...corners.map((p) => (p.x+1)*size.width/2)), top:Math.min(...corners.map((p) => (1-p.y)*size.height/2)), bottom:Math.max(...corners.map((p) => (1-p.y)*size.height/2)) });
    if (progress >= 1 && p > .997 && !arrived.current) { arrived.current = true; onArrive(); }
    if (progress < 1) arrived.current = false;
    if (Math.abs(progress-p)>.0001) invalidate();
  });
  return <><group ref={outerRef}><group ref={fitRef} scale={bounds.scale} position={[-bounds.center.x*bounds.scale,-bounds.center.y*bounds.scale,-bounds.center.z*bounds.scale]}><primitive object={object} /><mesh position={[screen.x,screen.y,screen.z]}><planeGeometry args={[screen.width,screen.height]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh></group></group><ContactShadows position={[0,-.69,0]} opacity={.4} scale={6} blur={2.5} far={2} resolution={256} color="#000000" /></>;
}

export default function ModelViewer(props) {
  return <Canvas frameloop="demand" dpr={[1,1.5]} camera={{ fov:30,position:[0,0,6],near:.01,far:100 }} gl={{ antialias:true, alpha:true, toneMapping:THREE.NeutralToneMapping }}><ambientLight intensity={2} /><directionalLight position={[3,5,4]} intensity={4} /><directionalLight position={[-4,2,-3]} intensity={3} color="#d3dfbe" /><Suspense fallback={null}><Stage {...props} /></Suspense></Canvas>;
}
