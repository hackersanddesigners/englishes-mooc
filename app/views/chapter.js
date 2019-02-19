var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var nav = require('../components/nav')
var md = new Markdown()

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title)

  const page = ov(data.children).filter(page => page.uid === 'course')
  console.log(page[0])

  return html`
    <body>
      ${ nav(state, emit) }
      <main>
        <h1>${ raw(md.render(page[0].content.title)) }</h1>
      </main>
    </body>
  `

}
