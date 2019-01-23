var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var md = new Markdown()

module.exports = view

function view (state, emit) {
  emit(state.events.DOMTITLECHANGE, state.title)

  const page = ov(data.children).filter(page => page.uid === 'signup')
  console.log(page[0].content)

  return html`
    <body class="vh100">
      <main class="x xdc bg-xdr">
        <section class="pt2 pb2 pr2 pl2 w-100 bg-w-50 vh50 bg-vh0">
          <h1 class="ft-bd fs1-3">${ page[0].content.title }</h1>
          <div class="fs1-3">${ raw(md.render(page[0].content.text)) }</div>

          <form id="signup" onsubmit=${ onsubmit } method="post">
            <div class="fw-r fs1 lh1 pt2 pb2">
              <div class="pb0-5">
                <label class="dib w-50 ft-mn">${ page[0].content.name }</label>
                <input id="name" name="name" type="text" placeholder="" class="dib w-50 bb-bl">
              </div>

              <div class="pb0-5">
                <label class="dib w-50 ft-mn">${ page[0].content.email }</label>
                <input id="email" name="email" type="email" class="dib w-50 bb-bl">
              </div>

              <div class="pb0-5">
                <label class="dib w-50 ft-mn">${ page[0].content.email2t }</label>
                <input id="email2t" name="email2t" type="email" class="dib w-50 bb-bl">
              </div>

              <label class="dib w-50 ft-mn">${ page[0].content.info }</label>
              <input id="info" name="info" type="text" class="dib w-50 bb-bl">
            </div>
            <input type="submit" value="Send" class="fs1-3 bb-rd">

            <div class="psf t0 l999">
              <label for="message">If you are not a bot, leave this field empty</label>
              <input type="website" name="website" id="website" placeholder ="http://example.com" value="">
            </div>
            <div class="bot dn psa t0 l0 w100 h100 tac">
              <p class="psa t50 l50 ttcc">Hello bot!</p>
            </div>
          </form>
        </section>
        <section style="background: url(${ov(page[0].files)[0].url}); background-size: cover" class="w-100 bg-w-50 vh50 bg-vh100 bgpc bgrn"></section>
    </body>
  `

  function signup_toggle () {
    emit('toggle')
  }

}
