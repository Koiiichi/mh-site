/**
 * GLSL shaders for the particle sphere.
 *
 * The "etching" look: soft gaussian grain with per-particle size and opacity
 * variation, monochrome color, slow breathing. Each particle carries a surface
 * normal, so the cloud is lit like a solid: a fixed key light shapes the form,
 * silhouettes (normals perpendicular to the view) gather extra grain, and far
 * surfaces recede. In ink mode (dark grain on a light page) shadows gather the
 * grain instead, like an engraving.
 */

/**
 * 3D simplex noise — Ashima / webgl-noise (Stefan Gustavson, Ahima Arts).
 * MIT licensed, used verbatim rather than hand-rolled. Source:
 * https://github.com/ashima/webgl-noise
 * Drives the organic mid-morph "bulge" so transitions feel alive, not linear.
 */
const glslSimplexNoise = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
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
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;     // global size multiplier (px-ish, tuned in JS)
  uniform float uBreath;   // breathing scale, ~1.0..1.025

  uniform vec3  uCursor;          // smoothed cursor position in world space
  uniform float uCursorRadius;    // influence radius in world units
  uniform float uCursorStrength;  // 0 = no pull, smoothed toward target

  uniform float uProgress;   // 0 = sphere, 1 = target shape
  uniform float uBulge;      // mid-morph noise displacement amplitude
  uniform float uNoiseScale; // spatial frequency of the morph noise

  uniform vec3  uLightDir; // world-space key light direction (unit)
  uniform float uShade;    // 0 = flat grain, 1 = full lighting + rim
  uniform float uInk;      // 0 = light grain on dark, 1 = dark grain on light

  uniform float uCameraDistance; // camera z; the orb sits at the origin

  attribute float aScale;            // per-particle size factor (etching grain)
  attribute float aOpacity;          // per-particle opacity (etching depth)
  attribute vec3  aPositionTarget;   // morph destination (object space)
  attribute vec3  aNormalTarget;     // morph destination normal (object space)
  attribute float aDelay;            // per-particle stagger delay (0..MAX)
  attribute float aTint;             // 1 = chromatic accent particle

  varying float vOpacity;
  varying float vTint;
  varying float vDepth;
  varying float vShade;

  ${glslSimplexNoise}


  // Per-particle staggered progress. MAX must match MORPH_STAGGER in JS.
  const float MORPH_STAGGER = 0.4;

  void main() {
    float local = clamp(
      (uProgress - aDelay) / (1.0 - MORPH_STAGGER),
      0.0,
      1.0
    );

    vec3 morphed = mix(position, aPositionTarget, local);

    // Organic bulge that peaks mid-transition and vanishes at both ends.
    float bulge = sin(local * 3.141592653589793);
    if (bulge > 0.0001) {
      float t = uTime * 0.05;
      vec3 n = vec3(
        snoise(morphed * uNoiseScale + vec3(0.0, 0.0, t)),
        snoise(morphed * uNoiseScale + vec3(31.4, 17.2, t)),
        snoise(morphed * uNoiseScale + vec3(0.0, 47.2, t))
      );
      morphed += n * uBulge * bulge;
    }

    vec3 transformed = morphed * uBreath;

    // World-space position (includes the object's Y rotation).
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);

    // Cursor attractor: pull points toward the cursor with a smooth radial
    // falloff. Strength is smoothed in JS so release feels elastic.
    vec3 toCursor = uCursor - worldPosition.xyz;
    float dist = length(toCursor);
    float falloff = smoothstep(uCursorRadius, 0.0, dist);
    worldPosition.xyz += toCursor * falloff * uCursorStrength;

    // Surface shading. Normals blend with the morph; mid-transition they can
    // cancel out, so guard the zero vector and fade shading out while the
    // bulge scatters the shape (a scattered cloud has no surface to light).
    vec3 objNormal = mix(normal, aNormalTarget, local);
    float nLen = length(objNormal);
    objNormal = nLen > 0.0001 ? objNormal / nLen : vec3(0.0, 0.0, 1.0);
    vec3 worldNormal = normalize(mat3(modelMatrix) * objNormal);
    vec3 viewDir = normalize(cameraPosition - worldPosition.xyz);
    float facing = dot(worldNormal, viewDir);
    // Two-sided key light: back faces are lit as seen, then dimmed below.
    float diffuse = max(dot(facing < 0.0 ? -worldNormal : worldNormal, uLightDir), 0.0);
    float lit = mix(0.2 + 0.8 * diffuse, 1.0 - 0.7 * diffuse, uInk);
    float backFade = mix(0.4, 1.0, smoothstep(-0.35, 0.2, facing));
    float rim = pow(1.0 - abs(facing), 2.0);
    float shade = lit * backFade + rim * 0.5;
    vShade = mix(1.0, shade, uShade * (1.0 - bulge));

    vec4 mvPosition = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * mvPosition;

    // Perspective size relative to the orb's center plane: nearer points
    // render slightly larger, giving the cloud depth.
    float depth = max(-mvPosition.z, 0.001);
    float perspective = uCameraDistance / depth;
    gl_PointSize = aScale * uSize * uPixelRatio * perspective
      * (0.7 + 0.3 * min(vShade, 1.4));

    vOpacity = aOpacity;
    vTint = aTint;
    // -1 at the orb's nearest extent, +1 at its farthest (unit radius).
    vDepth = depth - uCameraDistance;
  }
`;

export const particleFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform vec3 uAccentColor; // faint desaturated cyan for ~5% of particles

  varying float vOpacity;
  varying float vTint;
  varying float vDepth;
  varying float vShade;

  void main() {
    // Soft grain: a tight gaussian core plus a faint halo, so dense regions
    // read as tone rather than as overlapping discs.
    vec2 coord = gl_PointCoord - vec2(0.5);
    float r2 = dot(coord, coord);
    float alpha = exp(-r2 * 24.0) + exp(-r2 * 7.0) * 0.3;
    if (alpha < 0.01) discard;

    // Chromatic accent: tinted particles render in faint cyan (the "flicker").
    vec3 color = mix(uColor, uAccentColor, vTint);
    float opacity = mix(vOpacity, 0.18, vTint);

    // Depth fade: the near side of the orb stays crisp, the far side recedes.
    // Sharpens any shape's silhouette and adds depth.
    float depthFade = mix(1.0, 0.4, clamp(0.46 + vDepth * 0.385, 0.0, 1.0));
    opacity *= depthFade * vShade;

    gl_FragColor = vec4(color, min(opacity * alpha, 1.0));
  }
`;
