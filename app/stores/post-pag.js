const ok = require('object-keys')
const ov = require('object-values')
const xhr_call = require('../components/xhr-call.js')

function post_pag (state, emitter) {
  if (JSON.parse(localStorage.getItem('user_data')) !== null) {
    const user_s = JSON.parse(localStorage.getItem('user_data')).user
    const user = {
      id: user_s.id,
      username: user_s.username,
      name: user_s.name
    }
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

      if (state.components.cat !== undefined) {
        const topics = state.components.cat.topic_list.topics
        const topic = topics.filter(tag => tag.tags.includes(topic_n))

        if (topic.length > 0) {
          const opts = {
            topic_id: `${topic[0].id}/${post_id || 20}`,
            user: user
          }

          xhr_call.getTopic(opts, (err, resp, body) => {
            if (err) throw err
            console.log(body)
            state.components.post_pag = body

            if (body.errors) {
              console.log(body.errors[0])
            }

            if (topic_n === 'discussion') {
              state.components.discussion_pag = body
            } else if (topic_n === 'assignment'){
              state.components.assignment_pag = body
            }

            const posts = ov(body.post_stream.posts).filter(post => post.user_deleted === false)
            const post_tot = posts.length - 1
            const post_n_l = posts[post_tot].post_number
            const stream = ov(body.post_stream.stream)
            const stream_tot = stream.length - 1

            if (post_n_l < stream_tot) {
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
  } else {
    console.log('no localStorage')
  }
}

module.exports = post_pag
