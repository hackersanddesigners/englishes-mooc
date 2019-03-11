var ok = require('object-keys')
var ov = require('object-values')
var xhr = require('xhr')
var users = require('./users.json')

function forum (state, emitter) {
  

    state.components.disc_posts = []
    state.components.todo_posts = []

    emitter.on('DOMContentLoaded', () => {
      let page
      let cat_id

      if (state.route !== '/') {
        page = ov(state.content).filter(page => page.uri === state.route)[0]
        cat_id = page.content.cat_id
      } else {
        page = ov(state.content).filter(page => page.content.status === 'current')[0]
        cat_id = page.content.cat_id
      }

      return fetch_topic (page, cat_id)
    })

    emitter.on('log-in', () => {
      let page
      let cat_id

      if (state.route !== '/') {
        page = ov(state.content).filter(page => page.uri === state.route)[0]
        cat_id = page.content.cat_id
      } else {
        page = ov(state.content).filter(page => page.content.status === 'current')[0]
        cat_id = page.content.cat_id
      }

      return fetch_topic (page, cat_id)
    })


    function fetch_topic (page, cat_id) {
      const user_s = JSON.parse(localStorage.getItem('user_data'))
      if (user_s !== null) {
        const user = ok(users).filter(user => user === user_s.user.username)

        xhr({
          method: 'get',
          headers: {'Content-Type': 'multipart/form-data'},
          url: `https://forum.englishes-mooc.org/c/${ cat_id }.json?api_key=${users[user]}&api_username=${user[0]}`,
          json: true,
        }, function (err, resp, body) {
          if (err) throw err
          console.log(body)
          state.components.cat = body

          if(state.components.cat !== undefined) {
            const topics = state.components.cat.topic_list.topics
            const disc = topics.filter(tag => tag.tags.includes('discussion'))
            const todo = topics.filter(tag => tag.tags.includes('assignment'))

            if (disc.length > 0) {
              xhr({
                method: 'get',
                headers: {'Content-Type': 'multipart/form-data'},
                url: `https://forum.englishes-mooc.org/t/${ disc[0].id }.json?api_key=${users[user]}&api_username=${user[0]}`,
                json: true,
              }, function (err, resp, body) {
                if (err) throw err
                console.log(body)
                state.components.discussion = body

                const posts = body.post_stream.posts
                posts.forEach(function (post) {
                  state.components.disc_posts.push(post)
                })

                emitter.emit('render')
              })
            }

            if (todo.length > 0) {
              xhr({
                method: 'get',
                headers: {'Content-Type': 'multipart/form-data'},
                url: `https://forum.englishes-mooc.org/t/${ todo[0].id }.json?api_key=${users[user]}&api_username=${user[0]}`,
                json: true,
              }, function (err, resp, body) {
                if (err) throw err
                console.log(body)
                state.components.assignment = body

                const posts = body.post_stream.posts
                posts.forEach(function (post) {
                  state.components.todo_posts.push(post)
                })

                emitter.emit('render')
              })
            }
          }
        })
      }

  }
}

module.exports = forum
