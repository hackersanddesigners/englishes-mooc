module.exports = clickhandle

function clickhandle (state, emitter) {
  state.sidebar = false
  state.login = false

  emitter.on('close', function (close) {
    state.sidebar = false
    state.login = false
    emitter.emit('render')
  })

  emitter.on('login', function (login) {
    state.login =! state.login
    state.sidebar =! state.sidebar
    emitter.emit('render')
  })

  emitter.on('section', function (section) {
    state.components.sidepage = section
    state.sidebar =! state.sidebar
    emitter.emit('render')
  })

}
