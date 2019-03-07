var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var vimeo = require('@vimeo/player')

class video extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
    this.data = ''
  }

  createElement(state, data, emit) {
    this.state = state
    this.emit = emit
    this.data = data

    // console.log(data)

    return html`
      <div class="iframe-container psr">
        <button class="z4 psa b0 l0 bgc-wh p02-5">play</button>
      </div>
    `
  }

  load (el) {
    console.log(this.data)
    const player = new vimeo(el, {
      url: this.data,
      background: true,
      title: false,
      byline: false,
      portrait: false
    })

    this.state.components.video = player
  }

  update () {
    return true
  }

}

module.exports = video
