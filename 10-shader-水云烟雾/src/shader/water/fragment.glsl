precision mediump float;


uniform vec3 uLowColor;
uniform vec3 uHighColor;
uniform float uOpacity;
varying float vElevation;


void main(){
    float color = (vElevation + 1.0) / 2.0;
    vec3 mixColor = mix(uLowColor, uHighColor, color);
    gl_FragColor = vec4(mixColor, uOpacity);
}
