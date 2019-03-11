var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var vimeo = require('@vimeo/player')

function vvideo (state, data, emit) {
  // console.log(data)

  var url_split = data.split('://')
  var vcode = url_split[1].split('/')
  var embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]

  return html`
    <div class="iframe-container psr">
      <iframe src="${ embed }?title=0&byline=0&portrait=0&api=1&background=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
    </div>
  `

}

module.exports = vvideo
