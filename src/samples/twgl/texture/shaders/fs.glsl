precision mediump float;

varying vec2 vTexCoord;

uniform vec3 uColor;
uniform sampler2D uTexture;

void main() {
  // gl_FragColor = vec4(uColor, 1.0) * texture2D(uTexture, vTexCoord);
  gl_FragColor = texture2D(uTexture, vTexCoord);
}
