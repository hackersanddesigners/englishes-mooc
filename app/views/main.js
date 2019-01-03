var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var md = new Markdown()

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, state.title)

  const page = data.children.filter(page => page.intendedTemplate === 'home')

  return html`
    <body style="background: url(${page[0].files[0].url}); background-size: cover" class="vh100 bgpc bgrn">
      <button class="psf mt2 ${state.toggle ? "mw-bt t0 l50 ttxc md-ttx0 md-r0 md-mgr2 md-la sh-a" : "t0 r0 mr1 md-mr2"} z2 ft-mn py0-25 px0-5 bgc-wh curp" onclick=${toggle}>${state.toggle ? "About Englishes MOOC" : "x"}</button>

      <div class="pn ${state.toggle ? "dn" : "db mr0-5 ml0-5 sh-a"} mhv-bx os psf t0 mt2 r0 md-mr2 z1 p1 bgc-wh sm-w60 md-w40">
        <h1 class="ft-bd fs1">${data.content.title}</h1>
        <h2 class="ft-bd fs1 ft-mn">${raw(md.render(page[0].content.author))}</h2>
        <div class="copy-w pb1">${raw(md.render(page[0].content.text))}</div>
        ${raw(md.render(page[0].content.info))}
      </div>
    </body>
  `

  function toggle () {
    emit('toggle')
  }

}
