var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()

class reading extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
  }

  createElement(state, emit) {
    this.state = state
    this.emit = emit

    return html`
      <div class="c12 pt1 pr1 pb1 pl1 copy">
        <div class="pb1 bb-bk">
          <p>Downloads and links</p>
          <p>Here you can find additional material such as texts, videos or audio recordings for your classes.</p>
        </div>
        <div class="pt1">
        ${ raw(md.render(state.page.content.reading)) }
        </div>
      </div>
    `

  }

  update () {
    return true
  }

}

module.exports = reading
