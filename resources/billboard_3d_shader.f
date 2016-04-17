precision mediump float;

uniform sampler2D sampler0;

varying vec2 coords;
varying vec4 fcolor;

void main() {
    vec4 texel = texture2D(sampler0, coords);
    gl_FragColor = texel * fcolor;
    //gl_FragColor = vec4(texel.rgb, 1) * fcolor;
}