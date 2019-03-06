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
        <section class="${ state.sidebar ? "md-c6" : "md-c9" } br-rd pt1 pr1 pb1 pl1">
          <h1 class="ft-bd fs2-4 c12 tac">${data.content.title}</h1>

          <h2 class="ft-mn fs2 c6 ttu">${ page.content.title }</h2>
          <p>with ${ page.content.tutor }</p>
          ${ raw(md.render(page.content.text)) }

          ${ items() }
        </section>
        <section class="${ state.sidebar ? "md-c6" : "md-c3" } dn md-db os md-psf md-t0 md-r0 md-vh100 xdl">
          ${ sidebar() }
        </section>
      </main>
    </body>
  `

  function items () {
    return ov(page.children).map(function (item) {
      return html`
        <div>
          <h2 class="ft-mn fs2 ttu">${ item.content.title }</h2>
          <h2>${ item.content.subtitle }</h2>
          <p>${ item.content.video_length }</p>
          ${ video() }
          ${ raw(md.render(item.content.text)) }
        </div>
      `

      function video () {
        // prepare correct vimeo url embed
        // from simple vimeo url like https://vimeo.com/308769495
        // to https://player.vimeo.com/video/308769495
        // <iframe src="https://player.vimeo.com/video/308769495?title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

        var url = item.content.video_url
        var url_split = url.split('://')
        var vcode = url_split[1].split('/')
        var embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]

        return html`
          <div class="pr2 pl2 pb2">
            <div class="iframe-container">
              <iframe src="${ embed }?title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
            </div>
          </div>
        `
      }

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
