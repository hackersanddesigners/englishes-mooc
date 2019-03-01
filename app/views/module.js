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
      <main class="x xdr bl-gr br-bl">
        <section class="${ state.sidebar ? "c6" : "c9" } br-rd pt1 pr1 pb1 pl1">
          <h1 class="ft-bd fs2-4 c12 tac">${data.content.title}</h1>
          
          ${ cover() }
          <h2 class="ft-mn fs1-3 c6 td-u-r">${ page.content.title }<br>
          "${ page.content.subtitle }"</h2>
          <p>with ${ page.content.tutor }</p>

          ${ raw(md.render(page.content.text)) }
        </section>
        ${ sidebar() }
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

  function cover () {
    return ov(page.children).map(function (item) {
      return html`
        <figure>
          <img src="${ ov(item.files)[0].url }">
        </figure>
      `
    })
  }

  function sidebar () {
    if (state.sidebar != true) {
      return nav(state, emit)
    } else {
      return sp.render(state, state.components.sidepage, emit)
    }
  }

}
