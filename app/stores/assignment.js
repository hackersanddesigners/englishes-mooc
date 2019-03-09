var ok = require('object-keys')
var ov = require('object-values')
var xhr = require('xhr')
var users = require('./users.json')

function assignment (state, emitter) {
  emitter.on('topic', () => {
    const page = ov(state.content).filter(page => page.uri === state.route)[0]
    const cat_id = page.content.cat_id

    xhr({
      method: "get",
      headers: {"Content-Type": "multipart/form-data"},
      url: `https://forum.englishes-mooc.org/c/${ cat_id }.json?api_key=${users.system}&api_username=${ok(users)[0]}`,
      json: true,
    }, function (err, resp, body) {
      if (err) throw err
      console.log(body)
      state.components.cat = body

      if(body !== undefined && !('assignment' in state.components)) {
        const topics = body.topic_list.topics
        const topic = topics.filter(tag => tag.tags.includes('assignment'))

        if (topic.lenght > 0) {
          xhr({
            method: "get",
            headers: {"Content-Type": "multipart/form-data"},
            url: `https://forum.englishes-mooc.org/t/${ topic[0].id }.json?api_key=${users.system}&api_username=${ok(users)[0]}`,
            json: true,
          }, function (err, resp, body) {
            if (err) throw err
            // console.log(body)

            state.components.assignment = body

            if ('assignment' in state.components) {
              console.log('state.components.assignment')
            }
          })
        }

      }

    })
    emitter.emit('render')
  })

}

module.exports = assignment
