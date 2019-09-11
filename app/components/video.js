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
      <div class="iframe-container psr ${this.state.videos_fullscreen[i] ? ' c12 bg-bk' : ''}">
        <iframe src="${embed}?title=0&byline=0&portrait=0&api=1&background=0&controls=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay; fullscreen"></iframe> 
        <button onclick=${this.playerToggle(this.i, this.vplayer, this.emit)} class="controls z5 psa t0-75 l0-75 curp fc-wh txsh-t">${this.state.videos[i] ? 'Pause' : 'Play'}</button>
        <button onclick=${this.fullscreenToggle(this.i, this.vplayer, this.emit)} class="controls z5 psa b0-75 r0-75 curp fc-wh txsh-t">${this.state.videos_fullscreen[i] ? 'EX' : 'FS'}</button>
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

  playerToggle (i, video, emit) {
    return () => { emit('video-toggle', i, this.vplayer) }
  }

  fullscreenToggle (i, video, emit) {
    return () => { emit('fullscreen-toggle', i, this.vplayer.element.parentNode) }
  }
}

module.exports = video
