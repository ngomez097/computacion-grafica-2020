#ifdef GL_ES
precision highp float;
#endif

uniform int f_UseNormal;
uniform mat4 f_MVMatrix;


varying vec3 f_Color;
varying vec3 f_normals;

vec3 fixedNormal;

void main(void) {
  if (f_UseNormal == 1) {
    fixedNormal = normalize(f_normals);
    fixedNormal.x = (fixedNormal.x + 1.0) / 2.0;
    fixedNormal.y = (fixedNormal.y + 1.0) / 2.0;
    fixedNormal.z = (fixedNormal.z + 1.0) / 2.0;
    gl_FragColor = vec4(fixedNormal, 1.0);
  } else {
    gl_FragColor = vec4(f_Color, 1.0);
  }
}
