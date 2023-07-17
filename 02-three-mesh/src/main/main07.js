import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {BufferGeometry} from "three";
/*目标 透明纹理  alphaMap*/
//创建场景
const scene= new THREE.Scene()

//创建相机 -- 透视相机  fov:摄像机视锥体垂直视野角度  aspect：摄像机视锥体长宽比  near: 摄像机视锥体近端面 far:摄像机视锥体远端面
const aspectRatio = window.innerWidth / window.innerHeight
const  camera = new THREE.PerspectiveCamera(75 , aspectRatio, 0.1 ,1000)

//设置相机位置
camera.position.set(0,0,10)
//添加相机到场景
scene.add(camera)
//导入纹理
const textureLoader = new THREE.TextureLoader()
const doorTexture = textureLoader.load( './textures/door/avtor.png',undefined,undefined,function (error){
    console.log(error)
})

//设置纹理的常用属性
// doorTexture.offset.x = 0.5 //偏移量
// doorTexture.offset.y = 0.5 //偏移量
// doorTexture.offset.set(0.5,0.5) //偏移量

// doorTexture.center.set(0.5,0.5) //设置中心点
// doorTexture.rotation = Math.PI / 4 //旋转
//
// doorTexture.repeat.set(2,2) //设置重复
// doorTexture.wrapS = THREE.MirroredRepeatWrapping //设置水平方向重复 使用MirroredRepeatWrapping， 纹理将重复到无穷大，在每次重复时将进行镜像。
// doorTexture.wrapT = THREE.RepeatWrapping //设置垂直方向重复 使用RepeatWrapping，纹理将简单地重复到无穷大

// doorTexture.magFilter = THREE.NearestFilter //设置放大过滤器
// doorTexture.minFilter = THREE.NearestFilter //设置缩小过滤器
// doorTexture.magFilter = THREE.LinearFilter //设置放大过滤器 默认
// doorTexture.minFilter = THREE.LinearFilter //设置缩小过滤器 默认
//添加物体
//创建几何体对象
const cubeGeometry = new THREE.BoxGeometry(2,2,2)

const basicMaterial = new THREE.MeshBasicMaterial({color: '#ffff00',map:doorTexture})

const cube = new THREE.Mesh(cubeGeometry,basicMaterial)

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
