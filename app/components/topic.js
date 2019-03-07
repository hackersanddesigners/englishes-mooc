var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var xhr = require('xhr')
var users = require('../stores/users.json')
var Discussion = require('./discussion')
var discussion = new Discussion()
var Reading = require('./reading')
var reading = new Reading()
var Assignment = require('./assignment')
var assignment = new Assignment()

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
      <div class="c12 pt1 pr1 pb1 pl1 copy">
        <div class="c12 x xdr xjb pb2">
          <button class="fs1 tdu">${ data.user.name }</button> 
          <button class="curp" onclick=${ logout(emit) }>Log out</button>
        </div>

        <div class="x xdr xjb pb2">
          <button class="${ state.disc_tab ? 'tdu ' : '' }ft-mn curp" onclick=${ disc_tab(emit) }>Discussion Board</button>
          <button class="${ state.read_tab ? 'tdu ' : '' }ft-mn curp" onclick=${ read_tab(emit) }>Further Reading</button>
          <button class="${ state.todo_tab ? 'tdu ' : '' }ft-mn curp" onclick=${ todo_tab(emit) }>To Do's</button>
        </div>

        <div class="posts">
         ${ blob() }
        </div>
      </div>
    `

    function logout (emit) {
      return function () { emit('log-out') }
    }

    function disc_tab (emit) {
      return function () { emit('disc-tab') }
    }

    function read_tab (emit) {
      return function () { emit('read-tab') }
    }

    function todo_tab (emit) {
      return function () { emit('todo-tab') }
    }

    function blob () {
      if(state.disc_tab === true) {
        return discussion.render(state, emit)
      }

      if(state.read_tab === true) {
        return reading.render(state, emit)
      }

      if(state.todo_tab === true) {
        return assignment.render(state, emit)
      }
    }

  }

  update () {
    return true
  }

  unload () {
    this.state.components.user_id = ''
  }

}

module.exports = topic
