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
    // Para poder ver los ejes locales se descomento la siguiente linea.
    //fixedNormal = (f_MVMatrix * vec4(f_normals, 0.0)).xyz;
    fixedNormal = f_normals;
    fixedNormal = normalize(fixedNormal);
    fixedNormal = (fixedNormal + 1.0) / 2.0;

    gl_FragColor = vec4(fixedNormal, 1.0);
  } else {
    gl_FragColor = vec4(f_Color, 1.0);
  }
}
