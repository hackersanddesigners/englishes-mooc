var ok = require('object-keys')
var ov = require('object-values')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var xhr = require('xhr')
var users = require('../stores/users.json')

function login (state, emit) {

  return html`
    <div class="c12 pt1 pr1 pb1 pl1 copy">
      <button class="psf t05 r0 pr1 ft-mn fs2-4 curp" onclick=${ close(emit) }>x</button>

      <form id="login" onsubmit=${ onsubmit } method="post" class="pb2">
        <div class="fw-r fs1 lh1 pt2 pb2">
          <div class="pb0-5">
            <label class="dib w-50 ft-mn">Name*</label>
              <input id="name" name="name" type="text" placeholder="" class="dib w-50 bb-bl" required>
          </div>

          <div class="pb0-5">
            <label class="dib w-50 ft-mn">Password*</label>
            <input id="password" name="password" type="password" class="dib w-50 bb-bl" required>
          </div>
        </div>

        <div class="x xafs">
          <input type="submit" value="Login" class="send fs1-3 bb-rd curp">
          <button class="dn fs1-3 bb-rd retry-box curp" onclick=${ reset }>Retry</button>
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

  function reset () {
    const form = document.querySelector('#login')
    form.reset()

    const box = form.querySelector('.error-box')
    box.classList.remove('dib')
    box.classList.add('dn')

    const retry = form.querySelector('.retry-box')
    retry.classList.remove('dib')
    retry.classList.add('dn')

    const send = form.querySelector('.send')
    send.classList.remove('dn')
    send.value = 'Login'
  }

  function onsubmit (e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const bot = document.querySelector('.bot')
    const send = form.querySelector('.send')

    const body = {}
    for (var pair of data.entries()) body[pair[0]] = pair[1]

    const name = body.name
    const pw = body.password

		const auth = {'login': name, 'password': pw}

    if (body.website !== '') {
      bot.classList.remove('dn')
    } else if (body.name === '') {
      form.childNodes[0].childNodes[0].value="Type username"
    } else if (body.password === '') {
      form.childNodes[0].childNodes[1].value="Type password"
    } else {
      xhr({
        method: "post",
        body: auth,
				headers: {"Content-Type": "multipart/form-data"},
        url: `https://forum.englishes-mooc.org/session?api_key=${users.system}&api_username=${ok(users)[0]}&login=${name}&password=${pw}`,
        json: true,
        beforeSend: function(xhrObject){
          xhrObject.onprogress = function(){
            send.value = '...'
          }
        }
      }, function (err, resp, body) {
        if (err) throw err

        console.log(body)

        if (body.error) {
          const box = form.querySelector('.error-box')
          box.classList.remove('dn')
          box.classList.add('dib')

          const retry = form.querySelector('.retry-box')
          retry.classList.remove('dn')
          retry.classList.add('dib')

          const msg = 'Wrong combination of username and password.'
          box.firstChild.innerHTML = msg

          send.classList.add('dn')

        } else {
          console.log('request ok!', body)

          state.components.login = body
          state.components.user_id = body.user.id

          send.value = "You're in"

          emit('log-in')
        }

      })
    }
  }

}

module.exports = login
