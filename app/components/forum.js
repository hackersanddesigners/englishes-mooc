var ok = require('object-keys')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var xhr = require('xhr')
var users = require('../stores/users.json')

class forum extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
    this.data = { }
    this.getPosts = this.getPosts.bind(this)
  }

  createElement(state, data, emit) {
    this.state = state
    this.emit = emit
    this.data = data

    return html`
      <div class="c6 pt1 pr1 pb1 pl1 copy">
        <button class="curp" onclick=${ logout(emit) }>Log out</button>
        <h2>${ data.user.name }</h2> 
        ${ this.getPosts() }
      </div>
    `

    function logout (emit) {
      return function () { emit('log-out') }
    }
  }

  update () {
    return true
  }

  unload () {
    this.state.components.user_id = ''
  }

  getPosts() {
    xhr({
      method: "get",
      headers: {"Content-Type": "multipart/form-data"},
      url: `https://forum.englishes-mooc.org/posts.json?api_key=${users.system}&api_username=${ok(users)[0]}`,
      json: true,
    }, function (err, resp, body) {
      if (err) throw err

      // console.log(body)
    })

  }

}

module.exports = forum
