attribute vec4 aPosition;

uniform mat4 uModelMatrix;
uniform vec4 uColor;

varying vec4 vColor;

void main() {
  gl_Position = uModelMatrix * aPosition;
  vColor = uColor;
}
