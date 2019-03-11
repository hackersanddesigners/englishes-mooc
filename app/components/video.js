var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var vimeo = require('@vimeo/player')

class vvideo extends nc {
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

    var url_split = data.split('://')
    var vcode = url_split[1].split('/')
    var embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]
    // console.log(vcode[1])

    // <iframe src="${ embed }?title=0&byline=0&portrait=0&background=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

    return html`
      <div class="iframe-container psr">
        <iframe src="${ embed }?title=0&byline=0&portrait=0&api=1&background=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
      </div>
    `
  }

  load (el) {
    // var url_split = this.data.split('://')
    // var vcode = url_split[1].split('/')
    // var embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]
    // console.log(vcode[1])

    // const player = new vimeo(el.querySelector('.video'), {
    //   id: vcode[1],
    //   loop: false,
    // })
    // console.log(player)

    // const video = el.querySelector('.video')

    // const player = new vimeo(video, {
    //   id: vcode[1],
    //   width: 640
    // })

    // player.on('play', function() {
    //   console.log('played the video!');
    // })
  }

  update () {
    return true
  }

}

module.exports = vvideo
