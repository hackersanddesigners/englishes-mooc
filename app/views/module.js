const ov = require('object-values')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Markdown = require('markdown-it')
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
const Sidepage = require('../components/sidepage')
const sp = new Sidepage()
const login = require('../components/login')
const Statusbar = require('../components/statusbar')
const statusbar = new Statusbar()
const Forum = require('../components/forum')
const forum = new Forum()
const Video = require('../components/video')

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title + ' * ' + state.page.content.title)
  console.log(state)

  const page = state.page

  // replace inline img url to full path kirby-standard img-url
  // eg from ![](image.jpg) => ![](https://website.net/media/pages/<page>/<hash>/image.jpg)

  // ![xx](yy)
  // \!\[.*\]\((.+)\)
  const t = page.content.text.replace(/\!\[.*\]\((.+)\)/g, (match, p1, offset) => {
    const fn = p1.split('/').slice(-1)[0]
    const file = Object.values(page.files).find(file => file.filename === fn)

    if (file !== undefined) {
      return `![](${file.url})`
    } else {
      return match
    }
  })

  const txt = md.render(t)

  // set videos-array upfront so the click-store can toggle directly
  if (state.videos.length !== ov(page.children).length) {
    ov(page.children).map((module) => {
      const status = {
        ready: false,
        play: false
      }
      state.videos.push(status)

      state.videos_fullscreen.push(false)
    })
  }

  if (localStorage.getItem('user_login') !== false) {
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
            ${raw(txt)}
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
        i = i + '_md'
        const video = state.cache(Video, i)
        return html`
        <div class="copy">
          <div class="p2">
            <h2 class="ft-mn fs2">${item.content.title}</h2>
            <div class="x xdr">
            </div>
          </div>

          <div class="pb2">
          ${item.content.video_url !== '' ? video.render(state, emit, item.content.video_url, i) : ''}
          </div>

          ${attachment()}

          <div class="pt2">
            ${raw(md.render(item.content.text))}
          </div>
        </div>
      `

        function attachment () {
          if (ov(item.files).length > 0 && item.files[item.content.attachment] !== undefined) {
            return html`
            <a href="${item.files[item.content.attachment].url}" target="_blank" rel="noopener noreferrer">${item.content.attachment_lab || 'Video Transcript'}</a>
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
        return forum.render(state, emit, JSON.parse(localStorage.getItem('user_data')))
      } else if (state.login === true) {
        return login(state, emit)
      } else if (state.sidebar === false) {
        return nav(state, emit)
      } else {
        return sp.render(state, state.components.sidepage, emit)
      }
    }
  }
}
