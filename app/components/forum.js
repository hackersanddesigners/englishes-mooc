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
  }

  createElement(state, data, emit) {
    this.state = state
    this.emit = emit
    this.data = data

    const user_s = JSON.parse(localStorage.getItem('user_data'))
    const user = ok(users).filter(user => user === user_s.user.username)

    console.log(user_s, user)

    return html`
      <div class="c12 pt1 pr1 pb1 pl1 copy">
        <div class="c12 x xdr xjb pb2">
          <button class="fs1 tdu">${ data.user.name }</button> 
          <button class="curp" onclick=${ logout(emit) }>Log out</button>
        </div>
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

}

module.exports = forum
