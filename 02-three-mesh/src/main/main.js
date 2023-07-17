import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {BufferGeometry} from "three";
// 导入dat.gui
import * as dat from 'dat.gui'
/*目标 聚光灯
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
//聚光灯
const spotLight = new THREE.SpotLight(0xffffff,0.5)
spotLight.position.set(5,5,5)
//开启聚光灯投射阴影
spotLight.castShadow = true
//设置阴影模糊程度
spotLight.shadow.radius = 20
//设置阴影分辨率
spotLight.shadow.mapSize.set(4096,4096)
//设置透视相机属性
spotLight.shadow.camera.near = 0.5
spotLight.shadow.camera.far = 500
//设置聚光灯的角度
spotLight.angle = Math.PI / 6
spotLight.target = sphere
spotLight.distance = 0
spotLight.penumbra = 0.5
scene.add(spotLight)
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

//初始化gui界面
const gui = new dat.GUI()
gui.add(sphere.position,'x')
    .min(0)
    .max(20)
    .step(0.01)
    .name('x').onChange(() => {
})
gui.add(spotLight,'angle')
    .min(0)
    .max(Math.PI / 2)
    .step(0.01)
    .name('angle').onChange(() => {
})
gui.add(spotLight,'distance')
    .min(0)
    .max(10)
    .step(0.01)
    .name('distance').onChange(() => {
})

gui.add(spotLight,'penumbra')
    .min(0)
    .max(1)
    .step(0.01)
    .name('penumbra').onChange(() => {
})
