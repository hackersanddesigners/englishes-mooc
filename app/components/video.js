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
    this.url = ''
    this.i = null
  }

  createElement (state, emit, url, i) {
    this.state = state
    this.emit = emit
    this.url = url
    this.i = i

    var url_split = url.split('://')
    var vcode = url_split[1].split('/')
    var embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]

    return html`
      <div class="iframe-container psr">
        <iframe src="${embed}?title=0&byline=0&portrait=0&api=1&background=0&controls=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
        <button onclick=${this.player_toggle(this.i, this.vplayer, this.emit)} class="controls z5 psa curp bgc-wh">Play</button>
      </div>
    `
  }

  load (el) {
    this.vplayer = new Vimeo(el.querySelector('iframe'))
    return this.vplayer
  }

  update (el) {
    return false
  }

  player_toggle (i, video, emit) {
    return () => { emit('video-toggle', i, this.vplayer) }
  }
}

module.exports = video
