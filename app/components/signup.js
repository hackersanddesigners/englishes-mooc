const ov = require('object-values')
const html = require('choo/html')
const raw = require('choo/html/raw')
const xhr_call = require('./xhr-call')
const yaml = require('js-yaml')
const slugify = require('slugify')

function signup (state, emit) {
  const page = ov(data.children).filter(page => page.uid === 'signup')[0]

  const deadlines = yaml.safeLoad(page.content.deadline)

  return html`
    <form id="signup" onsubmit=${onsubmit} method="post" class="pb2 lg-pl2 lg-pr2">
      <div class="fw-r fs1 lh1 pt2 pb2">
        <div class="pb0-5">
          <label class="dib w-50 ft-mn">${page.content.name}*</label>
            <input id="name" name="name" type="text" placeholder="" class="dib w-50 bb-bl" required>
        </div>

        <div class="pb0-5">
          <label class="dib w-50 ft-mn">${page.content.email}*</label>
          <input id="email" name="email" type="email" class="dib w-50 bb-bl" required>
        </div>

        <div class="pb0-5">
          <label class="dib w-50 ft-mn">${page.content.email2t}*</label>
          <input id="email2t" name="email2t" type="email" class="dib w-50 bb-bl" required>
        </div>

        <div class="pb1">
          <label class="dib w-50 ft-mn">${page.content.info}</label>
          <input id="info" name="info" type="text" class="dib w-50 bb-bl">
        </div>

         ${deadline(deadlines)} 
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
  `

  function deadline (data) {
    return data.map(due => {
      // convert label to slugify version, so mailchimp works fine
      // and label can be written in the CMS a bit more "freely"
      const label = slugify(due.label.toLowerCase())
      return html`
        <div class="pb1 x xab">
          <label class="x xdr xab curp">
            <input id="${label}" name="${label}" type="checkbox" ${due.use === 'disabled' ? 'disabled' : ''} class="${due.use == 'disabled' ? 'op25 pen' : ''}">
              <p class="dib ft-mn pl1 pb0"><span class="${ due.status !== '' ? 'tdlt' : '' }">${due.text}</span> ${status(due.status)}</p>
           </label>
        </div>
      `

      function status (data) {
        if (data !== undefined && data !== '') {
          return html`
            <strong>${data}</strong>
          `
        }
      }
    })

  }

  function onsubmit (e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const bot = document.querySelector('.bot')
    const send = form.querySelector('.send')

    let body = {}
    for (let pair of data.entries()) {
      if (pair[0].split('-')[0] === 'cycle') {
        body['tag'] = pair[0]
      } else {
        body[pair[0]] = pair[1]
      }
    }

    const email = body.email

    const opts = {
      body: body,
      send: send
    }

    if (body.website !== '') {
      bot.classList.remove('dn')
    } else if (body.email === '') {
      form.childNodes[0].childNodes[0].value = 'Type email adddress'
    } else {
      xhr_call.signup(opts, (err, resp, body) => {
        if (err) throw err

        if (body.title === 'Member Exists') {
          const box = form.querySelector('.error-box')
          box.classList.remove('dn')
          box.classList.add('dib')

          const msg = 'The address ' + email + ' is already subscribed. Check your inbox for a confirmation email, or contact us.'
          box.firstChild.innerHTML = msg

          send.value = 'Error!'
        } else if (body.title === 'Forgotten Email Not Subscribed') {
          const box = form.querySelector('.error-box')
          box.classList.remove('dn')
          box.classList.add('dib')

          const msg = `The address ${email} has been deleted permanently. Please contact us.`

          box.firstChild.innerHTML = msg

          send.value = 'Error!'
        } else if (body.status === 'pending') {
          const box = form.querySelector('.success-box')
          box.classList.remove('dn')
          box.classList.add('dib')

          const msg = "Thank you, your registration has been sent. You'll receive a confirmation email soon."
          box.firstChild.innerHTML = msg

          send.value = 'Sent!'

          form.reset()
        }
      })
    }
  }
}

module.exports = signup
