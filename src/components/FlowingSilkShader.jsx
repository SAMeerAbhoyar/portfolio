import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vElevation;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Layered wave harmonics for silky cloth motion
    float wave1 = sin(pos.x * 2.5 + uTime * 0.7 + uScroll * 3.0) * 0.22;
    float wave2 = cos(pos.y * 2.0 + uTime * 0.5 + uMouse.x * 1.5) * 0.18;
    float wave3 = sin((pos.x + pos.y) * 1.8 + uTime * 0.9) * 0.12;

    // Mouse gentle wave distortion
    float dist = distance(uv, uMouse);
    float mouseWave = sin(dist * 10.0 - uTime * 1.5) * exp(-dist * 3.0) * 0.15;

    float elevation = wave1 + wave2 + wave3 + mouseWave;
    pos.z += elevation;

    vElevation = elevation;
    vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vElevation;

  uniform float uTime;
  uniform float uScroll;

  void main() {
    // Coral red / crimson silky palette
    vec3 deepShadow = vec3(0.02, 0.02, 0.03); // pure near black base
    vec3 darkCrimson = vec3(0.24, 0.05, 0.06);
    vec3 coralBase = vec3(0.937, 0.357, 0.31); // #ef5b4f
    vec3 coralHighlight = vec3(1.0, 0.65, 0.6); // silky specular glint

    // Lighting gradient driven by elevation and coordinates
    float factor = smoothstep(-0.35, 0.45, vElevation);
    vec3 color = mix(deepShadow, darkCrimson, factor * 0.8);
    color = mix(color, coralBase, pow(factor, 2.0));

    // Specular silky sheen
    float sheen = pow(max(0.0, vElevation + 0.3), 3.0);
    color += coralHighlight * sheen * 0.6;

    // Soft vignette on boundaries
    float edge = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) *
                 smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);

    gl_FragColor = vec4(color, edge * 0.92);
  }
`;

function SilkMesh({ mouseRef, scrollProgressRef }) {
  const meshRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      uniforms.uTime.value += delta;
      if (mouseRef.current) {
        uniforms.uMouse.value.lerp(
          new THREE.Vector2(
            (mouseRef.current.x + 1) * 0.5,
            (mouseRef.current.y + 1) * 0.5
          ),
          0.05
        );
      }
      if (typeof scrollProgressRef.current === "number") {
        uniforms.uScroll.value = scrollProgressRef.current;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 6, 0, 0]}>
      <planeGeometry args={[4.5, 3.2, 90, 90]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function FlowingSilkShader({ mouseRef, scrollProgressRef }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <SilkMesh
          mouseRef={mouseRef}
          scrollProgressRef={scrollProgressRef}
        />
      </Canvas>
    </div>
  );
}
