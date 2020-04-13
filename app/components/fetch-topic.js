const ok = require('object-keys')
const ov = require('object-values')
const xhr = require('xhr')
const xhr_call = require('./xhr-call')

function fetch_topic (state, emitter, emit, page, cat_id) {
  if (localStorage.getItem('user_data') !== null && typeof JSON.parse(localStorage.getItem('user_data')) !== 'string') {

    // check if old-format `user_data`
    let user_data = JSON.parse(localStorage.getItem('user_data'))
    if ('user_badges' in user_data) {
      console.log('old ls')

      // log out
      emit('log-out')
      emitter.emit('render')
    } else {
      const user = JSON.parse(localStorage.getItem('user_data'))
      console.log('*new* ls', cat_id)

      state.components.disc_posts = []

      const posts_opts = {
        cat_id: cat_id,
        username: user.username
      }

      console.log(posts_opts)

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
}

module.exports = fetch_topic
