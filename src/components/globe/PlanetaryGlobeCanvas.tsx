import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type {
  PlanetaryBodyDefinition,
  PlanetaryFeatureMarker,
  TileLoadResult,
} from '../../types/terra';

export interface PlanetaryGlobeHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetGlobalView: () => void;
  viewSouthPole: () => void;
  flyToLatLon: (lat: number, lon: number, distance?: number) => void;
}

interface PlanetaryGlobeCanvasProps {
  body: PlanetaryBodyDefinition;
  tileResult: TileLoadResult;
  markers: PlanetaryFeatureMarker[];
  selectedMarkerId: string | null;
  showGraticule: boolean;
  onHoverCoords: (coords: { lat: number; lon: number } | null) => void;
  onSelectMarker: (marker: PlanetaryFeatureMarker) => void;
  onSelectCoordinate?: (coords: { lat: number; lon: number }) => void;
}

const GLOBE_RADIUS = 1;
const DEFAULT_CAMERA_DISTANCE = 2.65;
const MIN_CAMERA_DISTANCE = 1.32;
const MAX_CAMERA_DISTANCE = 4.5;

function latLonToVector3(lat: number, lon: number, radius: number, out = new THREE.Vector3()): THREE.Vector3 {
  const phi = ((lon + 180) / 360) * Math.PI * 2;
  const theta = ((90 - lat) / 180) * Math.PI;
  out.set(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta)
  );
  return out;
}

function buildGraticuleGroup(radius: number): THREE.Group {
  const group = new THREE.Group();
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x4b5565,
    transparent: true,
    opacity: 0.45,
  });
  const equatorMaterial = new THREE.LineBasicMaterial({
    color: 0xd97724,
    transparent: true,
    opacity: 0.55,
  });

  // Parallels every 30 deg
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts: THREE.Vector3[] = [];
    for (let lon = -180; lon <= 180; lon += 4) {
      pts.push(latLonToVector3(lat, lon, radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(geo, lat === 0 ? equatorMaterial : lineMaterial));
  }

  // Meridians every 30 deg
  for (let lon = -180; lon < 180; lon += 30) {
    const pts: THREE.Vector3[] = [];
    for (let lat = -88; lat <= 88; lat += 4) {
      pts.push(latLonToVector3(lat, lon, radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(geo, lon === 0 ? equatorMaterial : lineMaterial));
  }

  return group;
}

function buildStarfield(): THREE.Points {
  const count = 420;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random spherical shell distribution
    const u = ((i * 73) % 1000) / 1000;
    const v = ((i * 197) % 1000) / 1000;
    const theta = u * 2 * Math.PI;
    const phi = Math.acos(2 * v - 1);
    const r = 18 + (i % 7) * 1.4;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xc8c4ba,
    size: 0.055,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

export const PlanetaryGlobeCanvas = forwardRef<
  PlanetaryGlobeHandle,
  PlanetaryGlobeCanvasProps
>(function PlanetaryGlobeCanvas(
  {
    body,
    tileResult,
    markers,
    selectedMarkerId,
    showGraticule,
    onHoverCoords,
    onSelectMarker,
    onSelectCoordinate,
  },
  ref
) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const onHoverCoordsRef = useRef(onHoverCoords);
  const onSelectMarkerRef = useRef(onSelectMarker);
  const onSelectCoordinateRef = useRef(onSelectCoordinate);
  onHoverCoordsRef.current = onHoverCoords;
  onSelectMarkerRef.current = onSelectMarker;
  onSelectCoordinateRef.current = onSelectCoordinate;

  // Imperative scene refs
  const sceneHandlesRef = useRef<{
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    globeMaterial: THREE.MeshStandardMaterial;
    atmosphereMaterial: THREE.MeshBasicMaterial;
    graticuleGroup: THREE.Group;
    markerGroup: THREE.Group;
    clickableMarkers: THREE.Object3D[];
    activeTexture: THREE.Texture | null;
    targetCamPos: THREE.Vector3 | null;
    requestRender: () => void;
  } | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => {
        const h = sceneHandlesRef.current;
        if (!h) return;
        const dir = h.camera.position.clone().normalize();
        const nextDist = Math.max(
          MIN_CAMERA_DISTANCE,
          h.camera.position.length() * 0.78
        );
        h.targetCamPos = dir.multiplyScalar(nextDist);
        h.requestRender();
      },
      zoomOut: () => {
        const h = sceneHandlesRef.current;
        if (!h) return;
        const dir = h.camera.position.clone().normalize();
        const nextDist = Math.min(
          MAX_CAMERA_DISTANCE,
          h.camera.position.length() * 1.26
        );
        h.targetCamPos = dir.multiplyScalar(nextDist);
        h.requestRender();
      },
      resetGlobalView: () => {
        const h = sceneHandlesRef.current;
        if (!h) return;
        h.targetCamPos = latLonToVector3(18, -15, DEFAULT_CAMERA_DISTANCE);
        h.requestRender();
      },
      viewSouthPole: () => {
        const h = sceneHandlesRef.current;
        if (!h) return;
        h.targetCamPos = latLonToVector3(-88, 0, 1.95);
        h.requestRender();
      },
      flyToLatLon: (lat: number, lon: number, distance = 1.92) => {
        const h = sceneHandlesRef.current;
        if (!h) return;
        h.targetCamPos = latLonToVector3(
          lat,
          lon,
          THREE.MathUtils.clamp(distance, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE)
        );
        h.requestRender();
      },
    }),
    []
  );

  // Initialize Three.js WebGL scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (!probe) return true;
      const ext = probe.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
      const gpu = String(probe.getParameter(param));
      probe.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 360);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x07090c, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090c);

    // Subtle studio environment reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    latLonToVector3(18, -15, DEFAULT_CAMERA_DISTANCE, camera.position);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.58;
    controls.zoomSpeed = 0.8;
    controls.minDistance = MIN_CAMERA_DISTANCE;
    controls.maxDistance = MAX_CAMERA_DISTANCE;

    // Warm key sun light + cool space hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xd9e3f0, 0x1a1c20, 0.95);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff6ea, 1.35);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x8aa0ba, 0.45);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const starfield = buildStarfield();
    scene.add(starfield);

    // Planetary sphere
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 48);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x161b23,
      roughness: 0.92,
      metalness: 0.04,
      envMapIntensity: 0.18,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMaterial);
    scene.add(globeMesh);

    // Subtle atmospheric/limb rim shell
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.016, 48, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x6c8ea4,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // Graticule grid
    const graticuleGroup = buildGraticuleGroup(GLOBE_RADIUS * 1.003);
    scene.add(graticuleGroup);

    // Marker group
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);

    // Render-on-demand loop with software-GL pacing
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTickTime = performance.now();
    const _pointer = new THREE.Vector2();
    const _raycaster = new THREE.Raycaster();
    const _quat = new THREE.Quaternion();
    const _targetDir = new THREE.Vector3();
    const _curDir = new THREE.Vector3();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        renderDirty = false;
        const delta = Math.min((now - lastTickTime) / 1000, 0.1);
        lastTickTime = now;

        const handles = sceneHandlesRef.current;
        let needsAnotherFrame = false;

        if (handles?.targetCamPos) {
          const curDist = camera.position.length();
          const tgtDist = handles.targetCamPos.length();
          _curDir.copy(camera.position).normalize();
          _targetDir.copy(handles.targetCamPos).normalize();

          const alpha = isSoftwareGl ? 0.38 : 1 - Math.exp(-7 * delta);
          _quat.setFromUnitVectors(_curDir, _targetDir);
          const stepQuat = new THREE.Quaternion().slerp(_quat, alpha);
          _curDir.applyQuaternion(stepQuat).normalize();

          const nextDist = THREE.MathUtils.lerp(curDist, tgtDist, alpha);
          camera.position.copy(_curDir.multiplyScalar(nextDist));

          if (
            _curDir.distanceTo(_targetDir) < 0.004 &&
            Math.abs(nextDist - tgtDist) < 0.008
          ) {
            camera.position.copy(handles.targetCamPos);
            handles.targetCamPos = null;
          } else {
            needsAnotherFrame = true;
          }
        }

        const didDamp = controls.update();
        if (didDamp && controls.enableDamping) {
          needsAnotherFrame = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsAnotherFrame) {
            requestRender();
          }
        };

        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    controls.addEventListener('change', requestRender);
    controls.addEventListener('start', () => {
      if (sceneHandlesRef.current) {
        sceneHandlesRef.current.targetCamPos = null;
      }
    });

    // Pointer hover coordinate readout & marker picking
    let lastHoverTime = 0;
    let pointerDownPos = { x: 0, y: 0 };

    const updatePointer = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (ev: PointerEvent) => {
      pointerDownPos = { x: ev.clientX, y: ev.clientY };
    };

    const handlePointerMove = (ev: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTime < 45) return;
      lastHoverTime = now;

      updatePointer(ev);
      _raycaster.setFromCamera(_pointer, camera);

      const handles = sceneHandlesRef.current;
      if (handles) {
        const markerHits = _raycaster.intersectObjects(handles.clickableMarkers, false);
        renderer.domElement.style.cursor = markerHits.length > 0 ? 'pointer' : 'grab';
      }

      const globeHits = _raycaster.intersectObject(globeMesh, false);
      if (globeHits.length > 0 && globeHits[0].uv) {
        const uv = globeHits[0].uv;
        const lon = uv.x * 360 - 180;
        const lat = uv.y * 180 - 90;
        onHoverCoordsRef.current({ lat, lon });
      } else {
        onHoverCoordsRef.current(null);
      }
    };

    const handlePointerUp = (ev: PointerEvent) => {
      const dx = ev.clientX - pointerDownPos.x;
      const dy = ev.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return; // Dragged rather than clicked

      updatePointer(ev);
      _raycaster.setFromCamera(_pointer, camera);

      const handles = sceneHandlesRef.current;
      if (!handles) return;

      const markerHits = _raycaster.intersectObjects(handles.clickableMarkers, false);
      if (markerHits.length > 0) {
        const markerData = markerHits[0].object.userData.marker as
          | PlanetaryFeatureMarker
          | undefined;
        if (markerData) {
          onSelectMarkerRef.current(markerData);
          handles.targetCamPos = latLonToVector3(markerData.lat, markerData.lon, 1.92);
          requestRender();
          return;
        }
      }

      const globeHits = _raycaster.intersectObject(globeMesh, false);
      if (globeHits.length > 0 && globeHits[0].uv && onSelectCoordinateRef.current) {
        const uv = globeHits[0].uv;
        const lon = uv.x * 360 - 180;
        const lat = uv.y * 180 - 90;
        onSelectCoordinateRef.current({ lat, lon });
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointerleave', () => {
      onHoverCoordsRef.current(null);
    });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 280);
        const h = Math.max(entry.contentRect.height, 300);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        requestRender();
      }
    });
    resizeObserver.observe(container);

    sceneHandlesRef.current = {
      camera,
      controls,
      globeMaterial,
      atmosphereMaterial,
      graticuleGroup,
      markerGroup,
      clickableMarkers: [],
      activeTexture: null,
      targetCamPos: null,
      requestRender,
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    requestRender();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);

      if (sceneHandlesRef.current?.activeTexture) {
        sceneHandlesRef.current.activeTexture.dispose();
      }
      globeGeo.dispose();
      globeMaterial.dispose();
      atmosphereGeo.dispose();
      atmosphereMaterial.dispose();
      starfield.geometry.dispose();
      (starfield.material as THREE.Material).dispose();
      envTex.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneHandlesRef.current = null;
    };
  }, []);

  // Update body tint, graticule visibility, and NASA WMTS texture
  useEffect(() => {
    const handles = sceneHandlesRef.current;
    if (!handles) return;

    handles.atmosphereMaterial.color.set(body.atmosphereRimHex);
    handles.graticuleGroup.visible = showGraticule;

    if (handles.activeTexture) {
      handles.activeTexture.dispose();
      handles.activeTexture = null;
    }

    if (tileResult.status === 'ready' && tileResult.canvas) {
      const tex = new THREE.CanvasTexture(tileResult.canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      handles.activeTexture = tex;
      handles.globeMaterial.map = tex;
      handles.globeMaterial.color.set(0xffffff);
      handles.globeMaterial.wireframe = false;
    } else {
      // Never fabricate planetary textures when unavailable — render clean coordinate wireframe sphere
      handles.globeMaterial.map = null;
      handles.globeMaterial.color.set(0x161b23);
      handles.globeMaterial.wireframe = false;
    }
    handles.globeMaterial.needsUpdate = true;
    handles.requestRender();
  }, [body, tileResult, showGraticule]);

  // Rebuild 3D marker beacons when body markers or selection change
  useEffect(() => {
    const handles = sceneHandlesRef.current;
    if (!handles) return;

    // Dispose old marker meshes
    while (handles.markerGroup.children.length > 0) {
      const child = handles.markerGroup.children.pop()!;
      child.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material.dispose();
          }
        }
      });
    }
    handles.clickableMarkers = [];

    const up = new THREE.Vector3(0, 1, 0);

    for (const marker of markers) {
      const isSelected = marker.id === selectedMarkerId;
      const group = new THREE.Group();

      const pos = latLonToVector3(marker.lat, marker.lon, GLOBE_RADIUS * 1.005);
      const normal = pos.clone().normalize();
      group.position.copy(pos);
      group.quaternion.setFromUnitVectors(up, normal);

      const baseColor = isSelected
        ? 0xf2efe9
        : marker.featureType === 'Terrain Candidate'
          ? 0x5ec8e5
          : marker.featureType === 'Materials-Only Reference'
            ? 0x5b8269
            : 0xd97724;

      // Surface ring
      const ringGeo = new THREE.RingGeometry(
        isSelected ? 0.022 : 0.015,
        isSelected ? 0.032 : 0.022,
        24
      );
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(ringGeo, ringMat));

      // Beacon node + invisible generous hit proxy
      const pinGeo = new THREE.SphereGeometry(isSelected ? 0.017 : 0.012, 16, 12);
      const pinMat = new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: baseColor,
        emissiveIntensity: isSelected ? 0.65 : 0.35,
        roughness: 0.35,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.y = 0.014;
      group.add(pinMesh);

      const hitGeo = new THREE.SphereGeometry(0.042, 10, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitProxy = new THREE.Mesh(hitGeo, hitMat);
      hitProxy.position.y = 0.012;
      hitProxy.userData.marker = marker;
      group.add(hitProxy);
      handles.clickableMarkers.push(hitProxy);

      handles.markerGroup.add(group);
    }

    handles.requestRender();
  }, [markers, selectedMarkerId]);

  return (
    <div
      ref={mountRef}
      className="h-full w-full min-h-[460px] select-none"
      aria-label={`Interactive 3D globe for ${body.name}`}
    />
  );
});
