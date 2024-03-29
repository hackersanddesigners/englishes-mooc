const ov = require('object-values')

function redirect (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    let user_data = JSON.parse(localStorage.getItem('user_data'))
    if (user_data !== null) {
      if (user_data.username === 'vu' && localStorage.getItem('user_login') === 'true') {
        if (state.route !== '/') {
          emitter.emit('pushState', '/course/module-03')
          emitter.emit('render')
        }
      } else if (state.route !== '/') {
        if (localStorage.getItem('user_data') === null && localStorage.getItem('user_login') === 'true') {
          emitter.emit('pushState', '/')
          emitter.emit('render')
        }
      }
    }
  })

  emitter.on('log-in', () => {
    const user_data = JSON.parse(localStorage.getItem('user_data'))

    if (user_data.username === 'vu' && localStorage.getItem('user_login') === 'true') {
      if (state.route !== '/') {
        emitter.emit('pushState', '/course/module-03')
        emitter.emit('render')
      }
    } else if (state.route !== '/') {
      if (localStorage.getItem('user_data') === null && localStorage.getItem('user_login') === 'true') {
        emitter.emit('pushState', '/')
        emitter.emit('render')
      }
    }
  })
}

module.exports = redirect
