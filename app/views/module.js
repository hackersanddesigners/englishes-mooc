var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var nav = require('../components/nav')
var md = new Markdown()

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title)
  console.log(state)

  const page = state.page

  return html`
    <body>
      ${ nav(state, emit) }
      <main>
        <h1>${ page.content.title }</h1>
      </main>
    </body>
  `

  function items () {
    return ov(page[0].children).map(function (item) {
      return html`
        <div>
          <a href="${ item.url }">${ item.content.title } with ${ item.content.tutor }</a>
          <h2>${ item.content.subtitle }</h2>
          ${ raw(md.render(item.content.text)) }
        </div>
      `
    })
  }

}
