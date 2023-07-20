
precision mediump float; //精度
varying vec2 vUv;
varying float vWave;
//  导入图片
uniform sampler2D uTexture;

void main(){
//        gl_FragColor = vec4(vUv,0.0,1.0);
//          float height = vWave + 0.05*10.0;
//          gl_FragColor = vec4(1.0*height,0.0,0.0,1.0);
    //根据uv坐标获取纹理颜色
    float height = vWave + 0.05*20.0;
    vec4 color = texture2D(uTexture,vUv);
    //根据纹理颜色的r通道值来获取高度
    color.rgb *= height;
    //根据高度来设置颜色
    gl_FragColor = color;
}
