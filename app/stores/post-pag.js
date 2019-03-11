var ok = require('object-keys')
var ov = require('object-values')
var xhr = require('xhr')
var users = require('./users.json')

function post_pag (state, emitter) {
  const user_s = JSON.parse(localStorage.getItem('user_data'))
  if (user_s !== null) {
    const user = ok(users).filter(user => user === user_s.user.username)

    emitter.on('post-pag', (post_id, topic_n) => {
      let page
      let cat_id

      if (state.route !== '/') {
        page = ov(state.content).filter(page => page.uri === state.route)[0]
        cat_id = page.content.cat_id
      } else {
        page = ov(state.content).filter(page => page.content.status === 'current')[0]
        cat_id = page.content.cat_id
      }

      if(state.components.cat !== undefined) {
        const topics = state.components.cat.topic_list.topics
        const topic = topics.filter(tag => tag.tags.includes(topic_n))

        if (topic.length > 0) {
          xhr({
            method: 'get',
            headers: {'Content-Type': 'multipart/form-data'},
            url: `https://forum.englishes-mooc.org/t/${ topic[0].id }/${ post_id || 20 }.json?api_key=${users[user]}&api_username=${user[0]}`,
            json: true,
          }, function (err, resp, body) {
            if (err) throw err
            console.log(body)
            let comp_n = topic_n + '_pag'
            // state.components.post_pag = body
            state.components[comp_n] = body

            const posts = ov(body.post_stream.posts).filter(post => post.user_deleted === false)
            const post_tot = posts.length -1
            const post_n_l = posts[post_tot].post_number
            const stream = ov(body.post_stream.stream)
            const stream_tot = stream.length -1

            if(post_n_l < stream_tot) {
              state.components.loadmore = true
            } else {
              state.components.loadmore = false
            }

          })

          emitter.emit('render')

        }
      }

    })

    emitter.on('loadmore', () => {
      emitter.emit('render')
    })

  }
}

module.exports = post_pag
