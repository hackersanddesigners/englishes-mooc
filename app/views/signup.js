var ov = require('object-values')
var Markdown = require('markdown-it')
var html = require('choo/html')
var raw = require('choo/html/raw')
var md = new Markdown()
var xhr = require('xhr')

module.exports = view

function view (state, emit) {
  const page = ov(data.children).filter(page => page.uid === 'signup')
  const title = data.content.title + ' / ' + page[0].content.title 
  const bgimg = ov(page[0].files).filter(file => file.type === 'image')

  emit(state.events.DOMTITLECHANGE, title)

  return html`
    <body class="bg-oh">
      <main class="w100 x xdc bg-xdr bl-grdb br-bldb bg-bl-n bg-br-n">
        <section class="w100 bg-w-50 bg-vh100 bg-os pt2 pb2 pr2 pl2 bg-bb-n bg-bl-grdb bg-br-rd">
          <h1 class="ft-bd fs1-3">${ page[0].content.title }</h1>
          <div class="fs1-3">${ raw(md.render(page[0].content.text)) }</div>

          <form id="signup" onsubmit=${ onsubmit } method="post" class="pb2">
            <div class="fw-r fs1 lh1 pt2 pb2">
              <div class="pb0-5">
                <label class="dib w-50 ft-mn">${ page[0].content.name }*</label>
                <input id="name" name="name" type="text" placeholder="" class="dib w-50 bb-bl" required>
              </div>

              <div class="pb0-5">
                <label class="dib w-50 ft-mn">${ page[0].content.email }*</label>
                <input id="email" name="email" type="email" class="dib w-50 bb-bl" required>
              </div>

              <div class="pb0-5">
                <label class="dib w-50 ft-mn">${ page[0].content.email2t }*</label>
                <input id="email2t" name="email2t" type="email" class="dib w-50 bb-bl" required>
              </div>

              <div class="pb1">
                <label class="dib w-50 ft-mn">${ page[0].content.info }</label>
                <input id="info" name="info" type="text" class="dib w-50 bb-bl">
              </div>

              <div class="pb1">
                <label class="dib w-50 ft-mn">${ page[0].content.pilot }</label>
                <input id="pilot" value="1" name="pilot" type="checkbox">
              </div>
            </div>

            <div class="x xafs">
              <input type="submit" value="Send" class="send fs1-3 bb-rd curp">

              <div class="dn success-box pl1">
                <p class="dib pb0"></p>
              </div>

              <div class="dn error-box pl1">
                <p class="dib pb0"></p>
              </div>
            </div>

            <div class="psf t0 l999">
              <label for="message">If you are not a bot, leave this field empty</label>
              <input type="website" name="website" id="website" placeholder ="http://example.com" value="">
            </div>
            <div class="bot dn psa t0 l0 w100 h100 tac">
              <p class="psa t50 l50 ttcc">Hello bot!</p>
            </div>
          </form>
        </section>
        <section style="background: url(${bgimg[0].url}); background-size: cover" class="w100 bg-w-50 vh50 bg-vh100 bg-oh bgpc bgrn bg-bt-n bg-bl-rd bg-br-bldb"></section>
      </main>
    </body>
  `

  function onsubmit (e) {
    e.preventDefault()
    var form = e.currentTarget
    var data = new FormData(form)
    var bot = document.querySelector('.bot')
    var send = form.querySelector('.send')

    var headers = new Headers({ 'Content-Type': 'application/json' })
    var body = {}
    for (var pair of data.entries()) body[pair[0]] = pair[1]

    const email = body.email

    if (body.website !== '') {
      bot.classList.remove('dn')
    } else if (body.email === '') {
      form.childNodes[0].childNodes[0].value="Type email adddress"
    } else {
      xhr({
        method: "post",
        body: body,
        uri: '/apisignup',
        json: true,
        beforeSend: function(xhrObject){
          xhrObject.onprogress = function(){
            send.value = '...'
          }
        }
      }, function (err, resp, body) {
        if (err) throw err
        console.log('request ok!', body)

        if (body.title === "Member Exists") {
          const box = form.querySelector('.error-box')
          box.classList.remove('dn')
          box.classList.add('dib')

          const msg = 'The address ' + email + ' is already in use. Please contact us.'
          box.firstChild.innerHTML = msg

          send.value = 'Error!'

        } else if (body.title === null || body.title === undefined) {
          const box = form.querySelector('.success-box')
          box.classList.remove('dn')
          box.classList.add('dib')

          const msg = 'Thank you, your registration has been sent.'
          box.firstChild.innerHTML = msg

          send.value = 'Sent!'
        }
      })
    }

  }

}
