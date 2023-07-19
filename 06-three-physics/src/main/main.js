import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
//导入cannon一引擎
import * as CANNON from "cannon-es";

// 目标：立方体相互碰撞后旋转效果

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

//创建平面
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial()
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//  接收阴影
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -15;
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

// 创建击打声音
const hitSound = new Audio('/assets/hit.mp3')

//创建物理平面
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body();
//设置材质
const planeWorldMaterial = new CANNON.Material("plane");

//质量为0，不受重力影响
planeBody.mass = 0;
planeBody.addShape(planeShape);
planeBody.position.set(0, -15, 0);
//旋转地面位置
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);
//设置小球的材质
const cubeWorldMaterial = new CANNON.Material("cube");
//设置两种材质的碰撞参数
const defaultContactMaterial = new CANNON.ContactMaterial(
    planeWorldMaterial,
    cubeWorldMaterial,
    {
      friction: 0.1,  //摩擦系数
      restitution:0.7,  //弹性系数
    }
)
// 将材料的关联设置加到物理世界
world.addContactMaterial(defaultContactMaterial);

//设置世界碰撞默认材料，如果两个物体没有设置材质，就会使用默认材质
world.defaultContactMaterial = defaultContactMaterial;
//创建立方体
let cubeArr = []
function createCube() {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const randomColor = Math.random() * 0xffffff;
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: randomColor });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  //  接收阴影
  cube.castShadow = true;
  scene.add(cube);


  //创建物理cube
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));


//创建物理世界的物体
  const cubeBody = new CANNON.Body({
    shape: cubeShape, //形状
    position: new CANNON.Vec3(0, 0, 0), //位置
    mass: 1, //质量
    material: cubeWorldMaterial,  //材质
  })
  //增加力
    cubeBody.applyLocalForce(
        new CANNON.Vec3(18, 0, 0),  //力的方向,大小
        new CANNON.Vec3(0, 0, 0)   //力的作用点
    )
//将物体添加到物理世界
  world.addBody(cubeBody);

//添加监听碰撞事件
  function HitEvent(e) {
    //获取碰撞强度
    let intensity = e.contact.getImpactVelocityAlongNormal();
    //播放声音
    if (intensity > 1.5) {
      //重新从零开始播放
      hitSound.currentTime = 0
      //播放声音
      hitSound.volume = Math.min(Math.max(intensity / 10, 0), 1);
      hitSound.play()
    }
  }

  cubeBody.addEventListener('collide', HitEvent)
  cubeArr.push({
    mesh: cube,
    body: cubeBody
  })
}

//创建多个立方体
window.addEventListener('click', createCube)
function createCubeMore() {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
        createCube()
    },1000)
  }
}

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
  // cube.position.copy(cubeBody.position);
  cubeArr.forEach((item) => {
    item.mesh.position.copy(item.body.position);
    item.mesh.quaternion.copy(item.body.quaternion);

  })
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
