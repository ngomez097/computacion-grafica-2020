attribute vec4 aPosition;
attribute vec2 aTexcoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

varying vec2 vTexcoord;

void main() {
  vTexcoord = aTexcoord;
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
}
