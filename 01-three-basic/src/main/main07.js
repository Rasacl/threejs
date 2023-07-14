import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
//导入动画库
import {gsap} from "gsap"
/*目标 掌握gsap设置各种动画效果*/
//创建场景
const scene= new THREE.Scene()

//创建相机 -- 透视相机  fov:摄像机视锥体垂直视野角度  aspect：摄像机视锥体长宽比  near: 摄像机视锥体近端面 far:摄像机视锥体远端面
const aspectRatio = window.innerWidth / window.innerHeight
const  camera = new THREE.PerspectiveCamera(75 , aspectRatio, 0.1 ,1000)

//设置相机位置
camera.position.set(0,0,10)
//添加相机到场景
scene.add(camera)

//添加物体
//创建几何体对象
const cubeGeometry = new THREE.BoxGeometry(2,2,2)
//创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00})
//根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
//修改物体的位置
// cube.position.set(5,0,0)
// cube.position.y = 10

//控制物体的缩放
// cube.scale.set(1,2,4)
// cube.scale.y = 3

//控制物体的旋转
// cube.rotation.set(Math.PI / 5,Math.PI / 2,Math.PI / 9, 'XZY')
//将几何体添加到场景
scene.add(cube)

//初始化渲染器
const render = new THREE.WebGLRenderer()

//设置渲染尺寸大小
render.setSize(window.innerWidth,window.innerHeight)

//将webGL渲染的内容添加到body上
document.body.appendChild(render.domElement)

// //使用渲染器 通过相机将场景渲染进来
// render.render(scene,camera)

//创建轨道控制器
const controls = new OrbitControls(camera,render.domElement)

//添加坐标轴复制器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//使用gsap动画
var aninmation = gsap.to(cube.position,{
    x:5,
    duration: 5,
    ease:'power1.inOut',
    repeat:-1, //设置重复次数，-1会无限循环
    yoyo:true, //设置往返运动
    delay: 3, //设置延迟时间
    onComplete:() => {
        console.log('动画完成')
    },
    onStart:() => {
    console.log('动画开始')
    }
})
gsap.to(cube.rotation,{x:Math.PI * 2, duration: 5, ease:'power1.inOut'})

window.addEventListener('click',() => {
    console.log(aninmation)
    if(aninmation.isActive()){
        aninmation.paused(true)
    }else {
        aninmation.resume()
    }
})
// time 默认传值
function renderDom(){
    render.render(scene,camera)
    // 渲染下一帧的时候会再次调用render函数
    requestAnimationFrame(renderDom)
}
console.log(cube)
renderDom()