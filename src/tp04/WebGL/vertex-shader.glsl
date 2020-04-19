#ifdef GL_ES
precision highp float;
precision mediump int;
#endif

attribute vec3 a_VertexPosition;
attribute vec3 a_VertexNormal;

uniform mat4 u_MVMatrix;
uniform mat4 u_VMatrix;
uniform mat4 u_PMatrix;
uniform int u_numPointLights;

varying vec3 f_normals;
varying vec3 f_vertex_position;

vec4 pos;

void main(void) {
  f_normals = (u_MVMatrix * vec4(a_VertexNormal, 0.0)).xyz;

  pos = vec4(a_VertexPosition, 1.0);
  pos = u_MVMatrix * pos;

  f_vertex_position = pos.xyz;

  pos = u_VMatrix * pos;
  pos = u_PMatrix * pos;
  gl_Position = pos;
}
