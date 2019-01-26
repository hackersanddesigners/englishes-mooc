var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var md = new Markdown()

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title)

  const page = ov(data.children).filter(page => page.uid === 'about')

  return html`
    <body style="background: url(${ov(page[0].files)[0].url}); background-size: cover" class="vh100 bgpc bgrn">
      <main>
        <nav class="w100 psf t0 r0 x xdc md-xdr xjb p2 bg-w-50 copy-tdbk">
          <button class="${state.toggle ? "sh-a" : "t0 r0 mr1 md-mr2"} z2 ft-mn py0-25 px0-5 md-mr0-5 bgc-wh tac curp" onclick=${toggle}>${state.toggle ? "About Englishes MOOC" : "x"}</button>
          <a href="/signup" class="ft-mn py0-25 px0-5 mt1 md-mt0 md-ml0-5 bgc-wh fc-bk tdn tac sh-a curp">Sign up for the course</a>
        </nav>

        <div class="pn ${state.toggle ? "dn" : "db mr0-5 ml0-5 sh-a"} mhv-bx os psf t0 mt2 r0 md-mr2 z1 p1 bgc-wh sm-w60 md-w40">
          <button class="psa t0 r0 mr1 z2 ft-mn py0-25 px0-5 curp" onclick=${toggle}>${state.toggle ? "About Englishes MOOC" : "x"}</button>
          <h1 class="ft-bd fs1">${data.content.title}</h1>
          <div class="copy-w pb1">${raw(md.render(page[0].content.text))}</div>
        </div>
      </main>
    </body>
  `

  function toggle () {
    emit('toggle')
  }

}
