var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()

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
      <div class="c6">
        <button onclick=${ close(emit) }>X</button>
        <h2>${ section.content.title }</h2> 
        ${ raw(md.render(section.content.text)) }
      </div>
    `

    function close (emit) {
      return function () { emit('close') }
    }
  }
  
}

module.exports = sidepage
