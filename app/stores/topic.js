var ok = require('object-keys')
var xhr = require('xhr')
var users = require('./users.json')

function topic (state, emitter) {
  const cat_id = '5'

  emitter.on('topic', () => {
    xhr({
      method: "get",
      headers: {"Content-Type": "multipart/form-data"},
      url: `https://forum.englishes-mooc.org/c/${ cat_id }.json?api_key=${users.system}&api_username=${ok(users)[0]}`,
      json: true,
    }, function (err, resp, body) {
      if (err) throw err
      // console.log(body)
      state.components.cat = body
    })

    emitter.emit('render')
  })

}

module.exports = topic
