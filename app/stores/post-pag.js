var ok = require('object-keys')
var ov = require('object-values')
var xhr = require('xhr')
var users = require('./users.json')

function post_pag (state, emitter) {
  const user_s = JSON.parse(localStorage.getItem('user_data'))
  if (user_s !== null) {
    const user = ok(users).filter(user => user === user_s.user.username)

    emitter.on('post-pag', (post_id, topic_n) => {
      console.log(post_id, topic_n)
      const page = ov(state.content).filter(page => page.uri === state.route)[0]
      const cat_id = page.content.cat_id

      if(state.components.cat !== undefined) {
        const topics = state.components.cat.topic_list.topics
        const topic = topics.filter(tag => tag.tags.includes(topic_n))

        if (topic.length > 0) {
          xhr({
            method: 'get',
            headers: {'Content-Type': 'multipart/form-data'},
            url: `https://forum.englishes-mooc.org/t/${ topic[0].id }/20.json?api_key=${users[user]}&api_username=${user[0]}`,
            json: true,
          }, function (err, resp, body) {
            if (err) throw err
            console.log('loading more posts')
            console.log(body)

            state.components.post_pag = body

          })

          emitter.emit('render')

        }
      }

    })

  }
}

module.exports = post_pag
