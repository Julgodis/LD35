attribute vec4 position;
attribute vec2 texture_coords;
attribute vec3 offset; // the third argument is the rotation
attribute vec4 color;

uniform mat4 projection;
uniform mat4 view;
uniform float deform;
uniform float time;

varying vec2 coords;
varying vec4 fcolor;

void main() {
	coords = texture_coords;
	fcolor = color;

	vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
	vec3 up = vec3(view[0][1], view[1][1], view[2][1]);

	float oa = 2.0 * 3.14 * offset.z;
	float ox = offset.x * cos(oa) - offset.y * sin(oa);
	float oy = offset.x * sin(oa) + offset.y * cos(oa);

	vec3 vertex = position.xyz
		+ right * ox * 0.5 * 0.01
		+ up * oy * 0.5 * 0.01;

	vertex.z += sin(time + vertex.y * 1.0) * 0.1 * deform;
	vertex.y += cos(time + vertex.z * 2.5) * 0.05 * deform;

	gl_Position = projection * view * vec4(vertex, 1.0);
}