attribute vec4 aPosition;
attribute vec4 aColor;

varying vec4 vColor;

void main() {
  gl_Position = aPosition;
  vColor = aColor;
  gl_PointSize = 10.0;
}
