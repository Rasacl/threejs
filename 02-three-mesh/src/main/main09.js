import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {BufferGeometry} from "three";
/*目标 灯光与阴影
*  1. 材质要满足能够对光照产生反应
*  2.设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true
*  3. 设置光照投射阴影 light.castShadow.enable = true
*  4. 设置物体投射阴影 mesh.castShadow = true
*  5. 设置接收阴影 mesh.receiveShadow = true
* */
//创建场景
const scene= new THREE.Scene()

//创建相机 -- 透视相机  fov:摄像机视锥体垂直视野角度  aspect：摄像机视锥体长宽比  near: 摄像机视锥体近端面 far:摄像机视锥体远端面
const aspectRatio = window.innerWidth / window.innerHeight
const  camera = new THREE.PerspectiveCamera(75 , aspectRatio, 0.1 ,1000)

//设置相机位置
camera.position.set(0,0,10)
//添加相机到场景
scene.add(camera)
// 添加一个球
const sphereGeometry = new THREE.SphereGeometry(1,20,20)
//创建标准材质
const standardMaterial = new THREE.MeshStandardMaterial()
//创建球体
const sphere = new THREE.Mesh(sphereGeometry,standardMaterial)
//投射阴影
sphere.castShadow = true
scene.add(sphere)
//创建平面
const planeGeometry = new THREE.PlaneGeometry(10,10)
const plane = new THREE.Mesh(planeGeometry,standardMaterial)
plane.position.set(0,-2,0)
plane.rotation.x = -Math.PI / 2
//接收阴影
plane.receiveShadow = true
scene.add(plane)


//环境光
const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)
//平行光
const directionalLight = new THREE.DirectionalLight(0xffffff,0.5)
directionalLight.position.set(10,10,10)
//开启平行光投射阴影
directionalLight.castShadow = true
scene.add(directionalLight)
//初始化渲染器
const render = new THREE.WebGLRenderer()

//设置渲染尺寸大小
render.setSize(window.innerWidth,window.innerHeight)
//开启场景阴影贴图
render.shadowMap.enabled = true

//将webGL渲染的内容添加到body上
document.body.appendChild(render.domElement)

//创建轨道控制器
const controls = new OrbitControls(camera,render.domElement)
controls.enableDamping = true

//添加坐标轴复制器
const axesHelper = new THREE.AxesHelper(88)
scene.add(axesHelper)


// time 默认传值
function renderDom(){
    controls.update()
    // //使用渲染器 通过相机将场景渲染进来
    render.render(scene,camera)
    // 渲染下一帧的时候会再次调用render函数
    requestAnimationFrame(renderDom)
}
renderDom()

//监听画面变化， 更新渲染画面
window.addEventListener('resize', () => {
    //1. 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    //更新摄像机的投影矩阵
    camera.updateProjectionMatrix()

    //更新渲染器
    render.setSize(window.innerWidth, window.innerHeight)
    //设置渲染器的像素比
    render.setPixelRatio(window.devicePixelRatio)
})
