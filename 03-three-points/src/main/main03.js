import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {BufferGeometry} from "three";
// 导入dat.gui
import * as dat from 'dat.gui'
/*目标 使用漫天雪花效果
* */
//创建场景
const scene= new THREE.Scene()

//创建相机 -- 透视相机  fov:摄像机视锥体垂直视野角度  aspect：摄像机视锥体长宽比  near: 摄像机视锥体近端面 far:摄像机视锥体远端面
const aspectRatio = window.innerWidth / window.innerHeight
const  camera = new THREE.PerspectiveCamera(75 , aspectRatio, 1,1000)

//设置相机位置
camera.position.set(0,0,50)
//添加相机到场景
scene.add(camera)


function creatPoints(url,size=0.5){
// 创建点的材质
    const pointsMaterial = new THREE.PointsMaterial()
    const particleGeometry = new THREE.BufferGeometry()
    const count = 5000
//创建顶点
    const positions = new Float32Array(count * 3)
//创建顶点颜色
    const colors = new Float32Array(count * 3)
    for(let i = 0; i < count * 3; i++){
        positions[i] = (Math.random() - 0.5) * 10
        colors[i] = 1
    }
    particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
    particleGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3))


// 设置点材质大小
    pointsMaterial.size = size
// 设置点材质颜色
// pointsMaterial.color = new THREE.Color(0xff0000)
// pointsMaterial.color.set(0xff0000)
//载入纹理
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(`./textures/particles/${url}.png`)
//设置点材质的纹理
    pointsMaterial.map = texture
//设置点材质透明t贴图
    pointsMaterial.alphaMap = texture
//设置点材质透明度
    pointsMaterial.transparent = true
    pointsMaterial.depthWrite = false
    pointsMaterial.blending = THREE.AdditiveBlending
//设置启用顶点颜色
    pointsMaterial.vertexColors = true
//相机深度而衰减
    pointsMaterial.sizeAttenuation = true
//创建点
    const points = new THREE.Points(particleGeometry,pointsMaterial)
    scene.add(points)

    return points
}
const points = creatPoints('xue3',0.05)
const points2 = creatPoints('xue2',0.1)
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

const clock = new THREE.Clock()
// time 默认传值
function renderDom(){
    let time = clock.getElapsedTime()
    //更新点的位置
    points.rotation.x = time * 0.09
    points2.rotation.x = time * 0.5
    points2.rotation.y = time * 0.08
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
