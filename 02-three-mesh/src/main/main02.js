import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {BufferGeometry} from "three";
/*目标 打造炫酷的三角形集群*/
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
// const cubeGeometry = new THREE.BoxGeometry(2,2,2)

for (let i = 0; i < 50; i++){
    const geometry = new BufferGeometry()
    const positionArray = new Float32Array(9)
    //每一个三角形，需要三个顶点，每个定点需要三个值
    for (let j = 0; j < 9; j++){
        positionArray[j] = Math.random() * 10 -5
    }
    geometry.setAttribute('position',new THREE.BufferAttribute(positionArray, 3))
    let color = new THREE.Color(Math.random(),Math.random(),Math.random())
    //创建材质
    const cubeMaterial = new THREE.MeshBasicMaterial({color: color,transparent:true,opacity:0.5})
   //根据几何体和材质创建物体
    const cube = new THREE.Mesh(geometry,cubeMaterial)

    scene.add(cube)
}



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
controls.enableDamping = true

//添加坐标轴复制器
const axesHelper = new THREE.AxesHelper(88)
scene.add(axesHelper)


// time 默认传值
function renderDom(){
    controls.update()
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
