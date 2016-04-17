attribute vec4 position;
attribute vec2 texture_coords;

uniform mat4 projection;
uniform mat4 view;
uniform float deform;
uniform float time;
varying vec2 coords;

void main() {
	coords = texture_coords;

	vec4 temp_position = position;
	temp_position.z += sin(time + temp_position.y * 1.0) * 0.1 * deform;
	temp_position.y += cos(time + temp_position.z * 2.5) * 0.05 * deform;
	temp_position.x += cos(time - temp_position.y * 1.5) * 0.1 * deform;

	gl_Position = projection * view * vec4(temp_position.xyz, 1.0);
}