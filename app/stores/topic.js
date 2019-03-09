var ok = require('object-keys')
var ov = require('object-values')
var xhr = require('xhr')
var users = require('./users.json')

function topic (state, emitter) {
  const user_s = JSON.parse(localStorage.getItem('user_data'))
  if (user_s !== null) {
    const user = ok(users).filter(user => user === user_s.user.username)

    emitter.on('topic', () => {
      const page = ov(state.content).filter(page => page.uri === state.route)[0]
      const cat_id = page.content.cat_id

      xhr({
        method: 'get',
        headers: {'Content-Type': 'multipart/form-data'},
        url: `https://forum.englishes-mooc.org/c/${ cat_id }.json?api_key=${users[user]}&api_username=${ok(users)[0]}`,
        json: true,
      }, function (err, resp, body) {
        if (err) throw err
        // console.log(body)
        state.components.cat = body
      })

      emitter.emit('render')
    })

  }

}

module.exports = topic
