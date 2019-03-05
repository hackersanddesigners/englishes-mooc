var ov = require('object-values')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var nav = require('../components/nav')
var sidepage = require('../components/sidepage')
var sp = new sidepage()
var login = require('../components/login')
var Forum = require('../components/forum')
var forum = new Forum()
var Topic = require('../components/topic')
var topic = new Topic()

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

          <h2 class="ft-mn fs2 c6 ttu">${ page.content.title }<br>
          ${ page.content.subtitle }</h2>
          <p>with ${ page.content.tutor }</p>
          ${ raw(md.render(page.content.text)) }

          ${ items() }
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
    emit('topic')

    if (state.components.login !== undefined) {
      if (state.route === 'course/module-01') {
        return topic.render(state, state.components.login, emit)
      } else {
        return forum.render(state, state.components.login, emit)
      }

    } else if (state.login === true) {
      return login(state, emit)

    } else if (state.sidebar === false) {
      return nav(state, emit)

    } else {
      return sp.render(state, state.components.sidepage, emit)

    }
  }

}
