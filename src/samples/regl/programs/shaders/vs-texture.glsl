precision mediump float;

attribute vec3 position;
attribute vec2 texCoords;
uniform mat4 model;
varying vec2 vTexCoords;

void main () {
  gl_Position = model * vec4(position, 1);
  vTexCoords = texCoords;
}
