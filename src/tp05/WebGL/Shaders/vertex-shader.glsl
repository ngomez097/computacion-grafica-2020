#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

attribute vec3 a_VertexPosition;
attribute vec3 a_VertexNormal;
attribute vec3 a_VertexTangent;
attribute vec3 a_VertexBitangent;
attribute vec2 a_TextureCoordinates;

uniform mat4 u_MVMatrix;
uniform mat4 u_MVInverseTransposeMatrix;
uniform mat4 u_VMatrix;
uniform mat4 u_PMatrix;
uniform int u_numPointLights;

varying vec3 f_normals;
varying vec3 f_tangent;
varying vec3 f_bitangent;
varying vec3 f_vertex_position;
varying vec2 f_textureCoordinates;

vec4 pos;
mat4 InverseTranspose;

void main(void) {
  f_normals = (u_MVInverseTransposeMatrix * vec4(a_VertexNormal, 0.0)).xyz;
  f_tangent = (u_MVInverseTransposeMatrix * vec4(a_VertexTangent, 0.0)).xyz;
  f_bitangent = (u_MVInverseTransposeMatrix * vec4(a_VertexBitangent, 0.0)).xyz;

  pos = vec4(a_VertexPosition, 1.0);
  pos = u_MVMatrix * pos;

  f_vertex_position = pos.xyz;
  f_textureCoordinates = a_TextureCoordinates;

  pos = u_VMatrix * pos;
  pos = u_PMatrix * pos;
  gl_Position = pos;
}
