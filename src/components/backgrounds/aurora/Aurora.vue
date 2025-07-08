<template>
  <div ref="container" class="aurora-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";

const props = defineProps({
  // Color properties
  baseColor: {
    type: String,
    default: "#1b1b1b",
  },
  auroraColor1: {
    type: String,
    default: "#00ff00", // Green
  },
  auroraColor2: {
    type: String,
    default: "#0000ff", // Blue
  },
  // Animation properties
  speed: {
    type: Number,
    default: 0.2,
  },
  intensity: {
    type: Number,
    default: 1.0,
  },
  density: {
    type: Number,
    default: 5.0,
  },
  // Rendering properties
  resolution: {
    type: Number,
    default: 1.0, // 1.0 = full resolution, lower for performance
  },
});

const container = ref(null);
let renderer, scene, camera;
let auroraUniforms;
let animationFrameId = null;
let isActive = true;

// Initialize Three.js scene
const init = () => {
  if (!container.value) return;

  // Create renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio * props.resolution);
  container.value.appendChild(renderer.domElement);

  // Create scene and camera
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Create aurora shader material
  auroraUniforms = {
    uTime: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    uBaseColor: { value: new THREE.Color(props.baseColor) },
    uAuroraColor1: { value: new THREE.Color(props.auroraColor1) },
    uAuroraColor2: { value: new THREE.Color(props.auroraColor2) },
    uSpeed: { value: props.speed },
    uIntensity: { value: props.intensity },
    uDensity: { value: props.density },
  };

  const auroraShader = new THREE.ShaderMaterial({
    uniforms: auroraUniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uBaseColor;
      uniform vec3 uAuroraColor1;
      uniform vec3 uAuroraColor2;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uDensity;
      
      varying vec2 vUv;
      
      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        // Permutations
        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                
        // Gradients
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
      }
      
      void main() {
        // Normalized pixel coordinates
        vec2 uv = vUv;
        
        // Create base of the aurora (stronger at top)
        float yGradient = pow(uv.y, 2.0);
        
        // Create noise for the aurora waves
        float noise1 = snoise(vec3(uv.x * uDensity, uv.y * 2.0, uTime * uSpeed * 0.1)) * 0.5 + 0.5;
        float noise2 = snoise(vec3(uv.x * uDensity * 0.5, uv.y * 4.0, uTime * uSpeed * 0.2 + 100.0)) * 0.5 + 0.5;
        
        // Combine noises
        float auroraStrength = noise1 * noise2 * yGradient * uIntensity;
        auroraStrength = smoothstep(0.1, 1.0, auroraStrength);
        
        // Mix colors based on height
        vec3 auroraColor = mix(uAuroraColor1, uAuroraColor2, noise2);
        
        // Final color mixing
        vec3 finalColor = mix(uBaseColor, auroraColor, auroraStrength);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    transparent: true,
  });

  // Create a full-screen quad
  const geometry = new THREE.PlaneGeometry(2, 2);
  const auroraPlane = new THREE.Mesh(geometry, auroraShader);
  scene.add(auroraPlane);

  // Handle window resize
  window.addEventListener("resize", onResize);

  // Start animation
  animate();
};

// Animation loop
const animate = () => {
  if (!isActive) return;

  auroraUniforms.uTime.value += 0.01;
  renderer.render(scene, camera);
  animationFrameId = requestAnimationFrame(animate);
};

// Handle resize
const onResize = () => {
  if (!renderer) return;

  renderer.setSize(window.innerWidth, window.innerHeight);
  auroraUniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
};

// Update uniforms when props change
watch(
  () => props.baseColor,
  (newVal) => {
    if (auroraUniforms)
      auroraUniforms.uBaseColor.value = new THREE.Color(newVal);
  },
);

watch(
  () => props.auroraColor1,
  (newVal) => {
    if (auroraUniforms)
      auroraUniforms.uAuroraColor1.value = new THREE.Color(newVal);
  },
);

watch(
  () => props.auroraColor2,
  (newVal) => {
    if (auroraUniforms)
      auroraUniforms.uAuroraColor2.value = new THREE.Color(newVal);
  },
);

watch(
  () => props.speed,
  (newVal) => {
    if (auroraUniforms) auroraUniforms.uSpeed.value = newVal;
  },
);

watch(
  () => props.intensity,
  (newVal) => {
    if (auroraUniforms) auroraUniforms.uIntensity.value = newVal;
  },
);

watch(
  () => props.density,
  (newVal) => {
    if (auroraUniforms) auroraUniforms.uDensity.value = newVal;
  },
);

// Lifecycle hooks
onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  isActive = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  window.removeEventListener("resize", onResize);

  // Clean up Three.js resources
  if (renderer) {
    renderer.dispose();
    if (container.value && container.value.contains(renderer.domElement)) {
      container.value.removeChild(renderer.domElement);
    }
  }

  if (scene) {
    scene.clear();
  }
});
</script>

<style scoped>
.aurora-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}
</style>
