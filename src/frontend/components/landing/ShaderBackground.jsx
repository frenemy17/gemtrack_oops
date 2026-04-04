import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Color } from 'three';

const GradientShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new Color('#0f172a') }, // Slate 900
        uColor2: { value: new Color('#1e293b') }, // Slate 800
        uColor3: { value: new Color('#334155') }, // Slate 700
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      float noise = snoise(vUv * 3.0 + uTime * 0.1);
      vec3 color = mix(uColor1, uColor2, vUv.y + noise * 0.2);
      color = mix(color, uColor3, vUv.x - noise * 0.2);
      
      // Add a subtle grain or sparkle
      float sparkle = snoise(vUv * 50.0 + uTime * 0.5);
      if (sparkle > 0.95) {
        color += 0.05;
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

function ShaderPlane() {
    const mesh = useRef();

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new Color('#020617') }, // Very dark slate
        uColor2: { value: new Color('#0f172a') }, // Dark slate
        uColor3: { value: new Color('#1e1b4b') }, // Dark Indigo
    }), []);

    return (
        <mesh ref={mesh} scale={[20, 10, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                vertexShader={GradientShaderMaterial.vertexShader}
                fragmentShader={GradientShaderMaterial.fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

export default function ShaderBackground() {
    return (
        <div className="absolute inset-0 -z-10 w-full h-full bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ShaderPlane />
            </Canvas>
        </div>
    );
}
