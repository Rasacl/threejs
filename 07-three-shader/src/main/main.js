import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
//导入顶点着色器
import vertexShader from "../shader/deep/vertex.glsl";
//导入片元着色器
import fragmentShader from "../shader/deep/fragment.glsl";
// 目标：使用着色器绘制各种图形

// const gui = new dat.GUI();
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("./texture/2.jpg");
// 设置相机位置
camera.position.set(0, 0, 30);
scene.add(camera);

const material =  new THREE.MeshBasicMaterial({color:"#00ff00", side: THREE.DoubleSide});
// 创建原始着色器材质
const rawShaderMaterial = new THREE.RawShaderMaterial({
    // 顶点着色器
    vertexShader: vertexShader,
    // 片元着色器
    fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: particlesTexture },
  }
});
//创建平面
const floor = new THREE.Mesh(new THREE.PlaneGeometry(1,1, 64,64),rawShaderMaterial);

scene.add(floor);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({alpha: true});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
// renderer.shadowMap.enabled = true;
// renderer.physicallyCorrectLights = true;
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

function render() {
  let time = clock.getElapsedTime();
  let delTime = clock.getDelta();
  rawShaderMaterial.uniforms.uTime.value = time;
  controls.update();
  //根据当前滚动的scrolly值，设置摄像机的位置
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");

  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
