var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var np = require('nanopage')
var md = new Markdown()

module.exports = view

function view (state, emit) {
  var page = new np(state)

  return html`
    <body style="background: url(${bgi()}); background-size: cover" class="vh100 bgpc bgrn">
      <button class="psf mt2 ${state.toggle ? "mw-bt t0 l50 ttxc md-ttx0 md-r0 md-mgr2 md-la sh-a" : "t0 r0 mr1 md-mr2"} z2 ft-mn py0-25 px0-5 bgc-wh curp" onclick=${toggle}>${state.toggle ? "About Englishes MOOC" : "x"}</button>

      <div class="pn ${state.toggle ? "dn" : "db mr0-5 ml0-5 sh-a"} mhv-bx os psf t0 mt2 r0 md-mr2 z1 p1 bgc-wh sm-w60 md-w40">
        <h1>${page('/').v('title')}</h1>
        <h2 class="ft-mn">${raw(md.render(page('/').v('author')))}</h2>
        <div class="copy pb1">${raw(md.render(page('/').v('text')))}</div>
        ${raw(md.render(page('/').v('info')))}
      </div>
    </body>
  `

  function toggle () {
    emit('toggle')
  }

  function bgi () {
    return ov(page('/').images().v()).map(function (img) {
      return img.path
    })
  }

}
