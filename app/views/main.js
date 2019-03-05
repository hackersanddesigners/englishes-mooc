var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var nav = require('../components/nav')
var md = new Markdown()
var sidepage = require('../components/sidepage')
var sp = new sidepage()
var login = require('../components/login')
var Forum = require('../components/forum')
var forum = new Forum()

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title)
  console.log(state)

  return html`
    <body>
      <main class="x xdc md-xdr bl-gr br-bl vh100">
        <section class="${ state.sidebar ? "md-c6" : "md-c9" } os h100 br-rddb pt1 pr1 pb1 pl1 xdl">
          <h1 class="ft-bd fs2-4 c12 tac md-pb2">${ data.content.title }</h1>
          <section class="${ state.sidebar ? "md-c6" : "md-c3" } db md-dn os xdl bgc-wh">
            ${ sidebar() }
          </section>
          <div class="x xw xdr">
            ${ modules() }
          </div>
        </section>
        <section class="${ state.sidebar ? "md-c6" : "md-c3" } dn md-db os md-psf md-t0 md-r0 md-vh100 xdl">
          ${ sidebar() }
        </section>
      </main>
    </body>
  `

  function modules () {
    const modules = data.children.course.children
    return ov(modules).map(function (module, i) {
      return html`
        <div class="c12 md-c6 lg-c4 pr1 pl1 pb1 z1">
          ${ video() }
          <h2 class="fs1 fw-r ft-mn">${ module.content.title }: ${ module.content.subtitle }</h2>
          <p class="pb0 fs0-8">Opens ${ module.content.opening }</p>
          <p class="fs0-8">Live classroom ${ module.content.liveclass }</p>

          <button class="fs0-8 tdu curp" onclick=${ toggle(emit, i) }>Read ${ state.modules[i] ? 'more' : 'less' }</button>
          <div class="${ state.modules[i] ? 'dn ' : 'db pt1 ' }fs0-8">
            ${ raw(md.render( module.content.text )) }
          </div>
        </div>
      `

      function toggle(emit) {
        return function () { emit('mod_toggle', i) }
      }

      function video () {
        var url = module.content.pitch_url
        var url_split = url.split('://')
        var vcode = url_split[1].split('/')
        var embed = url_split[0] + '://player.' + vcode[0] + '/video/' + vcode[1]

        return html`
          <div class="pb1">
            <div class="iframe-container">
              <iframe src="${ embed }?title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
            </div>
          </div>
        `
      }
    })
  }

  function sidebar () {
    if (state.components.login !== undefined) {
      return forum.render(state, state.components.login, emit)

    } else if (state.login === true) {
      return login(state, emit)

    } else if (state.sidebar === false) {
      return nav(state, emit)

    } else {
      return sp.render(state, state.components.sidepage, emit)

    }
  }

}
