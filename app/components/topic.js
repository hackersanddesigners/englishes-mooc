var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var xhr = require('xhr')
var users = require('../stores/users.json')

class topic extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
    this.data = { }
  }

  createElement(state, data, emit) {
    this.state = state
    this.emit = emit
    this.data = data

    return html`
      <div class="c6 pt1 pr1 pb1 pl1 copy">
        <button class="curp" onclick=${ logout(emit) }>Log out</button>
        <h2>${ data.user.name }</h2> 
        <div>
         ${ topic() }
        </div>
      </div>
    `

    function logout (emit) {
      return function () { emit('log-out') }
    }

    function topic () {
      if (state.components.topic !== undefined) {
        return ov(state.components.topic.post_stream.posts).map(function (post) {
          return html`
            <div class="pb1" style="border-bottom: 1px solid black">
              ${ raw(post.cooked) }
            </div>
          `
        })
      }
    }
  }

  update () {
    return true
  }

  unload () {
    this.state.components.user_id = ''
  }

  load(el) {
    // const post_id = '47'

    // xhr({
    //   method: "get",
    //   headers: {"Content-Type": "multipart/form-data"},
    //   url: `https://forum.englishes-mooc.org/posts/${ post_id }.json?api_key=${users.system}&api_username=${ok(users)[0]}`,
    //   json: true,
    // }, function (err, resp, body) {
    //   if (err) throw err
    //   console.log(body)

    //   state.components.topic = body
    //   emit('topic')

    // })

    // this.emit('topic')

  }

}

module.exports = topic
