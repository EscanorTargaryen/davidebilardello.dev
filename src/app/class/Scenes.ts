import * as THREE from "three";
import {Clock, Mesh, Object3DEventMap, PerspectiveCamera, Scene, ShaderMaterial} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

export class Scenes {

  settings = {
    speed: 0.1,
    density: 2,
    strength: 0.2,
    frequency: 1.0,
    amplitude: 3,
    intensity: 10.0,
  };

  noise = `
  // GLSL textureless classic 3D noise "cnoise",
  // with an RSL-style periodic variant "pnoise".
  // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
  // Version: 2011-10-11
  //
  // Many thanks to Ian McEwan of Ashima Arts for the
  // ideas for permutation and gradient selection.
  //
  // Copyright (c) 2011 Stefan Gustavson. All rights reserved.
  // Distributed under the MIT license. See LICENSE file.
  // https://github.com/ashima/webgl-noise
  //

  vec3 mod289(vec3 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x)
  {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise, periodic variant
  float pnoise(vec3 P, vec3 rep)
  {
    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }
`;

  rotation = `
  mat3 rotation3dY(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }

  vec3 rotateY(vec3 v, float angle) {
    return rotation3dY(angle) * v;
  }
`;

  vertexShader = `
  varying vec2 vUv;
  varying float vDistort;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uNoiseDensity;
  uniform float uNoiseStrength;
  uniform float uFrequency;
  uniform float uAmplitude;

  ${this.noise}

  ${this.rotation}

  void main() {
    vUv = uv;

    float t = uTime * uSpeed;
    float distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;

    vec3 pos = position + (normal * distortion);
    float angle = sin(uv.y * uFrequency + t) * uAmplitude;
    pos = rotateY(pos, angle);

    vDistort = distortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
  }
`;

  rgb = [0.1,0.2,0.3]


  getFragmentShader() {

   let hue = 1.55

    return `
 varying vec2 vUv;
varying float vDistort;

uniform float uTime;
uniform float uHue;
uniform float uAlpha;

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  float distort = vDistort * 0.4;

  //rgb
  vec3 brightness = vec3(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]});
  vec3 contrast = vec3(0.5, 0.5, 0.5);
  vec3 oscilation = vec3(1.0, 1.0, 1.0);
  vec3 phase = vec3(0.0, 0.1, 0.2);

  vec3 color = cosPalette(${hue} + distort, brightness, contrast, oscilation, phase);

  gl_FragColor = vec4(color, uAlpha);
}
`
  }

  width = window.innerWidth;
  height = window.innerHeight;

  renderer: THREE.WebGLRenderer;
  camera: PerspectiveCamera;
  scene: Scene;
  clock: Clock;
  controls: any;
  mesh!: Mesh<THREE.IcosahedronGeometry, ShaderMaterial, Object3DEventMap>;

  constructor() {

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor('#121118', 0);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 3.5);

    this.scene = new THREE.Scene();

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableZoom = false;

    this.controls.enableRotate = false;

    this.controls.enablePan = false;

    this.init();
    this.animate();
  }

  init() {
    this.addCanvas();
    this.addElements();

    this.addEvents();
  }

  addCanvas() {
    const canvas = this.renderer.domElement;
    canvas.classList.add('webgl');
    document.body.appendChild(canvas);
  }

  addElements() {

    let vertexShader = this.vertexShader
    let fragmentShader = this.getFragmentShader()

    const geometry = new THREE.IcosahedronGeometry(1, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: {value: 0},
        uSpeed: {value: this.settings.speed},
        uNoiseDensity: {value: this.settings.density},
        uNoiseStrength: {value: this.settings.strength},
        uFrequency: {value: this.settings.frequency},
        uAmplitude: {value: this.settings.amplitude},
        uIntensity: {value: this.settings.intensity},
      },
      // wireframe: true,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  updateElement() {

    let fragmentShader = this.getFragmentShader()
    let vertexShader = this.vertexShader

    this.mesh.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: {value: 0},
        uSpeed: {value: this.settings.speed},
        uNoiseDensity: {value: this.settings.density},
        uNoiseStrength: {value: this.settings.strength},
        uFrequency: {value: this.settings.frequency},
        uAmplitude: {value: this.settings.amplitude},
        uIntensity: {value: this.settings.intensity},
      }

    })

  }

  addEvents() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);

    this.camera.updateProjectionMatrix();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {

    this.controls.update();

    // Update uniforms
    this.mesh.material.uniforms['uTime'].value = this.clock.getElapsedTime();
    this.mesh.material.uniforms['uSpeed'].value = this.settings.speed;
    this.mesh.material.uniforms['uNoiseDensity'].value = this.settings.density;
    this.mesh.material.uniforms['uNoiseStrength'].value = this.settings.strength;
    this.mesh.material.uniforms['uFrequency'].value = this.settings.frequency;
    this.mesh.material.uniforms['uAmplitude'].value = this.settings.amplitude;
    this.mesh.material.uniforms['uIntensity'].value = this.settings.intensity;

    this.renderer.render(this.scene, this.camera);
  }
}
