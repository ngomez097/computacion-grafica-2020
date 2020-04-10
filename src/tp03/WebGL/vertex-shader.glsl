attribute vec3 a_VertexPosition;
attribute vec3 a_VertexNormal;

uniform vec3 u_Color;
uniform mat4 u_MVMatrix;
uniform mat4 u_VMatrix;
uniform mat4 u_PMatrix;

varying vec3 f_Color;
varying vec3 f_normals;

vec4 pos;


void main(void) {
  f_normals = normalize(a_VertexNormal);
  f_Color = u_Color;

  pos = vec4(a_VertexPosition, 1.0);
  pos = u_MVMatrix * pos;
  pos = u_VMatrix * pos;
  pos = u_PMatrix * pos;
  gl_Position = pos;
}
