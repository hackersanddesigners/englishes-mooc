var ov = require('object-values')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var xhr = require('xhr')

function login (state, emit) {

  return html`
    <div class="c6 pt1 pr1 pb1 pl1 copy">
      <button class="curp" onclick=${ close(emit) }>X</button>
      <form id="login" onsubmit=${ onsubmit } method="post" class="pb2">
        <div class="fw-r fs1 lh1 pt2 pb2">
          <div class="pb0-5">
            <label class="dib w-50 ft-mn">Name*</label>
              <input id="name" name="name" type="text" placeholder="" class="dib w-50 bb-bl" required>
          </div>

          <div class="pb0-5">
            <label class="dib w-50 ft-mn">Password*</label>
            <input id="email" name="email" type="password" class="dib w-50 bb-bl" required>
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
    </div>
  `

  function close (emit) {
    return function () { emit('close') }
  }

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
        uri: '/apilogin',
        json: true,
        beforeSend: function(xhrObject){
          xhrObject.onprogress = function(){
            send.value = '...'
          }
        }
      }, function (err, resp, body) {
        if (err) throw err
        console.log('request ok!', body)
      })
    }
  }

}

module.exports = login
