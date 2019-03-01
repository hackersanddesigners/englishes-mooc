var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var nav = require('../components/nav')
var md = new Markdown()
var sidepage = require('../components/sidepage')
var sp = new sidepage()

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title)

  console.log(state)
  
  return html`
    <body>
      <main class="vh100 x xdr bl-gr br-bl">
        <section class="${ state.sidebar ? "c6" : "c9" } br-rd pt1 pr1 pl1">
          <h1 class="ft-bd fs2-4 c12 tac">${data.content.title}</h1>
          <div class="x xdr">
            ${ modules() }
          </div>
        </section>
        ${ sidebar() }
      </main>
    </body>
  `

  function modules () {
    const modules = data.children.course.children
    return ov(modules).map(function (module) {
      return html`
        <div class="c4 pr2 pl2 pb2">
          ${ cover() }
          <a href="${ module.url }"><h2 class="fs1-3 fw-r ft-mn">${ module.content.title }</h2></a>
        </div>
      `

      function cover () {
        return ov(module.children).map(function (item) {
          return html`
            <a href="${ module.url }">
              <img src="${ ov(item.files)[0].url }">
            </a>
          `
        })
      } 
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
