const nc = require('nanocomponent')
const html = require('choo/html')
const Vimeo = require('@vimeo/player')

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

    const url_split = url.split('://')
    const vcode = url_split[1].split('/')
    const embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]

    return html`
      <div class="iframe-container psr">
        <iframe src="${embed}?title=0&byline=0&portrait=0&api=1&background=0&controls=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
        <button onclick=${this.player_toggle(this.i, this.vplayer, this.emit)} class="controls z5 psa curp bgc-wh">${this.state.videos[i] ? 'Pause' : 'Play'}</button>
      </div>
    `
  }

  load (el) {
    this.vplayer = new Vimeo(el.querySelector('iframe'))
    return this.vplayer
  }

  update (el) {
    return true
  }

  player_toggle (i, video, emit) {
    return () => { emit('video-toggle', i, this.vplayer) }
  }
}

module.exports = video
