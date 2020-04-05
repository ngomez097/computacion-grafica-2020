#ifdef GL_ES
precision highp float;
#endif

varying vec3 f_Color;


void main(void) {
  gl_FragColor = vec4(f_Color, 1.0);
}
