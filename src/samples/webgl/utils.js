/**
 * Resize canvas if needed
 * @see https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html
 */
function resizeCanvas (canvas) {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  if (canvas.width !== width ||
      canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }
}

module.exports = {
  resizeCanvas
}
