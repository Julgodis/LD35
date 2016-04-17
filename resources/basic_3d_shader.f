precision mediump float;

uniform sampler2D sampler0;
uniform vec4 color;

varying vec2 coords;

void main() {
    vec4 texel = texture2D(sampler0, coords);
    gl_FragColor = texel * color;
    //gl_FragColor = vec4(texel.rgb, 1) * color;
}