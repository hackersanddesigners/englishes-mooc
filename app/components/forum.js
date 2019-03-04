var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()

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

    return html`
      <div class="c6 pt1 pr1 pb1 pl1 copy">
        <button class="curp" onclick=${ logout(emit) }>Log out</button>
        <h2>${ data.user.name }</h2> 
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
