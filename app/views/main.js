const ov = require('object-values')
const html = require('choo/html')
const raw = require('choo/html/raw')
const md = require('markdown-it')()
md.use(require('markdown-it-container'), 'wrap', {
  validate: function(params) {
    return params.trim().match(/^wrap/)
  },

  render: function (tokens, idx) {
    var m = tokens[idx].info.trim().match(/^wrap/)

    if (tokens[idx].nesting === 1) {
      // opening tag
      return '<div class="wrap pb1">\n'

    } else {
      // closing tag
      return '</div>\n'
    }
  }
})
  .use(require('markdown-it-implicit-figures'))
const nav = require('../components/nav')
const sidepage = require('../components/sidepage')
const sp = new sidepage()
const login = require('../components/login')
const Statusbar = require('../components/statusbar')
const statusbar = new Statusbar()
const Forum = require('../components/forum')
const forum = new Forum()
const Video = require('../components/video')

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title)
  console.log(state)

  return html`
    <body>
      <main class="x xdc md-xdr vh100 bgi-main">
        <section class="
          ${localStorage.getItem('user_login') === 'false' ? 'dn ' : ''}
          ${state.status_toggle ? 'md-w-15 ' : ''}
          os x md-vh100 z3 xdl bgc-wh">
          ${status(state, emit)}
        </section>
        <button class="psf t0-5 ft-sr fs1-5 fc-wh txsh-c${localStorage.getItem('user_login') === 'false' || localStorage.getItem('user_login') === null ? ' dn ' : ' '}${state.status_toggle ? ' l16 ' : ' l0-75 '}curp z4" onclick=${status_toggle(emit)}>${state.status_toggle ? raw('&#8592;') : raw('&#8594;')}</button>

        <section class="
          ${state.status_toggle ? 'md-w-35 ' : ''}
          ${localStorage.getItem('user_login') === 'false' || localStorage.getItem('user_login') === null && state.sidebar === false ? 'md-c9 ' : 'md-c6 '}
          os h100 md-bl-grdb md-br-rddb pt1 pr1 pb1 pl1 xdl">
          <h1 class="ft-bd fs2-4 c12 tac md-pb2">${ data.content.title }</h1>
          <section class="${state.sidebar ? 'md-c6 psf t70 l0 r0 b0 z4 md-psr bl-rddb br-bldb bgc-wh' : 'md-c3'} db md-dn os xdl">
            ${sidebar(state, emit)}
          </section>
          <div class="x xw xdr xjb mb1 oh">
            ${modules(state, emit)}
          </div>
        </section>

        <section class="
          ${localStorage.getItem('user_login') === 'true' ? 'md-c6 ' : ''}
          ${state.sidebar ? 'md-c6' : 'md-c3'}
          ${localStorage.getItem('user_login') === 'true' ? 'bgc-gy' : 'bgc-wh'}
          br-bldb dn md-db os md-vh100 xdl">
          ${sidebar()}
        </section>
      </main>
    </body>
  `

  function modules (state, emit) {
    const modules = data.children.course.children
    return ov(modules).map(function (module, i) {
      // `vi`: build custom index-naming for the video component
      const vi = i + '_mp'
      const video = state.cache(Video, vi)
      const txt = md.render(module.content.text)
      return html`
        <div class="c12 md-w-49-5 lg-w-32-8 xmr0-3 mb0-75 md-mb0-35 bgc-wh z1">
          <div class="bgc-wh pt0-2 pr0-2 pl0-2">
            ${video.render(state, emit, module.content.pitch_url, vi)}
          </div>
          <div class="pl1 pr1 os h-11">
            <h2 class="fs1 fw-r ft-mn pt1">${module.content.title}</h2>
            <p class="pb0 fs0-8">Opens ${module.content.opening}</p>
            <p class="fs0-8">Live classroom ${module.content.liveclass}</p>
            <div class="fs0-8">
              ${raw(txt)}
            </div>
          </div>
        </div>
      `

      function toggle (emit) {
        return function () { emit('mod_toggle', i) }
      }
    })
  }

  function sidebar () {
    // https://stackoverflow.com/a/27013704
    if (localStorage.getItem('user_data') !== undefined && localStorage.getItem('user_data') !== null && localStorage.getItem('user_login') === 'true') {
      return forum.render(state, emit, JSON.parse(localStorage.getItem('user_data')))
    } else if (state.login === true) {
      return login(state, emit)
    } else if (state.sidebar === false) {
      return nav(state, emit)
    } else {
      return sp.render(state, state.components.sidepage, emit)
    }
  }

  function status () {
    const modules = ov(state.content).filter(page => page.uid === 'course')[0]
    if (localStorage.getItem('user_data') !== undefined && localStorage.getItem('user_login') === 'true') {
      return statusbar.render(state, modules, emit)
    }
  }

  function status_toggle (emit) {
    return function () { emit('status_toggle') }
  }
}

module.exports = view
