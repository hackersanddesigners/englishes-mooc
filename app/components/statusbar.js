var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()

class statusbar extends nc {
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
        ${ items() }
      </div>
    `

    function items () {
      return ov(data.children).map(function (item) {
        return html`
          <div class="">
            ${ item.content.title }
          </div>
        `
      })
    }

  }

  update () {
    return true
  }

}

module.exports = statusbar
