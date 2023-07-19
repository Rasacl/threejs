import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// 目标：raycaster

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
const particlesTexture = textureLoader.load("./textures/particles/1.png");
// 设置相机位置
camera.position.set(0, 0, 30);
scene.add(camera);

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
});
const redMaterial = new THREE.MeshBasicMaterial({
  color: "#ff0000",
});

// 1000立方体
let cubeArr = [];
let cubeGroup = new THREE.Group();
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let z = 0; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(i*2 -5, j*2 - 5, z*2 -5);
      cubeGroup.add(cube);
      cubeArr.push(cube);
    }
  }
}


//c创建三角形
var sjxGroup = new THREE.Group();
for (let i = 0; i < 50; i++) {
  // 每一个三角形，需要3个顶点，每个顶点需要3个值
  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    if(j%3 == 1){
      positionArray[j] = Math.random() * 10 - 5;
    }else {

      positionArray[j] = Math.random() * 10 - 5;
    }
  }
  geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
  );
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  // 根据几何体和材质创建物体
  let sjxmesh = new THREE.Mesh(geometry, material);
  sjxGroup.add(sjxmesh);
  sjxGroup.position.set(0, -35, 0);
}

//弹跳小球
let sphereGroup = new THREE.Group();
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// 投射阴影
sphere.castShadow = true;

sphereGroup.add(sphere);

// // 创建平面
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, sphereMaterial);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
sphereGroup.add(plane);

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
sphereGroup.add(light);

const smallBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
smallBall.position.set(2, 2, 2);
//直线光源
const pointLight = new THREE.PointLight(0xff0000, 2);
// pointLight.position.set(2, 2, 2);
pointLight.castShadow = true;

// 设置阴影贴图模糊度
pointLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(512, 512);
pointLight.decay = 0;
sphereGroup.position.set(0, -75, 0);
// 设置透视相机的属性
smallBall.add(pointLight);
sphereGroup.add(smallBall);
scene.add(sphereGroup);
scene.add(cubeGroup)
scene.add(sjxGroup)

let arrGroup = [cubeGroup,sjxGroup,sphereGroup];
// 创建投射光线对象
const raycaster = new THREE.Raycaster();

// 鼠标的位置对象
const mouse = new THREE.Vector2();

// 监听鼠标的位置
window.addEventListener("mousemove", (event) => {
  //摇晃相机
  mouse.x = (event.clientX / window.innerWidth)  - 0.5;
  mouse.y = (event.clientY / window.innerHeight) - 0.5;
});

// 监听鼠标的位置
window.addEventListener("click", (event) => {
  //   console.log(event);
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  raycaster.setFromCamera(mouse, camera);
  let result = raycaster.intersectObjects(cubeArr);
  //   console.log(result);
  //   result[0].object.material = redMaterial;
  result.forEach((item) => {
    item.object.material = redMaterial;
  });
});
//设置当前页
let currentPage = 0;
//监听鼠标滚动事件
window.addEventListener("scroll", (event) => {
  const newPage = Math.round(window.scrollY / window.innerHeight);
if (currentPage !== newPage){
  currentPage = newPage;
  console.log('改变页面', currentPage)
// gsap.to(`.page${currentPage} h1`, {
//     duration: 0.7,
//   rotation: '+=360',
// })
  gsap.fromTo(`.page${currentPage} h1`,
      {x:-300},
      {x:0,duration: 0.7,rotation: '+=360',}
  )
}
})

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({alpha: true});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
// const controls = new OrbitControls(camera, renderer.domElement);
// // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
// controls.enableDamping = true;

// 添加坐标轴辅助器
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

function render() {
  let time = clock.getElapsedTime();
  let delTime = clock.getDelta();
  cubeGroup.rotation.x = time * 0.5;
  cubeGroup.rotation.y = time * 0.5;

  sjxGroup.rotation.x = time * 0.5;
  sjxGroup.rotation.y = time * 0.5;

  smallBall.position.x = Math.sin(time) * 3;
  smallBall.position.z = Math.cos(time) * 3;
  smallBall.position.y = 2 + Math.sin(time * 10) / 2;
  sphereGroup.rotation.z = Math.sin(time)  * 0.5;
  sphereGroup.rotation.y = Math.sin(time)  * 0.1;
  // controls.update();
  //根据当前滚动的scrolly值，设置摄像机的位置
  camera.position.y = -(window.scrollY / window.innerHeight) * 30;
  camera.position.x = (mouse.x * 10 - camera.position.x) * delTime * 50;
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
