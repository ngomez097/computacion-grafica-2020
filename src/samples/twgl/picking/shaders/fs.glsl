precision mediump float;

uniform sampler2D uColor;

varying vec2 vTexcoord;

void main() {
  gl_FragColor = texture2D(uColor, vTexcoord);
}
