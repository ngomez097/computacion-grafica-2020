precision mediump float;

uniform mat4 projection, view, model;
attribute vec3 position;

void main () {
  gl_Position = projection * view * model * vec4(position, 1);
}
