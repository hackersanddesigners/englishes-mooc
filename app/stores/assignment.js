var ok = require('object-keys')
var xhr = require('xhr')
var users = require('./users.json')

function assignment (state, emitter) {
  const cat_id = '5'

  emitter.on('topic', () => {
    xhr({
      method: "get",
      headers: {"Content-Type": "multipart/form-data"},
      url: `https://forum.englishes-mooc.org/c/${ cat_id }.json?api_key=${users.system}&api_username=${ok(users)[0]}`,
      json: true,
    }, function (err, resp, body) {
      if (err) throw err
      // console.log(body)
      state.components.cat = body

      const topics = body.topic_list.topics
      const topic = topics.filter(tag => tag.tags.includes('assignment'))

      xhr({
        method: "get",
        headers: {"Content-Type": "multipart/form-data"},
        url: `https://forum.englishes-mooc.org/t/${ topic[0].id }.json?api_key=${users.system}&api_username=${ok(users)[0]}`,
        json: true,
      }, function (err, resp, body) {
        if (err) throw err
        console.log(body)

        state.components.assignment = body
      })

    })
    emitter.emit('render')
  })

}

module.exports = assignment
