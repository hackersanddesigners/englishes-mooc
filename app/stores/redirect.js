const ov = require('object-values')

function redirect (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    if (state.route !== '/') {
      if (localStorage.getItem('user_data') === null && localStorage.getItem('user_login') === 'false') {
        emitter.emit('pushState', '/')
        emitter.emit('render')
      }
    }
  })
}

module.exports = redirect
