var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var nav = require('../components/nav')
var md = new Markdown()

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title)

  return html`
    <body>
      ${ nav(state, emit) }
      <main>
        <h1 class="ft-bd fs1">${data.content.title}</h1>
      </main>
    </body>
  `

}
