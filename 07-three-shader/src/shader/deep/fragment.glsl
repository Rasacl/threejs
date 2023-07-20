precision mediump float; //精度
uniform float uTime;
varying vec2 vUv;

float random (vec2 st) {
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void main(){

        // 1 通过顶点对应的uv，决定每一个像素在uv图像的位置，通过这个位置想x，y决定颜色
//        gl_FragColor = vec4(vUv,0.0,1.0);

        // 2 对第一种变形
//        gl_FragColor = vec4(vUv,1.0,1.0);

        // 3 利用uv实现渐变效果  从左到右
//        gl_FragColor = vec4(vUv.x,vUv.x,vUv.x,1.0);
        // 4 利用uv实现渐变效果  从上到下
//        gl_FragColor = vec4(vUv.y,vUv.y,vUv.y,1.0);

        //5 从上到下 1-vUv.y

        // 6 短范围渐变 vUv.y *10

        // 7 利用取模实现反复效果  mod(vUv.y*10.0,1.0)  0-1
//        gl_FragColor = vec4(mod(vUv.y*10.0,1.0),mod(vUv.y*10.0,1.0),mod(vUv.y*10.0,1.0),1.0);

        // 8 利用step函数实现阶梯效果 step(0.5,vUv.y)  0-1  step(dege,x) x>dege 1  x<dege 0
//        float strength = mod(vUv.x*10.0,1.0);
//        float step = step(0.5,strength);
//       gl_FragColor = vec4(step,step,step,1.0);

        // 9 条纹相加

//        float steps = step(0.8, mod(vUv.x*10.0,1.0));
//        steps += step(0.8, mod(vUv.y*10.0,1.0));
//        gl_FragColor = vec4(steps,steps,steps,1.0);

        // 10 条纹相乘
//        float steps = step(0.8, mod(vUv.x*10.0,1.0));
//        steps *= step(0.8, mod(vUv.y*10.0,1.0));
//        gl_FragColor = vec4(steps,steps,steps,1.0);

        // 11 条纹相减
//        float steps = step(0.8, mod(vUv.x*10.0,1.0));
//        steps -= step(0.8, mod(vUv.y*10.0,1.0));
//        gl_FragColor = vec4(steps,steps,steps,1.0);

        // 12 条纹偏移
//        float steps = step(0.2, mod(vUv.x*10.0,1.0));
//        steps *= step(0.2, mod(vUv.y*10.0,1.0));
//        gl_FragColor = vec4(steps,steps,steps,1.0);
//        float barx = step(0.4, mod((vUv.x*10.0 + uTime),1.0)) * step(0.8, mod(vUv.y*10.0,1.0));
//        float bary = step(0.4, mod((vUv.y*10.0 + uTime),1.0)) * step(0.8, mod(vUv.x*10.0,1.0));
//        float strength = barx + bary;
//        gl_FragColor = vec4(vUv, 1.0,strength);

        //16 利用绝对值 abs(vUv.x-0.5)


        // 17 最小值 min
//        float strength = min(abs(vUv.x-0.5),abs(vUv.y-0.5));
//        gl_FragColor = vec4(strength,strength, strength,1.0);


        // 18 最大值 max
//        float strength = max(abs(vUv.x-0.5),abs(vUv.y-0.5));
//        gl_FragColor = vec4(strength,strength, strength,1.0);

        // 19 取整 实现条纹渐变 floor ceil
//        float strength = floor(vUv.x*10.0) / 10.0;
//        float strength = ceil(vUv.x*10.0) / 10.0;
//        gl_FragColor = vec4(strength,strength, strength,1.0);


        // 20 随机数

//        float strength = random(vUv);
//        gl_FragColor = vec4(strength,strength, strength,1.0);

        // 21 依据length返回向量长度
//        float strength = length(vUv);
//        gl_FragColor = vec4(strength,strength, strength,1.0);

        //22 根据distance返回两个向量之间的距离
//        float strength = distance(vUv,vec2(0.5,0.5));
//        gl_FragColor = vec4(strength,strength, strength,1.0);

        // 23 依据dot返回两个向量的点积
//        float strength = dot(vUv,vec2(0.5,0.5));
//        gl_FragColor = vec4(strength,strength, strength,1.0);

        // 24 波浪圆环
//        vec2 waveUv = vec2(
//                vUv.x + sin(vUv.x * 30.0 + uTime) * 0.1,
//                vUv.y + sin(vUv.x * 30.0 + uTime) * 0.1
//        );
//        float strength = 1.0 -step(0.01, abs(distance(waveUv,vec2(0.5,0.5)) - 0.25));
//        gl_FragColor = vec4(strength,strength, strength,strength);
//        vec2 waveUv = vec2(
//                vUv.x + sin(vUv.x * 10.0 + uTime) * 0.1,
//                vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
//        );
//        float strength = 1.0 -step(0.01, abs(distance(waveUv,vec2(0.5,0.5)) - 0.25));
//        gl_FragColor = vec4(strength,strength, strength,strength);

        // 25 正切 tan
//      float strength = tan(vUv.x*10.0);
//      gl_FragColor = vec4(strength,strength, strength,1.0);

        // 26 反正切 atan
//       float strength = atan(vUv.x,vUv.y);
//       gl_FragColor = vec4(strength,strength, strength,1.0);

        // 27 根据角度实现螺旋渐变
//        float strength = (atan(vUv.x - 0.5,vUv.y - 0.5) + 3.14) / 6.28;
//        gl_FragColor = vec4(strength,strength, strength,1.0);

        //28 实现雷达扫射
        float alpha = 1.0 - step(0.1, distance(vUv,vec2(0.5)) - 0.25);
        float strength = (atan(vUv.x - 0.5,vUv.y - 0.5) + 3.14) / 6.28;
        gl_FragColor = vec4(strength,strength, strength,alpha);

}

