const ov = require('object-values')

function redirect (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    if (state.route === '/') {
      if (localStorage.getItem('user_data') !== undefined && localStorage.getItem('user_login') === 'true') {
        emitter.emit('pushState', page.uri)
      }
    }
  })
}

module.exports = redirect
