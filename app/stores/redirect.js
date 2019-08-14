const ov = require('object-values')

function redirect (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    if (state.route === '/') {
      const page = ov(state.content).filter(page => page.content.status === 'current')[0]

      if (localStorage.getItem('user_data') !== undefined && localStorage.getItem('user_login') === 'true') {
        emitter.emit('pushState', page.uri)
      }
    }
  })
}

module.exports = redirect
