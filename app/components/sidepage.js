const nc = require('nanocomponent')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Markdown = require('markdown-it')
const md = new Markdown()

class sidepage extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
    this.section = { }
  }

  createElement (state, section, emit) {
    this.state = state
    this.section = section
    this.emit = emit

    return html`
      <div class="c12 pt1 pr2 pb1 pl2 copy">
        <button class="psf t0 r0 pr1 ft-mn fs2-4 curp" onclick=${close(emit)}>x</button>
        <h2 class="ft-mn fs2 tac">${section.content.title}</h2> 
        ${raw(md.render(section.content.text))}
      </div>
    `

    function close (emit) {
      return function () { emit('close') }
    }
  }

  update () {
    return true
  }
}

module.exports = sidepage
