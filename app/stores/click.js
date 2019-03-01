module.exports = clickhandle

function clickhandle (state, emitter) {
  state.toggle = true

  emitter.on('close', function (close) {
    console.log(close)
    state.sidebar =! state.sidebar
    emitter.emit('render')
  })

  emitter.on('toggle', function (toggle) {
    console.log(toggle)
    state.components.sidepage = toggle
    state.sidebar =! state.sidebar

    emitter.emit('render')
  })

}
