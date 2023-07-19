import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
//导入cannon一引擎
import * as CANNON from "cannon-es";

// 目标：碰撞事件的监听,播放声音

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
// 设置相机位置
camera.position.set(0, 0, 30);
scene.add(camera);
//创建球
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//  接收阴影
sphere.castShadow = true;
scene.add(sphere);
//创建平面
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial()
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//  接收阴影
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -5;
scene.add(plane);

// 创建环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
//添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//开启阴影
directionalLight.castShadow = true;
scene.add(directionalLight);


//创建物理世界
// const world = new CANNON.World(
//     {
//         gravity: new CANNON.Vec3(0, -9.82, 0)
//     }
// );
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0);
//创建物理小球
const sphereShape = new CANNON.Sphere(1);
//设置小球的材质
const sphereWorldMaterial = new CANNON.Material();
//创建物理世界的物体
const sphereBody = new CANNON.Body({
  shape: sphereShape, //形状
  position: new CANNON.Vec3(0, 0, 0), //位置
  mass: 1, //质量
  material: sphereWorldMaterial,  //材质
})
//将物体添加到物理世界
world.addBody(sphereBody);
// 创建击打声音
const hitSound = new Audio('/assets/hit.mp3')
//添加监听碰撞事件
function HitEvent(e) {
  //获取碰撞强度
  let intensity = e.contact.getImpactVelocityAlongNormal();
    console.log(intensity)
    //播放声音
    if(intensity > 1.5){
        hitSound.play()
    }
}
sphereBody.addEventListener('collide', HitEvent)
//创建物理平面
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body();
//质量为0，不受重力影响
planeBody.mass = 0;
planeBody.addShape(planeShape);
planeBody.position.set(0, -5, 0);
//旋转地面位置
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({alpha: true});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
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
  let delta = clock.getDelta();
  //   更新物理世界
  world.step(1 / 120, delta);
  sphere.position.copy(sphereBody.position);

  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
