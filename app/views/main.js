const ov = require('object-values')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Markdown = require('markdown-it')
const md = new Markdown()
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
      <main class="x xdc md-xdr vh100">
        <section class="
          ${localStorage.getItem('user_login') === 'false' ? 'dn ' : ''}
          ${state.status_toggle ? 'md-w-15 ' : ''}
          os x md-vh100 z3 xdl bgc-wh">
          ${status(state, emit)}
        </section>
        <button class="psf t0-5${localStorage.getItem('user_login') === 'false' || localStorage.getItem('user_login') === null ? ' dn ' : ' '}${state.status_toggle ? ' l16 ' : ' l0-75 '}curp z4" onclick=${status_toggle(emit)}>${state.status_toggle ? '⇇ ' : '⇉'}</button>

        <section class="
          ${state.status_toggle ? 'md-w-35 ' : ''}
          ${localStorage.getItem('user_login') === 'false' || localStorage.getItem('user_login') === null && state.sidebar === false ? 'md-c9 ' : 'md-c6 '}
          os h100 md-bl-grdb md-br-rddb pt1 pr1 pb1 pl1 xdl">
          <h1 class="ft-bd fs2-4 c12 tac md-pb2">${ data.content.title }</h1>
          <section class="${state.sidebar ? 'md-c6 psf t70 l0 r0 b0 z4 md-psr bl-rddb br-bldb' : 'md-c3'} db md-dn os xdl bgc-wh">
            ${sidebar(state, emit)}
          </section>
          <div class="x xw xdr">
            ${modules()}
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

  function modules () {
    const modules = data.children.course.children
    return ov(modules).map(function (module, i) {
      i = i + 'mp'
      const video = state.cache(Video, i)
      return html`
        <div class="c12 md-c6 lg-c4 pr1 pl1 pb1 z1">
          ${video.render(state, emit, module.content.pitch_url, i)}
          <h2 class="fs1 fw-r ft-mn pt1">${module.content.title}</h2>
          <p class="pb0 fs0-8">Opens ${module.content.opening}</p>
          <p class="fs0-8">Live classroom ${module.content.liveclass}</p>

          <button class="fs0-8 tdu curp" onclick=${toggle(emit, i)}>Read ${state.modules[i] ? 'more' : 'less'}</button>
          <div class="${state.modules[i] ? 'dn ' : 'db pt1 '}fs0-8">
            ${raw(md.render(module.content.text))}
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
    if (localStorage.getItem('user_data') !== undefined && localStorage.getItem('user_login') === 'true') {
      return forum.render(state, JSON.parse(localStorage.getItem('user_data')), emit)
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
