attribute vec4 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

uniform mat4 uModelMatrix;

void main() {
  gl_Position = uModelMatrix * aPosition;
  vTexCoord = aTexCoord;
}
