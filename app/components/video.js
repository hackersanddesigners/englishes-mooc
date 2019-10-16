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
    this.i = i.replace(/_(.*)/, '')

    const url_split = url.split('://')
    const vcode = url_split[1].split('/')
    const embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]

    function video_status (video_state) {
      if (video_state.ready === true) {
        return 'Loading'
      } else if (video_state.play === true) {
        return 'Pause'
      } else {
        return 'Play'
      }
    }

    return html`
      <div class="iframe-container psr ${this.state.videos_fullscreen[i] ? ' c12 bg-bk' : ''}">
        <iframe src="${embed}?title=0&byline=0&portrait=0&api=1&background=0&controls=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay; fullscreen"></iframe> 
        <button onclick=${this.playerToggle(this.i, this.vplayer, this.emit)} class="controls z5 psa t0-75 l0-75 curp fc-wh txsh-t">
         ${video_status(this.state.videos[this.i])}
        </button>
        <button onclick=${this.fullscreenToggle(this.i, this.vplayer, this.emit)} class="controls z5 psa${this.state.videos_fullscreen[this.i] ? ' t0-75' : ' b0-75'} r0-75 curp fc-wh txsh-t">
          <svg width="26" height="25">
            <defs>
              <filter x="-37.5%" y="-36.1%" width="170%" height="177.8%" filterUnits="objectBoundingBox" id="a">
                <feOffset in="SourceAlpha" result="shadowOffsetOuter1"/>
                <feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>
                <feColorMatrix values="0 0 0 0 0.101960784 0 0 0 0 0.101960784 0 0 0 0 0.101960784 0 0 0 1 0" in="shadowBlurOuter1" result="shadowMatrixOuter1"/>
                <feMerge><feMergeNode in="shadowMatrixOuter1"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <g filter="url(#a)" transform="translate(3 3)" fill="#FFF" stroke="#FFF" fill-rule="evenodd">
              <path d="M18.466 7.062V1.748h-2.278V.99h3.037v6.073zM1.246 11.67v5.314h2.277v.76H.487V11.67zM1.211 7.166h-.76V1.093h3.037v.759H1.211zM18.43 11.774h.76v6.073h-3.037v-.759h2.278z"/>
            </g>
          </svg>
        </button>
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
