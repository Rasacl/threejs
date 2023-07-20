
//highp 代表高精度 -2^62~2^62
//mediump 代表中精度 -2^14~2^14
//lowp 代表低精度 -2^6~2^6
precision mediump float; //精度

// projectionMatrix 投影矩阵 modelMatrix 模型矩阵 viewMatrix 视图矩阵
attribute vec3 position;
attribute vec2 uv;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// 获取时间
uniform float uTime;

varying vec2 vUv;
varying float vWave;

void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//    modelPosition.x += 1.0;
//    modelPosition.z += modelPosition.x;


    // 使用余弦函数创建前后凹凸的波浪效果
    modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.1;
    modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.1;

    vWave = modelPosition.z;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
