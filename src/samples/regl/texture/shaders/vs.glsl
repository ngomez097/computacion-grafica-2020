precision mediump float;

attribute vec3 position;
attribute vec2 texCoord;
varying vec2 vTexCoord;
void main() {
  gl_Position = vec4(position, 1);
  vTexCoord = texCoord;
}
