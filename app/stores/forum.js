var ok = require('object-keys')
var ov = require('object-values')
var xhr = require('xhr')
var users = require('./users.json')
var fetch_topic = require('../components/fetch-topic')

function forum (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    let page
    let cat_id

    if (state.href !== '/hkw') {
      if (state.route !== '/') {
        page = ov(state.content).filter(page => page.uri === state.route)[0]
        cat_id = page.content.cat_id
      } else {
        page = ov(state.content).filter(page => page.content.status === 'current')[0]
        cat_id = page.content.cat_id
      }

      return fetch_topic(state, emitter, page, cat_id)
    }
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

    return fetch_topic(state, emitter, page, cat_id)
  })

}

module.exports = forum
