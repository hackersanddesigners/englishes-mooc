const ok = require('object-keys')
const ov = require('object-values')
const xhr = require('xhr')
const xhr_call = require('./xhr-call')

function fetch_topic (state, emitter, page, cat_id) {
  if (JSON.parse(localStorage.getItem('user_data')) !== null) {
    const user_s = JSON.parse(localStorage.getItem('user_data')).user
    const user = {
      id: user_s.id,
      username: user_s.username,
      name: user_s.name
    }

    state.components.disc_posts = []

    const posts_opts = {
      cat_id: cat_id,
      username: user.username
    }

    xhr_call.getPosts(posts_opts, (err, resp, body) => {
      if (err) throw err
      state.components.cat = body

      if (state.components.cat !== undefined) {
        const topics = state.components.cat.topic_list.topics
        const disc = topics.filter(tag => tag.tags.includes('discussion'))

        if (disc.length > 0) {
          const disc_opts = {
            topic_id: disc[0].id,
            username: user.username
          }

          xhr_call.getTopic(disc_opts, (err, resp, body) => {
            if (err) throw err
            state.components.discussion = body

            if (body.post_stream !== undefined) {
              let posts = body.post_stream.posts
              posts.forEach(function (post) {
                if (ov(state.components.disc_posts).filter(item => item.id !== post.id)) {
                  state.components.disc_posts.push(post)
                }
              })

              emitter.emit('render')
            }
          })
        }
      }
    })
  }
}

module.exports = fetch_topic
