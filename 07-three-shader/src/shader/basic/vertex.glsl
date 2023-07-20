// projectionMatrix 投影矩阵 modelViewMatrix 模型视图矩阵
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
