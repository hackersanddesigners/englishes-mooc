const ov = require('object-values')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Markdown = require('markdown-it')
const md = new Markdown()
const nav = require('../components/nav')
const Sidepage = require('../components/sidepage')
const sp = new Sidepage()
const login = require('../components/login')
const Statusbar = require('../components/statusbar')
const statusbar = new Statusbar()
const Forum = require('../components/forum')
const forum = new Forum()
const Topic = require('../components/topic')
const topic = new Topic()
const Video = require('../components/video')

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title + ' * ' + state.page.content.title)
  console.log(state)

  const page = state.page

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
          <a href="${window.location.origin}" class="tdn"><h1 class="ft-bd fs2-4 c12 tac md-pb2">${data.content.title}</h1></a>
          <section class="${state.sidebar ? 'md-c6 psf t70 l0 r0 b0 z4 md-psr bl-rddb br-bldb' : 'md-c3'} db md-dn os xdl bgc-wh">
            ${sidebar(state, emit)}
          </section>
  
          <div class="pl2 pr2 pb1">
            <h2 class="ft-mn fs2 pb1">${page.content.title}</h2>
            <p>with ${page.content.tutor}</p>
          </div>
          <div class="pb2">
            ${raw(md.render(page.content.text))}
          </div>

          ${items()}

          <div class="pt4">
            ${raw(md.render(page.content.feedback))}
            <div class="ft-mn pt1">
              ${raw(md.render(page.content.credit))}
            </div>
          </div>
        </section>
        <section class="
          ${localStorage.getItem('user_login') === 'true' ? 'md-c6 ' : ''}
          ${state.sidebar ? 'md-c6 ' : 'md-c3 '}
          ${localStorage.getItem('user_login') === 'true' && state.href === '/' + state.route ? 'bgc-gy' : 'bgc-wh'}
          br-bldb dn md-db os md-vh100 xdl">
          ${sidebar(state, emit)}
        </section>
      </main>
    </body>
  `

  function items () {
    return ov(page.children).map(function (item, i) {
      i = i + 'md'
      const video = state.cache(Video, i)
      return html`
        <div class="copy">
          <div class="p2">
            <h2 class="ft-mn fs2">${item.content.title}</h2>
            <div class="x xdr">
              <p class="pr1">${item.content.video_length}</p>
              ${attachment()}
            </div>
          </div>

          <div class="pb2">
          ${item.content.video_url !== '' ? video.render(state, emit, item.content.video_url, i) : ''}
          </div>

          ${raw(md.render(item.content.text))}
        </div>
      `

      function attachment () {
        if (item.files.length > 0 && item.content.attachment !== undefined) {
          return html`
            <a href="${item.files[item.content.attachment].url}" target="_blank" rel="noopener noreferrer">${item.content.attachment_lab || 'Transcript'}</a>
          `
        }
      }
    })
  }

  function cover () {
    return ov(page.children).map(function (item) {
      return html`
        <figure>
          <img src="${ov(item.files)[0].url}">
        </figure>
      `
    })
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

  function sidebar (state, emit) {
    if (localStorage.getItem('user_data') !== undefined && localStorage.getItem('user_login') === 'true') {
      if (state.href === '/' + state.route) {
        return topic.render(state, JSON.parse(localStorage.getItem('user_data')), emit)
      } else {
        return forum.render(state, JSON.parse(localStorage.getItem('user_data')), emit)
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
