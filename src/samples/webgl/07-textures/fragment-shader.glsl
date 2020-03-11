precision mediump float;

uniform sampler2D uSampler;
uniform bool uUseTexture;

varying vec4 vColor;
varying vec2 vTexCoord;

void main() {
  if (uUseTexture) {
    gl_FragColor = vColor * texture2D(uSampler, vTexCoord);
  } else {
    gl_FragColor = vColor;
  }
}
