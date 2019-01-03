module.exports = clickhandle

function clickhandle (state, emitter) {
  state.toggle = true

  emitter.on('toggle', function (toggle) {
    state.toggle =! state.toggle
    emitter.emit('render')
  })

}
