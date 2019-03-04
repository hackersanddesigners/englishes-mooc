var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var signup = require('./signup')

class sidepage extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
    this.section = { }
  }

  createElement(state, section, emit) {
    this.state = state
    this.section = section
    this.emit = emit

    return html`
      <div class="c6 pt1 pr1 pb1 pl1 copy">
        <button class="curp" onclick=${ close(emit) }>X</button>
        <h2>${ section.content.title }</h2> 
        ${ raw(md.render(section.content.text)) }
        ${ signup_field() }
      </div>
    `

    function close (emit) {
      return function () { emit('close') }
    }

    function signup_field () {
      if(section.id === 'signup') {
        return signup()
      }
    }

  }

  update () {
    return true
  }
  
}

module.exports = sidepage
