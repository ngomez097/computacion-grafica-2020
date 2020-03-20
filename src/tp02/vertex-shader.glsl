attribute vec3 aVertexPosition;
uniform float xFactor;
uniform float yFactor;

void main(void) {
  gl_Position = vec4(aVertexPosition.x * xFactor
  , aVertexPosition.y * yFactor
  , aVertexPosition.z
  , 1.0);
}
