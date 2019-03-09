var ok = require('object-keys')
var ov = require('object-values')
var xhr = require('xhr')
var users = require('./users.json')

function discussion (state, emitter) {
  const user_s = JSON.parse(localStorage.getItem('user_data'))
  if (user_s !== null) {
    const user = ok(users).filter(user => user === user_s.user.username)

    emitter.on('discussion', () => {
      const page = ov(state.content).filter(page => page.uri === state.route)[0]
      const cat_id = page.content.cat_id

      if(state.components.cat !== undefined) {
        const topics = state.components.cat.topic_list.topics
        const topic = topics.filter(tag => tag.tags.includes('discussion'))

        if (topic.length > 0) {
          xhr({
            method: 'get',
            headers: {'Content-Type': 'multipart/form-data'},
            url: `https://forum.englishes-mooc.org/t/${ topic[0].id }.json?api_key=${users[user]}&api_username=${user[0]}`,
            json: true,
          }, function (err, resp, body) {
            if (err) throw err
            console.log(body)
            state.components.discussion = body
          })

          emitter.emit('render')
        }
      }

    })

  }
}

module.exports = discussion
