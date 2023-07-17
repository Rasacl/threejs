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
const textureLoader = new THREE.TextureLoader()
const map = textureLoader.load('./textures/particles/1.png')
//设置顶点
const params = {
    count:10000,
    size:0.1,
    radius:5,
    branches:20, //分支数
    color:'#ff6030',
    endColor:'#1b3984',
    rotateScale:0.3,
}
let geometry = null
let material = null

const centerColor = new THREE.Color(params.color)
const endColor = new THREE.Color(params.endColor)
const generateGalaxy = () => {
    //生成顶点
    geometry = new THREE.BufferGeometry()
    //随机位置生成
    const positions = new Float32Array(params.count * 3)
    //随机颜色生成
    const colors = new Float32Array(params.count * 3)
    //循环生成顶点
    for(let i = 0; i < params.count; i++){
        //当前的点应该在哪一条分支的角度上
        const branchAngle = (i % params.branches) / params.branches * Math.PI * 2
        //当前点距离圆心的距离
        const radius = Math.random() * params.radius *  Math.pow(Math.random() ,3)
        const current = i * 3
        const  randomX= Math.pow(Math.random() * 2 - 1,3) * (params.radius - radius) / 5
        const  randomY= Math.pow(Math.random() * 2 - 1,3) * (params.radius - radius) / 5
        const  randomZ= Math.pow(Math.random() * 2 - 1,3) * (params.radius - radius) / 5

        positions[current] = Math.cos(branchAngle + radius * params.rotateScale) * radius + randomX
        positions[current + 1] = 0 + randomY
        positions[current + 2] = Math.sin(branchAngle + radius * params.rotateScale) * radius + randomZ
        //混合颜色,形成渐变色
        const mixedColor = centerColor.clone()
        mixedColor.lerp(endColor, radius / params.radius)
        colors[current] = mixedColor.r
        colors[current + 1] = mixedColor.g
        colors[current + 2] = mixedColor.b

    }
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
    geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))
    //创建材质
    material = new THREE.PointsMaterial({
        size:params.size,
        // color: new THREE.Color(params.color),
        sizeAttenuation:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending,
        map:map,
        alphaMap:map,
        transparent:true,
        vertexColors:true,
    })
    //创建点
    const points = new THREE.Points(geometry,material)
    scene.add(points)
    return points
}
const points = generateGalaxy()
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
    //X轴旋转
    points.rotation.y = time * 0.09
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
