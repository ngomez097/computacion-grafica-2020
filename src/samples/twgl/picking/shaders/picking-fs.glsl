precision mediump float;

uniform vec3 uPickingColor;

void main() {
  gl_FragColor = vec4(uPickingColor, 1.0 );
}
