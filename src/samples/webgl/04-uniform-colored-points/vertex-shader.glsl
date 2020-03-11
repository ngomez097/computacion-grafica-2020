attribute vec4 aPosition;

uniform vec4 uColor;

varying vec4 vColor;

void main() {
  gl_Position = aPosition;
  vColor = uColor;
  gl_PointSize = 10.0;
}
