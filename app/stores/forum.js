const ov = require('object-values')
const fetch_topic = require('../components/fetch-topic')

function forum (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    let page
    let cat_id

    let user_data = JSON.parse(localStorage.getItem('user_data'))
    if (user_data !== null) {
      if (state.href !== '/hkw' && user_data.user.username !== 'vu') {
        if (state.route !== '/') {
          page = ov(state.content).filter(page => page.uri === state.route)[0]
          cat_id = page !== undefined ? page.content.cat_id : null
        } else {
          page = ov(state.content).filter(page => page.content.status === 'current')[0]
          cat_id = page !== undefined ? page.content.cat_id : null
        }
      } else if (user_data.user.username === 'vu') {
        page = ov(state.content).filter(page => page.uid === 'module-03')[0]
        cat_id = page !== undefined ? page.content.cat_id : null
      }
    }

    // if all modules are close, do not run fetch_topic
    // and set `state.components.disc_posts = []`
    if (cat_id !== null) {
      return fetch_topic(state, emitter, page, cat_id)
    } else {
      state.components.discussion = null
      emitter.emit('render')
    }
  })

  emitter.on('log-in', () => {
    let page
    let cat_id
    const user_data = JSON.parse(localStorage.getItem('user_data'))

    if (user_data.user.username !== 'vu') {
      if (state.route !== '/') {
        page = ov(state.content).filter(page => page.uri === state.route)[0]
        cat_id = page !== undefined ? page.content.cat_id : null
      } else {
        page = ov(state.content).filter(page => page.content.status === 'current')[0]
        cat_id = page !== undefined ? page.content.cat_id : null
      }
    } else if (user_data.user.username === 'vu') {
      page = ov(state.content).filter(page => page.uid === 'module-03')[0]
      cat_id = page !== undefined ? page.content.cat_id : null
    }

    // if all modules are close, do not run fetch_topic
    // and set `state.components.disc_posts = []`
    if (cat_id !== null) {
      return fetch_topic(state, emitter, page, cat_id)
    } else {
      state.components.discussion = null
      emitter.emit('render')
    }
  })
}

module.exports = forum
