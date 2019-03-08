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

    var url_split = data.split('://')
    var vcode = url_split[1].split('/')
    var embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]

    return html`
      <div class="iframe-container psr">
        <iframe src="${ embed }?title=0&byline=0&portrait=0&api=1&background=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
        <button class="dn z4 psa b0 l0 bgc-wh p02-5">play</button>
      </div>
    `
  }

  load (el) {
    const player = el
    // console.log(el)
  }

  update () {
    return true
  }

}

module.exports = video
