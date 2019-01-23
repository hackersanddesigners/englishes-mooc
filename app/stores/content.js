var xhr = require('xhr')

module.exports = content 

function content (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    xhr.get({
      uri: '/spad',
      json: true
    }, function (err, resp, body) {
      if(err) throw err

      console.log(body)
      const data = body.data

      state.data = data
      emitter.emit('render')
    })
  })
}
