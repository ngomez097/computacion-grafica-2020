document.addEventListener('click', function (event) {
  console.log('click')
  console.log(event)
})

document.addEventListener('keyup', function (event) {
  console.log('keyup')
  console.log(event.keyCode)
})

document.addEventListener('keydown', function (event) {
  console.log('keydown')
  console.log(event)
})

document.addEventListener('keypress', function (event) {
  console.log('keypress')
  console.log(event)
})

let isPressed = false

document.addEventListener('mousedown', function (event) {
  isPressed = true
  console.log('mousedown')
  console.log(event)
})

document.addEventListener('mousemove', function (event) {
  if (isPressed) {
    console.log('mousemove')
    console.log(event)
  }
})

document.addEventListener('mouseup', function (event) {
  isPressed = false
  console.log('mouseup')
  console.log(event)
})
