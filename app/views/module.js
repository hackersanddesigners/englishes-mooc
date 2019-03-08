var ov = require('object-values')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var nav = require('../components/nav')
var sidepage = require('../components/sidepage')
var sp = new sidepage()
var login = require('../components/login')
var Statusbar = require('../components/statusbar')
var statusbar = new Statusbar()
var Forum = require('../components/forum')
var forum = new Forum()
var Topic = require('../components/topic')
var topic = new Topic()

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, data.content.title + ' * ' + state.page.content.title)
  console.log(state)

  const page = state.page

  return html`
    <body>
      <main class="x xdc md-xdr vh100">
        <section class="${ localStorage.getItem('user_login') !== 'true' ? 'dn ' : '' }${ state.status_toggle ? 'md-w-15 ' : '' }os x md-vh100 z3 xdl bgc-wh psr">
          ${ status() }
          <button class="psf t0-5${ state.status_toggle ? ' l16 ' : ' l0-75 ' }curp z4" onclick=${ status_toggle(emit) }>${ state.status_toggle ? '⇇ ' : '⇉' }</button>
        </section>

        <section class="${ state.status_toggle ? 'md-w-35 ' : '' }${ localStorage.getItem('user_login') !== 'true' ? 'md-c9' : 'md-c6' } os xh100 md-bl-grdb md-br-rddb pt1 pr1 pb1 pl1 xdl">
          <h1 class="ft-bd fs2-4 c12 tac md-pb2">${data.content.title}</h1>
          <section class="${ state.sidebar ? 'md-c6 psf t70 l0 r0 b0 z4 md-psr bl-rddb br-bldb' : 'md-c3' } db md-dn os xdl bgc-wh">
            ${ sidebar() }
          </section>
  
          <div class="pl2 pr2">
            <h2 class="ft-mn fs2 ttu pb1">${ page.content.title }</h2>
            <p>with ${ page.content.tutor }</p>
          </div>
          <div class="pb2">
            ${ raw(md.render(page.content.text)) }
          </div>

          ${ items() }

          <div class="pt4">
            ${ raw(md.render(page.content.feedback)) }
            <div class="ft-mn">
              ${ raw(md.render(page.content.credit)) }
            </div>
          </div>
        </section>
        <section class="${ localStorage.getItem('user_login') === 'true' && state.sidebar ? 'md-c6 ' : 'md-c3 ' }${ localStorage.getItem('user_login') === 'true' && state.href === '/' + state.route ? 'bgc-gy' : 'bgc-wh' } br-bldb dn md-db os md-vh100 xdl">
          ${ sidebar() }
        </section>
      </main>
    </body>
  `

  function items () {
    return ov(page.children).map(function (item) {
      return html`
        <div class="copy">
          <div class="p2">
            <h2 class="ft-mn fs2 ttu">${ item.content.title }</h2>
            ${ raw(md.render(item.content.video_length)) }
          </div>

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
          <div class="pb2">
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

  function status () {
    const modules = ov(state.content).filter(page => page.uid === 'course')[0]
    if (localStorage.getItem('user_data') !== undefined && localStorage.getItem('user_login') === 'true') {
      return statusbar.render(state, modules, emit)
    }
  }

  function status_toggle(emit) {
    return function () { emit('status_toggle') }
  }

  function sidebar () {
    if (localStorage.getItem('user_data') !== undefined && localStorage.getItem('user_login') === 'true') {
      // pre-load module's related topics from the forum
      emit('topic')

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
