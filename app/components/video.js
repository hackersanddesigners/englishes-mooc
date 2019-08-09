var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var Vimeo = require('@vimeo/player')

class video extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
    this.data = ''
    this.i = null
  }

  createElement (state, emit, data, i) {
    this.state = state
    this.emit = emit
    this.data = data
    this.i = i

    var url_split = data.split('://')
    var vcode = url_split[1].split('/')
    var embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]

    return html`
      <div class="iframe-container psr">
        <iframe src="${embed}?title=0&byline=0&portrait=0&api=1&background=0&controls=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
        <button onclick=${this.player_toggle(this.i, this.emit)} class="controls z5 psa curp bgc-wh">Play</button>
      </div>
    `
  }

  load (el) {
    const player = new Vimeo(el.querySelector('iframe'))
    this.state.components.vplayer = player
  }

  update (el) {
    const player = this.state.components.vplayer
    console.log(player)
    // const video = new Vimeo(player.element)
    return true
  }

  player_toggle (i, emit) {
    return function () { emit('video-toggle', i) }
  }
}

module.exports = video
