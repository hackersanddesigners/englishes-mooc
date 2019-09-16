const ok = require('object-keys')
const ov = require('object-values')
const xhr = require('xhr')
const xhr_call = require('./xhr-call')

function fetch_topic (state, emitter, page, cat_id) {
  const user_s = JSON.parse(localStorage.getItem('user_data')).user
  if (user_s !== null) {
    const user = {
      id: user_s.id,
      username: user_s.username,
      name: user_s.name
    }

    state.components.disc_posts = []
    state.components.todo_posts = []

    const posts_opts = {
      cat_id: cat_id,
      user: user.username
    }

    xhr_call.getPosts(posts_opts, (err, resp, body) => {
      if (err) throw err
      state.components.cat = body

      if (state.components.cat !== undefined) {
        const topics = state.components.cat.topic_list.topics
        
        const disc = topics.filter(tag => tag.tags.includes('discussion'))
        const todo = topics.filter(tag => tag.tags.includes('assignment'))

        if (disc.length > 0) {
          const disc_opts = {
            topic_id: disc[0].id,
            user: user.username
          }

          xhr_call.getTopic(disc_opts, (err, resp, body) => {
            if (err) throw err
            state.components.discussion = body

            let posts = body.post_stream.posts
            posts.forEach(function (post) {
              if (ov(state.components.disc_posts).filter(item => item.id !== post.id)) {
                state.components.disc_posts.push(post)
              }
            })

            emitter.emit('render')
          })
        }

        if (todo.length > 0) {
          const todo_opts = {
            topic_id: todo[0].id,
            user: user.username
          }

          // xhr_call.getTopic(todo_opts, (err, resp, body) => {
          //   if (err) throw err
          //   state.components.assignment = body

          //   let posts = body.post_stream.posts
          //   posts.forEach(function (post) {
          //     if (ov(state.components.todo_posts).filter(item => item.id !== post.id)) {
          //       state.components.todo_posts.push(post)
          //     }
          //   })

          //   emitter.emit('render')
          // })
        }

      }
    })
  }
}

module.exports = fetch_topic
