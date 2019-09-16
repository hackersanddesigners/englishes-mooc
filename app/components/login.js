const html = require('choo/html')
const xhr_call = require('./xhr-call')

function login (state, emit) {
  return html`
    <div class="c12 pt1 pr1 pb1 pl1 copy">
      ${storage()}
      <button class="psf t0 r0 pr1 ft-mn fs2-4 curp" onclick=${close(emit)}>x</button>

      <form id="login" onsubmit=${onsubmit} method="post" class="pb2">
        <div class="fw-r fs1 lh1 pt2 pb2">
          <div class="pb0-5">
            <label class="dib w-100 bg-w-50 ft-mn">Name*</label>
              <input id="name" name="name" type="text" placeholder="" class="dib w-100 bg-w-50 bb-bl" required>
          </div>

          <div class="pb0-5">
            <label class="dib w-100 bg-w-50 ft-mn">Password*</label>
            <input id="password" name="password" type="password" class="dib w-100 bg-w-50 bb-bl" required>
          </div>
        </div>

        <div class="x xafs">
          <input type="submit" value="Login" class="send fs1-3 bb-rd curp">
          <button class="dn fs1-3 bb-rd retry-box curp" onclick=${reset}>Retry</button>
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

  function storageAvailable (type) {
    try {
      let storage = window[type]
      let x = '__storage_test__'
      storage.setItem(x, x)
      storage.removeItem(x)
      return true
    } catch (e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0
    }
  }

  function storage () {
    if (storageAvailable('localStorage')) {
      console.log('yes! we can use localstorage')
    } else {
      console.log('no localStorage')
    }
  }

  function reset () {
    const form = document.querySelector('#login')
    form.reset()

    localStorage.clear()

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
    let data = new FormData(form)
    const bot = document.querySelector('.bot')
    const send = form.querySelector('.send')

    const body = {}
    for (let pair of data.entries()) body[pair[0]] = pair[1]

    const name = body.name
    const pw = body.password

    const opts = {
      user: name,
      pw: pw,
      send: send
    }

    if (body.website !== '') {
      bot.classList.remove('dn')
    } else if (body.name === '') {
      form.childNodes[0].childNodes[0].value = 'Type username'
    } else if (body.password === '') {
      form.childNodes[0].childNodes[1].value = 'Type password'
    } else {
      xhr_call.login(opts, (err, resp, body) => {
        if (err) throw err
        console.log(body)

        if (body.error || body.errors) {
          const box = form.querySelector('.error-box')
          box.classList.remove('dn')
          box.classList.add('dib')

          const retry = form.querySelector('.retry-box')
          retry.classList.remove('dn')
          retry.classList.add('dib')

          const msg = 'Wrong combination of username and password. Try again. In case of further assistance, please <a href="mailto:englishes.mooc@gmail.com">contact us</a>.'
          box.firstChild.innerHTML = msg

          send.classList.add('dn')
        } else {
          localStorage.setItem('user_data', JSON.stringify(body))

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
