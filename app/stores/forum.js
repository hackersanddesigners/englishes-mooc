const ov = require('object-values')
const fetch_topic = require('../components/fetch-topic')

function forum (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    let page
    let cat_id

    const user_data = JSON.parse(localStorage.getItem('user_data'))

    if (state.href !== '/hkw' && user_data.user.username !== 'vu' && localStorage.getItem('user_login') === 'false') {
      if (state.route !== '/') {
        page = ov(state.content).filter(page => page.uri === state.route)[0]
        cat_id = page.content.cat_id
      } else {
        page = ov(state.content).filter(page => page.content.status === 'current')[0]
        cat_id = page.content.cat_id
      }
    } else if (user_data.user.username === 'vu') {
      page = ov(state.content).filter(page => page.uid === 'module-03')[0]
      cat_id = page.content.cat_id
    }

    return fetch_topic(state, emitter, page, cat_id)
  })

  emitter.on('log-in', () => {
    let page
    let cat_id

    const user_data = JSON.parse(localStorage.getItem('user_data'))

    if (user_data.user.username !== 'vu' && localStorage.getItem('user_login') === 'false') { 
      if (state.route !== '/') {
        page = ov(state.content).filter(page => page.uri === state.route)[0]
        cat_id = page.content.cat_id
      } else {
        page = ov(state.content).filter(page => page.content.status === 'current')[0]
        cat_id = page.content.cat_id
      }
    } else if (user_data.user.username === 'vu') {
      console.log('vu vu vu')
      page = ov(state.content).filter(page => page.uid === 'module-03')[0]
      cat_id = page.content.cat_id
    }

    return fetch_topic(state, emitter, page, cat_id)
  })
}

module.exports = forum
