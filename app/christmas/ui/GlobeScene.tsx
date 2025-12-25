"use client";

import * as THREE from "three";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type Place = {
  id: "me" | "her";
  label: string;
  lat: number;
  lon: number;
  utcIso: string;
};

export default function GlobeScene({
  textureUrl,
  places,
  onPlaceSelected,
}: {
  textureUrl: string;
  places: Place[];
  onPlaceSelected: (p: Place) => void;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 3.1], fov: 45 }} gl={{ antialias: true }}>
      <ambientLight intensity={1.05} />
      <directionalLight position={[5, 3, 5]} intensity={1.15} />
      <Scene
        textureUrl={textureUrl}
        places={places}
        onPlaceSelected={onPlaceSelected}
      />
    </Canvas>
  );
}

function Scene({
  textureUrl,
  places,
  onPlaceSelected,
}: {
  textureUrl: string;
  places: Place[];
  onPlaceSelected: (p: Place) => void;
}) {
  const { camera } = useThree();

  // Group that rotates: Earth + pins (so pins rotate with Earth)
  const earthGroupRef = useRef<THREE.Group>(null);

  // Orbit controls (disabled during flight)
  const controlsRef = useRef<any>(null);
  const isFlyingRef = useRef(false);

  const [hovered, setHovered] = useState<Place["id"] | null>(null);

  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  const markers = useMemo(() => {
    return places.map((p) => ({
      place: p,
      pos: latLonToVector3(p.lat, p.lon, 1.01), // surface point (slightly above radius 1)
      normal: latLonToVector3(p.lat, p.lon, 1.0).normalize(), // outward direction
    }));
  }, [places]);

  // Camera flight state
  const flightRef = useRef<{
    active: boolean;
    t: number;
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    fromLook: THREE.Vector3;
    toLook: THREE.Vector3;
    duration: number;
  } | null>(null);

  useFrame((_, delta) => {
    // Rotate whole group so pins rotate with the Earth
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.06;
    }

    // Camera flight interpolation
    const flight = flightRef.current;
    if (flight?.active) {
      flight.t = Math.min(1, flight.t + delta / flight.duration);
      const k = flight.t * flight.t * (3 - 2 * flight.t); // smoothstep

      camera.position.lerpVectors(flight.fromPos, flight.toPos, k);

      const look = new THREE.Vector3().lerpVectors(flight.fromLook, flight.toLook, k);
      camera.lookAt(look);

      if (flight.t >= 1) {
        flight.active = false;
        isFlyingRef.current = false;
        if (controlsRef.current) controlsRef.current.enabled = true;
      }
    }
  });

  function flyTo(place: Place) {
    const marker = markers.find((m) => m.place.id === place.id);
    const group = earthGroupRef.current;
    if (!marker || !group) return;

    // Marker in WORLD coordinates (because group is rotating)
    const worldTarget = marker.pos.clone().applyMatrix4(group.matrixWorld);

    // World-space normal (outward), considering group rotation
    const q = group.getWorldQuaternion(new THREE.Quaternion());
    const worldNormal = marker.normal.clone().applyQuaternion(q).normalize();

    // Camera position: offset out from surface point
    const camPos = worldTarget.clone().add(worldNormal.multiplyScalar(1.65));

    isFlyingRef.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;

    flightRef.current = {
      active: true,
      t: 0,
      fromPos: camera.position.clone(),
      toPos: camPos,
      fromLook: new THREE.Vector3(0, 0, 0),
      toLook: worldTarget.clone(),
      duration: 1.15,
    };

    // Open sky overlay near the end of the flight
    window.setTimeout(() => onPlaceSelected(place), 980);
  }

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.55}
        enabled={!isFlyingRef.current}
      />

      <group ref={earthGroupRef}>
        {/* Earth (radius 1) */}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial map={texture} roughness={1} metalness={0} />
        </mesh>

        {/* Pins (children of the rotating group) */}
        {markers.map(({ place, pos }) => (
          <Pin
            key={place.id}
            place={place}
            pos={pos}
            earthGroupRef={earthGroupRef}
            hovered={hovered === place.id}
            setHovered={(v) => setHovered(v ? place.id : null)}
            onSelect={() => flyTo(place)}
          />
        ))}
      </group>
    </>
  );
}

function Pin({
  place,
  pos,
  earthGroupRef,
  hovered,
  setHovered,
  onSelect,
}: {
  place: Place;
  pos: THREE.Vector3;
  earthGroupRef: React.RefObject<THREE.Group | null>;
  hovered: boolean;
  setHovered: (v: boolean) => void;
  onSelect: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Orient pin so its “up” points outward from the Earth centre
  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.position.copy(pos);

    const outward = pos.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(up, outward);
    groupRef.current.quaternion.copy(q);
  }, [pos]);

  useFrame(() => {
    // Optional realism: hide pins on the far side of the Earth.
    // This avoids “floating in space” impressions near the limb.
    const g = earthGroupRef.current;
    const pin = groupRef.current;
    if (!g || !pin) return;

    const worldPos = pin.getWorldPosition(new THREE.Vector3());
    const camDir = camera.position.clone().normalize();
    const surfaceDir = worldPos.clone().normalize();
    pin.visible = surfaceDir.dot(camDir) > 0.02;
  });

  return (
    <group
      ref={groupRef}
      onClick={onSelect}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Stem */}
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.0022, 0.0022, 0.024, 16]} />
        <meshStandardMaterial
          color={hovered ? "#ffd6ea" : "#ff9fc8"}
          emissive={hovered ? "#ff9fc8" : "#000000"}
          emissiveIntensity={hovered ? 0.6 : 0}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.028, 0]}>
        <sphereGeometry args={[0.008, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#ffd6ea" : "#ff9fc8"}
          emissive={hovered ? "#ff9fc8" : "#000000"}
          emissiveIntensity={hovered ? 0.9 : 0}
        />
      </mesh>

      {/* Soft halo */}
      <mesh position={[0, 0.028, 0]}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial
          color="#ff9fc8"
          transparent
          opacity={hovered ? 0.18 : 0.08}
        />
      </mesh>
    </group>
  );
}

function latLonToVector3(lat: number, lon: number, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}
