var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var nav = require('../components/nav')
var md = new Markdown()

module.exports = view

function view (state, emit) {
  const page = ov(data.children).filter(page => page.uid === 'hkw')
  const title = data.content.title + ' / ' + page[0].content.title 

  emit(state.events.DOMTITLECHANGE, title)

  return html`
    <body>
      ${ nav(state, emit) }
      <main class="w100 bg-oh x xdc bg-xdr xjb copy copy-tdbk bl-gr br-bldb bg-bl-n bg-br-n">
        <section class="w100 bg-vh100 bg-os pt2 pb2 pr2 pl2 bg-bb-n bg-bl-gr bg-br-rd">
          <h1 class="fs1-3 fw-r ft-mn pt1 pb2 pl1">${ page[0].content.title }</h1>
          <div class="copy pb2">${ raw(md.render(page[0].content.text)) }</div>
        </section>
        <section class="w100 bg-vh100 bg-os pt2 pb2 bg-bt-n bg-bl-rd bg-br-bldb">
          ${ items() }
        </section>
      </main>
    </body>
  `

  function items () {
    return ov(page[0].children).map(function (item) {

      // prepare correct vimeo url embed
      // from simple vimeo url like https://vimeo.com/308769495
      // to https://player.vimeo.com/video/308769495

      var url = item.content.video_url
      var url_split = url.split('://')
      var vcode = url_split[1].split('/')
      var embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]

      return html`
        <div class="pr2 pl2 pb2">
          <div class="iframe-container">
            <iframe src="${ embed }" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
          </div>
          <div class="pt2 pr2 pl2">
            <h2 class="fs1-3 fw-r ft-mn">${ item.content.title }</h2>
            <div class="pb1">
              ${ raw(md.render(item.content.text)) }
            </div>
            ${ attachment () }
          </div>
        </div>
      `

      function attachment () {
        const files = ov(item.files)
        if (files[0] !== undefined) {
          return html`
            <a href="${ files[0].url }">Read as text</a>
          `
        }
      }
      
    })
  }

}
