// Unified Aurora Shader - works in both GLSL preview and Three.js
// Save as aurora.glsl

// Version and precision handling
#ifdef GL_ES
precision highp float;
#endif

// ======== UNIFORMS SECTION ========
// Define uniforms based on environment
#ifdef THREE_JS
  // Three.js specific uniforms and varyings
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform vec3 uAuroraColor1;
uniform vec3 uAuroraColor2;
uniform float uSpeed;
uniform float uIntensity;
uniform float uDensityX;
uniform float uDensityY;
uniform float uVerticalFalloff;
uniform float uOpacity;
uniform float uNoiseAmplitude;
varying vec2 vUv;
  #define TIME uTime
  #define RESOLUTION uResolution
  #define UV vUv
#else
  // Standalone GLSL preview uniforms
uniform float u_time;
uniform vec2 u_resolution;
  // Default values for preview
  #define TIME u_time
  #define RESOLUTION u_resolution
  #define UV (gl_FragCoord.xy / u_resolution.xy)

  // Default values for standalone preview
vec3 uBaseColor = vec3(0.106, 0.106, 0.106);     // #1b1b1b
vec3 uAuroraColor1 = vec3(0.0, 1.0, 0.0);        // #00ff00
vec3 uAuroraColor2 = vec3(0.0, 0.0, 1.0);        // #0000ff
float uSpeed = 1.0;
float uIntensity = 1.5;
float uDensityX = 3.0;
float uDensityY = 0.0;
float uVerticalFalloff = 2.0;
float uOpacity = 1.0;
float uNoiseAmplitude = 0.5;
#endif

// ======== NOISE FUNCTIONS ========
// Simplex noise function
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
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
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

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

// ======== MAIN FUNCTION ========
void main() {
  // Get UV coordinates based on environment
  vec2 uv = UV;

  // Create base of the aurora (stronger at top)
  float yGradient = pow(uv.y, uVerticalFalloff);

  // Create noise for the aurora waves
  float noise1 = snoise(vec3(uv.x * uDensityX, uv.y * uDensityY, TIME * uSpeed * 0.1)) * uNoiseAmplitude + 0.5;
  float noise2 = snoise(vec3(uv.x * uDensityX * 0.5, uv.y * uDensityY * 2.0, TIME * uSpeed * 0.2 + 100.0)) * uNoiseAmplitude + 0.5;

  // Combine noises
  float auroraStrength = noise1 * noise2 * yGradient * uIntensity;
  auroraStrength = smoothstep(0.1, 1.0, auroraStrength);

  // Opacity
  auroraStrength = auroraStrength * uOpacity; 

  // Mix colors based on height
  vec3 auroraColor = mix(uAuroraColor1, uAuroraColor2, noise2);

  // Final color mixing
  vec3 finalColor = mix(uBaseColor, auroraColor, auroraStrength);

  // Output color
  gl_FragColor = vec4(finalColor, 1.0);
}